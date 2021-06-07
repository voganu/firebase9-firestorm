import * as bootstrap from "../bootstrap.spec";
import { expect } from "chai";
import "mocha";
import { Collection, ICollection, IRepository } from "../../src";
import Post from "../entities/Post";
import { getRepository } from "../../src/store";

describe("[functional] configuration", (): void => {
  describe("usage without calling initialize()", (): void => {
    beforeEach((): void => {
      bootstrap.reset();
    });
    it("should throw an error", (): void => {
      expect((): ICollection<Post> => Collection(Post)).to.throw(Error);
    });
  });
  describe("usage when calling initialize()", (): void => {
    beforeEach((): void => {
      bootstrap.start();
    });
    it("getting an undefined repository should throw an error", (): void => {
      expect((): IRepository => getRepository("UndefinedEntity")).to.throw(
        Error
      );
    });
    it("getting a defined repository should should return the configuration", (): void => {
      expect((): IRepository => getRepository("Post")).to.not.throw(Error);
      const postRepository = getRepository("Post");
      expect(postRepository.fields).to.include.keys([
        "title",
        "body",
        "author",
        "posted",
      ]);
      expect(postRepository.collectionConfig.name).to.equal("posts");
    });
  });
});
