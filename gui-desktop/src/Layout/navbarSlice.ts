import { createSlice } from "@reduxjs/toolkit"
import { LibraryNavbarObj } from "../routes/Library/Library";
import { LoginNavbarObj } from "../routes/Login/Login";

interface NavbarState {
  items: { placeholder: string; navigateTo: string; }[],
  isCollapsed: boolean
}

const initialState: NavbarState = {
  isCollapsed: true,
  items: [{ placeholder: "OGGLabs", navigateTo: "/about" }, { placeholder: "Home", navigateTo: "/" }
    , LoginNavbarObj,
  { placeholder: "Sign Up", navigateTo: "/sign-up" }, LibraryNavbarObj]
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
    },
    centerNavbarTitle: (state, action: { payload: { placeholder: string; navigateTo: string; }, type: string }) => {
      const newNavbarItems = [...state.items]
      let foundIndex = 0
      for (let i = 0; i < newNavbarItems.length; i++) {
        if (newNavbarItems[i].placeholder === action.payload.placeholder) {
          foundIndex = i
          break
        }

      }

      newNavbarItems.splice(foundIndex, 1)
      newNavbarItems.splice(2, 0, action.payload)
      state.items = newNavbarItems

    }
  }
})
const navbarReducer = navbarSlice.reducer
export default navbarReducer
export const { setIsCollapsed, toggleIsCollapsed, setItems, centerNavbarTitle } = navbarSlice.actions

