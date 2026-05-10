import { useEffect, useRef, useState } from "react";
import {
    Users,
    Search,
    Shield,
    ChevronDown,
    Calendar,
    Trash2,
    X,
    Heart,
    Music,
    Eye,
    Pause,
    Play,
    Headphones,
    Loader,
    Clock
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserList, deleteUser } from "../../API/DataList/user";
import { formatDate, formatTime, searchFilter } from "../../utils/helpers";
import { handleDelete } from "../../utils/handleDelete";

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const dispatch = useDispatch();
    const { userList, loading } = useSelector((store) => store.user);

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    const handlePlaySong = (song) => {
        setSelectedSong(song);
        setShowMusicPlayer(true);
    };

    const handleClosePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
        setShowMusicPlayer(false);
        setSelectedSong(null);
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const filteredUsers = searchFilter(
        userList,
        searchTerm,
        ["userName", "email"]
    );


    const handleDeleteUser = (id) => {
        handleDelete({
            dispatch,
            id,
            action: deleteUser,
            title: "Delete User?",
            text: "Are you sure you want to delete this user?",
            successText: "User has been deleted successfully.",
        });
    };

    const handleViewFavorites = (user) => {
        setSelectedUser(user);
        setShowFavoritesModal(true);
    };


    const handlePlayPause = (songId, songUri) => {
        Object.keys(audioRefs.current).forEach((key) => {
            if (key !== String(songId) && audioRefs.current[key]) {
                audioRefs.current[key].pause();
                audioRefs.current[key].currentTime = 0;
            }
        }); const currentAudio = audioRefs.current[songId];
        if (currentAudio) {
            if (currentlyPlaying === songId) {
                currentAudio.pause();
                setCurrentlyPlaying(null);
            } else {
                currentAudio.play();
                setCurrentlyPlaying(songId);
            }
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
    return (
        <>
            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-7 h-7 text-indigo-600" />
                            User Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">View and manage all registered users</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm text-indigo-600 font-medium">{userList?.length || 0} Total Users</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>


                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Favorites</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user?._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">
                                                        {user?.userName?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user?.userName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user?.email}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewFavorites(user)}
                                                className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 transition-colors"
                                            >
                                                <Heart className="w-4 h-4" />
                                                <span className="font-medium">{user?.favorites?.length || 0} songs</span>
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(user?.createdAt)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteUser(user?._id)}
                                                className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showFavoritesModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Favorite Songs
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        {selectedUser?.userName} • {selectedUser?.favorites?.length || 0} songs
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowFavoritesModal(false);
                                }}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {selectedUser?.favorites && selectedUser.favorites.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedUser.favorites.map((song, idx) => (
                                        <div
                                            key={song?._id || idx}
                                            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all hover:border-pink-200 cursor-pointer"
                                            onClick={() => handlePlaySong(song)}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-100 to-purple-100">
                                                    <img
                                                        src={song?.image || "https://via.placeholder.com/64"}
                                                        alt={song?.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-base font-semibold text-gray-800">
                                                                {song?.title || "Untitled"}
                                                            </h3>
                                                            <p className="text-sm text-pink-500 mt-0.5 font-medium">
                                                                {song?.artist?.artistProfile?.stageName || "Unknown Artist"}
                                                            </p>
                                                            <p className="text-xs text-purple-500 mt-1 capitalize">
                                                                {song?.genre || "Unknown Genre"}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Added on {formatDate(song?.createdAt)}
                                                            </p>
                                                        </div>

                                                        <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm">
                                                            <Play className="w-4 h-4 ml-0.5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Heart className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-1">No Favorite Songs</h3>
                                    <p className="text-sm text-gray-400">
                                        {selectedUser?.userName} hasn't added any songs to favorites yet
                                    </p>
                                </div>
                            )}
                        </div>


                    </div>
                </div>
            )}


            {showMusicPlayer && selectedSong && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Music className="w-5 h-5 text-purple-600" />
                                <h2 className="text-xl font-bold text-gray-800">Song Details</h2>
                            </div>
                            <button
                                onClick={() => setShowMusicPlayer(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={selectedSong?.image || "https://via.placeholder.com/96"}
                                    alt={selectedSong?.title}
                                    className="w-24 h-24 rounded-lg object-cover"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/96"; }}
                                />
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                                        {selectedSong?.title || "Untitled"}
                                    </h3>

                                    <p className="text-lg text-purple-600 font-medium">
                                        {selectedSong?.artist?.artistProfile?.stageName || "Unknown Artist"}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                                        <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                                            {selectedSong?.genre || "Unknown Genre"}
                                        </span>
                                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize flex items-center gap-2 shadow-sm">
                                            <Clock className="w-4 h-4" />
                                            {formatTime(selectedSong?.duration)}
                                        </span>

                                        <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(selectedSong?.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Headphones className="w-4 h-4 text-purple-600" />
                                    Audio Preview
                                </h4>
                                <audio controls className="w-full rounded-lg">
                                    <source src={selectedSong?.uri} type="audio/mpeg" />
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

export default UserManagement;