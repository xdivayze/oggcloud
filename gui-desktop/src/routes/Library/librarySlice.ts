import { createSlice } from "@reduxjs/toolkit";
import { Library } from "./models/library";

interface LibrarySlice {
  effectivePath: number; //id of the folder in the library
  library: Library
}

const initialState: LibrarySlice = {
  effectivePath: 0,
  library: new Library(),
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setEffectivePath: (state, action) => {
      state.effectivePath = action.payload;
    },
    setLibrary: (state, action) => {
        state.library = action.payload;
    },
  },
});

const libraryReducer = librarySlice.reducer
export default libraryReducer
export const {setEffectivePath, setLibrary} = librarySlice.actions