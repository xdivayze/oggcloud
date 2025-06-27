import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="bg-green-ogg-0 h-screen w-screen flex flex-col overflow-hidden font-roboto_slab" >
      <Outlet />
    </div>
  )
}
