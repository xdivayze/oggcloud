import InputBase from "./components/InputBase";

export default function SignUp() {
  return (<div className="w-full h-full flex flex-col px-3">
    <div className="w-full text-center text-indigo-ogg-0 text-4xl font-roboto_slab">
      REGISTER
    </div>

    <div className="w-full h-1/3 flex flex-col items-center mt-[100px]">

      <InputBase />
    </div>
  </div>)
}
