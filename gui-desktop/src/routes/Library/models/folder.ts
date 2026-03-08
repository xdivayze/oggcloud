import {
  LibraryObjOpenable,
  type LibraryObjConstructorOptions,
} from "./libraryObj";

class Folder extends LibraryObjOpenable {
  open(): void {
    //TODO
    throw new Error("Method not implemented.");
  }

  constructor(options?: LibraryObjConstructorOptions) {
    super(options);
  }
}

export { Folder };
