import React from "react";
import {
  X,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Loader
} from "lucide-react";

const RejectionModal = ({
  open,
  onClose,
  onSubmit,
  title = "Reject Item",
  text,
  userName = "",
  reason,
  setReason,
  loading = false,
  confirmText = "Reject",
  cancelText = "Cancel"
}) => {
  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleSubmit = () => {
    if (!reason?.trim()) return;
    onSubmit();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {title}
              </h2>
            </div>

            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-600 mb-3">
            Are you sure you want to reject {text}{" "}
            <strong>{userName}</strong>?
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-700 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              This action cannot be undone.
            </p>
          </div>

          {/* Reason */}
          <label className="block text-gray-700 mb-2 font-medium">
            Rejection Reason <span className="text-red-500">*</span>
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none resize-none"
            placeholder="Enter rejection reason..."
          />

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={loading}
            >
              {cancelText}
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !reason?.trim()}
              className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  {confirmText}
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RejectionModal;