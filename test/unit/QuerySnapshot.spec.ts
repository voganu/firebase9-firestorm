import * as bootstrap from "../bootstrap.spec";
import { collection, QuerySnapshot, getDocs } from "firebase/firestore";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import { Collection, ICollection, IQuerySnapshot } from "../../src";
import Post from "../entities/Post";

chai.use(chaiAsPromised);

describe("[unit] QuerySnapshot", (): void => {
  let postCollection: ICollection<Post>;
  let firestormSnapshot: IQuerySnapshot<Post>;
  let firestoreSnapshot: QuerySnapshot;
  beforeEach(async (): Promise<void> => {
    bootstrap.start();
    postCollection = Collection(Post);
    firestormSnapshot = await postCollection.query().get();
    firestoreSnapshot = await getDocs(
      collection(bootstrap.getFirestore(), "posts")
    );
  });
  afterEach((): void => {
    bootstrap.reset();
  });
  describe("methods", (): void => {
    describe("#docs", (): void => {
      it("should match firestore result", async (): Promise<void> => {
        let docCounter = 0;
        const matches =
          firestormSnapshot.docs.length === firestormSnapshot.docs.length &&
          firestormSnapshot.docs.reduce((prev: any, curr: Post): boolean => {
            const matches =
              prev && curr.id === firestoreSnapshot.docs[docCounter].id;
            docCounter += 1;
            return matches;
          }, true);
        expect(matches).to.be.true;
      });
    });
    describe("#empty", (): void => {
      it("should match firestore result", (): void => {
        expect(firestoreSnapshot.empty).to.equal(firestormSnapshot.empty);
      });
    });
    describe("#size", (): void => {
      it("should match firestore result", (): void => {
        expect(firestoreSnapshot.size).to.equal(firestormSnapshot.size);
      });
    });
  });
});
