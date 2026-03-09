import {
  LibraryObjOpenable,
  type LibraryObjConstructorOptions,
} from "./libraryObj";

class Picture extends LibraryObjOpenable {
  open(): void {
    //TODO
    throw new Error("Method not implemented.");
  }
  constructor(options?: LibraryObjConstructorOptions) {
    if (!options) {
      options = {};
    }

    options.type = "picture";

    super(options);
  }
}

export { Picture };
