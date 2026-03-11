import axios from "axios";
import { FETCH_CHILDREN_ENDPOINT } from "../../../api/library";
import type { LibraryObjectType } from "../models/libraryObj";

export interface FolderFetchResponseBody {
  children: Array<{ id: number; type: LibraryObjectType }>;
}

export function folderFetchChildren(id: number) {
  const response = axios.get<FolderFetchResponseBody>(FETCH_CHILDREN_ENDPOINT, {
    params: {
      id,
    },
  });

  return response.then((v) => {
    if (v.status !== 200)
      throw new Error(
        `Requested returned non-ok code ${v.status} : ${v.statusText}`,
      );

    return v.data.children;
  });
}
