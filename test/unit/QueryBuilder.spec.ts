// import { firestore } from 'firebase/app';
import {
  Query,
  collection,
  query as queryOrig,
  getDocs,
  where,
  orderBy,
  limit,
  startAfter,
  startAt,
  endBefore,
  endAt,
  FirebaseFirestore,
} from "firebase/firestore";
import { expect } from "chai";
import "mocha";
import { Collection, IFieldMeta } from "../../src";
import { QueryBuilder } from "../../src/utils";

import * as bootstrap from "../../test/bootstrap.spec";
import Post from "../../test/entities/Post";
import { getRepository } from "../../src/store";

describe("[unit] QueryBuilder", (): void => {
  let firestore: FirebaseFirestore;
  let fields: Map<string, IFieldMeta>;

  beforeEach((): void => {
    bootstrap.start();
    firestore = bootstrap.getFirestore();
    fields = getRepository("Post").fields;
  });

  afterEach((): void => {
    bootstrap.reset();
  });

  describe("where queries", (): void => {
    it("unregister property should throw an error", (): void => {
      expect((): any =>
        QueryBuilder.query(Collection(Post), fields, {
          where: [["unregistered" as any, "==", "any"]],
        })
      ).to.throw(Error);
    });
    it("empty where should match firestore base collection query", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        where: [],
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(collection(firestore, "posts"));
      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
    it("undefined where should match firestore base collection query", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {});
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(collection(firestore, "posts"));
      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
    it("single where should match firestore collection query", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        where: [["title", "==", "test"]],
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(collection(firestore, "posts"), where("title", "==", "test"))
      );

      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
    it("chain where should match firestore collection query", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        where: [
          ["title", "==", "test"],
          ["body", "==", "test"],
        ],
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(
          collection(firestore, "posts"),
          where("title", "==", "test"),
          where("body", "==", "test")
        )
      );

      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
  });

  describe("order by queries", (): void => {
    describe("single order by should match firestore collection query", (): void => {
      it("with implicit order direction", async (): Promise<void> => {
        const query = QueryBuilder.query(Collection(Post), fields, {
          orderBy: [["title"]],
        });
        const firestormResults = await QueryBuilder.get(query);
        const firestoreResults = await getDocs(
          queryOrig(collection(firestore, "posts"), orderBy("title"))
        );
        // const firestoreResults = await query.get();
        expect(firestoreResults.docs.length).to.eql(
          firestormResults.docs.length
        );
      });
      it("with explicit order direction", async (): Promise<void> => {
        const query = QueryBuilder.query(Collection(Post), fields, {
          orderBy: [["title", "asc"]],
        });
        const firestormResults = await QueryBuilder.get(query);
        const firestoreResults = await getDocs(
          queryOrig(collection(firestore, "posts"), orderBy("title", "asc"))
        );
        expect(firestoreResults.docs.length).to.eql(
          firestormResults.docs.length
        );
      });
    });
  });

  describe("startAt/startAfter queries", (): void => {
    it("startAt query should match firestore collection query", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        orderBy: [["title", "desc"]],
        startAt: "Hello World!",
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(
          collection(firestore, "posts"),
          orderBy("title", "desc"),
          startAt("Hello World!")
        )
      );
      expect(firestormResults.docs.length).to.eql(2);
      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
    it("startAfter query should match firestore collection query", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        orderBy: [["title", "desc"]],
        startAfter: "Hello World!",
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(
          collection(firestore, "posts"),
          orderBy("title", "desc"),
          startAfter("Hello World!")
        )
      );
      expect(firestormResults.docs.length).to.equal(1);
      expect(firestoreResults.docs.length).to.equal(
        firestormResults.docs.length
      );
    });
    it("using startAt and startAfter should use startAt", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        orderBy: [["title", "desc"]],
        startAt: "Hello World!",
        startAfter: "Hello World!",
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(
          collection(firestore, "posts"),
          orderBy("title", "desc"),
          startAt("Hello World!"),
          startAfter("Hello World!")
        )
      );
      expect(firestormResults.docs.length).to.eql(2);
      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
  });

  describe("endAt/endBefore queries", (): void => {
    it("endAt query should match firestore collection query", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        orderBy: [["title", "desc"]],
        endAt: "Hello World!",
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(
          collection(firestore, "posts"),
          orderBy("title", "desc"),
          endAt("Hello World!")
        )
      );
      expect(firestormResults.docs.length).to.eql(1);
      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
    it("endBefore query should match firestore collection query", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        orderBy: [["title", "desc"]],
        endBefore: "Hello World!",
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(
          collection(firestore, "posts"),
          orderBy("title", "desc"),
          endBefore("Hello World!")
        )
      );
      expect(firestormResults.docs.length).to.equal(0);
      expect(firestoreResults.docs.length).to.equal(
        firestormResults.docs.length
      );
    });
    it("using endAt and endBefore should use endAt", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        orderBy: [["title", "desc"]],
        endAt: "Hello World",
        endBefore: "Hello World",
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(
          collection(firestore, "posts"),
          orderBy("title", "desc"),
          endAt("Hello World!"),
          endBefore("Hello World!")
        )
      );
      expect(firestormResults.docs.length).to.eql(2);
      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
  });

  describe("limit query", (): void => {
    it("should limit results", async (): Promise<void> => {
      const query = QueryBuilder.query(Collection(Post), fields, {
        limit: 1,
      });
      const firestormResults = await QueryBuilder.get(query);
      const firestoreResults = await getDocs(
        queryOrig(collection(firestore, "posts"), limit(1))
      );
      expect(firestormResults.docs.length).to.eql(1);
      expect(firestoreResults.docs.length).to.eql(firestormResults.docs.length);
    });
  });
});
