import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "../Layout/navbarSlice";
import authReducer from "./authSlice";
import loginReducer from "../routes/Login/loginSlice";

export const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    auth: authReducer,
    login: loginReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
