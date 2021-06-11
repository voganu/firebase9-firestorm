import Entity from "./Entity";
import { IDocumentSnapshot, ICollection } from "./types/collection.types";
import { IDocumentRef } from "./types";
import {
  DocumentSnapshot as DocumentSnapshotOrig,
  SnapshotMetadata,
} from "firebase/firestore";
import { FirestoreSerializer } from "./utils";

export default class DocumentSnapshot<T extends Entity> // eslint-disable-next-line @typescript-eslint/indent
  implements IDocumentSnapshot<T>
{
  /**
   * @hidden
   */
  private _nativeSnapshot: DocumentSnapshotOrig;
  /**
   * @hidden
   */
  private _doc: T;

  /**
   * Creates a document snapshot.
   * @param nativeSnapshot The firestore DocumentSnapshot.
   * @param Entity The entity to represent.
   * @param collection The parent collection for the entity.
   */
  public constructor(
    nativeSnapshot: DocumentSnapshotOrig,
    Entity: new () => T,
    collection: ICollection<T>
  ) {
    this._nativeSnapshot = nativeSnapshot;
    this._doc = FirestoreSerializer.deserialize(
      nativeSnapshot,
      Entity,
      collection
    );
  }

  /**
   * The document in the snapshot.
   */
  public get doc(): T {
    return this._doc;
  }

  /**
   * Whether or not the document exists.
   */
  public get exists(): boolean {
    return this._nativeSnapshot.exists();
  }

  /**
   * The document reference.
   */
  public get ref(): IDocumentRef<T> {
    return this._doc.ref;
  }

  /**
   * The metadata for the reference.
   */
  public get metadata(): SnapshotMetadata {
    return this._nativeSnapshot.metadata;
  }
}
