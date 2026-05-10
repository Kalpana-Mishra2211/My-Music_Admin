// pages/MusicApproval.jsx
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Search,
  Music,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader,
  MessageSquare,
  Send,
  X,
  Filter,
  ChevronDown
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { approveMusic, getMusicApprovalList, rejectMusic } from "../../API/approval/musicApproval";
import { formatDate, formatTime, searchAndFilter } from "../../utils/helpers";
import RejectionModal from "../../UI/RejectionModal";
import { handleApprove, handleReject } from "../../utils/handleDelete";

const MusicApproval = () => {
  const dispatch = useDispatch();
  const { musicApprovalList, loading, error } = useSelector((store) => store.musicApproval);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingMusicId, setRejectingMusicId] = useState(null);

  useEffect(() => {
    dispatch(getMusicApprovalList());
  }, [dispatch]);

  const handleApproveClick = (id) => {
    handleApprove({
      dispatch,
      id,
      action: approveMusic,
      title: "Approve Music?",
      text: "Do you want to approve this song?",
      successText: "Song approved successfully ✅"
    });
  };

  const handleRejectClick = (id) => {
    setRejectingMusicId(id);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    handleReject({
      dispatch,
      id: rejectingMusicId,
      reason: rejectionReason,
      action: rejectMusic,
      title: "Reject Music?",
      text: "Are you sure you want to reject this Music?",
      successText: "Music rejected successfully ❌",
      afterSuccess: () => {
        setShowRejectModal(false);
        setRejectionReason("");
        setRejectingMusicId(null);
      },
    });
  };

  const handleViewDetails = (music) => {
    setSelectedMusic(music);
    setShowModal(true);
  };


  const filteredMusic = searchAndFilter(
    musicApprovalList,
    searchTerm,
    ["title", "artist.userName"],
    {
      approvalStatus: filterStatus,
    }
  );

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const pendingCount = musicApprovalList?.filter(m => m?.approvalStatus === "pending").length || 0;
  const approvedCount = musicApprovalList?.filter(m => m?.approvalStatus === "approved").length || 0;
  const rejectedCount = musicApprovalList?.filter(m => m?.approvalStatus === "rejected").length || 0;

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
              <Music className="w-7 h-7 text-purple-600" />
              Music Approval
            </h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage song submissions from artists</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 px-4 py-2 rounded-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">{pendingCount} Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved Songs</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected Songs</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
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
                placeholder="Search by song title or artist..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                }}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMusic.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      {searchTerm || filterStatus !== "all" ? (
                        <>
                          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No matching songs found</p>
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setFilterStatus("all");
                            }}
                            className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Clear all filters
                          </button>
                        </>
                      ) : (
                        <>
                          <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No songs found</p>
                          <p className="text-gray-400 text-xs mt-1">Song submissions will appear here</p>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredMusic.map((music) => (
                    <tr key={music?._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={music?.image || "https://via.placeholder.com/40"}
                            alt={music?.title}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{music?.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{music?.artist?.artistProfile?.stageName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(music?.duration)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(music?.approvalStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(music?.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(music)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveClick(music?._id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition disabled:text-gray-600"
                            title="Approve"
                            disabled={music?.approvalStatus !== "pending"}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectClick(music?._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:text-gray-600"
                            title="Reject"
                            disabled={music?.approvalStatus !== "pending"}
                          >
                            <XCircle className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Song Details</h2>
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
                  <div className="mt-2">{getStatusBadge(selectedMusic?.approvalStatus)}</div>
                  {selectedMusic?.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700 flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Rejection Reason: {selectedMusic?.rejectionReason}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Song ID: {selectedMusic?._id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Duration: {formatTime(selectedMusic?.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Submitted: {formatDate(selectedMusic?.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Last Updated: {formatDate(selectedMusic?.updatedAt)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Audio Preview</h4>
                <audio controls className="w-full">
                  <source src={selectedMusic?.uri} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        </div>
      )}

      <RejectionModal
        open={showRejectModal}
        title="Rejection Reason"
        reason={rejectionReason}
        text="this song"
        setReason={setRejectionReason}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason("");
          setRejectingMusicId(null);
        }}
        onSubmit={handleRejectSubmit}
        loading={loading}
      />
    </>
  );
};

export default MusicApproval;