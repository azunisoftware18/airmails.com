import React, { useState, useEffect } from "react";
import { X, Globe, AlertCircle, Loader } from "lucide-react";

function AddDomain({ isOpen, onClose, onSubmit, initialData }) {
  const [domainName, setDomainName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDomainName(initialData?.name || "");
    setError("");
    setLoading(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateDomain = (name) => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/; // hyphen safe
    return domainRegex.test(name.trim());
  };

  const handleSubmit = async () => {
    setError("");
    if (!domainName.trim()) return setError("Domain name is required");
    if (!validateDomain(domainName))
      return setError("Please enter a valid domain name");

    setLoading(true);
    try {
      await onSubmit({ name: domainName.trim() });
      setDomainName("");
      onClose();
    } catch (err) {
      setError("Failed to save domain. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0  flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop + blobs */}
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
                <Globe className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                {initialData ? "Edit Domain" : "Add New Domain"}
              </h2>
              <p className="text-sm text-gray-600">
                {initialData
                  ? "Update your domain settings"
                  : "Add a domain to your account"}
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Domain Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="example.com"
                disabled={loading}
                autoFocus
                className={[
                  "w-full rounded-2xl border-2 bg-white/70 px-4 py-3 pr-10 outline-none transition-all duration-200",
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20",
                ].join(" ")}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              )}
            </div>

            {error ? (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Enter your domain without protocol (e.g.,{" "}
                <span className="font-mono">example.com</span>, not{" "}
                <span className="font-mono">https://example.com</span>)
              </p>
            )}
          </div>

          {/* Valid formats card (glass) */}
          <div className="p-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-cyan-50/80">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Valid formats
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              {["example.com"].map(
                (ex) => (
                  <li key={ex} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span className="font-mono">{ex}</span>
                  </li>
                )
              )}
            </ul>
          </div>
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
            disabled={loading || !domainName.trim()}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 transition shadow-lg hover:shadow-2xl disabled:opacity-50"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <span className="relative inline-flex items-center gap-2">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading
                ? initialData
                  ? "Updating..."
                  : "Adding..."
                : initialData
                ? "Update Domain"
                : "Add Domain"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddDomain;
