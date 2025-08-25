import { User } from "lucide-react";
import { useSelector } from "react-redux";

function Navbar({ setSidebarOpen }) {
  const { currentUserData } = useSelector((state) => state.auth);
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
      {/* Hamburger Button (Mobile Only) */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          aria-label="Open sidebar"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* App Name or Title */}
      <h1 className="text-lg font-bold text-gray-800 strong">Airmails</h1>

      {/* User Icon */}
      <div className="flex items-center gap-3 relative">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer text-white font-semibold uppercase">
          {currentUserData?.name?.charAt(0)}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
