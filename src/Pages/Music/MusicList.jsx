// pages/MusicList.jsx
import React, { useEffect, useState } from "react";
import {
  Music,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Trash2,
  X,
  Eye,
  Play,
  Pause,
  Headphones,
  User,
  Clock,
  Heart,
  Loader
} from "lucide-react";
import DeleteModal from "../../UI/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { getMusicList, deleteMusic } from "../../API/DataList/music";
import { formatDate, formatTime, searchFilter } from "../../utils/helpers";
import Swal from "sweetalert2";
import { handleDelete } from "../../utils/handleDelete";

const MusicList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const { musicList ,loading } = useSelector((store) => store.music);

  useEffect(() => {
    dispatch(getMusicList());
  }, []);


  const handleViewDetails = (music) => {
    setSelectedMusic(music);
    setShowModal(true);
  };

  
  const handleMusicDelete = (id) => {
    handleDelete({
      dispatch,
      id,
      action: deleteMusic,
      title: "Delete Music?",
      successText: "Music has been deleted successfully.",
    });
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

  const filteredMusic = searchFilter(
    musicList,
    searchTerm,
    ["title", "genre", "artist.userName"]
  );

console.log("filteredMusic",filteredMusic)

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Music className="w-7 h-7 text-purple-600" />
              Music Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage all songs in your platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 px-4 py-2 rounded-lg flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">{musicList.length} Total Songs</span>
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
                placeholder="Search by song title, artist, or genre..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>


          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Song</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMusic.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No songs found</p>
                      {(searchTerm || genreFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setGenreFilter("all");
                          }}
                          className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Clear all filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredMusic.map((music) => (
                    <tr key={music._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={music?.image || "https://via.placeholder.com/40"}
                            alt={music?.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{music?.title}</p>

                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 ">
                        <span className="text-sm text-gray-900 font-semibold">{music?.artist?.artistProfile?.stageName || "Unknown Artist"}</span>
                      </td>
                      <td className="px-6 py-4 ">
                        <span className="text-sm bg-purple-100 px-2 rounded-full text-purple-600">{music?.genre}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(music?.duration)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(music?.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(music)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMusicDelete(music._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {showModal && selectedMusic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">Song Details</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedMusic?.image || "https://via.placeholder.com/96"}
                  alt={selectedMusic?.title}
                  className="w-24 h-24 rounded-lg object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/96"; }}
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{selectedMusic?.title}</h3>
                  <p className="text-gray-600">by {selectedMusic?.artist?.artistProfile?.stageName}</p>

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-700"><strong>Song ID:</strong> {selectedMusic?._id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-pink-400" />
                  <span className="text-gray-700"><strong>Duration:</strong> {formatTime(selectedMusic?.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-700"><strong>Released:</strong>{formatDate(selectedMusic?.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-gray-700"><strong>Total Likes:</strong> {(selectedMusic?.likesCount || 0).toLocaleString()}</span>
                </div>
              </div>



              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-purple-600" />
                  Audio Preview
                </h4>
                <audio controls className="w-full rounded-lg" src={selectedMusic?.uri}>
                  Your browser does not support the audio element.
                </audio>
                <p className="text-xs text-gray-500 mt-2">
                  🎵 Click play to preview the song
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default MusicList;