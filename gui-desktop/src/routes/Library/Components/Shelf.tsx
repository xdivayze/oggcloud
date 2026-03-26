import React, { useEffect, useState } from "react";
import type { RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { type LibraryObj } from "../models/libraryObj";
import LibraryObject from "./LibraryObject";
import type { Library } from "../models/library";
import { Folder } from "../models/folder";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setEffectivePath } from "../librarySlice";
import { LibraryNavbarObj } from "../Library";
import { fetchFamilyTree } from "../services/fetchFamilyTree";

//displays the items in the effective path of the library
export function Shelf({
  libraryRef,
}: {
  libraryRef: React.RefObject<Library | null>;
}) {
  const effectivePath = useSelector(
    (state: RootState) => state.library.effectivePath,
  );

  const [shelfItems, setShelfItems] = useState<Array<LibraryObj>>([]);
  const [fetching, setFetching] = useState(false);

  const [searchParams] = useSearchParams();
  let pathParam = Number(searchParams.get("path"));
  pathParam = pathParam === null ? 0 : pathParam;
  const path = Number.isNaN(pathParam) ? 0 : pathParam;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setEffectivePath(path));
  }, [dispatch, path]);

  useEffect(() => {
    const library = libraryRef.current;
    let cancelled = false;

    async function loadShelf() {
      if (!library) throw new Error("library null");
      const tree = await fetchFamilyTree(path);
      if (!tree) {
        throw new Error("opened path does not exist");
      }

      let parent = library.getSpecificFromFamilyTree(tree);
      if (!parent) {
        await library.insertFamilyTreeAndInstantiate(tree);
        parent = library.getSpecificFromFamilyTree(tree);
      }
      if (!(parent instanceof Folder)) {
        throw new Error("effective path is not a parent object");
      }

      setFetching(true);
      await parent.populateChildrenArr();
      if (cancelled) throw new Error("cancelled", { cause: "cancel" });

      const children = parent.children.filter((v) => v.getID() !== 0);
      await Promise.all(children.map((v) => v.instantiateSelfFromID()));
      //TODO add go to parent directory
      setShelfItems([...children.filter((v) => v.getID() != path)]);

      setFetching(false);
    }

    loadShelf().catch((e: Error) => {
      if (e.cause !== "cancel") {
        console.error(e);
        navigate(LibraryNavbarObj.navigateTo); //current fallback to root path if the file tree hasn't reached the target
        return;
      }
      setFetching(false);
    });

    return () => {
      cancelled = true;
    };
  }, [path]);

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
