import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config";


export const getMusicApprovalList = createAsyncThunk(
  "musicApproval/getMusicApprovalList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("approval/music");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const approveMusic = createAsyncThunk(
  "musicApproval/approveMusic",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post(`approval/music-approval/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const rejectMusic = createAsyncThunk(
  "musicApproval/rejectMusic",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.post(`approval/music-rejected/${id}`, { reason });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const musicApprovalSlice = createSlice({
  name: "musicApproval",
  initialState: {
    musicApprovalList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMusicApprovalList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMusicApprovalList.fulfilled, (state, action) => {
        state.loading = false;
        state.musicApprovalList = action.payload.music;
      })
      .addCase(getMusicApprovalList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.musicApprovalList = [];
      })

      // .addCase(approveMusic.pending, (state) => {
      //   state.loading = true;
      // })
      .addCase(approveMusic.fulfilled, (state, action) => {
        const id = action.meta.arg;

        const music = state.musicApprovalList.find(
          (item) => item._id === id
        );

        if (music) {
          music.approvalStatus = "approved";
        }
      })
      // .addCase(approveMusic.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      .addCase(rejectMusic.fulfilled, (state, action) => {
        const id = action.meta.arg.id;

        const music = state.musicApprovalList.find(
          (item) => item._id === id
        );

        if (music) {
          music.approvalStatus = "rejected";
        }
      });

  },
});

export default musicApprovalSlice.reducer;