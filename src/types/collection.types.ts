// import { firestore } from 'firebase/app';
import {
  DocumentChangeType,
  OrderByDirection,
  WhereFilterOp,
  SnapshotMetadata,
  SnapshotListenOptions,
  CollectionReference,
} from "firebase/firestore";

import { IDocumentRef } from "./field.types";
import { Query } from "..";

export interface IEntity {
  id: string;
  ref: IDocumentRef<any>;
  toData(): Record<string, any>;
}

export interface IQuery<T extends IEntity> {
  where(property: keyof T, op: WhereFilterOp, value: any): IQuery<T>;
  orderBy(property: keyof T, sort?: OrderByDirection): IQuery<T>;
  limit(amount: number): IQuery<T>;
  startAt(...fieldValues: any[]): IQuery<T>;
  startAfter(...fieldValues: any[]): Query<T>;
  endAt(...fieldValues: any[]): Query<T>;
  endBefore(...fieldValues: any[]): Query<T>;
  onSnapshot(
    onNext: (snapshot: IQuerySnapshot<T>) => void,
    onError?: (error: Error) => void
  ): () => void;
  get(): Promise<IQuerySnapshot<T>>;
}

export interface IQuerySnapshot<T extends IEntity> {
  docs: T[];
  size: number;
  empty: boolean;
  query: IQuery<T>;
  metadata: SnapshotMetadata;
  forEach: (callback: (doc: T, index: number) => void) => void;
  docChanges: (opts?: SnapshotListenOptions) => DocumentChange<T>[];
}

export interface IDocumentSnapshot<T extends IEntity> {
  doc: T;
  exists: boolean;
  ref: IDocumentRef<T>;
  metadata: SnapshotMetadata;
}

export interface ICollection<T extends IEntity, P extends IEntity = any> {
  native: CollectionReference;
  path: string;
  parent?: IDocumentRef<P> | null;
  query: () => IQuery<T>;
  create: (entity: T) => Promise<T | null>;
  update: (entity: T) => Promise<T | null>;
  doc: (id: string) => IDocumentRef<T>;
  get: (id: string) => Promise<T | null>;
  find: (query?: ICollectionQuery<T>) => Promise<T[]>;
  remove: (id: string) => Promise<void>;
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
