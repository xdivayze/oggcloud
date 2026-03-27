import type { ReactNode, RefObject } from "react";
import type { Library } from "../../models/library";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import DescriptorPair from "./DescriptorPair";

export default function UploadInterface({
  libraryRef,
}: {
  libraryRef: RefObject<Library | null>;
}) {
  const effectiveTree = useSelector(
    (state: RootState) => state.library.effectivePathTree,
  );

  const pathComponent = () => {
    const treeObjects =
      libraryRef.current?.familyTreeToObjectArray(effectiveTree);
    if (!treeObjects) {
      throw new Error("path is null"); //TODO recover by asking for path
    }
    return treeObjects
      .filter((v) => v.getID() > 0)
      .map((v) => {
        return <div>{`/${v.name}`} </div>;
      });
  };

  const descriptors: { label: string; component: ReactNode }[] = [
    {
      label: "Path:",
      component: <>{pathComponent()}</>,
    },
  ];

  return (
    <div className="w-full h-full bg-blue-ogg-0 border-solid border-indigo-ogg-0 rounded-2xl shadow-lg shadow-black">
      <div className="flex flex-col font-roboto_slab text-md w-full h-full bg-amber-50 rounded-md border-solid border-indigo-ogg-0 ">
        {descriptors.map((v) => (
          <div className="w-full h-5 flex flex-row p-2 ">
            <DescriptorPair {...v} />
          </div>
        ))}
      </div>
    </div>
  );
}
