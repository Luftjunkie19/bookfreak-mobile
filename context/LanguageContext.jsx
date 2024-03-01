import { getLocales } from 'expo-localization';

import { createSlice } from '@reduxjs/toolkit';

const consistsLanguage=['en', 'de', 'pl'].find((val)=>val===getLocales()[0].languageCode);

export const languageContext = createSlice({
  name: "languages",
  initialState: {
    selectedLangugage: consistsLanguage ? consistsLanguage : 'en'
  },
  reducers: {
    selectLanguage: (state, action) => {
      state.selectedLangugage = action.payload;
    },
  },
});

export const languageActions = languageContext.actions;
