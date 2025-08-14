// src/store/snippetSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  snippets: [],
  currentSnippet: null,
  loading: false,
};

const snippetSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSnippets(state, action) {
      state.snippets = action.payload;
    },
    setCurrentSnippet(state, action) {
      state.currentSnippet = action.payload;
    },
    addCommentToSnippet(state, action) {
        if (state.currentSnippet) {
            state.currentSnippet.comments.push(action.payload);
        }
    }
  },
});

export const { setLoading, setSnippets, setCurrentSnippet, addCommentToSnippet } = snippetSlice.actions;
export default snippetSlice.reducer;