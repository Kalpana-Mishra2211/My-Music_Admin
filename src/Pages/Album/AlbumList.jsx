// pages/AlbumList.jsx
import React, { useEffect, useState } from "react";
import {
  Album,
  Search,
  Trash2,
  X,
  Eye,
  Music,
  Clock,
  Play,
  ListMusic,
  Calendar,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Image,
  Loader
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAlbumList,deleteAlbum } from "../../API/DataList/album";
import Swal from "sweetalert2";
import { calculateTotalDuration, formatDate, formatTime } from "../../utils/helpers";

const AlbumList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [showPlayModal, setShowPlayModal] = useState(false); // New state for play modal
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const dispatch = useDispatch();
  const { albumList , loading} = useSelector((store) => store.album);

  useEffect(() => {
    dispatch(getAlbumList());
  }, [dispatch]);

  // Filter albums based on search term
  const filteredAlbums = (albumList || []).filter(album => {
    const matchesSearch = searchTerm === "" ||
      album?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlbums = filteredAlbums.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (album) => {
    setSelectedAlbum(album);
    setSelectedMusic(null);
    setShowModal(true);
  };

  const handlePlaySong = (music) => {
    setSelectedMusic(music);
    setShowPlayModal(true);
  };

  const handleDeleteClick = (album) => {
    setAlbumToDelete(album);
    setShowDeleteConfirm(true);
  };

  

    const handleDelete = async (albumId) => {

        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This album will be permanently deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "#6b7280",
                confirmButtonText: "Yes, delete it!",
            });

            if (!result.isConfirmed) return;

            await dispatch(deleteAlbum(albumId)).unwrap();

            Swal.fire({
                title: "Deleted!",
                text: "Album deleted successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (error) {
            console.error("Error deleting album:", error);

            Swal.fire({
                title: "Error!",
                text: error?.message || "Failed to delete album",
                icon: "error",
            });
        }
    };

    if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="text-center">
        <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading artists...</p>
      </div>
    </div>
  );
}


  const totalAlbums = albumList?.length || 0;

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Album className="w-7 h-7 text-purple-600" />
              Album Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage all albums in your platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 px-4 py-2 rounded-lg flex items-center gap-2">
              <Album className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">{totalAlbums} Total Albums</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by album title or description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Albums Table */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {paginatedAlbums.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Album className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No albums found</p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                }}
                className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album Cover</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Songs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedAlbums.map((album, index) => (
                    <tr key={album._id} className="hover:bg-gray-50 transition-colors">
                    
                      <td className="px-6 py-4">
                        <img
                          src={album?.image || "https://via.placeholder.com/50"}
                          alt={album?.title}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{album?.title}</div>
                        <div className="text-xs text-gray-500">ID: {album?._id?.slice(-8)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {album?.description || "No description"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Music className="w-4 h-4 text-purple-500" />
                          <span>{album?.musics?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <span>{calculateTotalDuration(album?.musics)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(album?.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(album)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(album._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Album"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedAlbum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Album className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">Album Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMusic(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-5 mb-5">
                <img
                  src={selectedAlbum?.image || "https://via.placeholder.com/150"}
                  alt={selectedAlbum?.title}
                  className="w-28 h-28 rounded-lg object-cover shadow"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedAlbum?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 ">
                      {selectedAlbum?.description || "No description"}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Music className="w-4 h-4 text-purple-600" />
                      <span>{selectedAlbum?.musics?.length || 0} songs</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>{calculateTotalDuration(selectedAlbum?.musics)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>
                        {selectedAlbum?.createdAt
                          ? formatDate(selectedAlbum.createdAt)
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-purple-600" />
                  Tracklist
                </h4>
                {selectedAlbum?.musics && selectedAlbum.musics.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            Image
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            Title
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            Duration
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {selectedAlbum.musics.map((song, idx) => (
                          <tr key={song._id || idx} className="hover:bg-gray-100 transition">

                            <td className="px-4 py-2">
                              <div className="flex items-center">
                                <img
                                  src={song?.image || "https://via.placeholder.com/40"}
                                  alt={song?.title}
                                  className="w-10 h-10 rounded-md object-cover border"
                                />
                              </div>
                            </td>

                            <td className="px-4 py-2 text-sm font-medium text-gray-800">
                              {song.title}
                            </td>

                            <td className="px-4 py-2 text-sm text-gray-500">
                              {formatTime(song.duration)}
                            </td>

                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => handlePlaySong(song)}
                                className="px-2 py-1.5 rounded-lg flex items-center gap-1 bg-purple-100 text-purple-600 hover:bg-purple-500 hover:text-white transition mx-auto"
                              >
                                <Play className="w-3 h-3" />
                                <span className="text-xs">Play</span>
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Music className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No songs in this album</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlayModal && selectedMusic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">Now Playing</h2>
              </div>
              <button
                onClick={() => {
                  setShowPlayModal(false);
                  setSelectedMusic(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <img
                  src={selectedMusic?.image || "https://via.placeholder.com/150"}
                  alt={selectedMusic?.title}
                  className="w-16 h-16 rounded-lg object-cover mx-auto mb-2 shadow-sm"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{selectedMusic.title}</h3>
                <p className="text-sm text-gray-500">Duration: {formatTime(selectedMusic.duration)}</p>
                                <p className="text-sm text-purple-500">Artist: {selectedMusic?.artist?.artistProfile?.stageName}</p>

              </div>

              <div className="bg-gray-50 rounded-lg p-2">
                <audio controls autoPlay className="w-full rounded-lg" src={selectedMusic.uri}>
                  Your browser does not support the audio element.
                </audio>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  🎵 Playing: {selectedMusic.title}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && albumToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-800">Delete Album</h2>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the album <strong>"{albumToDelete?.title}"</strong>?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone. All {albumToDelete?.musics?.length || 0} songs in this album will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                >
                  Delete Album
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumList;