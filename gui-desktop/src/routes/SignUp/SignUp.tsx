import { useSelector } from "react-redux";
import InputBase from "./components/InputBase";
import { type RootState } from "../../app/store";
import GenericBar from "./components/GenericBar";
import { LoginSubmitTestID } from "../Login/Login";
import { useState } from "react";
import { sendSignUpRequest } from "./implementation";

export const SignUpErrorMessageTestID = "sign-up-error-message-test-id"
export const SignUpSubmitBtnTestID = "sign-up-submit-btn-test-id"

export default function SignUp() {
  const isCollapsed = useSelector(
    (state: RootState) => state.navbar.isCollapsed
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [signUpPending, setSignUpPending] = useState(false);

  const passwordPlain = useSelector(
    (state: RootState) => state.sign_up.password
  );
  const passwordPlainRepeat = useSelector(
    (state: RootState) => state.sign_up.passwordRepeat
  );
  const eMail = useSelector((state: RootState) => state.sign_up.eMail);
  const verificationCode = useSelector(
    (state: RootState) => state.sign_up.verificationCode
  );

  return (
    <div className="w-full h-full flex flex-col px-3">
      <div
        className={`w-full text-center text-indigo-ogg-0 text-4xl font-roboto_slab ease-in-out transition-opacity duration-100 ${
          !isCollapsed && "opacity-0"
        }`}
      >
        SIGN UP
      </div>

      <div className="w-full h-1/3 flex flex-col items-center mt-[100px]">
        <InputBase />
      </div>

      <div className="w-full h-1/3 flex flex-row items-center justify-end py-4  ">
        <div className="w-1/2 md:w-2/5 h-[119px] px-4 py-2 ">
          <div data-testid={SignUpErrorMessageTestID} className="w-full text-red-500 px-5 py-2">
            {/* display error message when errorMessage is non-nil */}
            {errorMessage && !signUpPending && errorMessage}
          </div>

          <GenericBar
            onClick={async () => {
              setErrorMessage("");
              setSignUpPending(true);

              if (passwordPlainRepeat.trimStart().trimEnd() != passwordPlain.trimStart().trimEnd()) {
                //return if non-matching passwords
                setErrorMessage("passwords don't match.");
                setSignUpPending(false);
                return;
              }

              sendSignUpRequest(eMail, passwordPlain, verificationCode)
                .then((response) => {
                  if (response.status != 201) {
                    //error if status is not 201
                    if (response.statusText) {
                      //if a status text is provided
                      setErrorMessage(response.statusText);
                    } else {
                      setErrorMessage(
                        "An error occured. Status: " + response.status
                      );
                    }
                  }
                })
                .catch((e) => {
                  //on client error
                  setErrorMessage(
                    "Client error occured while processing your request."
                  );
                  console.error(e);
                })
                .finally(() => setSignUpPending(false));
            }}
            color="bg-blue-ogg-2"
            testID={SignUpSubmitBtnTestID}
            override="rounded-2xl border border-white/50 text-2xl font-roboto_slab
          text-white/70 cursor-pointer "
          >
            Continue
          </GenericBar>
        </div>
      </div>
    </div>
  );
}
