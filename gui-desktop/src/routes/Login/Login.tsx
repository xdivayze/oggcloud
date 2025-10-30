import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import ButtonBody from "./Components/ButtonBody";
import VerifyIdentity from "./Components/VerifyIdentity";
import GenericBar from "../SignUp/components/GenericBar";

import { useEffect, useState } from "react";
import { centerNavbarTitle } from "../../Layout/navbarSlice";
import { sendLoginRequest } from "./implementation";
import { LoginNavbarObj } from "../../Layout/navItems";

export const LoginSubmitTestID = "login-submit-btn";

export function Login() {
  const isCollapsed = useSelector(
    (state: RootState) => state.navbar.isCollapsed
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(centerNavbarTitle(LoginNavbarObj));
  }, []);

  const [loginPending, setLoginPending] = useState(false);
  const [errorOccured, setErrorOccured] = useState("");

  const eMail = useSelector((state: RootState) => state.login.eMail);
  const passwordPlain = useSelector((state: RootState) => state.login.password);
  return (
    <div className="w-full h-full flex flex-col px-3">
      <div
        className={`w-full text-center text-indigo-ogg-0 text-4xl 
font-roboto_slab ease-in-out transition-opacity duration-100 ${
          !isCollapsed && "opacity-0"
        }`}
      >
        LOGIN
      </div>
      <div className="w-full flex flex-col items-center mt-[100px]">
        <ButtonBody />
      </div>
      <div className="md:w-2/5 w-1/2 ml-auto flex flex-col items-center mt-[100px] ">
        <VerifyIdentity />
        {(errorOccured && !loginPending) && (
          <div className="w-full text-red-500 px-5 py-2">
            {" "}
            {/* display error message when errorOccured is non-nil */}
            {errorOccured}
          </div>
        )}
        <div className="w-full h-[119px] px-4 py-2">
          <GenericBar
            testID={LoginSubmitTestID}
            onClick={async () => {
              setErrorOccured("");
              setLoginPending(true);
              const status = await sendLoginRequest(eMail, passwordPlain)
                .then((status) => {
                  setErrorOccured("success.");
                  return status;
                })
                .catch((e) => {
                  setErrorOccured(
                    "Error occured while processing your request."
                  );
                  console.error(e);
                })
                .finally(() => setLoginPending(false));
              if (status !== 200) {
                setErrorOccured("Undesired status code received: " + status);
              }
            }}
            color="bg-blue-ogg-2"
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
