import { useSelector } from "react-redux";
import InputBase from "./components/InputBase";
import { type RootState } from "../../app/store";
import GenericBar from "./components/GenericBar";

export default function SignUp() {

  const isCollapsed = useSelector((state: RootState) => state.navbar.isCollapsed)

  return (<div className="w-full h-full flex flex-col px-3">
    <div className={`w-full text-center text-indigo-ogg-0 text-4xl font-roboto_slab ease-in-out transition-opacity duration-100 ${!isCollapsed && "opacity-0"}`}>
      SIGN UP

    </div>

    <div className="w-full h-1/3 flex flex-col items-center mt-[100px]">
      <InputBase />
    </div>
    <div className="w-full h-1/3 flex flex-row items-center justify-end py-4  ">
      <div className="w-1/2 md:w-2/5 h-[119px] px-4 py-2 ">
        <GenericBar color="bg-blue-ogg-2" override="rounded-2xl border border-white/50 text-2xl font-roboto_slab
          text-white/70 cursor-pointer "> Continue</GenericBar>
      </div>
    </div>
  </div>)
}
