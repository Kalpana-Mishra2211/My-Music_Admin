import { configureStore } from "@reduxjs/toolkit";
import artistApprovalReducer from "../API/approval/artistApproval.js"
import musicApprovalReducer from "../API/approval/musicApproval.js"
import authReducer from "../API/auth/auth.js"
import userReducer from "../API/DataList/user.js"
import artistReducer from "../API/DataList/artist.js"
import musicReducer from "../API/DataList/music.js"
import albumReducer from "../API/DataList/album.js"
import dashboardReducer from "../API/dashboard/dashboard.js"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        artistApproval: artistApprovalReducer,
        musicApproval: musicApprovalReducer,
        user: userReducer,
        artist: artistReducer,
        music: musicReducer,
        album: albumReducer,
        dashboard:dashboardReducer,

    },
});