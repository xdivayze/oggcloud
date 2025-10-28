import { useDispatch } from "react-redux";
import {
  EMailSpanTestID,
  PasswdSpanTestID,
} from "../../Login/Components/ButtonBody";
import GenericBar, { DefaultContenteditableSpan } from "./GenericBar";
import { setEMail, setPassword, setPasswordRepeat } from "../signUpSlice";

export const passwordRepeatTestID = "editable-password-repeat-span";

export default function InputBase() {
  return (
    <div
      className="w-full h-full flex flex-row justify-between font-roboto_slab 
      text-2xl text-yellow-ogg-0 text-center "
    >
      <div className="md:w-2/5 sm:w-1/2 h-full p-2">
        <EmailCol />
      </div>
      <div className="md:w-2/5 sm:w-1/2 h-full p-2">
        <PasswordCol />
      </div>
    </div>
  );
}

function EmailCol() {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full  h-[119px] p-2">
        <GenericBar color="bg-blue-ogg-1">
          <DefaultContenteditableSpan
            testID={EMailSpanTestID}
            defaultText="Enter E-Mail"
            onInput={(t) => dispatch(setEMail(t))}
          />
        </GenericBar>
      </div>
      <div className="w-full h-[119px] p-2">
        <GenericBar color="bg-blue-ogg-1">
          <span>Verify E-Mail</span> {/* TODO implement with a button control that spawns another generic bar used to input the verification code */}
        </GenericBar>
      </div>
    </div>
  );
}

function PasswordCol() {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-[119px] p-2">
        <GenericBar color="bg-blue-ogg-1">
          <DefaultContenteditableSpan
            testID={PasswdSpanTestID}
            defaultText="Enter password."
            onInput={(t) => dispatch(setPassword(t))}
          />
        </GenericBar>
      </div>
      <div className="w-full  h-[119px] p-2">
        <GenericBar color="bg-blue-ogg-1">
          <DefaultContenteditableSpan
            testID={passwordRepeatTestID}
            defaultText="Re-enter your password."
            onInput={(t) => dispatch(setPasswordRepeat(t))}
          />
        </GenericBar>
      </div>
    </div>
  );
}
