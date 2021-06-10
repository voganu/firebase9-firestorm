import { expect } from "chai";
import "mocha";
import {
  FirebaseFirestore as firestoreTypes,
  collection,
  getDoc,
  doc,
} from "firebase/firestore";
import { Collection, ICollection } from "../../src";

import * as bootstrap from "../bootstrap.spec";
import Post from "../entities/Post";
import Comment from "../entities/Comment";
import Author from "../entities/Author";

describe("[unit] Collection", (): void => {
  describe("calling Collection(IEntity) without calling initialize()", (): void => {
    beforeEach((): void => {
      bootstrap.reset();
    });
    it("should throw an error", (): void => {
      expect((): ICollection<Post> => Collection(Post)).to.throw(Error);
    });
  });

  describe("calling Collection(IEntity) when calling initialize()", (): void => {
    beforeEach((): void => {
      bootstrap.start();
    });
    describe("with invalid entity", (): void => {
      it("should throw an error", (): void => {
        expect((): ICollection<any> => Collection(undefined as any)).to.throw(
          Error
        );
      });
    });
    describe("with valid entity", (): void => {
      let post: ICollection<Post>;
      let firestore: firestoreTypes;
      beforeEach((): void => {
        post = Collection(Post);
        firestore = bootstrap.getFirestore();
      });
      it("should not throw an error", (): void => {
        expect((): ICollection<Post> => Collection(Post)).to.not.throw(Error);
      });
      describe("#doc", (): void => {
        it("should provide a document ref when provided a valid ID", (): void => {
          const doc = post.doc("hello-world");
          expect(doc).to.not.be.null.and.not.be.undefined;
        });
      });
      describe("#path", (): void => {
        it("root collection should produce a valid path", (): void => {
          expect(post.path).to.equal("/posts");
        });
        it("sub collection should produce a valid path", (): void => {
          const doc = post.doc("hello-world");
          expect(doc.collection(Comment).path).to.equal(
            "/posts/hello-world/comments"
          );
        });
      });
      describe("#parent", (): void => {
        it("root collection should have null parent", (): void => {
          expect(post.parent).to.be.null;
        });
        it("sub collection parent should be document ref", (): void => {
          const commentCollection = post.doc("hello-world").collection(Comment);
          const docParent = commentCollection.parent;
          if (docParent) {
            const firestoreDoc = doc(firestore, "/posts/hello-world");
            expect(docParent.path).to.equal(`/${firestoreDoc.path}`);
            expect(docParent.id).to.equal(firestoreDoc.id);
          }
        });
        it("invalid subcollection from post ref should throw an error", (): void => {
          expect(
            (): ICollection<Author> =>
              post.doc("hello-wolrd").collection(Author)
          ).to.throw(Error);
        });
      });
      describe("#native", (): void => {
        it("root collection native reference should equal firestore reference", (): void => {
          expect(post.native.id).to.eql(collection(firestore, "posts").id);
        });
        it("subcollection native should equal firestore reference", (): void => {
          const commentCollection = post.doc("hello-world").collection(Comment);
          expect(commentCollection.native.id).to.eql(
            collection(firestore, "posts/hello-world/comments").id
          );
        });
      });
    });
  });
});
