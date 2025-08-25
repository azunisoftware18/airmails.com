import React from "react";
import { Trash2, X } from "lucide-react";

const ConfirmDelete = ({ isOpen, onClose, onConfirm, domainName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs bg-opacity-40 flex items-center justify-center ">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">{domainName}</span>? 
          <br />This will also remove DNS records and delete the domain from SendGrid.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
