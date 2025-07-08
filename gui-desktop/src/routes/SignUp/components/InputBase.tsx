import GenericBar from "./GenericBar"

export default function InputBase() {
  return (
    <div className="w-full h-full flex flex-row justify-between font-roboto_slab 
      text-2xl text-yellow-ogg-0 text-center ">
      <div className="md:w-2/5 sm:w-1/2 h-full p-2">

        <EmailCol />
      </div>
      <div className="md:w-2/5 sm:w-1/2 h-full p-2">
        <PasswordCol />
      </div>

    </div>
  )
}

function EmailCol() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full  h-[119px] p-2">
        <GenericBar color="bg-blue-ogg-1" ><span>
          Enter E-Mail
        </span></GenericBar>
      </div>
      <div className="w-full h-[119px] p-2">
        <GenericBar color="bg-blue-ogg-1" ><span>
          Verify E-Mail
        </span></GenericBar>
      </div>
    </div>
  )
}


function PasswordCol() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-[119px] p-2">
        <GenericBar color="bg-blue-ogg-1">
          <span>Password</span>
        </GenericBar>
      </div>
      <div className="w-full  h-[119px] p-2">
        <GenericBar color="bg-blue-ogg-1" >
          <span>Reenter Password</span>
        </GenericBar>
      </div>
    </div>
  )
}
