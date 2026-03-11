import { createSlice } from "@reduxjs/toolkit";

interface LibrarySlice {
  effectivePath: number; //id of the folder in the library
  shownChildrenIDs: Array<number>; //TODO i forgot why I had this field
}

const initialState: LibrarySlice = {
  effectivePath: 0,
  shownChildrenIDs: [],
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setEffectivePath: (state, action) => {
      state.effectivePath = action.payload;
    },
    setLibrary: (state, action) => {
      state.shownChildrenIDs = action.payload;
    },
  },
});

const libraryReducer = librarySlice.reducer;
export default libraryReducer;
export const { setEffectivePath, setLibrary } = librarySlice.actions;
