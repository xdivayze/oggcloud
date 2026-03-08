import {
  LibraryObjParent,
  type LibraryObjConstructorOptions,
} from "./libraryObj";

class Library extends LibraryObjParent {
  constructor(options?: LibraryObjConstructorOptions) {
    super(options);
  }
}

export { Library };
