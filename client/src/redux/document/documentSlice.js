import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentDocument: null,
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    // Fetch Document Actions
    fetchDocStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDocSuccess: (state, action) => {
      state.currentDocument = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDocFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Save/Update Document Actions
    saveDocStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveDocSuccess: (state, action) => {
      state.currentDocument = action.payload;
      state.loading = false;
      state.error = null;
    },
    saveDocFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear Active Document (useful when leaving a form or creating new)
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchDocStart,
  fetchDocSuccess,
  fetchDocFailure,
  saveDocStart,
  saveDocSuccess,
  saveDocFailure,
  clearCurrentDocument,
} = documentSlice.actions;

export default documentSlice.reducer;