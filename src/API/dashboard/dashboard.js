import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config";

export const getStats = createAsyncThunk(
    "dashboard/getStats",
    async (_, { rejectWithValue }) => {
        try {            
            const res = await api.get("dashboard/stats");
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Error occurred"
            );
        }
    }
);
export const getTopMusic = createAsyncThunk(
    "dashboard/getTopMusic",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("dashboard/top-music");
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Error occurred"
            );
        }
    }
);
export const getRecentUser = createAsyncThunk(
    "dashboard/getRecentUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("dashboard/recent-user");
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Error occurred"
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        stats: null,
        topMusic: [],
        recentUser: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload?.stats || null;
            })
            .addCase(getStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getTopMusic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTopMusic.fulfilled, (state, action) => {
                state.loading = false;
                state.topMusic = action.payload?.topMusics || null;
            })
            .addCase(getTopMusic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getRecentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.recentUser = action.payload?.recentUsers || null;
            })
            .addCase(getRecentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default dashboardSlice.reducer;