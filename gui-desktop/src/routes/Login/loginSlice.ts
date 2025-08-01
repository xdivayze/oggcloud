import { createSlice } from "@reduxjs/toolkit"

interface LoginSlice {
  eMail: string,
  password: string
}

const initialState: LoginSlice = {
  eMail: "",
  password: "",

}

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEMail: (state, action) => {
      state.eMail = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    }
  }
})

const loginReducer = loginSlice.reducer
export default loginReducer
export const { setEMail, setPassword } = loginSlice.actions
