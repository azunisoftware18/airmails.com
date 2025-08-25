import React, { useEffect, useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
  User,
  Shield,
  Mail,
  Phone,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdmins } from "../../redux/slices/dashboardSlice";
import { toggleActiveAPI } from "../../redux/slices/authSlice";

const AdminTable = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  // ---- Safe selector ----
  const dashboardState = useSelector((state) => state.dashboard);
  const dashboardData = dashboardState?.dashboardData;
  const dataFromStore = dashboardData?.data ?? [];

  // ---- Local mirror for editing/optimistic updates ----
  const [admins, setAdmins] = useState(
    Array.isArray(dataFromStore) ? dataFromStore : []
  );
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [originalRow, setOriginalRow] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAdmins(Array.isArray(dataFromStore) ? dataFromStore : []);
  }, [dataFromStore]);

  const totalAdmins = useMemo(() => admins.length, [admins]);
  const totalActive = useMemo(
    () => admins.filter((a) => a?.isActive).length,
    [admins]
  );
  const totalPendingAuth = useMemo(
    () => admins.filter((a) => !a?.isAuthorized).length,
    [admins]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const dt = new Date(dateString);
    if (isNaN(dt.getTime())) return "-";
    return dt.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditStart = (admin) => {
    setEditingId(admin.id);
    setEditingValues({
      isActive: Boolean(admin.isActive),
      isAuthorized: Boolean(admin.isAuthorized),
    });
    setOriginalRow(admin);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingValues({});
    setOriginalRow(null);
  };

  const handleStatusChange = (field, value) => {
    setEditingValues((prev) => ({ ...prev, [field]: value }));
  };

  const toggleActive = async (id) => {
    dispatch(toggleActiveAPI(id));
  };

  const handleEditSave = async (adminId) => {
    if (!originalRow) return;

    const before = originalRow;
    const after = { ...before, ...editingValues };

    try {
      setSaving(true);

      // 1) Toggle isActive if changed
      if (before.isActive !== after.isActive) {
        await toggleActive(adminId);
      }

      // Optimistic local update (then refresh from server)
      setAdmins((list) =>
        list.map((a) =>
          a.id === adminId
            ? {
                ...a,
                isActive: after.isActive,
                isAuthorized: after.isAuthorized,
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );

      dispatch(fetchAdmins());
    } catch (err) {
      console.error(err);
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
      setEditingId(null);
      setEditingValues({});
      setOriginalRow(null);
    }
  };

  const StatusBadge = ({ status, type }) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    if (type === "active") {
      return (
        <span
          className={`${base} ${
            status
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {status ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : (
            <XCircle className="w-3 h-3 mr-1" />
          )}
          {status ? "Active" : "Inactive"}
        </span>
      );
    }
    if (type === "authorized") {
      return (
        <span
          className={`${base} ${
            status
              ? "bg-blue-100 text-blue-800 border border-blue-200"
              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
          }`}
        >
          <Shield className="w-3 h-3 mr-1" />
          {status ? "Authorized" : "Pending"}
        </span>
      );
    }
    // terms
    return (
      <span
        className={`${base} ${
          status
            ? "bg-purple-100 text-purple-800 border border-purple-200"
            : "bg-gray-100 text-gray-700 border border-gray-200"
        }`}
      >
        {status ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : (
          <XCircle className="w-3 h-3 mr-1" />
        )}
        {status ? "Accepted" : "Not Accepted"}
      </span>
    );
  };

  const EditableStatus = ({ admin, field, type }) => {
    const isEditing = editingId === admin.id;
    const currentValue = isEditing ? editingValues[field] : admin[field];

    if (!isEditing)
      return <StatusBadge status={Boolean(currentValue)} type={type} />;

    return (
      <select
        value={String(currentValue)}
        onChange={(e) => handleStatusChange(field, e.target.value === "true")}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={saving}
      >
        <option value="true">
          {type === "active" ? "Active" : "Authorized"}
        </option>
        <option value="false">
          {type === "active" ? "Inactive" : "Pending"}
        </option>
      </select>
    );
  };

  return (
    <div className="h-screen">
      {/* Header */}
      <div className="bg-white/40 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <User className="w-8 h-8 text-blue-600" />
                Admin Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage administrator accounts and permissions
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">
                    Total Admins
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {totalAdmins}
                  </p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-800">
                    {totalActive}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* desktop */}
      <div className="hidden xl:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Admin Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Authorization
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Terms
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Admin Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {admin.name}
                        </p>
                        <p className="text-xs text-gray-500">{admin.role}</p>
                        <p className="text-xs text-gray-400 font-mono">
                          {String(admin.id).slice(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {admin.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {admin.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <EditableStatus
                      admin={admin}
                      field="isActive"
                      type="active"
                    />
                  </td>

                  {/* Authorization */}
                  <td className="px-6 py-4 text-center">
                    <StatusBadge
                      status={Boolean(admin.termsAndConditions)}
                      type="authorized"
                    />
                  </td>

                  {/* Terms */}
                  <td className="px-6 py-4 text-center">
                    <StatusBadge
                      status={Boolean(admin.termsAndConditions)}
                      type="terms"
                    />
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="text-gray-900">
                          {formatDate(admin.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Updated:</span>
                        <p className="text-gray-900">
                          {formatDate(admin.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    {editingId === admin.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditSave(admin.id)}
                          disabled={saving}
                          className={`inline-flex items-center px-3 py-1 text-white text-xs font-medium rounded-md transition-colors duration-150 ${
                            saving
                              ? "bg-green-400"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleEditCancel}
                          disabled={saving}
                          className="inline-flex items-center px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-md hover:bg-gray-600 transition-colors duration-150"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditStart(admin)}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors duration-150"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile middscreen View - Cards */}
      <div className="xl:hidden space-y-4 sm:flex sm:space-x-10">
        {admins.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No admins found.
          </div>
        ) : (
          admins.map((admin) => (
            <div
              key={admin.id}
              className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 space-y-3 "
            >
             <div>
               {/* Admin Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {admin.name}
                  </p>
                  <p className="text-xs text-gray-500">{admin.role}</p>
                  <p className="text-xs text-gray-400 font-mono">
                    {String(admin.id).slice(0, 12)}...
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {admin.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {admin.phone}
                </div>
              </div>
             </div>

              <div>
                {/* Statuses */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex-1">
                    <p className="text-gray-500">Active Status</p>
                    <EditableStatus
                      admin={admin}
                      field="isActive"
                      type="active"
                    />
                  </div>
                  <div>
                    <p className="text-gray-500">Authorized</p>
                    <StatusBadge
                      status={Boolean(admin.termsAndConditions)}
                      type="authorized"
                    />
                  </div>
                  <div>
                    <p className="text-gray-500">Terms</p>
                    <StatusBadge
                      status={Boolean(admin.termsAndConditions)}
                      type="terms"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium text-gray-500">Created:</span>{" "}
                    {formatDate(admin.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Updated:</span>{" "}
                    {formatDate(admin.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="text-center">
                {editingId === admin.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditSave(admin.id)}
                      disabled={saving}
                      className={`flex justify-center items-center px-3 py-3 text-white text-xs font-medium rounded-md transition-colors duration-150 ${
                        saving
                          ? "bg-green-400 px-3 py-3"
                          : "bg-green-600 hover:bg-green-700 px-3 py-3"
                      }`}
                    >
                      <Save className="w-3 h-3 mr-1" />
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleEditCancel}
                      disabled={saving}
                      className="flex justify-center items-center px-3 py-3 bg-gray-500 text-white text-xs font-medium rounded-md hover:bg-gray-600 transition-colors duration-150"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditStart(admin)}
                    className=" w-full text-center py-3 px-3 flex justify-center items-center bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors duration-150"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit Status
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTable;
