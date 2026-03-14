import { http, HttpResponse } from "msw";
import {
  FETCH_CHILDREN_ENDPOINT,
  FETCH_SELF_ENDPOINT,
} from "../../api/library";
import type { FolderFetchResponseBody } from "../../routes/Library/services/folderFetchChildren";
import type { LibraryObjectDescriptor } from "../../routes/Library/services/fetchSelfFromID";
import type {
  LibraryObj,
  LibraryObjectType,
} from "../../routes/Library/models/libraryObj";
const data: Array<LibraryObjectDescriptor> = [
  {
    id: 1,
    type: "raw",
    name: "test object",
    parentID: 0,
    realSizeKB: 2048,
    altText: "alt",
    splashUrl: "",
  },
  {
    id: 2,
    type: "raw",
    name: "test object",
    parentID: 0,
    realSizeKB: 2048,
    altText: "alt",
    splashUrl: "",
  },
  {
    id: 3,
    type: "folder",
    name: "test folder",
    parentID: 0,
    realSizeKB: 2048,
    altText: "alt",
    splashUrl: "",
  },
  {
    id: 4,
    type: "folder",
    name: "test folder",
    parentID: 3,
    realSizeKB: 2048,
    altText: "alt",
    splashUrl: "",
  },
  {
    id: 5,
    type: "picture",
    name: "test picture",
    parentID: 3,
    realSizeKB: 2048,
    splashUrl: "",

    altText: "alt",
  },
];

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
      children: data.filter((v) => v.parentID == id),
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
    const found = data.find((v) => v.id == id);
    if (!found) return HttpResponse.json({}, { status: 404 });

    return HttpResponse.json(found, { status: 200 });
  }),
];
