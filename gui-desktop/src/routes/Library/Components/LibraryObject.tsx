import type { LibraryObjOpenable } from "../models/libraryObj";

export default function LibraryObject({
  libraryObj,
}: {
  libraryObj: LibraryObjOpenable;
}) {
  return (
    <div className="w-full h-full">
      <img
        src={libraryObj.splashUrl}
        alt={libraryObj.altText}
        onClick={() => {
          "open" in libraryObj ? libraryObj.open() : () => {};
        }}
      />
    </div>
  );
}
