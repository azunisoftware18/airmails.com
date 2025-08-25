import React from "react";

function ButtonField({ onSubmit, onClose, submitLabel, closeLabel, loading }) {
  const baseClass =
    "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      {onClose && closeLabel && (
        <button
          onClick={onClose}
          className={`${baseClass} `}
          disabled={loading}
        >
          {loading ? `${submitLabel}...` : closeLabel}
        </button>
      )}
      <button
        onClick={onSubmit}
        className={`${baseClass} bg-blue-600 hover:bg-blue-700 text-white font-semibold `}
        disabled={loading}
      >
        {loading ? `${submitLabel}...` : submitLabel}
      </button>
    </>
  );
}

export default ButtonField;
