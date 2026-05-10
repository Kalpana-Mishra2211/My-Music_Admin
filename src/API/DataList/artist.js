import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config";

export const getArtistList = createAsyncThunk(
  "artist/getArtistList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("data/artist");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error occurred"
      );
    }
  }
);

export const deleteArtist = createAsyncThunk(
  "artist/deleteArtist",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`data/artist/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error occurred"
      );
    }
  }
);

const artistSlice = createSlice({
  name: "artist",
  initialState: {
    artistList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArtistList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArtistList.fulfilled, (state, action) => {
        state.loading = false;
        state.artistList = action.payload?.artist || [];
      })
      .addCase(getArtistList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(deleteArtist.fulfilled, (state, action) => {
        const artistId = action.meta.arg;
        state.artistList = state.artistList.filter(
          (artist) => artist._id !== artistId
        );
      })
    
  },
});

export default artistSlice.reducer;