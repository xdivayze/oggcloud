import { createSlice } from "@reduxjs/toolkit";

interface LibrarySlice {
  effectivePath: number; //id of the folder in the library
  effectivePathTree: Array<number>; 
}

const initialState: LibrarySlice = {
  effectivePath: 0,
  effectivePathTree: [0],
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setEffectivePath: (state, action) => {
      state.effectivePath = action.payload;
    },
    setEffectivePathTree: (state, action) => {
      state.effectivePathTree = action.payload;
    },
  },
});

const libraryReducer = librarySlice.reducer;
export default libraryReducer;
export const { setEffectivePath, setEffectivePathTree } = librarySlice.actions;
