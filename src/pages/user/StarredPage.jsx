import { useEffect, useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";
import { getAllStarred, moveToTrash } from "../../redux/slices/mailSlice.js";
import { useDispatch, useSelector } from "react-redux";
import MailList from "../../components/user/MailList.jsx";
import MailHeader from "../../components/user/MailHeader.jsx";
import useMailSearchFilter from "../../Hook/useMailSearchFilter.js";
import { useLocation } from "react-router-dom";
import { Star } from "lucide-react";

export default function StarredPage() {
  usePageTitle("Starred");

  const [selectedMails, setSelectedMails] = useState(new Set());
  const toggleSelect = (mailId) => {
    const newSelected = new Set(selectedMails);
    if (newSelected.has(mailId)) {
      newSelected.delete(mailId);
    } else {
      newSelected.add(mailId);
    }
    setSelectedMails(newSelected);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllStarred());
  }, [dispatch]);

  const allStarredMails = useSelector((state) => state.mail?.list);
  const loading = useSelector((state) => state.mail?.isLoading);

  const {
    processedMails,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
  } = useMailSearchFilter(allStarredMails);


  // Toggle select all mails
  const toggleSelectAll = () => {
    if (selectedMails.size === allStarredMails.length && allStarredMails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(allStarredMails.map((m) => m.id)));
    }
  };


  // Refresh mails
  const handleRefresh = () => {
    dispatch(getAllStarred());
    setSelectedMails(new Set()); // reset selection
  };

  const currentPath = useLocation().pathname

  // Move selected mails to trash
  const handleMoveTrash = () => {
    if (selectedMails.size === 0) return;
    dispatch(moveToTrash([...selectedMails], currentPath)); // bulk move
    setSelectedMails(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <MailHeader
        name="Starred Mails"
        icon={Star}
        mails={allStarredMails}
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
      <MailList
        mails={processedMails}
        selectedMails={selectedMails}
        toggleSelect={toggleSelect}
      />
    </div>
  );
}
