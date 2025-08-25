import React from "react";

function StatCard({
  title,
  count,
  description,
  icon,
  gradientFrom,
  gradientTo,
}) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity`}
          ></div>
          <div
            className={`relative p-3 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-xl`}
          >
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
