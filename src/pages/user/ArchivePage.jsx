import { Archive, ArchiveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";
import { getAllArchive, moveToTrash } from "../../redux/slices/mailSlice.js";
import { useDispatch, useSelector } from "react-redux";
import MailList from "../../components/user/MailList.jsx";
import MailToolbar from "../../components/MailToolbar.jsx";
import MailHeader from "../../components/user/MailHeader.jsx";
import { useLocation } from "react-router-dom";
import useMailSearchFilter from "../../Hook/useMailSearchFilter.js";

export default function ArchivePage() {
  const [selectedMails, setSelectedMails] = useState(new Set());

  const dispatch = useDispatch();
  

  usePageTitle("archive");

  useEffect(() => {
    dispatch(getAllArchive());
  }, [dispatch,]);
  const allArchiveMails = useSelector((state) => state.mail?.list || []);
  const loading = useSelector((state) => state.mail?.isLoading);

  const {
    processedMails,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
  } = useMailSearchFilter(allArchiveMails);

  const toggleSelect = (mailId) => {
    setSelectedMails((prev) => {
      const newSet = new Set(prev);
      newSet.has(mailId) ? newSet.delete(mailId) : newSet.add(mailId);
      return newSet;
    });
  };


  // Toggle select all mails
  const toggleSelectAll = () => {
    if (selectedMails.size === allArchiveMails.length && allArchiveMails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(allArchiveMails.map((m) => m.id)));
    }
  };

  // Refresh mails
  const handleRefresh = () => {
    dispatch(getAllArchive());
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
        icon={ArchiveIcon}
        name="Archive Mails"
        mails={allArchiveMails}
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
