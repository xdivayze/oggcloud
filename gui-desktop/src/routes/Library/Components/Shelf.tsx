import { useEffect, useState } from "react";
import type { RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { type LibraryObj } from "../models/libraryObj";
import LibraryObject from "./LibraryObject";
import type { Library } from "../models/library";
import { Folder } from "../models/folder";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setEffectivePath } from "../librarySlice";
import { LibraryNavbarObj } from "../Library";

//displays the items in the effective path of the library
export function Shelf({ library }: { library: Library }) {
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
    let cancelled = false;

    async function loadShelf() {
      const parent = library.getSpecificFromID(effectivePath); //TODO add fallback and fetch from server
      if (!parent) {
        console.error("opened path does not exist");
        navigate(LibraryNavbarObj.navigateTo);
        return;
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
