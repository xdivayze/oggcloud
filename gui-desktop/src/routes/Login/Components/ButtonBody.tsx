import { useDispatch } from "react-redux";
import GenericBar, { DefaultContenteditableSpan } from "../../SignUp/components/GenericBar";
import { setEMail, setPassword } from "../loginSlice";

export default function ButtonBody() {

  const dispatch = useDispatch()
  return (
    <div className="w-full h-full flex flex-row justify-between font-roboto_slab 
      text-2xl text-yellow-ogg-0 text-center ">
      <div className="md:w-2/5 w-1/2 h-full p-2">
        <div className="w-full h-[119px] p-2">
          <GenericBar color="bg-blue-ogg-1">
            <DefaultContenteditableSpan defaultText="Enter E-Mail" onInput={(t) => dispatch(setEMail(t))} />
          </GenericBar>

        </div>
      </div>
      <div className="md:w-2/5 w-1/2 h-full p-2">
        <div className="w-full h-[119px] p-2">
          <GenericBar color="bg-blue-ogg-1">

            <DefaultContenteditableSpan defaultText="Enter Password"
              onInput={(t) => dispatch(setPassword(t))} />
          </GenericBar>

        </div>
      </div>

    </div>)
}

