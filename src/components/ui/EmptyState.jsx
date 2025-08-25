import { Plus } from "lucide-react";

function EmptyState({ icon, title, message, buttonLabel, onButtonClick }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 shadow-xl">
      <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>

      {onButtonClick && (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
        >
          <Plus size={20} />
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
