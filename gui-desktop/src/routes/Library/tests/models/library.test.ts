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
});
