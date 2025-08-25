import { Link, useLocation } from "react-router-dom";
import {
  CheckSquare,
  Square,
  Clock,
  Eye,
  Reply,
  Forward,
  Trash2,
  Archive,
  Star,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addArchive,
  addStarred,
  moveToTrash,
  removeStarred,
} from "../../redux/slices/mailSlice";

export default function MailList({ mails = [], selectedMails, toggleSelect }) {
  const { openCompose } = useOutletContext();
  const dispatch = useDispatch();

  const [viewedMails, setViewedMails] = useState([]);

  const handleView = (id) => {
    setViewedMails((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleArchive = (mailId) => {
    dispatch(addArchive(mailId));
  };

  const currentPath = useLocation().pathname;

  const handleStarred = (mailId, currentlyStarred) => {
    if (!currentlyStarred) {
      dispatch(addStarred(mailId, currentPath));
    } else {
      dispatch(removeStarred(mailId));
    }
  };

  const handleSingleDelete = (mailId) => {
    if (!mailId) return;
    if (!confirm("Delete this email?")) return;
    dispatch(moveToTrash([mailId], currentPath));
    // remove from selected if present
    selectedMails.delete(mailId);
  };

  if (!mails || mails.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
        <h3 className="text-xl font-semibold text-slate-600 mb-2">
          No emails found
        </h3>
        <p className="text-slate-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  // 🔹 Utility functions
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const sumAttachmentSizes = (attachments) => {
    if (!attachments || attachments.length === 0) return "0 B";
    const totalBytes = attachments.reduce(
      (sum, att) => sum + (att.fileSize || 0),
      0
    );
    return formatFileSize(totalBytes);
  };

  const stringToColor = (str) => {
    if (!str) return "#6366f1";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f97316",
      "#10b981",
      "#06b6d4",
      "#f59e0b",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "SENT":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "DELETED":
        return "bg-red-100 text-red-700 border-red-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {mails.map((mail) => {
        const displayDate = (() => {
          const date = new Date(mail.sentAt || mail.receivedAt);
          if (isNaN(date)) return "No date";
          const now = new Date();
          if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            });
          }
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        })();

        return (
          <div
            key={mail.id}
            className={`relative bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 border transition-all duration-300 hover:-translate-y-1  
          ${selectedMails.has(mail.id)
                ? "border-purple-600 bg-blue-50/80"
                : "border-purple-300 hover:border-purple-200"
              }`}
          >
            {/* Left side indicator */}
            {selectedMails.has(mail.id) && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
            )}

            {/* ROW on Desktop | STACK on Mobile */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(mail.id)}
                className="mt-1 p-1 hover:bg-blue-100 rounded-lg transition-colors"
              >
                {selectedMails.has(mail.id) ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 hover:text-blue-500" />
                )}
              </button>

              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${stringToColor(
                    mail.toEmail || mail.fromEmail
                  )}, ${stringToColor(mail.toEmail || mail.fromEmail)}dd)`,
                }}
              >
                {(mail.toEmail || mail.fromEmail)?.[0]?.toUpperCase() || "U"}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 w-full">
                {/* Top Row (desktop inline, mobile stacked) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <h3 className="font-semibold text-slate-800 truncate">
                      {mail.toEmail
                        ? `To: ${mail.toEmail}`
                        : `From: ${mail.fromEmail}`}
                    </h3>
                    {mail.isRead === true && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-blue-50 text-blue-500 border-blue-200">
                        New
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-slate-500 text-sm md:ml-auto">
                    <Clock className="w-4 h-4" />
                    {displayDate}
                  </div>
                </div>

                {/* Subject */}
                <div
                  className="cursor-pointer group"
                  onClick={() => handleView(mail.id)}
                >
                  <h4 className="text-slate-800 font-medium group-hover:text-blue-600 transition-colors text-lg truncate">
                    {mail.subject || "No subject"}
                  </h4>
                </div>

                {/* Bottom Actions (mobile → stack, desktop → row) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 pt-3 border-t border-slate-100 gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/u/inbox/detail/${mail.id}`}
                      state={{ mailId: mail.id }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>

                    {!mail.deleted && (
                      <>
                        <button
                          onClick={() => openCompose("reply", mail)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition text-sm font-medium"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>

                        <button
                          onClick={() => openCompose("forward", mail)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition text-sm font-medium"
                        >
                          <Forward className="w-4 h-4" />
                          Forward
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleSingleDelete(mail.id)}
                      disabled={mail.deleted === true}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition text-sm font-medium
                    ${mail.deleted
                          ? "cursor-not-allowed bg-red-400 text-white"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {mail.deleted === true ? "Deleted" : "Delete"}
                    </button>
                  </div>

                  {/* Attachment size */}
                  <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg self-end md:self-auto">
                    {sumAttachmentSizes(mail.attachments)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

  );
}
