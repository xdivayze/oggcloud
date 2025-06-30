import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { setIsCollapsed } from "./navbarSlice"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const items = useSelector((state: RootState) => state.navbar.items)
  const isCollapsed = useSelector((state: RootState) => state.navbar.isCollapsed)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const colors = ["bg-blue-ogg-light-0", "bg-blue-ogg-0", "bg-green-ogg-1", "bg-brown-ogg-0", "bg-blue-ogg-1"]

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div onMouseEnter={() => {
        dispatch(setIsCollapsed(false))
      }} onMouseLeave={() => {
        dispatch(setIsCollapsed(true))
      }
      } className={` cursor-pointer w-full lg:text-2xl md:text-lg  font-roboto_slab  
      text-yellow-ogg-0 text-center transition-all duration-300 ease-in-out flex flex-row 
      ${!isCollapsed ? "h-full scale-100" : "h-2 scale-95"}`}>
        <div className="flex relative w-full h-full">

          {items.map((v, i) => {
            return (
              <div onClick={() => {
                navigate(v.navigateTo)
              }} className={`w-1/5 justify-center items-center flex h-full rounded-xl z-[${10 * i}] ${i !== 0 ? '-ml-4' : ''}  ${colors[i]}`} key={i}>
                <span className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>

                  {v.placeholder}
                </span>
              </div>

            )
          })}
        </div>
      </div>
    </div>)
}


