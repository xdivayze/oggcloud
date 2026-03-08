import {
  LibraryObjParent,
  type LibraryObjConstructorOptions,
} from "./libraryObj";

class Folder extends LibraryObjParent {
  open(): void {
    //TODO
    throw new Error("Method not implemented.");
  }

  constructor(options?: LibraryObjConstructorOptions) {
    super(options);
  }
}

export { Folder };
