import { useEffect, useState } from "react";
import type { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import { type LibraryObj } from "../models/libraryObj";
import LibraryObject from "./LibraryObject";
import type { Library } from "../models/library";
import { Folder } from "../models/folder";

//displays the items in the effective path of the library
export function Shelf({ library }: { library: Library }) {
  const effectivePath = useSelector(
    (state: RootState) => state.library.effectivePath,
  );

  const [shelfItems, setShelfItems] = useState<Array<LibraryObj>>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadShelf() {
      const parent = library.getSpecificFromID(effectivePath);

      if (!parent) {
        throw new Error("opened path does not exist");
      }
      if (!(parent instanceof Folder)) {
        throw new Error("effective path is not a parent object");
      }

      setFetching(true);
      await parent.populateChildrenArr();

      const children = parent.children.filter((v) => v.getID() !== 0);
      await Promise.all(
        children.map((v) =>
          v.instantiateSelfFromID().catch((e) => {
            console.error(e);
          }),
        ),
      );
      //TODO add go to parent directory
      setShelfItems([...children.filter((v) => v.getID() != effectivePath)]);

      setFetching(false);
    }

    loadShelf().catch((e) => {
      console.error(e);
      setFetching(false);
    });

    return () => {
      cancelled = true;
    };
  }, [effectivePath]);

  return (
    <div className="w-full h-full p-3 flex flex-row">
      {!fetching &&
        shelfItems.map((v) => {
          return (
            <div className=" w-25 m-2 " key={v.getID()} id={String(v.getID())}>
              <LibraryObject libraryObj={v} />
            </div>
          );
        })}
    </div>
  );
}
