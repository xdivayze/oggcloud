import { folderFetchChildren } from "../services/folderFetchChildren";
import { libraryObjectFactory } from "../services/libraryObjectFactory";
import {
  LibraryObj,
  LibraryObjParent,
  type LibraryObjConstructorOptions,
} from "./libraryObj";

export const LIBRARY_SPLASH_URL = "/libraryObjectFolderSplash.svg";

class Folder extends LibraryObjParent {
  open(): void {
    //TODO
    throw new Error("Method not implemented.");
  }

  async populateChildrenArr(): Promise<void> {
    const children = await folderFetchChildren(this.getID());
    let childrenObjArr: Array<LibraryObj> = [];
    children.forEach((v) => {
      childrenObjArr.push(libraryObjectFactory(v));
    });
  }

  constructor(
    children?: Array<LibraryObj>,
    options?: LibraryObjConstructorOptions,
  ) {
    if (!options) {
      options = {};
    }
    options.type = "folder";
    options.splashUrl = LIBRARY_SPLASH_URL;

    super(children, options);
  }
}

export { Folder };
