import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Mail,
  Edit3,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  ShieldCheck,
  Activity,
  Globe,
} from "lucide-react";
import { AddMailbox } from "../../components/forms/AddMailbox";
import {
  createMailbox,
  deleteMailbox,
  fetchMailboxes,
  updateMailbox,
} from "../../redux/slices/mailboxSlice";
import { fetchDomains } from "../../redux/slices/domainSlice";
import ConfirmDelete from "../ConfirmDelete";
import Header from "../../components/ui/Header";
import StatCard from "../../components/ui/Stats";
import EmptyState from "../../components/ui/EmptyState";

function MailboxesPage() {
  const dispatch = useDispatch();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMailbox, setEditMailbox] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const mailboxes = useSelector((state) => state.mailbox?.list || []);
  const { domains } = useSelector((state) => state.domain);

  useEffect(() => {
    if (!domains) dispatch(fetchDomains());
  }, [dispatch]); // eslint-disable-line

  useEffect(() => {
    dispatch(fetchMailboxes());
  }, [dispatch]);

  // Create / Update mailbox
  const handleSaveMailbox = (formData) => {
    if (editMailbox) {
      dispatch(updateMailbox({ id: editMailbox.id, ...formData }));
    } else {
      dispatch(createMailbox(formData));
    }
    setShowCreateModal(false);
    setEditMailbox(null);
  };

  // Delete mailbox confirmed
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteMailbox(deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // Edit mailbox (open modal with pre-filled data)
  const handleEditMailbox = (mailbox) => {
    setEditMailbox(mailbox);
    setShowCreateModal(true);
  };

  const filteredMailboxes = (mailboxes || []).filter((mailbox) => {
    const q = (searchQuery || "").toLowerCase();
    return (
      mailbox.email?.toLowerCase().includes(q) ||
      mailbox.name?.toLowerCase().includes(q)
    );
  });

  // Status badge (ACTIVE, PENDING, INACTIVE)
  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: {
        color:
          "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      PENDING: {
        color:
          "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
      INACTIVE: {
        color:
          "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200",
        icon: AlertCircle,
      },
    };
    const config = statusConfig[status] || statusConfig.INACTIVE;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <IconComponent className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  // Stats (DomainPage style)
  const total = mailboxes.length;
  const active = mailboxes.filter((m) => m.status === "ACTIVE").length;
  const pending = mailboxes.filter((m) => m.status === "PENDING").length;
  const inactive = mailboxes.filter((m) => m.status === "INACTIVE").length;

  const stats = [
    {
      title: "Total Mailboxes", // trimmed
      count: total,
      description: "All accounts",
      icon: <Globe className="w-6 h-6 text-white" />,
      gradientFrom: "blue-500",
      gradientTo: "cyan-500",
    },
    {
      title: "Active",
      count: active,
      description: "Ready to use",
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      gradientFrom: "green-500",
      gradientTo: "emerald-500",
    },
    {
      title: "Pending",
      count: pending,
      description: "Awaiting setup",
      icon: <Clock className="w-6 h-6 text-white" />,
      gradientFrom: "yellow-500",
      gradientTo: "orange-500",
    },
    {
      title: "Inactive",
      count: inactive,
      description: "Disabled accounts",
      icon: <AlertCircle className="w-6 h-6 text-white" />,
      gradientFrom: "red-500",
      gradientTo: "pink-500",
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <Header
        setEditFormData={setEditMailbox}
        setShowForm={setShowCreateModal}
        subTitle=" Email Management System"
        title="  Mailbox Control Center"
        tagLine=" Effortlessly create, manage, and monitor your mailboxes with a
                  sleek, unified dashboard."
        btnName="Add New Mailbox"
      />

      <div className="flex flex-col gap-y-6">
        {/* Stats - glass cards like DomainPage */}
        {mailboxes?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        )}

        <div >
          {/* Search + count */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 " />
              <input
                type="text"
                placeholder="Search mailboxes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/30">
              <Activity className="w-4 h-4 text-blue-600" />
              {filteredMailboxes.length} of {mailboxes.length} mailboxes
            </div>
          </div>

          {/* Table Container - glass card like DomainPage */}
          <div className="bg-white/85 backdrop-blur-sm rounded-3xl shadow-lg border border-white/40 overflow-hidden">
            {filteredMailboxes.length === 0 ? (
              <EmptyState
                title="No Mailboxes Found"
                message="You haven't added any mailboxes yet. Add one to get started."
                buttonLabel="Add Your First Mailbox"
                onButtonClick={() => {
                  setEditMailbox(null);
                  setShowCreateModal(true);
                }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Mailbox
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMailboxes.map((mailbox) => {
                      const lastLoginAt = mailbox.lastLoginAt; // data unchanged
                      return (
                        <tr
                          key={mailbox.id}
                          className="hover:bg-blue-50/40 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center shadow-sm">
                                  <Mail className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900">
                                  {mailbox.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {mailbox.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(mailbox.status)}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {lastLoginAt
                              ? new Date(lastLoginAt).toLocaleDateString()
                              : "Never"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              {mailbox.emailAddress}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditMailbox(mailbox)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl transition"
                                title="Edit mailbox"
                              >
                                <Edit3 className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteTarget(mailbox)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl transition"
                                title="Delete mailbox"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Helper footer like DomainPage */}
                <div className="px-6 py-4 text-sm text-gray-600 bg-gray-50 border-t">
                  Tip: Ensure correct domain routing & DNS configuration to keep
                  mailbox status active.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AddMailbox
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditMailbox(null);
        }}
        onSubmit={handleSaveMailbox}
        initialData={
          editMailbox || { email: "", name: "", password: "", domains }
        }
      />

      {/* Confirm Delete Modal */}
      <ConfirmDelete
        isOpen={!!deleteTarget}
        domainName={deleteTarget?.name || deleteTarget?.email}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default MailboxesPage;
