import axios from "axios";
import { fetchSelfEndpoint } from "../../../api/library";
import type { LibraryObjConstructorOptions, LibraryObjectType } from "../models/libraryObj";

export interface LibraryObjectDescriptor extends LibraryObjConstructorOptions {
  parentID: number;
  id: number;
  splashUrl: string;
  type: LibraryObjectType;
  name: string;
  altText: string;
  realSizeKB: number;
}

export function fetchSelfFromID(id: number) {
  return axios
    .get<LibraryObjectDescriptor>(fetchSelfEndpoint, {
      params: {
        id,
      },
    })
    .then((v) => {
      if (v.status !== 200) {
        throw new Error(
          `Requested returned non-ok code ${v.status} : ${v.statusText}`,
        );
      }
      return v.data;
    });
}
