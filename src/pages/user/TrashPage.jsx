import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePageTitle from "../../components/usePageTitle.js";
import MailList from "../../components/user/MailList.jsx";
import MailHeader from "../../components/user/MailHeader.jsx";
import { getTrash, deleteMails } from "../../redux/slices/mailSlice.js";
import { useLocation, useNavigate } from "react-router-dom";
import useMailSearchFilter from "../../Hook/useMailSearchFilter.js";
import { DeleteIcon, Trash2 } from "lucide-react";

export default function TrashPage() {
  usePageTitle("Trash");
  const dispatch = useDispatch();

  const [selectedMails, setSelectedMails] = useState(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(getTrash());
  }, [dispatch]);
  const trashMails = useSelector((state) => state.mail.list || []);


  const loading = useSelector((state) => state.mail?.isLoading);

  const {
    processedMails,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
  } = useMailSearchFilter(trashMails);

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
    if (selectedMails.size === trashMails.length && trashMails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(trashMails.map((m) => m.id)));
    }
  };

  // Refresh mails
  const handleRefresh = () => {
    dispatch(getTrash());
    setSelectedMails(new Set());
    setRefreshKey((prev) => prev + 1);
  };

  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  // Empty selected mails
  const handleEmptyTrash = () => {
    if (selectedMails.size === 0) return;
    const data = dispatch(deleteMails([...selectedMails, currentPath]));
    setSelectedMails(new Set());
    if (data) {
      navigate("/u/trash");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <MailHeader
        name="Trash"
        icon={Trash2}

        mails={trashMails}
        selectedMails={selectedMails}
        toggleSelectAll={toggleSelectAll}
        handleRefresh={handleRefresh}
        handleMoveTrash={handleEmptyTrash}
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
