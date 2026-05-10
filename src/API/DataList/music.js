import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config";

export const getMusicList = createAsyncThunk(
  "music/getMusicList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("data/musicList");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error occurred"
      );
    }
  }
);

export const deleteMusic = createAsyncThunk(
  "music/deleteMusic",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`data/music/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error occurred"
      );
    }
  }
);


const musicSlice = createSlice({
  name: "music",
  initialState: {
    musicList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMusicList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMusicList.fulfilled, (state, action) => {
        state.loading = false;
        state.musicList = action.payload?.data || [];
      })
      .addCase(getMusicList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMusic.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMusic.fulfilled, (state, action) => {
        state.loading = false;
        const musicId = action.meta.arg;
        state.musicList = state.musicList.filter(
          (music) => music._id !== musicId
        );
      })
      .addCase(deleteMusic.rejected, (state) => {
        state.loading = true;
      })
  },
});

export default musicSlice.reducer;