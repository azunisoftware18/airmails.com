import { useEffect, useState } from "react";
import { X, Mail, AlertCircle, Loader } from "lucide-react";

export const AddMailbox = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    domainId: "",
    status: "ACTIVE",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialData?.emailAddress);
  // domains yahin se aa rahe — agar alag prop se aate hain to yahan replace kar dena
  const domains = initialData?.domains || [];

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      name: initialData?.name || "",
      email: initialData?.emailAddress || "",
      password: "", // edit pe blank
      domainId: initialData?.domainId || domains[0]?.id || "",
      status: initialData?.status || "ACTIVE",
    });
    setError("");
    setLoading(false);
  }, [initialData, isOpen]); // domains ko include nahi kiya to avoid loop

  if (!isOpen) return null;

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  const handleSubmit = async () => {
    setError("");

    if (!formData.name.trim()) return setError("Name is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (!isValidEmail(formData.email))
      return setError("Please enter a valid email");
    if (!isEdit && !formData.password.trim())
      return setError("Password is required");
    if (!formData.domainId.trim()) return setError("Please select a domain");

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (e) {
      setError("Failed to save mailbox. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !loading) handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop + theme blobs */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/25 to-purple-400/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/25 to-blue-400/25 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative  w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-40" />
              <div className="relative p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                <Mail className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                {isEdit ? "Edit Mailbox" : "Add New Mailbox"}
              </h2>
              <p className="text-sm text-gray-600">
                {isEdit
                  ? "Update mailbox details"
                  : "Create a new mailbox under this domain"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl border border-white/30 bg-white/60 hover:bg-white transition disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              onKeyDown={handleKey}
              placeholder="Enter mailbox name"
              disabled={loading}
              className={[
                "w-full rounded-2xl border-2 bg-white/70 px-4 py-3 outline-none transition-all duration-200",
                error && !formData.name.trim()
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20",
              ].join(" ")}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onKeyDown={handleKey}
              placeholder="user@example.com"
              disabled={loading}
              className={[
                "w-full rounded-2xl border-2 bg-white/70 px-4 py-3 outline-none transition-all duration-200",
                error && !isValidEmail(formData.email)
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20",
              ].join(" ")}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isEdit ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onKeyDown={handleKey}
              placeholder={
                isEdit
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
              disabled={loading}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white/70 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mailbox Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              disabled={loading}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white/70 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Domain
            </label>
            <select
              value={formData.domainId}
              onChange={(e) =>
                setFormData({ ...formData, domainId: e.target.value })
              }
              disabled={loading || isEdit}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white/70 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="">-- Select Domain --</option>

              {/* Edit mode fallback if domains empty */}
              {domains.length === 0 && formData.domainId && (
                <option value={formData.domainId}>
                  {formData.email?.split("@")[1] || "Unknown Domain"}
                </option>
              )}

              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/30 bg-white/60 rounded-b-3xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-2xl border border-gray-200 bg-white/70 text-gray-700 hover:bg-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 transition shadow-lg hover:shadow-2xl disabled:opacity-50"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <span className="relative inline-flex items-center gap-2">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Mailbox"
                : "Create Mailbox"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
