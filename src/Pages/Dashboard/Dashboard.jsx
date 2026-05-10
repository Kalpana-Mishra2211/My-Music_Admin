import {
  Users,
  Clock,
  Album,
  Music,
  CheckCircle,
  XCircle,
  Eye,
  ThumbsUp,
  Calendar,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Award,
  Star,
  Headphones,
  UserPlus,
  Mic2,
  ListMusic,
  Loader
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentUser, getStats, getTopMusic } from "../../API/dashboard/dashboard";
import { formatDate, recentTime } from "../../utils/helpers";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, topMusic, recentUser, loading } = useSelector((store) => store.dashboard);

  useEffect(() => {
    dispatch(getStats())
    dispatch(getTopMusic())
    dispatch(getRecentUser())

  }, [dispatch])

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


  const getStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const getActivityIcon = (type) => {
    if (type === "artist") {
      return <div className="bg-blue-100 p-2 rounded-full"><Users className="w-4 h-4 text-blue-600" /></div>;
    }
    return <div className="bg-purple-100 p-2 rounded-full"><Music className="w-4 h-4 text-purple-600" /></div>;
  };



  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Artists</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.artist}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <UserPlus className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Artists</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.pendingArtists}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Album className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Albums</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.album}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Music className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Songs</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.music}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <ListMusic className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Music</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.pendingMusic}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-gray-800">{stats?.users}</p>
        </div>

      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-800">Top Musics</h2>
              </div>

            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topMusic.map((track, index) => (
              <div key={track?._id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {track?.image ? (
                        <img
                          src={track.image}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        track?.title?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{track?.title}</p>
                      <p className="text-sm text-gray-500">{track?.artist.userName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4 text-purple-500" />
                      {track?.likesCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                      <TrendingUp className="w-3 h-3" />
                      Top {index + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUser.map((user) => (
              <div key={user?._id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.userName}</p>
                      <p className="text-xs text-gray-500">Email: {user?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{recentTime(user?.createdAt)}</p>
                    <p className="text-xs text-green-600">New user</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;