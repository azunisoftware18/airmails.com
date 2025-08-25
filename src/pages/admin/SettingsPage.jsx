import React, { useEffect, useState } from "react";
import { Save, Key, User } from "lucide-react";
import ProfileModel from "../../components/forms/ProfileModel";
import { useSelector, useDispatch } from "react-redux";
import { changePassword, updateProfile } from "../../redux/slices/authSlice";
import PasswordModel from "../../components/forms/PasswordModel";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";

function SettingsPage() {
  const rawProfileData = useSelector((state) => state.auth?.currentUserData);
  const profileData = rawProfileData || {};

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setProfile({
      name: profileData?.name || "",
      email: profileData?.email || profileData?.emailAddress || "",
      phone: profileData?.phone || "",
      role: profileData?.role || "",
    });
  }, [
    profileData?.name,
    profileData?.email,
    profileData?.emailAddress,
    profileData?.phone,
    profileData?.role,
  ]);

  const handleSubmit = async (formData) => {
    try {
      if (activeTab === "password") {
        const res = await dispatch(changePassword(formData));
        const ok =
          res?.payload?.success === true ||
          res?.success === true ||
          res?.meta?.requestStatus === "fulfilled";

        if (ok) {
          navigate("/login");
        }
      } else {
        await dispatch(updateProfile(formData || profile));
      }
    } catch (e) {
      console.error("Settings submit error:", e);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    {
      id: "profile",
      name: "Profile",
      icon: <User size={18} />,
      description: "Manage your personal information",
    },
    {
      id: "password",
      name: "Security",
      icon: <Key size={18} />,
      description: "Update your password and security settings",
    },
  ];

  const initialLetter =
    (profileData?.name && profileData.name.trim()[0]?.toUpperCase()) || "U";
  const createdAtText = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString()
    : "—";

  return (
    <div className="relative  space-y-6">
      {/* Header */}
      <div className="flex justify-between lg:items-center flex-col lg:flex-row">
        <Header
          subTitle="Account Settings"
          title="Settings"
          tagLine="Manage your account settings and preferences"
        />

        {activeTab === "profile" && (
          <button
            className="group justify-center w-full lg:w-fit relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={() => handleSubmit(profile)}
          >
            <div className="absolute  inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <Save size={18} className="relative" />
            <span className="relative text-center">Save Profile</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden w-full">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50/60">
          <nav className="flex px-2 sm:px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 w-full px-3 sm:px-6 cursor-pointer border-b-2 font-medium text-sm flex items-center gap-3 transition-all duration-200 rounded-t-xl
                      ${
                        activeTab === tab.id
                          ? "border-purple-600 text-purple-700 bg-white"
                          : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-white/60"
                      }`}
              >
                {tab.icon}
                <div className="text-left">
                  <div>{tab.name}</div>
                  <div className="text-xs opacity-70 hidden sm:block">
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="sm:p-8">
          {activeTab === "profile" && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Preview card */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100 lg:w-[24rem] space-y-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 text-center">
                  Profile Preview
                </h4>

                <div className="flex items-center gap-4 flex-col">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow">
                    {initialLetter}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {profileData?.name || "Unnamed User"}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {profileData?.role || "USER"}
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-sm space-y-3">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {profileData?.email || profileData?.emailAddress || "—"}
                  </p>

                  {profileData?.role !== "USER" && (
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {profileData?.phone || "—"}
                    </p>
                  )}

                  {profileData?.isActive === true && (
                    <p>
                      <span className="font-medium">Account Status:</span>{" "}
                      Active
                    </p>
                  )}

                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {createdAtText}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="w-full p-4">
                <ProfileModel
                  profileDataUpdate={profile}
                  onProfileChange={handleProfileChange}
                />
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Change Password
                </h3>
                <p className="text-gray-600">
                  Update your password to keep your account secure.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <PasswordModel onSubmit={handleSubmit} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
