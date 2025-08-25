function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur border border-white/30 shadow-lg">
        <span className="h-3 w-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span className="text-sm font-semibold text-gray-700">Loading…</span>
      </div>
    </div>
  );
}

export default Loading;
