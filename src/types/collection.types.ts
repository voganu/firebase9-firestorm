// import { firestore } from 'firebase/app';
import {
  DocumentChangeType,
  OrderByDirection,
  WhereFilterOp,
  SnapshotMetadata,
  SnapshotListenOptions,
  CollectionReference,
  Query as QueryOrig,
  QuerySnapshot as QuerySnapshotOrig,
} from "firebase/firestore";

import { IDocumentRef } from "./field.types";
import QuerySnapshot from "../QuerySnapshot";
import { _Query } from "..";

export interface IEntity {
  id: string;
  ref: IDocumentRef<any>;
  toData(): Record<string, any>;
}

export interface _IQuery<T extends IEntity> {
  native: QueryOrig;
  where(property: keyof T, op: WhereFilterOp, value: any): _Query<T>;
  orderBy(property: keyof T, sort?: OrderByDirection): _Query<T>;
  limit(amount: number): _Query<T>;
  startAt(...fieldValues: any[]): _Query<T>;
  startAfter(...fieldValues: any[]): _Query<T>;
  endAt(...fieldValues: any[]): _Query<T>;
  endBefore(...fieldValues: any[]): _Query<T>;
  buildSnapshot(nativeSnapshot: QuerySnapshotOrig): QuerySnapshot<T>;
  // onSnapshot(
  //   onNext: (snapshot: _IQuerySnapshot<T>) => void,
  //   onError?: (error: Error) => void
  // ): () => void;
  // get(): Promise<_IQuerySnapshot<T>>;
}

export interface _IQuerySnapshot<T extends IEntity> {
  docs: T[];
  size: number;
  empty: boolean;
  query: _IQuery<T>;
  metadata: SnapshotMetadata;
  forEach: (callback: (doc: T, index: number) => void) => void;
  docChanges: (opts?: SnapshotListenOptions) => DocumentChange<T>[];
}

export interface _IDocumentSnapshot<T extends IEntity> {
  doc: T;
  exists: boolean;
  ref: IDocumentRef<T>;
  metadata: SnapshotMetadata;
}

export interface _ICollection<T extends IEntity, P extends IEntity = any> {
  native: CollectionReference;
  path: string;
  parent?: IDocumentRef<P> | null;
  entity: new () => T;
}

export interface DocumentChange<T extends IEntity> {
  doc: T;
  type: DocumentChangeType;
  newIndex: number;
  oldIndex: number;
}

export interface ICollectionConfig {
  name: string;
}

type WhereQuery<T extends IEntity> = [keyof T, WhereFilterOp, any];

type OrderByQuery<T extends IEntity> = [keyof T, OrderByDirection?];

type StartAtQuery<T extends IEntity> = T | any;
type StartAfterQuery<T extends IEntity> = T | any;
type EndAtQuery<T extends IEntity> = T | any;
type EndBeforeQuery<T extends IEntity> = T | any;

export interface ICollectionQuery<T extends IEntity> {
  where?: WhereQuery<T>[];
  orderBy?: OrderByQuery<T>[];
  limit?: number;
  startAt?: StartAtQuery<T>;
  startAfter?: StartAfterQuery<T>;
  endAt?: EndAtQuery<T>;
  endBefore?: EndBeforeQuery<T>;
}

export interface ISubCollectionConfig extends ICollectionConfig {
  entity: new () => IEntity;
}
