import React from "react";
import { X } from "lucide-react";

const RejectModal = ({
  open,
  title = "Reject Request",
  userName,
  reason,
  setReason,
  onCancel,
  onSubmit,
  loading = false
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">

        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-600 mb-2">
            Reason for rejecting{" "}
            <span className="font-semibold text-gray-800">
              {userName || "this request"}
            </span>
          </p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full border rounded-lg p-3 h-28 focus:ring-2 focus:ring-red-400 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={!reason?.trim() || loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;