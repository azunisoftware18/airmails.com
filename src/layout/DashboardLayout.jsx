import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom"; // removed unused Navigate
import { useState } from "react";
import SentEmailForm from "../components/forms/SentEmailForm";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeMode, setComposeMode] = useState("new"); // new | reply | forward
  const [selectedMail, setSelectedMail] = useState(null);

  const userEmail = useSelector(
    (state) => state.auth.currentUserData?.emailAddress
  );
  const loading = useSelector((state) => state.mail.isLoading);

  const openCompose = (mode = "new", mail = null) => {
    setComposeMode(mode);
    setSelectedMail(mail);
    setIsComposeOpen(true);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar (glass inside the component) */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onCompose={() => openCompose("new")}
      />

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[9] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        <main className=" flex-1 grid grid-rows-[1fr_auto] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
          {/* Background Blobs */}
          <div className="pointer-events-none  inset-0">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-cyan-400/20 to-blue-300/20 rounded-full blur-3xl" />
          </div>

          <div className="overflow-y-auto p-6 sm:p-8">
            {/* Loading overlay (glass chip) */}
            {loading && <Loading />}

            <Outlet context={{ openCompose }} />
            {/* Footer (always bottom of main) */}
            <div className=" mt-7">
              <Footer />
            </div>
          </div>
        </main>

        {/* Compose modal */}
        {isComposeOpen && (
          <SentEmailForm
            onClose={() => setIsComposeOpen(false)}
            userEmail={userEmail}
            initialData={selectedMail || {}}
            mode={composeMode}
          />
        )}
      </div>
    </div>
  );
}
