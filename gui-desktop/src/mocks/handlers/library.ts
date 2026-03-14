import { http, HttpResponse } from "msw";
import {
  FETCH_CHILDREN_ENDPOINT,
  FETCH_SELF_ENDPOINT,
} from "../../api/library";
import type { FolderFetchResponseBody } from "../../routes/Library/services/folderFetchChildren";
import type { LibraryObjectDescriptor } from "../../routes/Library/services/fetchSelfFromID";
import type { LibraryObj, LibraryObjectType } from "../../routes/Library/models/libraryObj";
export const libraryHandlers = [
  //mocked handler for children fetching endpoint
  http.get(FETCH_CHILDREN_ENDPOINT, ({ request }) => {
    const url = new URL(request.url);
    const idStr = url.searchParams.get("id");

    if (!idStr) {
      return HttpResponse.json(
        {},
        { statusText: "id search parameter missing", status: 400 },
      );
    }
    const children1: Array<{id: number; type: LibraryObjectType;}> = [
      {
        id: 1,
        type: "raw",
      },
      {
        id: 2,
        type: "raw",
      },
      {
        id: 3,
        type: "folder",
      },
    ];

    const children2: Array<{id: number; type: LibraryObjectType;}> = [
      { id: 4, type: "folder" },
      { id: 5, type: "picture" },
    ];

    const id = Number(idStr);

    const children: FolderFetchResponseBody = {
      children: id === 0 ? children1 : children2
    };
    return HttpResponse.json(children, { status: 200 });
  }),

  //mocked http handler for the self fetching of a library object
  http.get(FETCH_SELF_ENDPOINT, ({ request }) => {
    const url = new URL(request.url);
    const idStr = url.searchParams.get("id");

    if (!idStr) {
      return HttpResponse.json(
        {},
        { statusText: "id search parameter missing", status: 400 },
      );
    }

    const id = Number(idStr);

    let type: LibraryObjectType = "raw";
    let name = "test object raw";
    if (id === 3) {
      type = "folder";
      name = "test object folder";
    }

    const self: LibraryObjectDescriptor = {
      parentID: 0,
      id,
      splashUrl: "",
      type,
      name: `${name}-${id}` ,
      altText: "alt",
      realSizeKB: 2048,
    };
    return HttpResponse.json(self, { status: 200 });
  }),
];
