// AdminApp.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ArtistApproval from "./pages/Artist/ArtistApproval";
import MusicApproval from "./pages/Music/MusicApproval";
import Login from "./Components/Login ";
import ProtectedRoute from "./Components/ProtectedRoute";
import User from "./Pages/User/User";
import Artist from "./Pages/Artist/Artist";
import MusicList from "./Pages/Music/MusicList";
import AlbumList from "./Pages/Album/AlbumList";
import ArtistProfileRequests from "./Pages/Artist/ArtistProfileRequests";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="artist-approval" element={<ArtistApproval />} />
        <Route path="music-approval" element={<MusicApproval />} />
        <Route path="user" element={<User />} />
        <Route path="artists" element={<Artist />} />
        <Route path="music" element={<MusicList />} />
        <Route path="album" element={<AlbumList />} />
        <Route path="artist-profile-requests" element={<ArtistProfileRequests />} />



      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;