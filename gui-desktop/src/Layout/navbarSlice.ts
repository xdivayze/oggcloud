import { createSlice } from "@reduxjs/toolkit"

interface NavbarState {
  items: [string, string, string, string, string],
  isOpen: boolean
}

const initialState: NavbarState = {
  isOpen: false,
  items: ["OGGLabs", "Home", "Login", "Register", "Help"]
}

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload
    },
    toggleIsOpen: (state) => {
      state.isOpen = !state.isOpen
    },
    setItems: (state, action) => {
      state.items = action.payload
    }
  }
})

export default navbarSlice.reducer
export const { setIsOpen, toggleIsOpen, setItems } = navbarSlice.actions

