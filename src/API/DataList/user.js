import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config";

export const getUserList = createAsyncThunk(
  "user/getUserList",
  async (_, { rejectWithValue }) => {
    try {
      console.log("userList")
      const res = await api.get("data/user");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error occurred"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`data/user/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error occurred"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload?.users || [];
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const userId = action.meta.arg;
        state.userList = state.userList.filter(
          (user) => user._id !== userId
        );
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loading = true;
      })
  },
});

export default userSlice.reducer;