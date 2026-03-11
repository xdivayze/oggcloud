import { http, HttpResponse } from "msw";
import {
  FETCH_CHILDREN_ENDPOINT,
  FETCH_SELF_ENDPOINT,
} from "../../api/library";
import type { FolderFetchResponseBody } from "../../routes/Library/services/folderFetchChildren";
import type { LibraryObjectDescriptor } from "../../routes/Library/services/fetchSelfFromID";
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

    const id = Number(idStr);

    const children: FolderFetchResponseBody = {
      children: [
        {
          id: id + 1,
          type: "raw",
        },
        {
          id: id + 2,
          type: "raw",
        },
      ],
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

    const self: LibraryObjectDescriptor = {
      parentID: 0,
      id,
      splashUrl: "",
      type: "raw",
      name: "test library object",
      altText: "alt",
      realSizeKB: 2048,
    };
    return HttpResponse.json(self, { status: 200 });
  }),
];
