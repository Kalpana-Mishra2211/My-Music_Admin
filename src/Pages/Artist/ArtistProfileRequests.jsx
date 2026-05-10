// pages/ArtistProfileRequests.jsx
import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  X,
  Loader,
  Users,
  FileText,
  ArrowLeftRight
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';
import { getProfileApprovalList, approveArtist, rejectArtist } from "../../API/approval/artistApproval";
import RejectionModal from "../../UI/RejectionModal";
import { formatDate, searchAndFilter } from "../../utils/helpers";
import { handleApprove, handleReject } from "../../utils/handleDelete";

const ArtistProfileRequests = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showComparison, setShowComparison] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingArtist, setRejectingArtist] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const { profileApprovalList, loading } = useSelector((store) => store.artistApproval);

  useEffect(() => {
    dispatch(getProfileApprovalList());
  }, [dispatch]);

  const getChangedFieldsList = (artist) => {
    const changes = [];
    
    if (artist?.artistProfile?.stageName !== artist?.artistProfilePending?.stageName) {
      changes.push('Stage Name');
    }
    if (artist?.artistProfile?.phoneNumber !== artist?.artistProfilePending?.phoneNumber) {
      changes.push('Phone Number');
    }
    if (artist?.artistProfile?.bio !== artist?.artistProfilePending?.bio) {
      changes.push('Bio');
    }
    if (JSON.stringify(artist?.artistProfile?.genre) !== JSON.stringify(artist?.artistProfilePending?.genre)) {
      changes.push('Genres');
    }
    if (artist?.artistProfile?.profileImage !== artist?.artistProfilePending?.profileImage) {
      changes.push('Profile Image');
    }
    if (JSON.stringify(artist?.artistProfile?.socialLinks) !== JSON.stringify(artist?.artistProfilePending?.socialLinks)) {
      changes.push('Social Links');
    }
    
    return changes;
  };

  const getChangedFields = (current, pending) => {
    const changes = [];
    
    if (current?.stageName !== pending?.stageName) {
      changes.push({ field: 'Stage Name', current: current?.stageName, pending: pending?.stageName });
    }
    if (current?.bio !== pending?.bio) {
      changes.push({ field: 'Bio', current: current?.bio, pending: pending?.bio });
    }
    if (JSON.stringify(current?.genre) !== JSON.stringify(pending?.genre)) {
      changes.push({ field: 'Genres', current: current?.genre?.join(', '), pending: pending?.genre?.join(', ') });
    }
    if (current?.phoneNumber !== pending?.phoneNumber) {
      changes.push({ field: 'Phone Number', current: current?.phoneNumber, pending: pending?.phoneNumber });
    }
    if (current?.profileImage !== pending?.profileImage) {
      changes.push({ field: 'Profile Image', current: 'Current Image', pending: 'New Image' });
    }
    if (JSON.stringify(current?.socialLinks) !== JSON.stringify(pending?.socialLinks)) {
      changes.push({ field: 'Social Links', current: 'Current Links', pending: 'Updated Links' });
    }
    
    return changes;
  };

    const handleApproveClick = (artist) => {
      handleApprove({
        dispatch,
        id:artist._id,
        action: approveArtist,
        title: "Approve Profile Update?",
        text: `Are you sure you want to approve the profile update for ${artist.userName}`,
        successText: "Song approved successfully ✅"
      });
    };
  



  const handleRejectModel = (artist) => {
    setRejectingArtist(artist);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  

  const submitReject = async () => {
    if (!rejectionReason.trim()) return;
   handleReject({
        dispatch,
        id: rejectingArtist._id,
        reason: rejectionReason,
        action: rejectArtist,
        title: "Reject Update?",
        text: "Are you sure you want to reject this update?",
        successText: `Profile update for ${rejectingArtist.userName} has been rejected`,
        afterSuccess: () => {
          setShowRejectModal(false);
          setRejectionReason("");
          setRejectingArtist(null);
        },
      });

  };

  const handleViewRequest = (artist) => {
    setSelectedRequest(artist);
    setShowComparison(false);
    setShowModal(true);
  };

  const filteredRequests = searchAndFilter(
      profileApprovalList,
      searchTerm,
      ["userName", "email"],
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pending requests...</p>
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
              <RefreshCw className="w-7 h-7 text-orange-600" />
              Profile Update Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage artist profile update requests</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 px-4 py-2 rounded-lg flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-600 font-medium">{filteredRequests.length} Pending Requests</span>
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
                placeholder="Search by artist name, email, or stage name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <button
              onClick={() => dispatch(getProfileApprovalList())}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No pending profile update requests</p>
                      <p className="text-gray-400 text-xs mt-1">All artist profiles are up to date</p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((artist) => {
                    const currentProfile = artist.artistProfile;
                    const pendingProfile = artist.artistProfilePending;
                    const changes = getChangedFields(currentProfile, pendingProfile);
                    
                    return (
                      <tr key={artist._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img 
                              src={currentProfile?.profileImage} 
                              alt={artist.userName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{artist.userName}</p>
                              <p className="text-sm text-gray-500">{artist.email}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {changes.map((change, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
                                <ArrowLeftRight className="w-3 h-3" />
                                {change.field}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(artist.updatedAt)}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewRequest(artist)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Review Request"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApproveClick(artist)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectModel(artist)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

      
        </div>
      </div>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-800">Review Profile Update Request</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className={`text-xs px-3 py-1 rounded-full transition flex items-center gap-1 ${
                    showComparison 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  {showComparison ? 'Hide Comparison' : 'Show Comparison'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <img
                  src={selectedRequest.artistProfile?.profileImage}
                  alt={selectedRequest.userName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-100"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedRequest.userName}</h3>
                  <p className="text-sm text-gray-500">{selectedRequest.email}</p>
                  <div className="mt-1 flex gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      <Clock className="w-3 h-3" />
                      Pending Review
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      <FileText className="w-3 h-3" />
                      Profile Update Request
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  The following fields have been modified and are waiting for your review:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getChangedFieldsList(selectedRequest).map((field, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white text-blue-600 rounded-full border border-blue-200">
                      <ArrowLeftRight className="w-3 h-3" />
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-purple-600" />
                  Changes Overview
                </h3>
                
                {selectedRequest.artistProfile?.stageName !== selectedRequest.artistProfilePending?.stageName && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Stage Name</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-1">Current Value</p>
                        <p className="text-sm text-gray-600">{selectedRequest.artistProfile.stageName || "N/A"}</p>
                      </div>
                      <div className="p-4 bg-green-50">
                        <p className="text-xs text-gray-400 mb-1">Requested Change</p>
                        <p className="text-sm font-medium text-green-700">{selectedRequest.artistProfilePending.stageName || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.artistProfile?.phoneNumber !== selectedRequest.artistProfilePending?.phoneNumber && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Phone Number</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-1">Current Value</p>
                        <p className="text-sm text-gray-600">{selectedRequest.artistProfile.phoneNumber || "N/A"}</p>
                      </div>
                      <div className="p-4 bg-green-50">
                        <p className="text-xs text-gray-400 mb-1">Requested Change</p>
                        <p className="text-sm font-medium text-green-700">{selectedRequest.artistProfilePending.phoneNumber || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.artistProfile?.bio !== selectedRequest.artistProfilePending?.bio && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Bio</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-1">Current Value</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedRequest.artistProfile.bio || "N/A"}</p>
                      </div>
                      <div className="p-4 bg-green-50">
                        <p className="text-xs text-gray-400 mb-1">Requested Change</p>
                        <p className="text-sm font-medium text-green-700 whitespace-pre-wrap">{selectedRequest.artistProfilePending.bio || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {JSON.stringify(selectedRequest.artistProfile?.genre) !== JSON.stringify(selectedRequest.artistProfilePending?.genre) && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Genres</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-1">Current Value</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedRequest.artistProfile.genre?.length > 0 ? (
                            selectedRequest.artistProfile.genre.map((g, i) => (
                              <span key={i} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                {g}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-green-50">
                        <p className="text-xs text-gray-400 mb-1">Requested Change</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedRequest.artistProfilePending.genre?.length > 0 ? (
                            selectedRequest.artistProfilePending.genre.map((g, i) => (
                              <span key={i} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                {g}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.artistProfile?.profileImage !== selectedRequest.artistProfilePending?.profileImage && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Profile Image</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-1">Current Value</p>
                        <img 
                          src={selectedRequest.artistProfile.profileImage }
                          alt="Current"
                          className="w-20 h-20 rounded-full object-cover border border-gray-200"
                        />
                      </div>
                      <div className="p-4 bg-green-50">
                        <p className="text-xs text-gray-400 mb-1">Requested Change</p>
                        <img 
                          src={selectedRequest.artistProfilePending.profileImage }
                          alt="Requested"
                          className="w-20 h-20 rounded-full object-cover border-2 border-green-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {JSON.stringify(selectedRequest.artistProfile?.socialLinks) !== JSON.stringify(selectedRequest.artistProfilePending?.socialLinks) && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Social Links</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-1">Current Value</p>
                        <div className="space-y-2">
                          {selectedRequest.artistProfile.socialLinks?.instagram && (
                            <p className="text-sm"><span className="text-gray-500">Instagram:</span> {selectedRequest.artistProfile.socialLinks.instagram}</p>
                          )}
                          {selectedRequest.artistProfile.socialLinks?.youtube && (
                            <p className="text-sm"><span className="text-gray-500">YouTube:</span> {selectedRequest.artistProfile.socialLinks.youtube}</p>
                          )}
                          {selectedRequest.artistProfile.socialLinks?.spotify && (
                            <p className="text-sm"><span className="text-gray-500">Spotify:</span> {selectedRequest.artistProfile.socialLinks.spotify}</p>
                          )}
                          {selectedRequest.artistProfile.socialLinks?.twitter && (
                            <p className="text-sm"><span className="text-gray-500">Twitter:</span> {selectedRequest.artistProfile.socialLinks.twitter}</p>
                          )}
                          {!selectedRequest.artistProfile.socialLinks?.instagram && 
                           !selectedRequest.artistProfile.socialLinks?.youtube && 
                           !selectedRequest.artistProfile.socialLinks?.spotify && 
                           !selectedRequest.artistProfile.socialLinks?.twitter && (
                            <p className="text-sm text-gray-500">No social links added</p>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-green-50">
                        <p className="text-xs text-gray-400 mb-1">Requested Change</p>
                        <div className="space-y-2">
                          {selectedRequest.artistProfilePending.socialLinks?.instagram && (
                            <p className="text-sm"><span className="text-gray-500">Instagram:</span> <span className="text-green-700">{selectedRequest.artistProfilePending.socialLinks.instagram}</span></p>
                          )}
                          {selectedRequest.artistProfilePending.socialLinks?.youtube && (
                            <p className="text-sm"><span className="text-gray-500">YouTube:</span> <span className="text-green-700">{selectedRequest.artistProfilePending.socialLinks.youtube}</span></p>
                          )}
                          {selectedRequest.artistProfilePending.socialLinks?.spotify && (
                            <p className="text-sm"><span className="text-gray-500">Spotify:</span> <span className="text-green-700">{selectedRequest.artistProfilePending.socialLinks.spotify}</span></p>
                          )}
                          {selectedRequest.artistProfilePending.socialLinks?.twitter && (
                            <p className="text-sm"><span className="text-gray-500">Twitter:</span> <span className="text-green-700">{selectedRequest.artistProfilePending.socialLinks.twitter}</span></p>
                          )}
                          {!selectedRequest.artistProfilePending.socialLinks?.instagram && 
                           !selectedRequest.artistProfilePending.socialLinks?.youtube && 
                           !selectedRequest.artistProfilePending.socialLinks?.spotify && 
                           !selectedRequest.artistProfilePending.socialLinks?.twitter && (
                            <p className="text-sm text-gray-500">No social links added</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {getChangedFieldsList(selectedRequest).length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-yellow-700">No changes detected in this request</p>
                    <p className="text-sm text-yellow-600 mt-1">The pending profile is identical to the current profile</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <RejectionModal
        open={showRejectModal}
        title="Reject Profile Update"
        userName={rejectingArtist?.userName}
        reason={rejectionReason}
        setReason={setRejectionReason}
        text="update for"
        onClose={() => {
          setShowRejectModal(false);
          setRejectingArtist(null);
          setRejectionReason("");
        }}
        onSubmit={submitReject}
        loading={rejectLoading}
      />
    </>
  );
};

export default ArtistProfileRequests;