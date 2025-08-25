import React from "react";

function ProfileModel({ profileDataUpdate, onProfileChange }) {
  const value = (k) => profileDataUpdate?.[k] ?? "";

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={value("name")}
          onChange={(e) => onProfileChange("name", e.target.value)}
          placeholder="Enter full name"
          className="w-full rounded-2xl border-2 border-gray-200 bg-white/70 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={value("email")}
          onChange={(e) => onProfileChange("email", e.target.value)}
          placeholder="user@example.com"
          autoComplete="email"
          className="w-full rounded-2xl border-2 border-gray-200 bg-white/70 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
        />
        <p className="mt-1 text-xs text-gray-500">
          We’ll use this for notifications and login.
        </p>
      </div>

      {/* Phone (hide for USER) */}
      {profileDataUpdate?.role !== "USER" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={value("phone")}
            onChange={(e) => onProfileChange("phone", e.target.value)}
            placeholder="e.g. 9876543210"
            className="w-full rounded-2xl border-2 border-gray-200 bg-white/70 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
          />
        </div>
      )}

      {/* Role (read-only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            value={value("role")}
            disabled
            onChange={(e) => onProfileChange("role", e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-200 bg-white/60 px-4 py-3 outline-none disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            <option value={value("role")}>{value("role") || "N/A"}</option>
          </select>
          
        </div>
      </div>
    </div>
  );
}

export default ProfileModel;
