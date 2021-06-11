// Module File
import "reflect-metadata";
export { initialize, destroy } from "./store";
export * from "./types";
export * from "./decorators";
export * from "./fields";
export { default as Entity } from "./Entity";
export {
  default as Collection,
  collection_,
  getDoc_,
  getDocByRef_,
  create_,
  doc_,
  remove_,
  query_,
  find_,
} from "./Collection";
export { default as Query } from "./Query";
