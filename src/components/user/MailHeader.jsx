import {
  Send,
  RefreshCw,
  Trash2,
  Search,
  Filter,
  CheckSquare,
  Square,
} from "lucide-react";
import { useState } from "react";

export default function MailHeader({
  name,
  icon: Icon,
  mails = [],
  selectedMails,
  toggleSelectAll = () => {},
  handleRefresh = () => {},
  handleMoveTrash = () => {},
  isLoading = false,

  searchQuery = "",
  setSearchQuery = () => {},
  filterStatus = "ALL",
  setFilterStatus = () => {},
  sortOrder = "latest",
  setSortOrder = () => {},
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-blue-50/30 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-gray-300 shadow-xl shadow-blue-500/5">
      {/* Header Section */}
      <div className="flex flex-col space-y-3.5 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-8 ">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="relative p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-lg">
              {<Icon className="text-white" />}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent mb-1">
              {name}
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-slate-500 font-medium">
                {mails.length} emails found
              </p>
              {selectedMails.size > 0 && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/30">
                  {selectedMails.size} selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {selectedMails.size > 0 && (
            <button
              onClick={handleMoveTrash}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl shadow-lg hover:shadow-xl shadow-red-500/30 transition-all duration-300 hover:scale-105"
            >
              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">
                Delete ({selectedMails.size})
              </span>
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="group flex items-center gap-3 group px-6 py-3 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-100"
          >
            <RefreshCw
              className={`w-5 h-5 transition-transform duration-300 ${
                isLoading && "animate-spin"
              } group-hover:rotate-180`}
            />
            <span className="font-medium absolute hidden right-22 bg-blue-200 py-3 px-6 rounded-full sm:group-hover:block">
              Refresh
            </span>
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
          <div className="relative w-full">
            <Search className="absolute  left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search emails, recipients, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 focus:outline-none focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-slate-700 placeholder-slate-400 shadow-lg"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`group flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer font-medium hover:scale-100 ${
                showFilters
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-300 text-white shadow-blue-500/30"
                  : "bg-white/80 border-slate-200/50 text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-xl"
              }`}
            >
              <Filter
                className={`w-5 h-5 transition-transform duration-300 ${
                  showFilters ? "rotate-180" : "group-hover:rotate-12"
                }`}
              />
              Filter
            </button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-6 min-w-80 ">
                <div className="absolute -top-2 right-8 w-4 h-4 bg-white/95 border-l border-t border-white/40 rotate-45"></div>
                <div className="flex gap-6 w-full">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full p-3 border border-slate-200/50 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-200 text-slate-700 shadow-sm"
                    >
                      <option value="ALL">All Status</option>
                      <option value="SENT">Sent</option>
                      <option value="FAILED">Failed</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Sort
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full p-3 border border-slate-200/50 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-200 text-slate-700 shadow-sm"
                    >
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleSelectAll}
            className="group flex items-center gap-3 px-6 py-4 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 cursor-pointer font-medium hover:scale-100 text-xs sm:text-sm"
          >
            {selectedMails.size === mails.length && mails.length > 0 ? (
              <CheckSquare className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <Square className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            )}
            Select All
          </button>
        </div>
      </div>
    </div>
  );
}
