import { fetchSelfFromID } from "../services/fetchSelfFromID";
import { RAW_SPLASH_URL } from "./constants";

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
  private parentID: number;
  private id: number;
  protected splashUrl: string;
  readonly type: LibraryObjectType;
  name: string;
  altText: string;
  realSizeKB: number;

  setSplashUrl(splashUrl: string) {
    this.splashUrl = splashUrl;
  }

  getSplashUrl() {
    return this.splashUrl;
  }

  getParentID(): number {
    return this.parentID;
  }

  setID(id: number) {
    this.id = this.id === -1 ? id : this.id;
  }

  getID() {
    return this.id;
  }

  async instantiateSelfFromID(): Promise<void> {
    if (this.id === -1)
      throw new Error(
        "unitialized id objects can't be instantiated,exiting...",
      );

    const self = await fetchSelfFromID(this.id);
    if (self.id !== this.id)
      throw new Error(
        "id mismatch in fetched self and current object, exiting...",
      );
    if (self.type !== this.type)
      throw new Error(
        "type mismatch in fetched self and current object, exiting...",
      );
    if (self.parentID !== this.parentID)
      throw new Error(
        "parent mismatch in fetched self and current object, exiting...",
      );

    this.altText = self.altText;
    this.name = self.name;
    this.realSizeKB = self.realSizeKB;
    this.setSplashUrl(this.splashUrl);
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
    this.parentID = parentID;
    this.name = name;
  }
}

export interface LibraryObjOpener {
  open(callback: (data: Record<string, unknown>) => void): void;
}

abstract class LibraryObjOpenable
  extends LibraryObj
  implements LibraryObjOpener
{
  abstract open(callback: (data: Record<string, unknown>) => void): void;
  constructor(options?: LibraryObjConstructorOptions) {
    super(options);
  }
}

//parent objects must be able to display their children when requested
abstract class LibraryObjParent extends LibraryObjOpenable {
  children: Array<LibraryObj>;

  //this setter function ignores the root folder if it is passed
  setChildren(children: Array<LibraryObj>) {
    this.children = children.filter((v) => v.getID() != 0);
    this.children.push(this);
  }

  //adds child if it isn't already a child, returns the number of successful insertions
  addChildrenUnique(children: Array<LibraryObj>) {
    let count = 0;
    this.children.push(
      ...children.filter((v) => {
        if (v.getID() == 0) return false;
        if (this.getSpecificFromID(v.getID())) return false; //push if child doesn't exist
        count ++
        return true;
      }),
    );
    return count;
  }
  getSpecificFromID(id: number): undefined | LibraryObj {
    //return the object with the specific id, 0 is reserved for self
    if (id === 0) return this;
    return this.children.find((v) => v.getID() == id);
  }

  deleteSpecific(obj: LibraryObj): void {
    this.children = this.children.filter((v) => v.getID() != obj.getID());
  }

  constructor(
    children?: Array<LibraryObj>,
    options?: LibraryObjConstructorOptions,
  ) {
    super(options);
    this.children = [];
    this.setChildren(children ? children : []);
  }
}

export {
  LibraryObjOpenable,
  LibraryObj,
  type LibraryObjConstructorOptions,
  type LibraryObjectType,
  LibraryObjParent,
};
