import { LibraryObj, type LibraryObjConstructorOptions } from "./libraryObj";

export const RAW_SPLASH_URL = "/libraryObjectRawSplash.svg";

class Raw extends LibraryObj {
  constructor(options?: LibraryObjConstructorOptions) {
    if (!options) {
      options = {}
    } 
    options.splashUrl= RAW_SPLASH_URL;
    options.type = "raw";
    super(options);
  }
}

export { Raw };
