import { PICTURE_DEFAULT_SPLASH_URL } from "./constants";
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
    if (!options.splashUrl) options.splashUrl = PICTURE_DEFAULT_SPLASH_URL;

    super(options);
  }
}

export { Picture };
