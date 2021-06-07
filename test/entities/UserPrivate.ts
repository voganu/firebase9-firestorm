import {
  field,
  rootCollection,
  // documentRef,
  Entity,
  // subCollection,
  // IDocumentRef,
  // ICollection,
  timestamp,
} from "../../src";
import { ITimestamp } from "../../src/types";

@rootCollection({
  name: "usersprivate",
})
export default class UserPrivate extends Entity {
  @field({ name: "id" })
  id!: string;

  @field({ name: "email" })
  email!: string;
  @timestamp({
    updateOnCreate: true,
  })
  createdAt!: ITimestamp;
  @timestamp({
    updateOnCreate: true,
    updateOnUpdate: true,
  })
  updatedAt!: ITimestamp;
}
