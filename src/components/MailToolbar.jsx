import React from "react";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
} from "lucide-react";

function MailToolbar({ onRefresh }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Left Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200">
          <Square className="w-4 h-4" />
          <span className="text-sm">Select all</span>
        </button>

        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Right Info */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">1–50 of 179 conversations</span>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MailToolbar;
