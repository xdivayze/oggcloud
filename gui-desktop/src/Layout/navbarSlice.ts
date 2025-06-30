import { createSlice } from "@reduxjs/toolkit"

interface NavbarState {
  items: { placeholder: string; navigateTo: string; }[],
  isCollapsed: boolean
}

const initialState: NavbarState = {
  isCollapsed: true,
  items: [{ placeholder: "OGGLabs", navigateTo: "/about" }, { placeholder: "Home", navigateTo: "/" },
  { placeholder: "Login", navigateTo: "/login" },
  { placeholder: "Sign Up", navigateTo: "/sign-up" }, { placeholder: "Help", navigateTo: "/help" }]
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

