// Module File
import "reflect-metadata";
export { initialize, destroy } from "./store";
export * from "./types";
export * from "./decorators";
export * from "./fields";
export { default as Entity } from "./Entity";
export {
  default as _collection,
  _doc,
  _findDocs,
  _getDoc,
  _removeDoc,
  _updateDoc,
  _createDoc,
  _query,
  _onSnapshotDoc,
} from "./Collection";
// export {
//   collection_,
//   getDoc_,
//   updateDoc_,
//   getDocByRef_,
//   createDoc_,
//   doc_,
//   removeDoc_,
//   queryDocs_,
//   findDocs_,
//   onSnapshotDoc_,
//   onSnapshotDocs_,
//   docsBuilder_,
//   getDocsBuilder_,
// } from "./_service_";

export { default as _Query, _getDocs, _onSnapshotDocs } from "./Query";
