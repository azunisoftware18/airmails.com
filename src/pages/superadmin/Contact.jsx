import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allContacts } from "../../redux/slices/homeSlice";
import Loading from "../../components/Loading";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Search,
  Filter,
  Archive,
  Trash2,
  Reply,
  Star,
  StarOff,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  MoreVertical,
} from "lucide-react";

function SuperAdminContactDashboard() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);

  useEffect(() => {
    dispatch(allContacts());
  }, [dispatch]);

  const { data: contacts, loading } = useSelector((state) => state.home);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };


  // Filter contacts based on search and status
  const filteredContacts =
    contacts?.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase());

     
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  // Calculate stats
  const totalContacts = contacts?.length || 0;

  const todayContacts =
    contacts?.filter((contact) => {
      const contactDate = new Date(contact.createdAt);
      const today = new Date();
      return contactDate.toDateString() === today.toDateString();
    }).length || 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <AlertCircle className="w-4 h-4" />;
      case "replied":
        return <CheckCircle className="w-4 h-4" />;
      case "archived":
        return <Archive className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Contact Messages
              </h1>
              <p className="text-gray-600">
                Manage and respond to customer inquiries
              </p>
            </div>
           
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Messages
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalContacts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-600 ml-1">vs last week</span>
            </div>
          </div>

         
          

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {todayContacts}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Messages today</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Messages ({filteredContacts.length})
            </h3>
          </div>

          {filteredContacts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => {

                const isExpanded = expandedMessage === contact.id;

                return (
                  <div
                    key={contact.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-semibold text-gray-900 truncate">
                                {contact.name}
                              </h4>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  status
                                )}`}
                              >
                                {getStatusIcon(status)}
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {contact.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {contact.phone}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-2">
                            Subject: {contact.subject}
                          </h5>
                          <p
                            className={`text-gray-700 leading-relaxed ${
                              isExpanded ? "" : "line-clamp-2"
                            }`}
                          >
                            {contact.message}
                          </p>
                          {contact.message.length > 150 && (
                            <button
                              onClick={() =>
                                setExpandedMessage(
                                  isExpanded ? null : contact.id
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {getTimeAgo(contact.createdAt)}
                          </span>
                          <div className="flex items-center gap-2">
                           
                            <button className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No contact messages received yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminContactDashboard;
