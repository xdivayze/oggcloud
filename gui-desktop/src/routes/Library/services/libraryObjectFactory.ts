import { Folder } from "../models/folder";
import type {
  LibraryObj,
  LibraryObjConstructorOptions,
  LibraryObjectType,
} from "../models/libraryObj";
import { Picture } from "../models/picture";
import { Raw } from "../models/raw";
import { Video } from "../models/video";

export interface LibraryObjectFactoryOptions extends LibraryObjConstructorOptions {
  parentID?: number;
  id: number;
  splashUrl?: string;
  type: LibraryObjectType;
  name?: string;
  altText?: string;
  realSizeKB?: number;
}

export function libraryObjectFactory(descriptor: LibraryObjectFactoryOptions) {
  let ret: LibraryObj;

  switch (descriptor.type) {
    case "folder":
      ret = new Folder([], descriptor);
      break;
    case "picture":
      ret = new Picture(descriptor);
      break;

    case "raw":
      ret = new Raw(descriptor);
      break;
    case "video":
      ret = new Video(descriptor);
      break;

    default:
      throw new Error(
        `Unitialized library object found, rejecting id: ${descriptor.id}`,
      );
  }
  return ret;
}
