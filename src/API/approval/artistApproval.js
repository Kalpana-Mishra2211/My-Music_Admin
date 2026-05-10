import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config";

export const getArtistApprovalList = createAsyncThunk(
  "artistApproval/getArtistApprovalList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("approval/artist");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const getProfileApprovalList = createAsyncThunk(
  "artistApproval/getProfileApprovalList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("approval/profile");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const approveArtist = createAsyncThunk(
  "artistApproval/approveArtist",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post(`approval/artist-approval/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const rejectArtist = createAsyncThunk(
  "artistApproval/rejectArtist",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.post(`approval/artist-rejected/${id}`, { reason });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const artistApprovalSlice = createSlice({
  name: "artistApproval",
  initialState: {
    artistApprovalList: [],
    profileApprovalList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArtistApprovalList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArtistApprovalList.fulfilled, (state, action) => {
        state.loading = false;
        state.artistApprovalList = action.payload.artists;
        state.error = null;

      })
      .addCase(getArtistApprovalList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.artistApprovalList = [];
      })
      .addCase(getProfileApprovalList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileApprovalList.fulfilled, (state, action) => {
        state.loading = false;
        state.profileApprovalList = action.payload.data;
        state.error = null;

      })
      .addCase(getProfileApprovalList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profileApprovalList = [];
      })


      // .addCase(approveArtist.pending, (state) => {
      //   state.loading = true;
      // })
      .addCase(approveArtist.fulfilled, (state, action) => {
        state.loading = false;

        const artist = state.artistApprovalList.find(
          (item) => item._id === action.meta.arg
        );
        state.profileApprovalList = state.profileApprovalList.filter(
          (item) => item._id !== action.meta.arg
        );
        if (artist) {
          artist.artistStatus = "approved";
        }
      })
      // .addCase(approveArtist.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })


      // .addCase(rejectArtist.pending, (state) => {
      //   state.loading = true;
      // })
      .addCase(rejectArtist.fulfilled, (state, action) => {
        state.loading = false;

        const { id, reason } = action.meta.arg;

        const artist = state.artistApprovalList.find(
          (item) => item._id === id
        );
        state.profileApprovalList = state.profileApprovalList.filter(
          (item) => item._id !== id
        );

        if (artist) {
          artist.artistStatus = "rejected";
          artist.rejectionReason = reason;
        }
      });
    // .addCase(rejectArtist.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });

  },


});

export default artistApprovalSlice.reducer;