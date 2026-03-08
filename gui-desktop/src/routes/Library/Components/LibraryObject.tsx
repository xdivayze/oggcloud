import { LibraryObjOpenable, type LibraryObj } from "../models/libraryObj";

export default function LibraryObject({
  libraryObj,
}: {
  libraryObj: LibraryObj;
}) {
  return (
    <div className="w-full h-full">
      <img
        src={libraryObj.splashUrl}
        alt={libraryObj.altText}
        onClick={() => {
          libraryObj instanceof LibraryObjOpenable
            ? libraryObj.open()
            : () => {};
        }}
      />
    </div>
  );
}
