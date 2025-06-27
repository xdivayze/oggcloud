import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="bg-green-ogg-0 h-screen w-screen flex flex-col overflow-hidden font-roboto_slab items-center p-5" >
      <div className="w-[95%] h-[7%] flex flex-row ml-[4rem] ">
        <Navbar />
      </div>
      <Outlet />
    </div>
  )
}
