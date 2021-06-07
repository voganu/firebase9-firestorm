// import { firestore } from 'firebase/app';
import {
  FieldValue as FieldValueOrig,
  Timestamp as TimestampOrig,
} from "firebase/firestore";

import { IFieldConfig, IFieldMeta, WriteTypes } from ".";
import { Timestamp } from "../fields";

export interface ITimestamp {
  seconds: number;
  nanoseconds: number;
  native: TimestampOrig;
  toDate: () => Date;
  toMillis: () => number;
  isEqual: (other: ITimestamp) => boolean;
}

export interface ITimestampConfig extends IFieldConfig {
  isArray?: boolean;
  updateOnWrite?: boolean;
  updateOnCreate?: boolean;
  updateOnUpdate?: boolean;
  format?: (date: Date) => string;
}

export interface ITimestampMeta extends IFieldMeta {
  updateOnWrite: boolean;
  updateOnCreate: boolean;
  updateOnUpdate: boolean;
  serialize: (
    value: Timestamp | Timestamp[],
    writeType: WriteTypes
  ) => TimestampOrig | TimestampOrig[] | FieldValueOrig | FieldValueOrig[];
  format: (date: Date) => string;
}
