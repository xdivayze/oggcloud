import { createSlice } from "@reduxjs/toolkit";

interface SignUpSlice {
  eMail: string;
  password: string;
  passwordRepeat: string;
  verificationCode: string;
}

const initialState: SignUpSlice = {
  eMail: "",
  password: "",
  passwordRepeat: "",
  verificationCode: "",
};

const signUpSlice = createSlice({
  name: "sign_up",
  initialState,
  reducers: {
    setEMail: (state, action) => {
      state.eMail = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setPasswordRepeat: (state, action) => {
      state.passwordRepeat = action.payload;
    },
    setVerificationCode: (state, action) => {
      state.verificationCode = action.payload;
    },
  },
});

const signUpReducer = signUpSlice.reducer;
export default signUpReducer;
export const { setEMail, setPassword, setPasswordRepeat, setVerificationCode } =
  signUpSlice.actions;
