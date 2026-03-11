import { LibraryObjOpenable, type LibraryObj } from "../models/libraryObj";

export default function LibraryObject({
  libraryObj,
}: {
  libraryObj: LibraryObj;
}) {
  return (
    <div className="w-full h-full bg-gray-800 rounded-2xl p-3 border-solid border-1 border-indigo-ogg-0 shadow-lg">
      <img
        src={libraryObj.getSplashUrl()}
        alt={libraryObj.altText}
        onClick={() => {
          libraryObj instanceof LibraryObjOpenable
            ? libraryObj.open()
            : () => {};
        }}
      />
      <div className="font-roboto_slab  text-gray-100 text-center text-[10px]">{libraryObj.name}</div>
    </div>
  );
}
