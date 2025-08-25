import { useEffect, useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";
import { useDispatch, useSelector } from "react-redux";
import MailList from "../../components/user/MailList.jsx";
import MailHeader from "../../components/user/MailHeader.jsx";
import { getAllMails, moveToTrash } from "../../redux/slices/mailSlice.js";
import { useLocation } from "react-router-dom";
import useMailSearchFilter from "../../Hook/useMailSearchFilter.js";
import { Mail } from "lucide-react";

export default function AllMailsPage() {
  usePageTitle("All Mails");

  const dispatch = useDispatch();
  const allMails = useSelector((state) =>
    Array.isArray(state.mail?.list) ? state.mail.list : []
  );

  const loading = useSelector((state) => state.mail?.isLoading)

  const {
    processedMails,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
  } = useMailSearchFilter(allMails);

  const [selectedMails, setSelectedMails] = useState(new Set());

  // Fetch all mails
  useEffect(() => {
    dispatch(getAllMails());
  }, [dispatch]);

  // Toggle single mail selection
  const toggleSelect = (mailId) => {
    const newSelected = new Set(selectedMails);
    newSelected.has(mailId)
      ? newSelected.delete(mailId)
      : newSelected.add(mailId);
    setSelectedMails(newSelected);
  };

  // Toggle select all mails
  const toggleSelectAll = () => {
    if (selectedMails.size === allMails.length && allMails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(allMails.map((m) => m.id)));
    }
  };

  // Refresh mails
  const handleRefresh = () => {
    dispatch(getAllMails());
    setSelectedMails(new Set()); // reset selection
  };

  const currentPath = useLocation().pathname;

  // Move selected mails to trash
  const handleMoveTrash = () => {
    if (selectedMails.size === 0) return;
    dispatch(moveToTrash([...selectedMails], currentPath)); // bulk move
    setSelectedMails(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Mail Header */}
      <MailHeader
        name="All Mails"
        icon={Mail}
        mails={allMails}
        selectedMails={selectedMails}
        toggleSelectAll={toggleSelectAll}
        handleRefresh={handleRefresh}
        handleMoveTrash={handleMoveTrash}
        isLoading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Mail Cards */}
      <div className="space-y-4">
        <MailList
          mails={processedMails}
          selectedMails={selectedMails}
          toggleSelect={toggleSelect}
        />
      </div>
    </div>
  );
}
