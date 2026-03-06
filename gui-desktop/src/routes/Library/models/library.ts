import type { LibraryObj } from "./libraryObj";

class Library {
  children: Array<LibraryObj>;

  getSpecificFromID(id: number): Error | void {}

  deleteSpecific(obj: LibraryObj): Error | void {
  }

  constructor() {
    this.children = [];
  }
}
