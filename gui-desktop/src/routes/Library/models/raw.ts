import { RAW_SPLASH_URL } from "./constants";
import { LibraryObj, type LibraryObjConstructorOptions } from "./libraryObj";


class Raw extends LibraryObj {
  setSplashUrl(_splashUrl: string): void {
      this.splashUrl = RAW_SPLASH_URL;
    }
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
