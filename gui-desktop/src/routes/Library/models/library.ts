import { Folder } from "./folder";
import { type LibraryObjConstructorOptions } from "./libraryObj";

//library acts as the root folder with id = 0
class Library extends Folder {
  constructor(options?: LibraryObjConstructorOptions) {
    options = options ? options : {};
    options.id = 0;
    super(options);
  }
}

export { Library };
