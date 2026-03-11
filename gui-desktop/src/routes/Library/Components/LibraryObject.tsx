import { LibraryObjOpenable, type LibraryObj } from "../models/libraryObj";

export default function LibraryObject({
  libraryObj,
}: {
  libraryObj: LibraryObj;
}) {
  return (
    <div className="cursor-pointer w-full h-full opacity-80 bg-gray-300 rounded-2xl p-3 border-solid border-1 border-indigo-ogg-0 shadow-lg">
      <img
        src={libraryObj.getSplashUrl()}
        alt={libraryObj.altText}
        onClick={() => {
          libraryObj instanceof LibraryObjOpenable
            ? libraryObj.open()
            : () => {};
        }}
      />
      <div className="font-roboto_slab  text-black text-center text-[10px]">{libraryObj.name}</div>
    </div>
  );
}
