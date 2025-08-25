import { useEffect, useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllReceivedMails,
  moveToTrash,
} from "../../redux/slices/mailSlice.js";
import MailList from "../../components/user/MailList.jsx";
import MailHeader from "../../components/user/MailHeader.jsx";
import { useLocation } from "react-router-dom";
import useMailSearchFilter from "../../Hook/useMailSearchFilter.js";
import { Send } from "lucide-react";

export default function InboxPage() {
  usePageTitle("Inbox");

  const dispatch = useDispatch();
  const mails = useSelector((state) =>
    Array.isArray(state.mail?.list) ? state.mail.list : []
  );
  const loading = useSelector((state) => state.mail?.isLoading);
  const [selectedMails, setSelectedMails] = useState(new Set());

  const {
    processedMails,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
  } = useMailSearchFilter(mails);

  useEffect(() => {
    dispatch(getAllReceivedMails());
  }, [dispatch]);

  const toggleSelect = (mailId) => {
    const newSelected = new Set(selectedMails);
    newSelected.has(mailId)
      ? newSelected.delete(mailId)
      : newSelected.add(mailId);
    setSelectedMails(newSelected);
  };

  const handleRefresh = () => {
    dispatch(getAllReceivedMails());
    setSelectedMails(new Set());
  };

  const currentPath = useLocation().pathname;

  const handleMoveTrash = () => {
    if (
      selectedMails.size > 0 &&
      confirm(`Delete ${selectedMails.size} selected emails?`)
    ) {
      dispatch(moveToTrash([...selectedMails, currentPath], currentPath));
      setSelectedMails(new Set());
    }
  };

  const toggleSelectAll = () => {
    if (selectedMails.size === mails.length && mails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(mails.map((m) => m.id)));
    }
  };

  return (
    <div className="space-y-6">
      <MailHeader
        icon={Send}
        name="Inbox"
        mails={mails}
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

      <div className="space-y-4">
        <MailList
          mails={processedMails}
          selectedMails={selectedMails}
          toggleSelect={toggleSelect}
          handleTrash={handleMoveTrash}
        />
      </div>
    </div>
  );
}
