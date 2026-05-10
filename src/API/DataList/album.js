import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config";

export const getAlbumList = createAsyncThunk(
    "album/getAlbumList",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("data/albumList");
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Error occurred"
            );
        }
    }
);

export const deleteAlbum = createAsyncThunk(
    "album/deleteAlbum",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.delete(`data/album/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Error occurred"
            );
        }
    }
);

const albumSlice = createSlice({
    name: "album",
    initialState: {
        albumList: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAlbumList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAlbumList.fulfilled, (state, action) => {
                state.loading = false;
                state.albumList = action.payload?.data || [];
            })
            .addCase(getAlbumList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAlbum.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAlbum.fulfilled, (state, action) => {
                state.loading = false;
                const albumId = action.meta.arg;
                state.albumList = state.albumList.filter(
                    (album) => album._id !== albumId
                );
            })
            .addCase(deleteAlbum.rejected, (state) => {
                state.loading = true;
            })
    },
});

export default albumSlice.reducer;