import { LibraryNavbarObj } from "../Library";
import { Folder } from "../models/folder";
import { LibraryObjOpenable, type LibraryObj } from "../models/libraryObj";
import { useNavigate } from "react-router-dom";

export default function LibraryObject({
  libraryObj,
}: {
  libraryObj: LibraryObj;
}) {
  const navigate = useNavigate();

  const fileOpenFunc = (data: Record<string, unknown>) => {
    if (data.id && typeof data.id === "number") {
      const search = new URLSearchParams();
      search.set("path", data.id.toString());

      navigate(`${LibraryNavbarObj.navigateTo}?${search.toString()}`);
    }
  };
  const libraryObjOpenFunc = () => {
    if (!(libraryObj instanceof LibraryObjOpenable)) return; //TODO add download function for non openables
    if (libraryObj instanceof Folder) {
      libraryObj.open(fileOpenFunc);
      return;
    }

    //TODO add other type methods
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
