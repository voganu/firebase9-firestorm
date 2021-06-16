import { expect } from "chai";
import "mocha";
import {
  FirebaseFirestore as firestoreTypes,
  collection,
  getDoc,
  doc,
} from "firebase/firestore";
import { _ICollection, _collection, _doc, _getDoc } from "../../src";

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
      expect((): _ICollection<Post> => _collection(Post)).to.throw(Error);
    });
  });

  describe("calling Collection(IEntity) when calling initialize()", (): void => {
    beforeEach((): void => {
      bootstrap.start();
    });
    describe("with invalid entity", (): void => {
      it("should throw an error", (): void => {
        expect((): _ICollection<any> => _collection(undefined as any)).to.throw(
          Error
        );
      });
    });
    describe("with valid entity", (): void => {
      let post: _ICollection<Post>;
      let firestore: firestoreTypes;
      beforeEach((): void => {
        post = _collection(Post);
        firestore = bootstrap.getFirestore();
      });
      it("should not throw an error", (): void => {
        expect((): _ICollection<Post> => _collection(Post)).to.not.throw(Error);
      });
      describe("#doc", (): void => {
        it("should provide a document ref when provided a valid ID", (): void => {
          const doc = _getDoc(post, "hello-world");
          expect(doc).to.not.be.null.and.not.be.undefined;
        });
      });
      describe("#path", (): void => {
        it("root collection should produce a valid path", (): void => {
          expect(post.path).to.equal("/posts");
        });
        it("sub collection should produce a valid path", (): void => {
          const doc = _doc(post, "hello-world");
          expect(_collection(Comment, doc).path).to.equal(
            "/posts/hello-world/comments"
          );
        });
      });
      describe("#parent", (): void => {
        it("root collection should have null parent", (): void => {
          expect(post.parent).to.be.null;
        });
        it("sub collection parent should be document ref", (): void => {
          const commentCollection = _collection(
            Comment,
            _doc(post, "hello-world")
          );
          const docParent = commentCollection.parent;
          if (docParent) {
            const firestoreDoc = doc(firestore, "/posts/hello-world");
            expect(docParent.path).to.equal(`/${firestoreDoc.path}`);
            expect(docParent.id).to.equal(firestoreDoc.id);
          }
        });
        it("invalid subcollection from post ref should throw an error", (): void => {
          expect(
            (): _ICollection<Author> =>
              _collection(Author, _doc(post, "hello-wolrd"))
          ).to.throw(Error);
        });
      });
      describe("#native", (): void => {
        it("root collection native reference should equal firestore reference", (): void => {
          expect(post.native.id).to.eql(collection(firestore, "posts").id);
        });
        it("subcollection native should equal firestore reference", (): void => {
          const commentCollection = _collection(
            Comment,
            _doc(post, "hello-world")
          );
          expect(commentCollection.native.id).to.eql(
            collection(firestore, "posts/hello-world/comments").id
          );
        });
      });
    });
  });
});
