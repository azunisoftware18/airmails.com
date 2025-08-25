import { useEffect, useState } from "react";
import {
  Server,
  Send,
  Inbox,
  HardDrive,
  Users,
  Clock,
  CalendarDays,
  Activity,
  TrendingUp,
  Mail,
  Database,
  Shield,
  Zap,
  RefreshCw,
} from "lucide-react";
import { getAlldashboardData } from "../redux/slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const dispatch = useDispatch();
  const fechedDashboardData = useSelector(
    (state) => state.dashboard.dashboardData || []
  );

  useEffect(() => {
    if (!fechedDashboardData) {
      dispatch(getAlldashboardData());
    }
  }, [dispatch, fechedDashboardData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardData({
        totalDomains: fechedDashboardData.totalDomains,
        totalMailboxes: fechedDashboardData.totalMailboxes,
        totalReceivedEmails: fechedDashboardData.totalReceivedEmails,
        totalSentEmails: fechedDashboardData.totalSentEmails,
        storageUsed: fechedDashboardData.storageUsed,
        recentDomains: fechedDashboardData.recentDomains,
        recentSentEmails: fechedDashboardData.recentSentEmails,
        recentReceivedEmails: fechedDashboardData.recentReceivedEmails,
      });
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const data = {
    totalDomains: 0,
    totalMailboxes: 0,
    totalReceivedEmails: 0,
    totalSentEmails: 0,
    storageUsed: 0,
    recentDomains: [],
    recentSentEmails: [],
    recentReceivedEmails: [],
    ...(dashboardData || {}),
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(getAlldashboardData());
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return "—";
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const formatBytes = (bytes) => {
    const b = typeof bytes === "number" && !isNaN(bytes) ? bytes : 0;
    if (b < 1024) return `${b} B`;
    else if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
    else if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
    else return `${(b / 1024 ** 3).toFixed(1)} GB`;
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = "blue",
    isLoading = false,
  }) => {
    const colorClasses = {
      blue: {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
        text: "text-blue-600",
        accent: "bg-blue-500",
        border: "border-blue-200/50",
        glow: "shadow-blue-100/50",
      },
      green: {
        bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
        text: "text-emerald-600",
        accent: "bg-emerald-500",
        border: "border-emerald-200/50",
        glow: "shadow-emerald-100/50",
      },
      purple: {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100/50",
        text: "text-purple-600",
        accent: "bg-purple-500",
        border: "border-purple-200/50",
        glow: "shadow-purple-100/50",
      },
      orange: {
        bg: "bg-gradient-to-br from-orange-50 to-orange-100/50",
        text: "text-orange-600",
        accent: "bg-orange-500",
        border: "border-orange-200/50",
        glow: "shadow-orange-100/50",
      },
      indigo: {
        bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50",
        text: "text-indigo-600",
        accent: "bg-indigo-500",
        border: "border-indigo-200/50",
        glow: "shadow-indigo-100/50",
      },
    };

    if (isLoading) {
      return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100/50 p-4 sm:p-6 animate-pulse backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-200 rounded-2xl p-3 w-12 h-12"></div>
            <div className="bg-gray-200 h-4 w-16 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-200 h-8 w-20 rounded"></div>
            <div className="bg-gray-200 h-4 w-32 rounded"></div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg ${colorClasses[color].glow} border ${colorClasses[color].border} p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-500 group relative overflow-hidden`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative ">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-2xl ${colorClasses[color].bg} ${colorClasses[color].border} border group-hover:scale-110 transition-all duration-500 shadow-sm`}
            >
              <Icon
                className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClasses[color].text}`}
              />
            </div>
            {trend && (
              <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200/50">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-semibold">+{trend}%</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
            </h3>
            <p className="text-gray-600 font-medium text-xs sm:text-sm">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DomainCard = ({ domain }) => (
    <div className="group relative bg-gradient-to-r from-white to-gray-50/50 rounded-2xl p-4 hover:from-blue-50 hover:to-indigo-50/50 border border-gray-100 hover:border-blue-200/50 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="p-3 bg-white rounded-xl shadow-sm border group-hover:border-blue-200/50 transition-all duration-300">
              <Server className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300 truncate">
              {domain?.name ?? "—"}
            </p>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{domain?.mailboxes ?? 0} mailboxes</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${
              domain?.status === "VERIFIED"
                ? "bg-emerald-100/80 text-emerald-800 border-emerald-200/50"
                : domain?.status === "PENDING"
                ? "bg-amber-100/80 text-amber-800 border-amber-200/50"
                : "bg-gray-100/80 text-gray-800 border-gray-200/50"
            }`}
          >
            {domain?.status === "VERIFIED" && (
              <Shield className="inline h-3 w-3 mr-1" />
            )}
            {domain?.status ?? "UNKNOWN"}
          </span>
          {/* <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button> */}
        </div>
      </div>
    </div>
  );

  const EmailCard = ({ email, type = "sent" }) => (
    <div className="group bg-gradient-to-r from-white to-gray-50/50 rounded-2xl p-4 hover:from-blue-50 hover:to-indigo-50/50 border border-gray-100 hover:border-blue-200/50 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start space-x-4">
        <div className="relative flex-shrink-0">
          <div className="p-3 bg-white rounded-xl shadow-sm border group-hover:border-blue-200/50 transition-all duration-300">
            {type === "sent" ? (
              <Send className="h-5 w-5 text-blue-600" />
            ) : (
              <Inbox className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div
            className={`absolute -top-1 -right-1 w-3 h-3 ${
              type === "sent" ? "bg-blue-400" : "bg-emerald-400"
            } rounded-full border-2 border-white`}
          ></div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300 truncate text-sm mb-1">
            {email?.subject ?? "(No subject)"}
          </h4>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {type === "sent"
                ? `To: ${email?.to ?? "—"}`
                : `From: ${email?.from ?? "—"}`}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 truncate bg-gray-100 px-2 py-1 rounded-full">
              {email?.mailbox ?? "—"}
            </span>
            <div className="flex items-center space-x-1 text-gray-400">
              <CalendarDays className="h-3 w-3" />
              <span>
                {formatDate(
                  type === "sent" ? email?.sentAt : email?.receivedAt
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button className="p-2 hover:bg-blue-100/50 rounded-lg transition-colors group/btn">
          <Eye className="h-4 w-4 text-gray-400 group-hover/btn:text-blue-600" />
        </button>
        <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div> */}
    </div>
  );

  const LoadingCard = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 animate-pulse overflow-hidden">
      <div className="p-6 border-b border-gray-100/50">
        <div className="bg-gray-200 h-6 w-32 rounded-full"></div>
      </div>
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="bg-gray-200 rounded-2xl w-14 h-14 flex-shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="bg-gray-200 h-4 w-3/4 rounded-full"></div>
              <div className="bg-gray-200 h-3 w-1/2 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Header */}
      <div className="relative ">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 sm:py-8">
            <div className="flex-1 lg:flex-none">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-lg hidden sm:block">
                Monitor your email infrastructure at a glance
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                className={`p-2 sm:p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 `}
              >
                <RefreshCw
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-600 ${
                    refreshing ? "animate-spin" : "hover:scale-110"
                  }`}
                />
              </button>

              {/* Status indicators */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-emerald-50/80 rounded-xl border border-emerald-200/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-emerald-800">
                    System Online
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-gray-50/80 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-sm border border-gray-200/50">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Updated </span>
                  <span>{formatDate(new Date().toISOString())}</span>
                </div>
              </div>

              {/* Mobile status indicator */}
              <div className="flex sm:hidden items-center space-x-2 px-3 py-2 bg-emerald-50/80 rounded-xl border border-emerald-200/50">
                <Activity className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative  py-4 space-y-8">
        {/* Stats Grid */}
        <div className="sm:grid flex flex-col sm:grid-cols-2  lg:grid-cols-3 sm:space-x-4 space-y-3 lg:gap-x-4 lg:gap-y-4">
          <StatCard
            icon={Server}
            title="Active Domains"
            value={data.totalDomains}
            subtitle="Email domains"
            trend="15"
            color="blue"
            isLoading={loading}
          />
          <StatCard
            icon={Users}
            title="Total Mailboxes"
            value={data.totalMailboxes}
            subtitle="Active accounts"
            trend="23"
            color="green"
            isLoading={loading}
          />
          <StatCard
            icon={Inbox}
            title="Received"
            value={data.totalReceivedEmails}
            subtitle="Incoming messages"
            trend="18"
            color="purple"
            isLoading={loading}
          />
          <StatCard
            icon={Send}
            title="Sent"
            value={data.totalSentEmails}
            subtitle="Outgoing messages"
            trend="27"
            color="orange"
            isLoading={loading}
          />
          <div className="col-span-2 sm:col-span-1">
            <StatCard
              icon={HardDrive}
              title="Storage Used"
              value={formatBytes(data.storageUsed)}
              subtitle="Total storage"
              color="indigo"
              isLoading={loading}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Domains */}
          {loading ? (
            <LoadingCard />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Server className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Recent Domains</span>
                  </h2>
                  {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1.5 hover:bg-blue-50 rounded-xl transition-all duration-300 flex items-center space-x-1">
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </button> */}
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4 max-h-96 overflow-y-auto">
                {data.recentDomains.map((domain) => (
                  <DomainCard
                    key={domain?.id ?? Math.random()}
                    domain={domain}
                  />
                ))}
                {!data.recentDomains.length && (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">
                      No domains configured yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Sent Emails */}
          {loading ? (
            <LoadingCard />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Send className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Recent Sent</span>
                  </h2>
                  {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1.5 hover:bg-blue-50 rounded-xl transition-all duration-300 flex items-center space-x-1">
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </button> */}
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4 max-h-96 overflow-y-auto">
                {data.recentSentEmails.map((email) => (
                  <EmailCard
                    key={email?.id ?? Math.random()}
                    email={email}
                    type="sent"
                  />
                ))}
                {!data.recentSentEmails.length && (
                  <div className="text-center py-8">
                    <Send className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">No sent emails yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Received Emails */}
          {loading ? (
            <LoadingCard />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <Inbox className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span>Recent Received</span>
                  </h2>
                  {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1.5 hover:bg-blue-50 rounded-xl transition-all duration-300 flex items-center space-x-1">
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </button> */}
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4 max-h-96 overflow-y-auto">
                {data.recentReceivedEmails.map((email) => (
                  <EmailCard
                    key={email?.id ?? Math.random()}
                    email={email}
                    type="received"
                  />
                ))}
                {!data.recentReceivedEmails.length && (
                  <div className="text-center py-8">
                    <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">
                      No received emails yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions - Mobile Only */}
        <div className="mt-8 lg:hidden">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">New Domain</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors">
                <Mail className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-900">Send Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
