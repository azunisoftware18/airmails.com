import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Globe,
  Mail,
  CheckCircle,
  Users,
  Eye,
  Plus,
  Filter,
  X,
  Calendar,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { allDataGet } from "../../redux/slices/dashboardSlice";

function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allDataGet());
  }, [dispatch]);

  // Expecting shape: state.dashboard.dashboardData = { data, loading?, error? }
  const { data, loading, error } = useSelector(
    (state) => state.dashboard?.dashboardData || {}
  );

  // SAFE defaults aligned to your API sample
  const adminsData = useMemo(
    () =>
      data && typeof data === "object"
        ? data
        : { totalAdmins: 0, admins: [], page: 1, limit: 10 },
    [data]
  );

  const adminsArray = Array.isArray(adminsData.admins) ? adminsData.admins : [];

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSubscriptionStatus = (subscription) => {
    if (!subscription)
      return {
        status: "No Subscription",
        color: "text-gray-600",
        bg: "bg-gray-100 border-gray-200",
        dot: "bg-gray-400",
      };
    if (subscription.isActive)
      return {
        status: "Active",
        color: "text-emerald-700",
        bg: "bg-emerald-50 border-emerald-200",
        dot: "bg-emerald-500",
      };
    return {
      status: "Expired",
      color: "text-red-700",
      bg: "bg-red-50 border-red-200",
      dot: "bg-red-500",
    };
  };

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case "BASIC":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PREMIUM":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "FREE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getInitials = (name = "") => {
    const safe = String(name).trim();
    if (!safe) return "AD";
    return safe
      .split(" ")
      .filter(Boolean)
      .map((n) => n.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const categories = useMemo(
    () => [
      {
        id: "all",
        name: "All Admins",
        count: adminsData?.totalAdmins ?? adminsArray.length,
        icon: Users,
      },
      {
        id: "active",
        name: "Active",
        count: adminsArray.filter((a) => a?.lastSubscription?.isActive).length,
        icon: CheckCircle,
      },
      {
        id: "inactive",
        name: "Inactive",
        count: adminsArray.filter(
          (a) => a?.lastSubscription && !a?.lastSubscription?.isActive
        ).length,
        icon: Activity,
      },
      {
        id: "basic",
        name: "Basic Plan",
        count: adminsArray.filter((a) => a?.lastSubscription?.plan === "BASIC")
          .length,
        icon: CreditCard,
      },
      {
        id: "premium",
        name: "Premium Plan",
        count: adminsArray.filter(
          (a) => a?.lastSubscription?.plan === "PREMIUM"
        ).length,
        icon: TrendingUp,
      },
    ],
    [adminsArray, adminsData?.totalAdmins]
  );

  // Filtered admins (safe)
  const filteredAdmins = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return adminsArray.filter((admin) => {
      const name = String(admin?.name || "").toLowerCase();
      const email = String(admin?.email || "").toLowerCase();
      const id = String(admin?.id || "").toLowerCase();

      const matchesSearch =
        name.includes(q) || email.includes(q) || id.includes(q);

      let matchesCategory = true;
      if (activeCategory === "active")
        matchesCategory = !!admin?.lastSubscription?.isActive;
      else if (activeCategory === "inactive")
        matchesCategory =
          admin?.lastSubscription && !admin?.lastSubscription?.isActive;
      else if (activeCategory === "basic")
        matchesCategory = admin?.lastSubscription?.plan === "BASIC";
      else if (activeCategory === "premium")
        matchesCategory = admin?.lastSubscription?.plan === "PREMIUM";

      return matchesSearch && matchesCategory;
    });
  }, [adminsArray, searchTerm, activeCategory]);

  // Simple loading / error states (optional)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          Failed to load admins. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Modern Header with Glassmorphism */}
      <div className=" bg-white/50 border-b border-gray-200/90 rounded-2xl ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4 flex-col px-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Admin Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage administrators and their subscriptions
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 ">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 "
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search admins..."
                  className="w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Statistics Cards with Modern Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 sm:grid-cols-2 md:grid-cols-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Admins
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                  {adminsData?.totalAdmins ?? adminsArray.length}
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl lg:text-3xl font-bold text-emerald-600 mt-1">
                  {
                    adminsArray.filter((a) => a?.lastSubscription?.isActive)
                      .length
                  }
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  All systems online
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Domains</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-600 mt-1">
                  {adminsArray.reduce(
                    (sum, admin) => sum + (admin?.totalDomains || 0),
                    0
                  )}
                </p>
                <p className="text-xs text-purple-600 font-medium mt-1">
                  Across all accounts
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe size={20} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mailboxes</p>
                <p className="text-2xl lg:text-3xl font-bold text-orange-600 mt-1">
                  {adminsArray.reduce(
                    (sum, admin) => sum + (admin?.totalMailboxes || 0),
                    0
                  )}
                </p>
                <p className="text-xs text-orange-600 font-medium mt-1">
                  Total configured
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Mail size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Filter Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filter Admins</h3>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter size={20} />
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 ${
              showMobileFilters ? "block" : "hidden lg:grid"
            }`}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 border ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 shadow-md"
                      : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activeCategory === category.id
                          ? "bg-blue-100"
                          : "bg-gray-200"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          activeCategory === category.id
                            ? "text-blue-600"
                            : "text-gray-600"
                        }
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-lg font-bold">{category.count}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modern Admin Cards for Mobile, Table for Desktop */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Admin List ({filteredAdmins.length})
            </h2>
          </div>

          {/* Loading skeleton (optional) */}
          {loading && <div className="p-6 text-gray-500">Loading admins…</div>}

          {/* Mobile Card View */}
          {!loading && (
            <div className="lg:hidden space-y-4 p-4">
              {filteredAdmins.map((admin) => {
                const subscriptionStatus = getSubscriptionStatus(
                  admin?.lastSubscription
                );
                return (
                  <div
                    key={admin?.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(admin?.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {admin?.name || "—"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {admin?.email || "—"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowAdminModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Domains</p>
                        <p className="font-bold text-gray-900">
                          {admin?.totalDomains ?? 0}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Mailboxes</p>
                        <p className="font-bold text-gray-900">
                          {admin?.totalMailboxes ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${subscriptionStatus.dot}`}
                        ></div>
                        <span className="text-xs font-medium">
                          {subscriptionStatus.status}
                        </span>
                      </div>
                      {admin?.lastSubscription && (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPlanBadgeColor(
                            admin?.lastSubscription?.plan
                          )}`}
                        >
                          {admin?.lastSubscription?.plan}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Desktop Table View */}
          {!loading && (
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAdmins.map((admin) => {
                    const subscriptionStatus = getSubscriptionStatus(
                      admin?.lastSubscription
                    );
                    return (
                      <tr
                        key={admin?.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                              {getInitials(admin?.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {admin?.name || "—"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {admin?.email || "—"}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">
                                {String(admin?.id || "").substring(0, 12)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${subscriptionStatus.bg} ${subscriptionStatus.color}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${subscriptionStatus.dot}`}
                              ></div>
                              {subscriptionStatus.status}
                            </div>
                            {admin?.lastSubscription && (
                              <div
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg border ${getPlanBadgeColor(
                                  admin?.lastSubscription?.plan
                                )}`}
                              >
                                {admin?.lastSubscription?.plan}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Domains:</span>
                              <span className="font-medium">
                                {admin?.totalDomains ?? 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mailboxes:</span>
                              <span className="font-medium">
                                {admin?.totalMailboxes ?? 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Emails:</span>
                              <span className="font-medium">
                                {(admin?.totalSentEmails || 0) +
                                  (admin?.totalReceivedEmails || 0)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {formatDate(admin?.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setShowAdminModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!filteredAdmins.length && (
                <div className="p-6 text-center text-gray-500">
                  No admins found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modern Modal */}
      {showAdminModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(selectedAdmin?.name)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedAdmin?.name || "—"}
                    </h2>
                    <p className="text-gray-600">
                      {selectedAdmin?.email || "—"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedAdmin?.totalDomains ?? 0}
                  </p>
                  <p className="text-sm text-blue-700">Domains</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center">
                  <Mail className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-900">
                    {selectedAdmin?.totalMailboxes ?? 0}
                  </p>
                  <p className="text-sm text-emerald-700">Mailboxes</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">
                    {selectedAdmin?.totalSentEmails ?? 0}
                  </p>
                  <p className="text-sm text-purple-700">Sent</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                  <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-900">
                    {selectedAdmin?.totalReceivedEmails ?? 0}
                  </p>
                  <p className="text-sm text-orange-700">Received</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users size={20} />
                    Basic Information
                  </h3>

                  {/* Basic Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name</span>
                      <span className="font-medium text-gray-900">
                        {selectedAdmin?.name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium text-gray-900">
                        {selectedAdmin?.email || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg font-medium">
                        {selectedAdmin?.role || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admin ID</span>
                      <span className="font-mono text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded">
                        {selectedAdmin?.id || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedAdmin?.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Mailboxes */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Mail size={18} className="text-gray-600" />
                      Mailboxes
                    </h3>

                    {Array.isArray(selectedAdmin?.mailboxNames) && (
                      <ul className="list-disc list-inside space-y-1">
                        {selectedAdmin.mailboxNames.map((mailbox, idx) => (
                          <li key={idx} className="text-gray-700">
                            {mailbox}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Subscription Details */}
                {selectedAdmin?.lastSubscription ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard size={20} />
                      Subscription Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Plan</span>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-lg border ${getPlanBadgeColor(
                            selectedAdmin?.lastSubscription?.plan
                          )}`}
                        >
                          {selectedAdmin?.lastSubscription?.plan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Billing</span>
                        <span className="font-medium text-gray-900">
                          {selectedAdmin?.lastSubscription?.billingCycle}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                            getSubscriptionStatus(
                              selectedAdmin?.lastSubscription
                            ).bg
                          } ${
                            getSubscriptionStatus(
                              selectedAdmin?.lastSubscription
                            ).color
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              getSubscriptionStatus(
                                selectedAdmin?.lastSubscription
                              ).dot
                            }`}
                          ></div>
                          {
                            getSubscriptionStatus(
                              selectedAdmin?.lastSubscription
                            ).status
                          }
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Until</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(selectedAdmin?.lastSubscription?.endDate)}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-indigo-200">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Usage Limits
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Domains</span>
                              <span className="font-medium">
                                {selectedAdmin?.totalDomains ?? 0}/
                                {selectedAdmin?.lastSubscription?.maxDomains ??
                                  0}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    Math.min(
                                      ((selectedAdmin?.totalDomains || 0) /
                                        (selectedAdmin?.lastSubscription
                                          ?.maxDomains || 1)) *
                                        100,
                                      100
                                    ) || 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mailboxes</span>
                              <span className="font-medium">
                                {selectedAdmin?.totalMailboxes ?? 0}/
                                {selectedAdmin?.lastSubscription
                                  ?.maxMailboxes ?? 0}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    Math.min(
                                      ((selectedAdmin?.totalMailboxes || 0) /
                                        (selectedAdmin?.lastSubscription
                                          ?.maxMailboxes || 1)) *
                                        100,
                                      100
                                    ) || 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Emails Sent</span>
                              <span className="font-medium">
                                {selectedAdmin?.totalSentEmails ?? 0}/
                                {selectedAdmin?.lastSubscription
                                  ?.maxSentEmails ?? 0}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    Math.min(
                                      ((selectedAdmin?.totalSentEmails || 0) /
                                        (selectedAdmin?.lastSubscription
                                          ?.maxSentEmails || 1)) *
                                        100,
                                      100
                                    ) || 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Storage</span>
                              <span className="font-medium">
                                {selectedAdmin?.lastSubscription
                                  ?.storageUsedMB ?? 0}
                                MB/
                                {(
                                  (selectedAdmin?.lastSubscription
                                    ?.allowedStorageMB ?? 0) / 1024 || 0
                                ).toFixed(1)}
                                GB
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    ((selectedAdmin?.lastSubscription
                                      ?.storageUsedMB || 0) /
                                      (selectedAdmin?.lastSubscription
                                        ?.allowedStorageMB || 1)) *
                                      100 || 0,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedAdmin?.lastSubscription?.paymentId && (
                        <div className="pt-4 border-t border-indigo-200">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Payment Information
                          </h4>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Payment Status
                              </span>
                              <span className="font-medium text-emerald-600">
                                {selectedAdmin?.lastSubscription?.paymentStatus}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Provider</span>
                              <span className="font-medium">
                                {
                                  selectedAdmin?.lastSubscription
                                    ?.paymentProvider
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment ID</span>
                              <span className="font-mono text-xs">
                                {selectedAdmin?.lastSubscription?.paymentId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order ID</span>
                              <span className="font-mono text-xs">
                                {
                                  selectedAdmin?.lastSubscription
                                    ?.razorpayOrderId
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Active Subscription
                    </h3>
                    <p className="text-gray-600 mb-4">
                      This admin doesn't have an active subscription plan.
                    </p>
                  </div>
                )}
              </div>

              {/* Domains Section */}
              {Array.isArray(selectedAdmin?.domainNames) &&
                selectedAdmin.domainNames.filter(Boolean).length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe size={20} />
                      Connected Domains
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedAdmin.domainNames
                        .filter((domain) => domain)
                        .map((domain, index) => (
                          <div
                            key={`${domain}-${index}`}
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 hover:shadow-md transition-shadow"
                          >
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">
                              {domain}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Email Activity */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail size={20} />
                  Email Activity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Emails Sent</span>
                      <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedAdmin?.totalSentEmails ?? 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total outbound messages
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Emails Received</span>
                      <Activity size={16} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedAdmin?.totalReceivedEmails ?? 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total inbound messages
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsPage;
