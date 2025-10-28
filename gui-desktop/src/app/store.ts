import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "../Layout/navbarSlice";
import authReducer from "./authSlice";
import loginReducer from "../routes/Login/loginSlice";
import signUpReducer from "../routes/SignUp/signUpSlice";

export const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    auth: authReducer,
    login: loginReducer,
    sign_up: signUpReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
