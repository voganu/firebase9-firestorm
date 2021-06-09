import UserPrivate from "./UserPrivate";
import {
  field,
  rootCollection,
  ITimestamp,
  // documentRef,
  Entity,
  subCollection,
  // IDocumentRef,
  ICollection,
  timestamp,
  // ICollectionConfig,
  // IFieldConfig,
  // getOrCreateRepository,
} from "../../src";
// import { ITimestamp } from "../../firestorm/src/types";
@rootCollection({
  name: "users",
})
export default class User extends Entity {
  @field({ name: "id" })
  id!: string;

  @field({ name: "displayName" })
  displayName!: string;

  // @documentRef({
  //   name: "author",
  //   entity: Author,
  // })
  // author!: IDocumentRef<Author>;

  @subCollection({
    name: "usersprivate",
    entity: UserPrivate,
  })
  usersprivate!: ICollection<UserPrivate>;

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
