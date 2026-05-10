import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config";

export const login = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("auth/login", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        profile: null,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.profile = null;
            localStorage.removeItem("accessToken");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.admin;
                state.error = null;

            })
            .addCase(login.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;

            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;