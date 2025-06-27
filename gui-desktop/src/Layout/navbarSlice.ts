import { createSlice } from "@reduxjs/toolkit"

interface NavbarState {
  items: [string, string, string, string, string],
  isCollapsed: boolean
}

const initialState: NavbarState = {
  isCollapsed: true,
  items: ["OGGLabs", "Home", "Login", "Register", "Help"]
}

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setIsCollapsed: (state, action) => {
      state.isCollapsed = action.payload
    },
    toggleIsCollapsed: (state) => {
      state.isCollapsed = !state.isCollapsed
    },
    setItems: (state, action) => {
      state.items = action.payload
    }
  }
})
const navbarReducer = navbarSlice.reducer
export default navbarReducer
export const { setIsCollapsed, toggleIsCollapsed, setItems } = navbarSlice.actions

