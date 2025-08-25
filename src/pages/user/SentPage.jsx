import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSentMails, moveToTrash } from "../../redux/slices/mailSlice";
import MailHeader from "../../components/user/MailHeader";
import MailList from "../../components/user/MailList";
import { useLocation } from "react-router-dom";
import useMailSearchFilter from "../../Hook/useMailSearchFilter";
import { Send } from "lucide-react";

export default function SentPage() {
  const dispatch = useDispatch();

  const [selectedMails, setSelectedMails] = useState(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(getAllSentMails());
  }, [dispatch]);
  const sentMails = useSelector((state) =>
    Array.isArray(state.mail?.list) ? state.mail.list : []
  );
  const loading = useSelector((state) => state.mail?.isLoading);

  const {
    processedMails,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
  } = useMailSearchFilter(sentMails);

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
    if (selectedMails.size === sentMails.length && sentMails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(sentMails.map((m) => m.id)));
    }
  };

  // Refresh mails
  const handleRefresh = () => {
    dispatch(getAllSentMails());
    setSelectedMails(new Set());
    setRefreshKey((prev) => prev + 1);
  };

  const currentPath = useLocation().pathname;
  // Move selected mails to trash
  const handleMoveTrash = () => {
    if (
      selectedMails.size > 0 &&
      confirm(`Delete ${selectedMails.size} selected emails?`)
    ) {
      dispatch(moveToTrash([...selectedMails], currentPath));
      setSelectedMails(new Set());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <MailHeader
        icon={Send}
        name="Sent Mail"
        mails={sentMails}
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

      {/* Mail List */}
      <div key={refreshKey} className="space-y-4">
        <MailList
          mails={processedMails}
          selectedMails={selectedMails}
          toggleSelect={toggleSelect}
        />
      </div>
    </div>
  );
}
