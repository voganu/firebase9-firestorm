import {
  CollectionReference,
  QuerySnapshot,
  collection as collectionOrig,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
  getDocs,
  FirebaseFirestore,
} from "firebase/firestore";
import store, { getRepository } from "./store";
import {
  ICollectionQuery,
  ICollection,
  IDocumentRef,
  WriteTypes,
} from "./types";
import { QueryBuilder, FirestoreSerializer } from "./utils";
import DocumentRef from "./fields/DocumentRef";
import Entity from "./Entity";
import Query from "./Query";

/**
 * Firestorm representation of a collection reference.
 * @typeparam T The entity for the collection documents.
 * @typeparam P The entity for the collection parent.
 */

class Collection<T extends Entity, P extends Entity> //eslint-disable-next-line @typescript-eslint/indent
  implements ICollection<T, P>
{
  /**
   * @hidden
   */
  private _Entity: new () => T;
  /**
   * @hidden
   */
  private _native: CollectionReference;
  /**
   * @hidden
   */
  private _path: string;
  /**
   * @hidden
   */
  private _parent: IDocumentRef<P> | null;

  /**
   * Create a collection reference from an [[Entity]] and optional parent.
   * @param E The entity class for the collections documents.
   * @param parent The parent document for the collection.
   */
  public constructor(E: new () => T, parent?: IDocumentRef<P>) {
    this._Entity = E;
    this._parent = parent || null;
    this._path = this.buildPath();
    this._native = this.buildNative();
  }

  /**
   * The path to this collection.
   */
  public get path(): string {
    return this._path;
  }

  /**
   * The parent document reference for the collection.
   */
  public get parent(): IDocumentRef<P> | null {
    return this._parent;
  }

  /**
   * The native firestore collection reference.
   */
  public get native(): CollectionReference {
    return this._native;
  }

  /**
   * @hidden
   * Creates the path to the collection.
   */
  // private buildPath(): string {
  //   const { name: collectionName } = getRepository(
  //     this._Entity.prototype.constructor.name
  //   ).collectionConfig;
  //   let p = `/${collectionName}`;
  //   if (this._parent) {
  //     p = `${this._parent.path}${p}`;
  //   }
  //   return p;
  // }
  private buildPath(): string {
    const { name: collectionName } = getRepository(
      this._Entity.prototype.constructor.name
    ).collectionConfig;
    let p = `/${collectionName}`;
    if (this._parent) {
      p = `${this._parent.path}${p}`;
    }
    return p;
  }

  /**
   * @hidden
   * Creates the native firestore reference.
   */
  private buildNative(): CollectionReference {
    const db = store().db;
    if (db) {
      return collectionOrig(db, this._path);
    } else {
      throw new Error("Undefined firestore1");
    }
  }

  /**
   * Gets a document reference from the collection.
   * @param id The document ID.
   */
  public doc(id: string): IDocumentRef<T> {
    return DocumentRef(id, this._Entity, this);
  }

  /**
   * Gets a document with a provided ID
   * @param id The ID of the document.
   *
   * @returns The entity.
   */
  // public async get(id: string): <T | null> {
  //   const dc = await getDoc(doc(this._native, id));
  //   return FirestoreSerializer.deserialize(dc, this._Entity, this);
  // }

  public get(id: string): Promise<T | null> {
    return new Promise(async (resolve) => {
      const dc = await getDoc(doc(this._native, id));
      if (dc.exists()) {
        resolve(FirestoreSerializer.deserialize(dc, this._Entity, this));
      }
      return resolve(null);
    });
  }

  /**
   * Updates a document from an entity instance.
   * @param entity The entity (with ID) to update.
   *
   * @returns The updated entity.
   */
  public async update(entity: T): Promise<T | null> {
    if (!entity.id) {
      throw new Error(
        `An ID must be provided when updating ${entity.constructor.name}`
      );
    }
    const { id, ...data } = FirestoreSerializer.serialize(
      entity,
      WriteTypes.Update
    );
    await updateDoc(doc(this._native, id), data);
    return await this.get(entity.id);
  }

  /**
   * Creates a new document from an entity instance.
   * @param entity An instance of the entity.
   *
   * @returns The created entity.
   */
  public async create(entity: T): Promise<T | null> {
    const { id, ...data } = FirestoreSerializer.serialize(
      entity,
      WriteTypes.Create
    );
    if (id) {
      await setDoc(doc(this._native, id), data);
      return await this.get(id);
    } else {
      const aD = await addDoc(this._native, data);
      return await this.get(aD.id);
    }
  }

  public find(query?: ICollectionQuery<T>): Promise<T[]> {
    return new Promise((resolve): void => {
      let querySnapshotPromise: Promise<QuerySnapshot>;
      if (query) {
        const fields = getRepository(
          this._Entity.prototype.constructor.name
        ).fields;
        console.log(QueryBuilder.query(this, fields, query));
        querySnapshotPromise = QueryBuilder.get(
          QueryBuilder.query(this, fields, query)
        );
      } else {
        querySnapshotPromise = getDocs(this._native);
      }
      querySnapshotPromise.then((querySnapshot): void => {
        resolve(
          querySnapshot.docs.map((snapshot): T => {
            return FirestoreSerializer.deserialize(
              snapshot,
              this._Entity,
              this
            ) as T;
          })
        );
      });
    });
  }
  /**
   * Removes a document from the collection.
   * @param id The document ID to remove.
   */
  public remove(id: string): Promise<void> {
    return new Promise((resolve): void => {
      deleteDoc(doc(this._native, id)).then((): void => {
        resolve();
      });
    });
  }

  /**
   * Entry point for building queries.
   */
  public query(): Query<T> {
    const fields = getRepository(
      this._Entity.prototype.constructor.name
    ).fields;
    return new Query(this._Entity, this, fields, this._native);
  }
}

/**
 * Collection factory
 * @returns A collection reference.
 */
export default <T extends Entity, P extends Entity>(
  model: new () => T,
  parent?: IDocumentRef<P>
): ICollection<T, P> => new Collection<T, P>(model, parent);
