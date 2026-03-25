import { Folder } from "./folder";
import {
  LibraryObj,
  LibraryObjParent,
  type LibraryObjConstructorOptions,
} from "./libraryObj";

//library acts as the root folder with id = 0
class Library extends Folder {
  setChildren(children: Array<LibraryObj>) {
    this.children = children;
  }

  //returns an array of library objects from the id tree
  //elements must already be inserted into the library
  familyTreeToObjectArray(tree: number[]): LibraryObj[] {
    let objs = [];

    for (let i = 0; i < tree.length; i++) {
      const found = this.getSpecificFromFamilyTree(
        //retrieves the ith element from the last
        tree.slice(0, tree.length - i),
      );
      if (!found)
        throw new Error(
          "at least one of the elements are not found in the library",
        );
      objs.push(found);
    }
    objs.reverse();

    return objs;
  }


  //everything is inserted and instantiated
  async insertFamilyTreeAndInstantiate(tree: Array<number>) {
    if (tree[0] != 0) throw new Error("root object is not the first element"); //return if root is not the first object in the tree
    let lastFound: Folder = this;
    let instantiationPromises = [];
    for (let i = 1; i < tree.length - 1; i++) {
      const lastFoundTemp = lastFound.getSpecificFromID(tree[i - 1]);
      if (!lastFoundTemp || !(lastFoundTemp instanceof Folder))
        throw new Error(
          "recently inserted parent object unretrievable or of a different type",
        );
      lastFound = lastFoundTemp;
      const newChild = new Folder(undefined, {
        id: tree[i],
        parentID: tree[i - 1],
      });

      lastFound.addChildrenUnique([newChild]);
      instantiationPromises.push(newChild.instantiateSelfFromID());
    }
    await Promise.all(instantiationPromises);

    //last element's instantiation
    const parentTree = tree.slice(0, tree.length - 1);
    const parent = this.getSpecificFromFamilyTree(parentTree);
    if (!parent || !(parent instanceof Folder)) {
      throw new Error(
        "recently inserted parent object unretrievable or of a different type",
      );
    }
    await parent.populateChildrenArr();
    const foundLastChild = parent.getSpecificFromID(tree[tree.length - 1]);
    if (!foundLastChild)
      throw new Error(
        "the last element was not found in the database as a child of it's parent",
      );

    await foundLastChild.instantiateSelfFromID();
  }

  //inserts all but the last element in the family tree
  //this design is chosen to ensure that function is usable without knowing the last element's type
  insertFamilyTreeOnlyRelativeParents(tree: Array<number>) {
    if (tree[0] != 0) throw new Error("root object is not the first element"); //return if root is not the first object in the tree
    let lastFound: LibraryObjParent = this;
    for (let i = 1; i < tree.length - 1; i++) {
      const newChild = new Folder(undefined, {
        id: tree[i],
        parentID: tree[i - 1],
      });

      lastFound.addChildrenUnique([newChild]);
      lastFound = newChild;
    }
  }

  //family tree defined as object ids from (index:actual): 0: root -> n: self
  getSpecificFromFamilyTree(tree: Array<number>) {
    if (tree[0] != 0) return null; //return if root is not the first object in the tree
    let lastFound: LibraryObjParent = this;
    for (let i = 0; i < tree.length; i++) {
      const lastFoundUnk = lastFound.getSpecificFromID(tree[i]);
      if (!lastFoundUnk) return null;
      if (i == tree.length - 1) {
        //return last object in the tree
        return lastFoundUnk;
      }

      if (!(lastFoundUnk instanceof LibraryObjParent)) return null; //return if non-last object is not a parent
      lastFound = lastFoundUnk;
    }
  }

  constructor(options?: LibraryObjConstructorOptions) {
    options = options ? options : {};
    options.id = 0;
    options.parentID = 0; //self referential
    super([], options);

    this.setChildren([...this.children, this]);
  }
}

export { Library };
