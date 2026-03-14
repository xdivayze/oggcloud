import { useDispatch } from "react-redux";
import { Folder } from "../models/folder";
import { LibraryObjOpenable, type LibraryObj } from "../models/libraryObj";
import { setEffectivePath } from "../librarySlice";

export default function LibraryObject({
  libraryObj,
}: {
  libraryObj: LibraryObj;
}) {
  const dispatch = useDispatch();
  const fileOpenFunc = (data: Record<string, unknown>) => {
    if (data.id && typeof data.id === "number") {
      dispatch(setEffectivePath(data.id));
    }
  };
  const libraryObjOpenFunc = () => {
    

    if (libraryObj instanceof LibraryObjOpenable) {
      if (libraryObj instanceof Folder) {

        libraryObj.open(fileOpenFunc);
        return;
      }

      //TODO add other type methods
    }
  };
  return (
    <div className="cursor-pointer w-full h-full opacity-80 bg-gray-300 rounded-2xl p-3 border-solid border-1 border-indigo-ogg-0 shadow-lg">
      <img
        src={libraryObj.getSplashUrl()}
        alt={libraryObj.altText}
        onClick={libraryObjOpenFunc}
      />
      <div className="font-roboto_slab  text-black text-center text-[10px]">
        {libraryObj.name}
      </div>
    </div>
  );
}
