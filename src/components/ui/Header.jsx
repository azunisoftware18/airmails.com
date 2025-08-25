import { Plus, ExternalLink } from "lucide-react";

function Header({
  setEditFormData,
  setShowForm,
  subTitle,
  title,
  tagLine,
  btnName,
}) {
  return (
    <div className="mb-12">
      <div className="flex flex-col  lg:flex-row lg:justify-between lg:items-center gap-6">
        {/* Left Section */}
        <div
          className={`space-y-4 ${
            title == "Settings" && " "
          }`}
        >
          {subTitle && (
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-lg">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">
                {subTitle}
              </span>
            </div>
          )}

          {title && (
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              {title}
            </h1>
          )}

          {tagLine && (
            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              {tagLine}
            </p>
          )}
        </div>

        {/* Right Section (Button) */}
        {btnName && (
          <button
            onClick={() => {
              if (typeof setEditFormData === "function") setEditFormData(null);
              if (typeof setShowForm === "function") setShowForm(true);
            }}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative flex items-center gap-3 justify-center w-full">
              <Plus
                size={22}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              <span>{btnName}</span>
              <ExternalLink
                size={18}
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
