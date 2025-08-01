import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
  eMail: string
}

const initialState: AuthState = {
  eMail: ""
}

const navbarSlice = createSlice(
  {
    name: "auth",
    initialState,
    reducers: {
      login: (state, action) => {
        state.eMail = action.payload
      },
      logout: (state) => {
        state.eMail = ""
      }
    }
  }
)

const authReducer = navbarSlice.reducer

export default authReducer
export const { login, logout } = navbarSlice.actions
