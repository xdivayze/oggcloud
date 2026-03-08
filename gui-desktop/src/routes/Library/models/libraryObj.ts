type LibraryObjectType = "picture" | "video" | "raw" | "folder" | "na";

interface LibraryObjConstructorOptions {
  altText?: string;
  type?: LibraryObjectType;
  id?: number;
  splashUrl?: string;
  realSizeKB?: number;
}

abstract class LibraryObj {
  altText: string;
  type: LibraryObjectType;
  readonly id: number;
  splashUrl: string;
  realSizeKB: number;
  children: Array<LibraryObj>;

  //this setter function ignores unitialized and root sets
  setChildren(children: Array<LibraryObj>) {
    this.children = children.filter((v) => v.id > 0);
  }

  constructor(options?: LibraryObjConstructorOptions) {
    options = options ? options : {};
    const {
      altText = "n/A",
      type = "na",
      id = -1,
      splashUrl = "/libraryObjectSplashFallback.svg",
      realSizeKB = 0,
    } = options;

    this.altText = altText;
    this.type = type;
    this.id = id;
    this.splashUrl = splashUrl;
    this.realSizeKB = realSizeKB;
    this.children = [];
  }
}

export interface LibraryObjOpener {
  open(): void;
}

abstract class LibraryObjOpenable
  extends LibraryObj
  implements LibraryObjOpener
{
  open(): void {
    throw new Error("Abstract class called, open() method implemented in JSX suitable functions");
  }
  constructor(options?: LibraryObjConstructorOptions) {
    super(options);
  }
}

abstract class LibraryObjParent extends LibraryObjOpenable {
  getSpecificFromID(id: number): undefined | LibraryObj {
    //return the object with the specific id, 0 is reserved for self
    if ((id = 0)) return this;
    return this.children.find((v) => (v.id == id));
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
