import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="bg-green-ogg-0 h-screen w-screen flex flex-col overflow-hidden 
      font-roboto_slab items-center p-5" >
      <div className="w-full h-[7%] flex flex-row ml-[4rem] mt-2 ">
        <Navbar />
      </div>
      <div className="w-full h-full px-[4rem]">
        
        <Outlet />
      </div>
    </div>
  )
}
