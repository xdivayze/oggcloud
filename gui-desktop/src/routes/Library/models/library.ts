import { Folder } from "./folder";
import { LibraryObj, type LibraryObjConstructorOptions } from "./libraryObj";

//library acts as the root folder with id = 0
class Library extends Folder {
  setChildren(children: Array<LibraryObj>) {
    this.children = children;
  }
  constructor(options?: LibraryObjConstructorOptions) {
    options = options ? options : {};
    options.id = 0;
    options.parentID = 0; //self referential
    super([], options);
    this.setChildren([...this.children, this])
  }
}

export { Library };
