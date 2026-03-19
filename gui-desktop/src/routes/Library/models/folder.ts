import { folderFetchChildren } from "../services/folderFetchChildren";
import { libraryObjectFactory } from "../services/libraryObjectFactory";
import { FOLDER_SPLASH_URL } from "./constants";
import {
  LibraryObj,
  LibraryObjParent,
  type LibraryObjConstructorOptions,
} from "./libraryObj";

class Folder extends LibraryObjParent {
  open(callback: (data: Record<string, unknown>) => void): void {
    callback({
      id: this.getID(),
    });
  }

  async populateChildrenArr(): Promise<void> {
    const children = await folderFetchChildren(this.getID());
    let childrenObjArr: Array<LibraryObj> = [];
    children.forEach((v) => {
      childrenObjArr.push(libraryObjectFactory(v));
    });
    this.setChildren(childrenObjArr);
  }

  setSplashUrl(_splashUrl: string): void {
    this.splashUrl = FOLDER_SPLASH_URL;
  }

  

  constructor(
    children?: Array<LibraryObj>,
    options?: LibraryObjConstructorOptions,
  ) {
    if (!options) {
      options = {};
    }
    options.type = "folder";
    options.splashUrl = FOLDER_SPLASH_URL;

    super(children, options);
  }
}

export { Folder };
