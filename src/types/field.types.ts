/* eslint-disable @typescript-eslint/no-empty-interface */
// import { firestore } from "firebase/app";
import { DocumentReference, GeoPoint } from "firebase/firestore";

import { FieldTypes } from "./enum.types";
import { _ICollection, IEntity, _IDocumentSnapshot } from "./collection.types";

// Base Field Config

export interface IFieldConfig {
  name?: string;
}

export interface IFieldMeta {
  name: string;
  type: FieldTypes;
  isArray: boolean;
  serialize: (...values: any) => any;
  deserialize: (value: any) => any;
  toData: (value: any) => any;
}

export interface IFieldWithEntityConfig extends IFieldConfig {
  entity: new () => IEntity;
}

export interface IFieldWithEntityMeta extends IFieldMeta {
  entity: new () => IEntity;
}

// Document References

export interface IDocumentRef<T extends IEntity> {
  id: string;
  cached: T | null;
  native: DocumentReference;
  path: string;
  parent: _ICollection<T>;
  isFetched(): boolean;
  get(): Promise<T>;
  collection<C extends IEntity>(coll: new () => C): _ICollection<C>;
  onSnapshot(
    onNext: (snapshot: _IDocumentSnapshot<T>) => void,
    onError?: (error: Error) => void
  ): () => void;
}

export interface IDocumentRefConfig extends IFieldWithEntityConfig {}

export interface IDocumentRefMeta extends IFieldWithEntityMeta {}

// GeoPoints

export interface IGeoPoint {
  latitude: number;
  longitude: number;
  native: GeoPoint;
  isEqual: (other: IGeoPoint) => boolean;
}

export interface IGeoPointConfig extends IFieldConfig {}

export interface IGeoPointMeta extends IFieldMeta {}

// Field Maps

export interface IFieldMapConfig extends IFieldConfig {
  entity?: new () => any;
}

export interface IFieldMapMeta extends IFieldWithEntityMeta {}
