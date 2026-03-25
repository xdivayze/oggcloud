import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import type { Library } from "../models/library";
import { useEffect, useState } from "react";
import { fetchFamilyTree } from "../services/fetchFamilyTree";
import type { LibraryObj } from "../models/libraryObj";

export default function DirectoryNavigator({ library }: { library: Library }) {
  const effectivePath = useSelector(
    (state: RootState) => state.library.effectivePath,
  );

  const [displayedElements, setDisplayedElements] = useState<LibraryObj[]>([]);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const updateDisplayElements = async () => {
      setFetching(true);
      const familyTree = await fetchFamilyTree(effectivePath);
      if (!familyTree) {
        throw new Error("object with the specified path doesn't exist");
      }
      if (cancelled) {
        throw new Error("cancelled");
      }

      const elems = library.familyTreeToObjectArray(familyTree);

      setDisplayedElements(elems);
      setFetching(false);
    };
    updateDisplayElements().catch((e) => {
      console.error(e);
      setFetching(false);
    });

    return () => {
      cancelled = true;
    };
  }, [effectivePath]);

  return (
    <div className="w-full h-full flex flex-row">
      {!fetching &&
        displayedElements.map((v) => {
          return <div key={v.getID()} className="w-10 h-5">{v.name}</div>;
        })}
    </div>
  );
}
