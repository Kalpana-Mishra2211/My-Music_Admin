import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  ChevronDown,
  Mail,
  Calendar,
  Trash2,
  X,
  Filter,
  Eye,
  Music,
  Mic,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  ThumbsUp,
  ThumbsUpIcon
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteArtist, getArtistList } from "../../API/DataList/artist";
import { handleDelete } from "../../utils/handleDelete";
import { formatDate, searchFilter } from "../../utils/helpers";
import { FaInstagram, FaInstagramSquare } from "react-icons/fa";
import { BsSpotify, BsTwitterX, BsYoutube } from "react-icons/bs";

const Artist = () => {
  const dispatch = useDispatch();
  const { artistList, loading } = useSelector((store) => store.artist);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);

  useEffect(() => {
    dispatch(getArtistList());
  }, [dispatch]);

  const handleViewDetails = (artist) => {
    setSelectedArtist(artist);
    setShowModal(true);
  };


  const handleDeleteArtist = (id) => {
    handleDelete({
      dispatch,
      id,
      action: deleteArtist,
      title: "Delete Artist?",
      successText: "Artist has been deleted successfully.",
    });
  };

  const filteredArtists = searchFilter(
    artistList,
    searchTerm,
    ["userName", "email", "artistProfile.stageName"]
  );


  const totalArtists = artistList?.length || 0;



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

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Mic className="w-7 h-7 text-purple-600" />
              Artist List
            </h1>
            <p className="text-sm text-gray-500 mt-1">View and manage all registered artists</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 px-4 py-2 rounded-lg flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">{totalArtists} Total Artists</span>
            </div>
          </div>
        </div>
      </div>


      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, stage name, or genre..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follower</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {artistList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      {searchTerm || statusFilter !== "all" ? (
                        <>
                          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No matching artists found</p>
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("all");
                            }}
                            className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Clear all filters
                          </button>
                        </>
                      ) : (
                        <>
                          <Mic className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No artists found</p>
                          <p className="text-gray-400 text-xs mt-1">Artists will appear here once they register</p>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredArtists.map((artist) => (
                    <tr key={artist._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={artist?.artistProfile?.profileImage || "https://via.placeholder.com/40"}
                            alt={artist?.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{artist?.userName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {artist?.email || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {artist?.artistProfile?.stageName || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {artist?.artistProfile?.genre?.slice(0, 2).map((g, idx) => (
                            <span key={idx} className="inline-flex px-2 py-0.5 text-xs bg-purple-100 text-purple-600 rounded-full">
                              {g}
                            </span>
                          ))}
                          {artist?.artistProfile?.genre?.length > 2 && (
                            <span className="text-xs text-gray-400">+{artist.artistProfile.genre.length - 2}</span>
                          )}
                        </div>
                      </td>

                      <td className="px-12 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          {artist?.artistProfile?.followersCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(artist?.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(artist)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArtist(artist._id)}
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

      {showModal && selectedArtist && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">

            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-800">Artist Details</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              <div className="flex items-center gap-4">
                <img
                  src={selectedArtist?.artistProfile?.profileImage || "https://via.placeholder.com/80"}
                  alt={selectedArtist?.userName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-100"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/80"; }}
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedArtist?.userName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedArtist?.artistProfile?.stageName}
                  </p>

                </div>
              </div>

            <div>
  <h4 className="text-sm font-semibold text-gray-700 mb-2">
    Statistics
  </h4>

  <div className="grid grid-cols-3 gap-3">
    
    {/* Songs */}
    <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
      <Music className="w-4 h-4 text-purple-600" />
      <div>
        <p className="text-sm font-semibold">
          {selectedArtist?.artistProfile?.totalSongs || 0}
        </p>
        <p className="text-xs text-gray-500">Songs</p>
      </div>
    </div>

    <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
      <Mic className="w-4 h-4 text-blue-600" />
      <div>
        <p className="text-sm font-semibold">
          {selectedArtist?.artistProfile?.totalAlbums || 0}
        </p>
        <p className="text-xs text-gray-500">Albums</p>
      </div>
    </div>

    <div className="flex items-center gap-3 bg-pink-50 border border-pink-100 rounded-lg px-3 py-2">
      <Users className="w-4 h-4 text-pink-600" />
      <div>
        <p className="text-sm font-semibold">
          {selectedArtist?.artistProfile?.followersCount || 0}
        </p>
        <p className="text-xs text-gray-500">Followers</p>
      </div>
    </div>

  </div>
</div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact</h4>

                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <p><span className="text-gray-500">Email:</span> {selectedArtist?.email}</p>
                  <p><span className="text-gray-500">Phone:</span> {selectedArtist?.artistProfile?.phoneNumber || "N/A"}</p>
                  <p><span className="text-gray-500">Joined:</span> {formatDate(selectedArtist?.createdAt)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Artist Info</h4>

                <div className="bg-gray-50 rounded-lg p-3 space-y-3">

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Genres</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedArtist?.artistProfile?.genre?.length > 0 ? (
                        selectedArtist.artistProfile.genre.map((g, i) => (
                          <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {g}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No genres</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bio</p>
                    <p className="text-sm text-gray-700">
                      {selectedArtist?.artistProfile?.bio || "No bio provided"}
                    </p>
                  </div>
                </div>
              </div>

              {(selectedArtist?.artistProfile?.socialLinks?.instagram ||
                selectedArtist?.artistProfile?.socialLinks?.youtube ||
                selectedArtist?.artistProfile?.socialLinks?.twitter ||
                selectedArtist?.artistProfile?.socialLinks?.spotify) && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Social
                    </h4>

                    <div className="flex flex-wrap gap-2">

                      {selectedArtist?.artistProfile?.socialLinks?.instagram && (
                        <a
                          href={`https://instagram.com/${selectedArtist.artistProfile.socialLinks.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs px-3 py-1 bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100"
                        >
                          <FaInstagramSquare className="text-sm" />
                          <span>
                            {selectedArtist.artistProfile.socialLinks.instagram}
                          </span>
                        </a>
                      )}

                      {selectedArtist?.artistProfile?.socialLinks?.youtube && (
                        <a
                          href={`https://youtube.com/@${selectedArtist.artistProfile.socialLinks.youtube}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                        >
                          <BsYoutube className="text-sm" />
                          <span>
                            {selectedArtist.artistProfile.socialLinks.youtube}
                          </span>
                        </a>
                      )}

                      {selectedArtist?.artistProfile?.socialLinks?.twitter && (
                        <a
                          href={`https://twitter.com/${selectedArtist.artistProfile.socialLinks.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                        >
                          <BsTwitterX className="text-sm" />
                          <span>
                            {selectedArtist.artistProfile.socialLinks.twitter}
                          </span>
                        </a>
                      )}

                      {selectedArtist?.artistProfile?.socialLinks?.spotify && (
                        <a
                          href={selectedArtist.artistProfile.socialLinks.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                        >
                          <BsSpotify className="text-sm" />
                          <span>Spotify</span>
                        </a>
                      )}

                    </div>
                  </div>
                )}

            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default Artist;