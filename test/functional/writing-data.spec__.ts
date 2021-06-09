import * as bootstrap from "../bootstrap.spec";
import chai, { expect } from "chai";
import "mocha";
import { Collection, GeoPoint, ICollection } from "../../src";
import Post from "../entities/Post";
import chaiAsPromised from "chai-as-promised";
import User from "../entities/User";
import UserPrivate from "../entities/UserPrivate";
import { Timestamp } from "../../src/fields";
import AuthorPreferences from "../entities/AuthorPreferences";
import Comment from "../entities/Comment";

chai.use(chaiAsPromised);

describe("[functional] querying data", (): void => {
  let docId: string;
  // let collectionRef: ICollection<User>;

  before((): void => {
    bootstrap.start();
    docId = "user-1";
    // collectionRef = Collection(User);
  });

  after((): void => {
    bootstrap.reset();
  });

  const createDocument = async (id?: string): Promise<void> => {
    const displayName = "Name-1";
    const user = new User();
    // console.log(user);
    // const comment = new Comment();
  };
  it("creating document without id should create doc with generated id", async (): Promise<void> => {
    await createDocument(docId);
  });
});
