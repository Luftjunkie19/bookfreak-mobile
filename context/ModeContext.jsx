import { createSlice } from '@reduxjs/toolkit';

export const modeReducer = createSlice({
  name: "mode",
  initialState: {
    isDarkMode:true,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const modeActions = modeReducer.actions;
