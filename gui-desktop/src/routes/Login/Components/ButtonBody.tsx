import GenericBar from "../../SignUp/components/GenericBar";

export default function ButtonBody() {
  return (
    <div className="w-full h-full flex flex-row justify-between font-roboto_slab 
      text-2xl text-yellow-ogg-0 text-center ">
      <div className="md:w-2/5 w-1/2 h-full p-2">
        <div className="w-full h-[119px] p-2">
          <GenericBar color="bg-blue-ogg-1">
            Enter E-Mail
          </GenericBar>

        </div>
      </div>
      <div className="md:w-2/5 w-1/2 h-full p-2">
        <div className="w-full h-[119px] p-2">
          <GenericBar color="bg-blue-ogg-1">
            Enter Password
          </GenericBar>

        </div>
      </div>

    </div>)
}

