import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useEffect, useRef } from "react";
import { centerNavbarTitle } from "../../Layout/navbarSlice";
import { Plus } from "lucide-react";
import { Library } from "./models/library";
import { Shelf } from "./Components/Shelf";
import DirectoryNavigator from "./Components/DirectoryNavigator";

export const LibraryNavbarObj = {
  placeholder: "Library",
  navigateTo: "/secure/library",
};

export function LibraryComponent() { //TODO add navigation bar that shows the current path tree
  //page where files shared by and to the user can be viewed
  const dispatch = useDispatch();
  
  const libraryRef = useRef<Library | null>(null);
  if (libraryRef.current === null) {
    libraryRef.current = new Library(); 
    libraryRef.current.populateChildrenArr();
  }

  useEffect(()=>{
    dispatch(centerNavbarTitle(LibraryNavbarObj));
  }, [])

  const library = libraryRef.current;

  const isCollapsed = useSelector(
    (state: RootState) => state.navbar.isCollapsed,
  );
  
  return (
    <div
      className={`w-full h-full pb-2 px-2 duration-100 transform-all ease-linear ${isCollapsed ? "pt-3" : "pt-7"} `}
    >
      {/* <div className="w-full h-7 px-2"> <DirectoryNavigator library={library} /> </div> */}
      <div className="w-full h-full rounded-3xl relative bg-blue-ogg-1 p-5 ">
        <div className="w-full max-h-full  overflow-y-auto overflow-x-hidden ">
          <Shelf libraryRef={libraryRef} />  {/*//TODO PASS LIBRARY REF */}
          {/* library data inserted here to keep the + sign floating fixed */}
        </div>

        <div
          className="
          z-10 absolute bottom-4 right-4 h-[60px] w-[60px]"
        >
          <Plus
            color="white"
            className=" cursor-pointer h-full w-full stroke-1 bg-blue-ogg-1 shadow-md shadow-black/50 border-md border
           border-white/30 rounded-full "
          />
        </div>
      </div>
    </div>
  );
}
