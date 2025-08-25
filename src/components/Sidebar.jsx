import {
  Inbox,
  Star,
  Send,
  Archive,
  Trash2,
  Settings,
  Mails,
  LayoutDashboard,
  Globe,
  Mailbox,
  CreditCard,
  Zap,
  X,
  Edit3,
  Shield,
  User,
  LogOut,
  MailboxIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser, logout } from "../redux/slices/authSlice.js";
import { newAllCountReceivedMails } from "../redux/slices/mailSlice.js";

export default function Sidebar({ sidebarOpen, setSidebarOpen, onCompose }) {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser.role === "USER") {
      dispatch(newAllCountReceivedMails());
    }
  }, [dispatch, currentUser]);

  const { newReceivedCount } = useSelector((state) => state.mail);

  const navItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      path: "/:role/dashboard",
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      icon: <Inbox className="w-5 h-5" />,
      label: "Inbox",
      path: "/:role/inbox",
      count: newReceivedCount,
      roles: ["USER"],
    },
    {
      icon: <Mails className="w-5 h-5" />,
      label: "All Mails",
      path: "/:role/all-mails",
      roles: ["USER"],
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Starred",
      path: "/:role/starred",
      roles: ["USER"],
    },
    {
      icon: <Send className="w-5 h-5" />,
      label: "Sent",
      path: "/:role/sent",
      roles: ["USER"],
    },
    {
      icon: <Archive className="w-5 h-5" />,
      label: "Archive",
      path: "/:role/archive",
      roles: ["USER"],
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      label: "Trash",
      path: "/:role/trash",
      roles: ["USER"],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Domains",
      path: "/:role/domains",
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      icon: <Mailbox className="w-5 h-5" />,
      label: "Mailboxes",
      path: "/:role/mailboxes",
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Billing",
      path: "/:role/billing",
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/:role/settings",
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "System Logs",
      path: "/:role/logs",
      roles: ["SUPER_ADMIN"],
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Admin Tools",
      path: "/:role/tools",
      roles: ["SUPER_ADMIN"],
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Testimonials",
      path: "/:role/testimonials",
      roles: ["SUPER_ADMIN"],
    },
    {
      icon: <MailboxIcon className="w-5 h-5" />,
      label: "Contact",
      path: "/:role/contact",
      roles: ["SUPER_ADMIN"],
    },
  ];

  const role = currentUser?.role?.toUpperCase().replace(" ", "_") || null;
  const location = useLocation();
  if (!role) return null;

  // Base path
  const basePath =
    role === "USER" ? "/u" : role === "ADMIN" ? "/admin" : "/superadmin";

  // Visible links
  const visibleLinks = navItems
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      path: item.path.includes(":role")
        ? item.path.replace(":role", basePath.replace("/", ""))
        : item.path,
    }));

  const superAdminItems = visibleLinks.filter(
    (item) => item.roles.length === 1 && item.roles[0] === "SUPER_ADMIN"
  );
  const regularItems = visibleLinks.filter(
    (item) => !superAdminItems.includes(item)
  );

  return (
    <aside
      className={[
        // glass + border + shadow (theme)
        "bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl z-10",
        "w-72 fixed top-0 left-0 h-screen",
        "transform transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:static lg:translate-x-0 lg:flex lg:flex-col",
      ].join(" ")}
    >
      {/* Header */}
      <div className="p-5 border-b border-white/30">
        <div className="flex items-center gap-3 ">
          <div className="relative">
            {/* <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 blur opacity-40" />
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"> */}
            {/* <Zap className="w-5 h-5 text-white" /> */}
            <img
              src="https://sdmntpraustraliaeast.oaiusercontent.com/files/00000000-c0d4-61fa-99d7-d202df47bb65/raw?se=2025-08-25T13%3A08%3A36Z&sp=r&sv=2024-08-04&sr=b&scid=7cd937fa-5d9b-507b-8625-0f2c8f4ecd8c&skoid=f8b66c09-1aa0-4801-9884-173c5cef2b8c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-24T23%3A56%3A52Z&ske=2025-08-25T23%3A56%3A52Z&sks=b&skv=2024-08-04&sig=W8AVh9nLDxy3fHmO36sQmCKrLMS47PPGuh0QV1s9CU4%3D"
              alt=""
              srcset=""
              className="w-8 h-8"
            />
            {/* </div> */}
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Airmails
          </h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-2 rounded-lg border border-white/30 bg-white/60 hover:bg-white/80 transition"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {role === "USER" && (
          <button
            onClick={onCompose}
            className="w-full mt-4 group relative inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 transition shadow-lg hover:shadow-2xl"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <span className="relative inline-flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Compose
            </span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <nav className="space-y-1">
          {regularItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              count={item.count}
              active={location.pathname.startsWith(item.path)}
              setSidebarOpen={setSidebarOpen}
            />
          ))}
        </nav>

        {superAdminItems.length > 0 && (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg border border-white/30 bg-white/60 text-xs font-semibold text-gray-600 mb-2">
              Super Admin
            </div>
            {superAdminItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={item.path}
                count={item.count}
                active={location.pathname.startsWith(item.path)}
                setSidebarOpen={setSidebarOpen}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer (Profile + Logout) */}
      <div className="p-4 border-t border-white/30  backdrop-blur-sm">
        {role === "USER" && (
          <Link
            to="/u/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white/70 transition"
            onClick={() => setSidebarOpen(false)}
          >
            <User className="w-4 h-4" />
            <span className="text-sm">Profile</span>
          </Link>
        )}

        <button
          onClick={() => dispatch(logout())}
          className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, path, active, count, setSidebarOpen }) {
  return (
    <Link
      to={path}
      onClick={() => setSidebarOpen(false)}
      className={[
        "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all",
        active
          ? "bg-gradient-to-r from-violet-100 to-blue-100 text-violet-800 border border-violet-200 shadow-sm"
          : "text-gray-700 hover:text-gray-900 hover:bg-white/70 border border-transparent",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "p-2 rounded-lg",
            active
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
              : "bg-gray-100 text-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-colors",
          ].join(" ")}
        >
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </div>

      {typeof count === "number" && (
        <span
          className={[
            "text-xs px-2 py-1 rounded-full",
            active
              ? "bg-violet-200 text-violet-800"
              : "bg-gray-100 text-gray-600",
          ].join(" ")}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
