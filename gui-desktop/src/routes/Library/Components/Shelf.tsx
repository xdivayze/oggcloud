import { useEffect, useState } from "react";
import type { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import type { LibraryObj } from "../models/libraryObj";
import LibraryObject from "./LibraryObject";

//displays the items in the effective path of the library
export function Shelf() {
  const effectivePath = useSelector(
    (state: RootState) => state.library.effectivePath,
  );
  const library = useSelector((state: RootState) => state.library.library);
  const [shelfItems, setShelfItems] = useState<Array<LibraryObj>>([]);

  useEffect(() => {
    const parent = library.getSpecificFromID(effectivePath);
    if (!parent) {
      throw new Error("opened path does not exist");
    }
    setShelfItems(parent.children);
  }, [effectivePath]);

  return (
    <div className="w-full h-full p-3">
      {shelfItems.map((v) => {
        return (
          <div id={String(v.id)}>
            <LibraryObject libraryObj={v} />
          </div>
        );
      })}
    </div>
  );
}
