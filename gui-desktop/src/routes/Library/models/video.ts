import {
  LibraryObjOpenable,
  type LibraryObjConstructorOptions,
} from "./libraryObj";

class Video extends LibraryObjOpenable {
  open(): void { //TODO
    throw new Error("Method not implemented.");
  }

  constructor(options?: LibraryObjConstructorOptions) {
    if (!options) {
      options = {};
    }
    options.type = "video";
    super(options);
  }
}

export { Video };
