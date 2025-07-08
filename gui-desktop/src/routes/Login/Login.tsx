import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"
import ButtonBody from "./Components/ButtonBody"
import VerifyIdentity from "./Components/VerifyIdentity"
import GenericBar from "../SignUp/components/GenericBar"

export default function Login() {
  const isCollapsed = useSelector((state: RootState) => state.navbar.isCollapsed)
  return (
    <div className="w-full h-full flex flex-col px-3">

      <div className={`w-full text-center text-indigo-ogg-0 text-4xl font-roboto_slab ease-in-out transition-opacity duration-100 ${!isCollapsed && "opacity-0"}`}>
        LOGIN
      </div>
      <div className="w-full flex flex-col items-center mt-[100px]">
        <ButtonBody />
      </div>
      <div className="md:w-2/5 w-1/2 ml-auto flex flex-col items-center mt-[100px] ">
        <VerifyIdentity />
        <div className="w-full h-[119px] px-4 py-2">
          <GenericBar color="bg-blue-ogg-2" override="rounded-2xl border border-white/50 text-2xl font-roboto_slab
          text-white/70 cursor-pointer ">
            Continue
          </GenericBar>
        </div>
      </div>


    </div>
  )
}
