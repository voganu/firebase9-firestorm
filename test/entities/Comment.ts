import Reply from "./Reply";
import { _ICollection, Entity, field, subCollection } from "../../src";

export default class Comment extends Entity {
  @field({ name: "content" })
  content!: string;

  @field({ name: "by" })
  by!: string;

  @subCollection({
    name: "replies",
    entity: Reply,
  })
  replies!: _ICollection<Reply>;
}
