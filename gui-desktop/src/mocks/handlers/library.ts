import { http, HttpResponse } from "msw";
import {
  FETCH_CHILDREN_ENDPOINT,
  FETCH_FAMILY_TREE_ENDPOINT,
  FETCH_SELF_ENDPOINT,
} from "../../api/library";
import type { FolderFetchResponseBody } from "../../routes/Library/services/folderFetchChildren";
import type { LibraryObjectDescriptor } from "../../routes/Library/services/fetchSelfFromID";
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
  {
    id: 6,
    type: "raw",
    name: "test object",
    parentID: 4,
    realSizeKB: 4096,
    splashUrl: "",
    altText: "alt",
  },
  {
    id: 7,
    type: "folder",
    name: "test folder",
    parentID: 4,
    realSizeKB: 2048,
    altText: "alt",
    splashUrl: "",
  },
  {
    id: 8,
    type: "raw",
    name: "test object",
    parentID: 7,
    realSizeKB: 4096,
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
  http.get(FETCH_FAMILY_TREE_ENDPOINT, ({ request }) => {
    const url = new URL(request.url);
    const idStr = url.searchParams.get("id");

    if (!idStr) {
      return HttpResponse.json(
        {},
        { statusText: "id search parameter missing", status: 400 },
      );
    }

    let tree = [];
    let id = Number(idStr);
    while (id != 0) {
      const found = data.find((v) => v.id === id);
      if (!found) {
        return HttpResponse.json(
          {},
          { statusText: "one of the parents not found", status: 404 },
        );
      }
      tree.push(found.id);
      id = found.parentID;
    }
    tree.push(0);
    tree.reverse();

    return HttpResponse.json(
      {
        tree,
      },
      { status: 200 },
    );
  }),
];
