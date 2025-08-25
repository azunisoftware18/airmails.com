import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  Copy,
  Globe,
  Shield,
  ShieldAlert,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Activity,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react";
import AddDomain from "../../components/forms/AddDomain.jsx";
import {
  addDomain,
  deleteDomain,
  fetchDomains,
  updateDomain,
  verifyDomain,
} from "../../redux/slices/domainSlice.js";
import ConfirmDelete from "../ConfirmDelete.jsx";
import Header from "../../components/ui/Header.jsx";
import StatCard from "../../components/ui/Stats.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

function DomainsPage() {
  const dispatch = useDispatch();

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editDomainData, setEditDomainData] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);
  const [expandedDomains, setExpandedDomains] = useState(() => new Set());
  const [verificationTimer, setVerificationTimer] = useState({});
  const [verificationError, setVerificationError] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // NEW: we keep which domain is being verified + avoid re-trigger loops
  const [isVerifying, setIsVerifying] = useState({});
  const [attemptedOnce, setAttemptedOnce] = useState({});

  const domains = useSelector((state) => state.domain.domains || []);

  useEffect(() => {
    dispatch(fetchDomains());
  }, [dispatch]);

  const handleAddDomain = (data) => {
    if (editDomainData) {
      dispatch(updateDomain({ id: editDomainData.id, ...data }));
    } else {
      dispatch(addDomain(data));
    }
    setShowForm(false);
    setEditDomainData(null);
  };

  const handleCopy = (value, id) => {
    navigator.clipboard.writeText(String(value));
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const toggleDomainExpansion = (domainId) => {
    setExpandedDomains((prev) => {
      const s = new Set(prev);
      s.has(domainId) ? s.delete(domainId) : s.add(domainId);
      return s;
    });
  };

  const getDomainVerificationStatus = (domain) => {
    const list = Array.isArray(domain?.dnsRecords) ? domain.dnsRecords : [];
    const hasRecords = list.length > 0;
    if (!hasRecords) return { isVerified: false, hasRecords: false };
    const allVerified = list.every((r) => r?.isVerified === true);
    return { isVerified: allVerified, hasRecords: true };
  };

  const isWithin24h = (domainId) => {
    const timer = verificationTimer[domainId];
    return timer && Date.now() < timer;
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteDomain(deleteTarget.name));
      setDeleteTarget(null);
    }
  };

  // Stats
  const totalDomains = domains.length;
  const verifiedDomains = domains.filter(
    (d) => getDomainVerificationStatus(d).isVerified
  ).length;
  const activeDomains = domains.filter((d) => d.status === "active").length;
  const pendingDomains = domains.filter((d) => isWithin24h(d.id)).length;

  const stats = [
    {
      title: "Total Domains",
      count: totalDomains,
      description: "Registered domains",
      icon: <Globe className="w-6 h-6 text-white" />,
      gradientFrom: "blue-500",
      gradientTo: "cyan-500",
    },
    {
      title: "Verified",
      count: verifiedDomains,
      description: "DNS configured",
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      gradientFrom: "green-500",
      gradientTo: "emerald-500",
    },
    {
      title: "Active",
      count: activeDomains,
      description: "Currently active",
      icon: <Activity className="w-6 h-6 text-white" />,
      gradientFrom: "purple-500",
      gradientTo: "pink-500",
    },
    {
      title: "Pending",
      count: pendingDomains,
      description: "Verification pending",
      icon: <Clock className="w-6 h-6 text-white" />,
      gradientFrom: "orange-500",
      gradientTo: "red-500",
    },
  ];

  // DNS Status Badge (auto, no manual button)
  const renderDnsStatusPill = (domain) => {
    const { isVerified, hasRecords } = getDomainVerificationStatus(domain);
    const pendingWindow = isWithin24h(domain.id);
    const spinning = !!isVerifying[domain.id];

    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 relative group">
          <ShieldCheck size={14} />
          DNS Verified
          <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-normal text-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-1.5">
              <Info size={12} className="text-slate-500" />
              <span>All required DNS records are valid.</span>
            </div>
          </span>
        </span>
      );
    }

    if (spinning) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock size={14} />
          Checking DNS…
          <span className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent" />
        </span>
      );
    }

    if (hasRecords) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 relative group">
          <Clock size={14} />
          Waiting for DNS propagation
          {pendingWindow && (
            <span className="ml-1 text-[10px] opacity-70">
              (auto‑verify queued)
            </span>
          )}
          <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-normal text-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-1.5">
              <Info size={12} className="text-slate-500" />
              <span>Records detected. We’ll verify automatically.</span>
            </div>
          </span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 relative group">
        <ShieldAlert size={14} />
        DNS records missing
        <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-normal text-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1.5">
            <Info size={12} className="text-slate-500" />
            <span>Please add the required DNS records in your DNS panel.</span>
          </div>
        </span>
      </span>
    );
  };

  const renderDnsRecordsTable = (domain) => {
    const records = Array.isArray(domain?.dnsRecords) ? domain.dnsRecords : [];
    return (
      <div className="mt-4 overflow-x-auto rounded-2xl border-2 border-gray-200 bg-white/80">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Record Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Record Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                TTL (sec)
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record, index) => (
              <tr
                key={record.id || `${record.recordName}-${index}`}
                className="hover:bg-blue-50/40 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
                    {record.recordType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-900 break-all">
                      {record.recordName}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          record.recordName,
                          `name-${record.id || index}`
                        )
                      }
                      className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                      title="Copy name"
                    >
                      {copiedItem === `name-${record.id || index}` ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 max-w-[420px]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-900 break-all line-clamp-2">
                      {record.recordValue}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          record.recordValue,
                          `value-${record.id || index}`
                        )
                      }
                      className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                      title="Copy value"
                    >
                      {copiedItem === `value-${record.id || index}` ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-900">
                      {record.ttl}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          String(record.ttl),
                          `ttl-${record.id || index}`
                        )
                      }
                      className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                      title="Copy TTL"
                    >
                      {copiedItem === `ttl-${record.id || index}` ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {record.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck size={14} /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                      <ShieldAlert size={14} /> Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() =>
                      handleCopy(
                        `${record.recordType} ${record.recordName} ${record.recordValue} TTL=${record.ttl}`,
                        `all-${record.id || index}`
                      )
                    }
                    className="px-3 py-2 text-sm rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white font-semibold transition"
                    title="Copy row"
                  >
                    {copiedItem === `all-${record.id || index}`
                      ? "Copied"
                      : "Copy Row"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50 border-t">
          Tip: Add all records exactly the same way to your DNS provider.
          Propagation can take from a few minutes to a few hours.
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <Header
        setEditFormData={setEditDomainData}
        setShowForm={setShowForm}
        subTitle="Domain Management System"
        title="Domain Control Center"
        tagLine="Effortlessly manage your domains, verify DNS configurations, and monitor status with our advanced management platform."
        btnName="Add New Domain"
      />

      <div className="flex flex-col gap-y-6">
        {/* Stats */}
        {domains?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        )}

        {/* Domains Table */}
        {domains?.length === 0 ? (
          <EmptyState
            title="No Domains Yet"
            message="Start by adding your first domain to begin managing DNS configurations and monitoring status."
            buttonLabel="Add Your First Domain"
            onButtonClick={() => {
              setEditDomainData(null);
              setShowForm(true);
            }}
          />
        ) : (
          <div className="overflow-x-auto rounded-3xl border-2 border-white/40 bg-white/80 shadow-lg">
            <table className="min-w-[900px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Expand
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    DNS Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {domains.map((domain) => {
                  const isExpanded = expandedDomains.has(domain.id);
                  const errorMessage = verificationError[domain.id];
                  const recordsCount = Array.isArray(domain?.dnsRecords)
                    ? domain.dnsRecords.length
                    : 0;

                  return (
                    <React.Fragment key={domain.id}>
                      <tr className="hover:bg-blue-50/40 transition-colors overflow-auto">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleDomainExpansion(domain.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                            title={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                              <Globe className="w-4 h-4 text-white" />
                            </span>
                            <span className="font-semibold text-gray-900 break-all">
                              {domain.name}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(domain.name, `domain-${domain.id}`)
                              }
                              className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                              title="Copy domain"
                            >
                              {copiedItem === `domain-${domain.id}` ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                              domain.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                domain.status === "active"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              } animate-pulse`}
                            />
                            {domain.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {renderDnsStatusPill(domain)}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {recordsCount}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditDomainData(domain);
                                setShowForm(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl transition"
                            >
                              <Edit size={16} /> Edit
                            </button>

                            {/* Removed Re‑check DNS button (as requested) */}

                            <button
                              onClick={() => setDeleteTarget(domain)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl transition"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Error message row */}
                      {errorMessage && (
                        <tr>
                          <td colSpan={6} className="px-4 pb-3">
                            <div className="mt-2 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl">
                              <div className="flex items-center gap-2">
                                <AlertTriangle
                                  size={18}
                                  className="text-red-600"
                                />
                                <p className="text-sm font-medium text-red-700">
                                  {errorMessage}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Expanded DNS Records row */}
                      {isExpanded &&
                        Array.isArray(domain?.dnsRecords) &&
                        domain.dnsRecords.length > 0 && (
                          <tr className="bg-gradient-to-r from-gray-50/50 to-white/50">
                            <td colSpan={6} className="px-4 pb-6">
                              <div className="max-h-96 overflow-y-auto pr-2">
                                <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                      <AlertTriangle className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="font-semibold text-blue-800">
                                      DNS Configuration Guide
                                    </p>
                                  </div>
                                  <p className="text-sm text-blue-700">
                                    Copy these DNS records to your registrar
                                    (GoDaddy, Namecheap, Cloudflare, etc.) to
                                    verify ownership.
                                  </p>
                                </div>

                                {renderDnsRecordsTable(domain)}
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Domain Modal */}
      <AddDomain
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddDomain}
        initialData={editDomainData}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDelete
        isOpen={!!deleteTarget}
        domainName={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default DomainsPage;
