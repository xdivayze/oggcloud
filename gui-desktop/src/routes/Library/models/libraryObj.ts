import { RAW_SPLASH_URL } from "./raw";

type LibraryObjectType = "picture" | "video" | "raw" | "folder" | "na";

interface LibraryObjConstructorOptions {
  altText?: string;
  type?: LibraryObjectType;
  id?: number;
  splashUrl?: string;
  realSizeKB?: number;
  parentID?: number;
  name?: string;
}

abstract class LibraryObj {
  readonly parentID: number;
  readonly id: number;
  readonly splashUrl: string;
  readonly type: LibraryObjectType;
  name: string;
  altText: string;
  realSizeKB: number;
  children: Array<LibraryObj>;

  //this setter function ignores the root folder if it is passed
  setChildren(children: Array<LibraryObj>) {
    this.children = children.filter((v) => v.id != 0);
  }

  constructor(options?: LibraryObjConstructorOptions) {
    options = options ? options : {};
    const {
      name = "n/A",
      altText = "n/A",
      type = "na",
      id = -1,
      splashUrl = RAW_SPLASH_URL,
      realSizeKB = 0,
      parentID = -1,
    } = options;

    this.altText = altText;
    this.type = type;
    this.id = id;
    this.splashUrl = splashUrl;
    this.realSizeKB = realSizeKB;
    this.children = [];
    this.parentID = parentID;
    this.name = name;
  }
}

export interface LibraryObjOpener {
  open(): void;
}

abstract class LibraryObjOpenable
  extends LibraryObj
  implements LibraryObjOpener
{
  abstract open(): void;
  constructor(options?: LibraryObjConstructorOptions) {
    super(options);
  }
}

//parent objects must be able to display their children when requested
abstract class LibraryObjParent extends LibraryObjOpenable {
  getSpecificFromID(id: number): undefined | LibraryObj {
    //return the object with the specific id, 0 is reserved for self
    if ((id = 0)) return this;
    return this.children.find((v) => v.id == id);
  }

  deleteSpecific(obj: LibraryObj): void {
    this.children = this.children.filter((v) => v.id != obj.id);
  }

  constructor(options?: LibraryObjConstructorOptions) {
    super(options);
  }
}

export {
  LibraryObjOpenable,
  LibraryObj,
  type LibraryObjConstructorOptions,
  type LibraryObjectType,
  LibraryObjParent,
};
