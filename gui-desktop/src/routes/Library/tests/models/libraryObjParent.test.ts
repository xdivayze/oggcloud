import { describe, it, expect } from "vitest";
import { Folder } from "../../models/folder";
import { LibraryObjParent } from "../../models/libraryObj";

class ObjParentConcrete extends LibraryObjParent {
  open(callback: (data: Record<string, unknown>) => void): void {
    callback({ id: this.getID() });
  }
}

describe("LibraryParentObj", () => {
  it("appends children successfully", () => {
    const parent = new ObjParentConcrete();
    const id = 5;
    parent.addChildrenUnique([new Folder(undefined, { id })]);
    expect(parent.children).toHaveLength(2);
    expect(parent.children.filter((v) => v.getID() === id)[0].getID()).toBe(
      id,
    );
  });

  it("")
});
