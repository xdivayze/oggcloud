import { describe, it, expect } from "vitest";
import { Library } from "../../models/library";

describe("Library", () => {
  it("inserts family tree parents successfully ", () => {
    const library = new Library();
    const tree = [0, 3, 7, 10, 15];
    library.insertFamilyTreeOnlyRelativeParents(tree);
    expect(library.children).toHaveLength(2);

    const foundObj = library.getSpecificFromFamilyTree(tree.slice(0, 4));
    if (!foundObj) throw new Error("found obj null");
    expect(foundObj).toBeTruthy();
    expect(foundObj.getID()).toBe(tree[3]);
    expect(foundObj.getParentID()).toBe(tree[2]);
  });

  it("inserts all elements in a family tree and initializes them successfully", async () => {
    const library = new Library();
    const tree = [0, 3, 4, 7, 8];
    await library.insertFamilyTreeAndInstantiate(tree);
    expect(library.getSpecificFromFamilyTree(tree)?.altText).toBe("alt");
    expect(
      library.getSpecificFromFamilyTree(tree.splice(0, tree.length - 1))?.name,
    ).toBe("test folder");
  });

  it("converts family tree to object array successfully", async () => {
    const library = new Library();
    const tree = [0, 3, 4, 6];
    await library.insertFamilyTreeAndInstantiate(tree);
    const objArr = library.familyTreeToObjectArray(tree);
    expect(objArr.length).toBe(tree.length);
    for (const v in objArr) {
      expect(v).toBeTruthy();
    }
    expect(objArr[0].getID()).toBe(0);
  });

  it("retrieves specific element from the library using the family tree successfully", async () => {
    const library = new Library();
    const tree = [0, 3, 4, 7, 8];
    await library.insertFamilyTreeAndInstantiate(tree);
    const obj = library.getSpecificFromFamilyTree(tree);
    expect(obj).toBeTruthy();
  });
});
