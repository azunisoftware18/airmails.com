import { Suspense, useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Download,
  FileText,
  CheckCircle,
  DollarSign,
  Calendar,
  Plus,
  Crown,
  Shield,
  Zap,
  AlertCircle,
  Activity,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrRenewSubscriptionAction,
  createRazorpayOrder,
  getMySubscription,
} from "../../redux/slices/subscriptionSlice";
import Header from "../../components/ui/Header";
import StatCard from "../../components/ui/Stats";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { processPaidSubscription } from "../../components/razorpay";

function currency(n) {
  if (typeof n !== "number") return n;
  return `₹${n.toFixed(2)}`;
}

export default function BillingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subscription: subscriptionData } = useSelector(
    (state) => state.subscribe ?? { subscription: null, loading: false }
  );
  const userData = useSelector((state) => state.auth.currentUserData ?? {});

  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(getMySubscription());
  }, [dispatch]);

  // --- Date helpers (UTC-only to avoid timezone off-by-one) ---
  const toUTCDateOnly = (d) => {
    if (!d) return null;
    const x = new Date(d);
    if (isNaN(x)) return null;
    return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()));
  };

  // Days left until next billing/endDate
  const daysLeft = useMemo(() => {
    const end = subscriptionData?.endDate ? toUTCDateOnly(subscriptionData.endDate) : null;
    const today = toUTCDateOnly(new Date());
    if (!end || !today) return null;
    return Math.ceil((end - today) / 86400000); // ms per day
  }, [subscriptionData?.endDate]);

  useEffect(() => {
    if (!subscriptionData) return;

    const sub = subscriptionData;

    // SAFE: invoices may be empty
    const firstInvoice = sub.invoices?.[0];
    const price =
      (sub.plan === "BASIC" || sub.plan === "PREMIUM")
        ? (firstInvoice?.amount ?? 0)
        : 0;

    const storageGb = sub.allowedStorageMB
      ? (sub.allowedStorageMB / 1024).toFixed(1)
      : 1;

    setSubscription({
      plan: sub.plan,
      price,
      billing: sub.billingCycle?.toLowerCase() || "monthly",
      nextBilling: sub.endDate
        ? new Date(sub.endDate).toLocaleDateString()
        : "N/A",
      status: sub.isActive ? "active" : "inactive",
      features: [
        `${sub.maxMailboxes || 0} Mailboxes`,
        `${sub.maxDomains || 0} Domains`,
        `${sub.maxSentEmails || 0} Sent Emails`,
        `${sub.maxReceivedEmails || 0} Received Emails`,
        `${storageGb} GB Storage`,
        `Payment via ${sub.paymentProvider || "Unknown"}`,
      ].filter(Boolean),
    });

    // Latest first + normalized status
    const sorted = [...(sub.invoices || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setInvoices(
      sorted.map((inv) => ({
        id: inv.invoiceId,
        date: inv.createdAt,
        description: `${sub.plan} Plan`,
        period: `${new Date(sub.startDate).toLocaleDateString()} - ${new Date(
          sub.endDate
        ).toLocaleDateString()}`,
        amount: inv.amount,
        status: String(inv.status || "").trim().toLowerCase(),
      }))
    );
  }, [subscriptionData]);

  // Latest invoice gating for renew
  const latestInvoiceStatus = (invoices?.[0]?.status || "").trim().toLowerCase();
  const canRenewLatest = ["pending", "unpaid", "overdue"].includes(latestInvoiceStatus);

  // Renew CTA if within 10 days OR the latest invoice needs action
  const showRenewCTA = useMemo(() => {
    const withinWindow = typeof daysLeft === "number" && daysLeft <= 10;
    return withinWindow || canRenewLatest;
  }, [daysLeft, canRenewLatest]);

  const totalDue = useMemo(
    () =>
      invoices
        .filter((i) => i.status === "overdue")
        .reduce((s, i) => s + i.amount, 0),
    [invoices]
  );
  const paidCount = useMemo(
    () => invoices.filter((i) => i.status === "paid").length,
    [invoices]
  );
  const overdueCount = useMemo(
    () => invoices.filter((i) => i.status === "overdue").length,
    [invoices]
  );

  function getStatusColor(status) {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  }
  function getStatusIcon(status) {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "overdue":
        return <AlertCircle className="h-3.5 w-3.5" />;
      default:
        return <FileText className="h-3.5 w-3.5" />;
    }
  }
  function getPlanIcon(plan) {
    switch (plan) {
      case "PREMIUM":
        return <Crown className="h-6 w-6 text-purple-500" />;
      case "BASIC":
        return <Shield className="h-6 w-6 text-blue-500" />;
      default:
        return <Zap className="h-6 w-6 text-gray-500" />;
    }
  }
  function getPlanGradient(plan) {
    switch (plan) {
      case "PREMIUM":
        return "bg-gradient-to-br from-purple-500 to-pink-500";
      case "BASIC":
        return "bg-gradient-to-br from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  }

  const formatINR = (n) =>
    `INR ${(Number(n) || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const parseAmount = (v) => {
    if (v === null || v === undefined) return 0;
    const s = String(v).replace(/[^\d.-]/g, "");
    const num = Number(s);
    return Number.isFinite(num) ? num : 0;
  };

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  const handleDownloadInvoice = async (invoice = {}, userData = {}) => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
        compress: true,
      });

      // THEME
      const theme = {
        primary: { r: 41, g: 128, b: 185 },
        bgSoft: { r: 246, g: 248, b: 252 },
        cardBg: { r: 250, g: 251, b: 253 },
        border: { r: 226, g: 232, b: 240 },
        text: { r: 20, g: 24, b: 33 },
        muted: { r: 108, g: 117, b: 125 },
        success: { r: 34, g: 197, b: 94 },
        warning: { r: 245, g: 158, b: 11 },
        danger: { r: 239, g: 68, b: 68 },
      };

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const M = 40;

      // BG
      doc.setFillColor(theme.bgSoft.r, theme.bgSoft.g, theme.bgSoft.b);
      doc.rect(0, 0, pageW, pageH, "F");

      // Header band
      doc.setFillColor(255, 255, 255);
      doc.rect(M, M, pageW - M * 2, 110, "F");

      // Logo
      try {
        const logo = await loadImage("/assets/azzunque-logo.png");
        doc.addImage(logo, "PNG", M + 20, M + 20, 110, 45);
      } catch {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(theme.primary.r, theme.primary.g, theme.primary.b);
        doc.text("AZZUNIQUE", M + 20, M + 50);
      }

      // Company
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(theme.primary.r, theme.primary.g, theme.primary.b);
      doc.text("Azzunique Software Private Limited", M + 140, M + 36);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(theme.muted.r, theme.muted.g, theme.muted.b);
      doc.text("Create trust", M + 140, M + 56);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(theme.text.r, theme.text.g, theme.text.b);
      doc.text("INVOICE", pageW - M - 130, M + 46);

      // Status pill
      const status = (invoice.status || "Pending").toString().toLowerCase();
      const pillColor =
        status === "paid"
          ? theme.success
          : status === "unpaid"
          ? theme.danger
          : theme.warning;
      const pillW = 90,
        pillH = 24,
        pillX = pageW - M - 130,
        pillY = M + 58;
      doc.setFillColor(pillColor.r, pillColor.g, pillColor.b);
      doc.roundedRect(pillX, pillY, pillW, pillH, 12, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(
        status.charAt(0).toUpperCase() + status.slice(1),
        pillX + pillW / 2,
        pillY + 16,
        { align: "center" }
      );

      // divider
      doc.setDrawColor(theme.border.r, theme.border.g, theme.border.b);
      doc.setLineWidth(1);
      doc.line(M, M + 120, pageW - M, M + 120);

      // ----- BILL TO -----
      const leftCardX = M;
      const leftCardY = M + 140;
      const leftCardW = (pageW - M * 3) * 0.5;
      const leftCardH = 120;

      doc.setFillColor(theme.cardBg.r, theme.cardBg.g, theme.cardBg.b);
      doc.roundedRect(leftCardX, leftCardY, leftCardW, leftCardH, 10, 10, "F");
      doc.setDrawColor(theme.border.r, theme.border.g, theme.border.b);
      doc.roundedRect(leftCardX, leftCardY, leftCardW, leftCardH, 10, 10, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(theme.text.r, theme.text.g, theme.text.b);
      doc.text("Bill To", leftCardX + 16, leftCardY + 24);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const billLines = [
        userData?.name || "Client Name",
        userData?.email || "client@email.com",
        userData?.phone || "+91-XXXXXXXXXX",
      ];
      let ty = leftCardY + 46;
      billLines.forEach((l) => {
        doc.text(String(l), leftCardX + 16, ty);
        ty += 16;
      });

      // ----- INVOICE DETAILS -----
      const rightCardX = leftCardX + leftCardW + M;
      const rightCardY = leftCardY;
      const rightCardW = pageW - M - rightCardX;
      const rightCardH = leftCardH;

      doc.setFillColor(theme.cardBg.r, theme.cardBg.g, theme.cardBg.b);
      doc.roundedRect(
        rightCardX,
        rightCardY,
        rightCardW,
        rightCardH,
        10,
        10,
        "F"
      );
      doc.setDrawColor(theme.border.r, theme.border.g, theme.border.b);
      doc.roundedRect(
        rightCardX,
        rightCardY,
        rightCardW,
        rightCardH,
        10,
        10,
        "S"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(theme.text.r, theme.text.g, theme.text.b);
      doc.text("Invoice Details", rightCardX + 16, rightCardY + 24);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const meta = [
        ["Invoice #", invoice.id || "INV-001"],
        ["Date", invoice.date || new Date().toLocaleDateString()],
        ["Status", invoice.status || "Pending"],
        ["Currency", invoice.currency || "INR"],
        ["Reference", invoice.reference || "N/A"],
      ];
      let my = rightCardY + 46;
      const labelX = rightCardX + 16;
      const valueX = rightCardX + rightCardW / 2;
      meta.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${k}:`, labelX, my);
        doc.setFont("helvetica", "normal");
        doc.text(String(v), valueX, my);
        my += 16;
      });

      // ----- ITEMS TABLE (NO RATE / NO TAX) -----
      const tableX = M;
      const tableY = leftCardY + leftCardH + 24;
      const tableW = pageW - M * 2;

      doc.setFillColor(theme.primary.r, theme.primary.g, theme.primary.b);
      doc.rect(tableX, tableY, tableW, 34, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);

      const cols = {
        desc: tableX + 16,
        qty: tableX + tableW - 200,
        amt: tableX + tableW - 80,
      };
      const headerY = tableY + 22;
      doc.text("Description", cols.desc, headerY);
      doc.text("Qty", cols.qty, headerY, { align: "right" });
      doc.text("Amount", cols.amt, headerY, { align: "right" });

      // Rows
      doc.setTextColor(theme.text.r, theme.text.g, theme.text.b);
      doc.setFont("helvetica", "normal");
      let rowY = tableY + 52;
      let subtotal = 0;

      // Default items: single line with invoice.amount if provided
      const items =
        Array.isArray(invoice.items) && invoice.items.length
          ? invoice.items
          : [
              {
                description: "Service/Product",
                quantity: 1,
                amount: parseAmount(invoice.amount) || 0,
              },
            ];

      const maxDescWidth = cols.qty - (cols.desc + 12);
      const rowGap = 26;

      items.forEach((item, idx) => {
        const qty = parseAmount(item.quantity);
        const rateParsed = parseAmount(item.rate); // optional
        const computed = qty * rateParsed;

        const amount =
          item.amount !== undefined && item.amount !== null
            ? parseAmount(item.amount)
            : computed;

        subtotal += amount;

        // zebra bg
        if (idx % 2 === 0) {
          doc.setFillColor(249, 251, 253);
          doc.rect(tableX, rowY - 16, tableW, rowGap, "F");
        }

        const descLines = doc.splitTextToSize(
          item.description || "",
          maxDescWidth
        );
        const baseY = rowY;

        doc.text(descLines, cols.desc, baseY);
        doc.text(String(qty || 0), cols.qty, baseY, { align: "right" });
        doc.text(formatINR(amount), cols.amt, baseY, { align: "right" });

        rowY += Math.max(rowGap, (descLines.length - 1) * 12 + rowGap);

        // New page header (without Rate)
        if (rowY > pageH - 180) {
          doc.addPage("a4", "l");
          doc.setFillColor(theme.primary.r, theme.primary.g, theme.primary.b);
          doc.rect(tableX, M, tableW, 34, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(255, 255, 255);
          doc.text("Description", cols.desc, M + 22);
          doc.text("Qty", cols.qty, M + 22, { align: "right" });
          doc.text("Amount", cols.amt, M + 22, { align: "right" });
          doc.setTextColor(theme.text.r, theme.text.g, theme.text.b);
          doc.setFont("helvetica", "normal");
          rowY = M + 52;
        }
      });

      // ----- TOTAL (no tax) -----
      const totalCardW = 320;
      const totalCardH = 110;
      const totalCardX = pageW - M - totalCardW;
      const totalCardY = Math.min(rowY + 18, pageH - totalCardH - 90);

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(
        totalCardX,
        totalCardY,
        totalCardW,
        totalCardH,
        12,
        12,
        "F"
      );
      doc.setDrawColor(theme.border.r, theme.border.g, theme.border.b);
      doc.roundedRect(
        totalCardX,
        totalCardY,
        totalCardW,
        totalCardH,
        12,
        12,
        "S"
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("Subtotal", totalCardX + 18, totalCardY + 34);
      doc.text(
        formatINR(subtotal),
        totalCardX + totalCardW - 18,
        totalCardY + 34,
        { align: "right" }
      );

      doc.setDrawColor(theme.border.r, theme.border.g, theme.border.b);
      doc.line(
        totalCardX + 18,
        totalCardY + 48,
        totalCardX + totalCardW - 18,
        totalCardY + 48
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Total Payable", totalCardX + 18, totalCardY + 76);
      doc.text(
        formatINR(subtotal),
        totalCardX + totalCardW - 18,
        totalCardY + 76,
        { align: "right" }
      );

      // ----- FOOTER -----
      const footerY = pageH - 60;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(theme.muted.r, theme.muted.g, theme.muted.b);
      doc.text("Thank you for your business!", M, footerY);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Azzunique Software Private Limited | info@azzunique.com | +91-7412066477",
        M,
        footerY + 16
      );

      // Save
      const fileId = invoice.id || `INV-${Date.now()}`;
      doc.save(`Azzunique_Invoice_${fileId}.pdf`);
    } catch (e) {
      console.error("PDF Download failed", e);
    }
  };

  const stats = [
    {
      title: "Invoices",
      count: invoices.length,
      description: "Total generated",
      icon: <Activity className="w-6 h-6 text-white" />,
      gradientFrom: "blue-500",
      gradientTo: "cyan-500",
    },
    {
      title: "Paid",
      count: paidCount,
      description: "Successful payments",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      gradientFrom: "green-500",
      gradientTo: "emerald-500",
    },
    {
      title: "Overdue",
      count: overdueCount,
      description: "Pending invoices",
      icon: <AlertCircle className="w-6 h-6 text-white" />,
      gradientFrom: "orange-500",
      gradientTo: "red-500",
    },
    {
      title: "Total Overdue",
      count:
        typeof currency === "function"
          ? currency(totalDue)
          : `₹${Number(totalDue || 0).toLocaleString()}`,
      description: "Amount due",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      gradientFrom: "purple-500",
      gradientTo: "pink-500",
    },
  ];

  // deps for renew flow
  const deps = {
    dispatch,
    navigate,
    toast,
    setIsProcessing,
    actions: {
      createRazorpayOrder,
      createOrRenewSubscriptionAction,
      getMySubscription,
    },
  };

  const handleRenewNow = async (
    { currentUserData, subscriptionData },
    depsArg
  ) => {
    const { navigate, toast, setIsProcessing } = depsArg || {};
    if (!currentUserData) {
      navigate?.("/login");
      return;
    }
    const sub = subscriptionData;
    if (!sub?.id) {
      toast?.error?.("Active subscription not found");
      return;
    }
    setIsProcessing?.(true);
    await processPaidSubscription(
      {
        mode: "RENEW",
        planCode: sub.plan,
        billingCycle: sub.billingCycle,
        subscriptionId: sub.id,
        currentUserData,
      },
      depsArg
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <Header
          subTitle="Billing & Subscription"
          title="Billing Control Center"
          tagLine="Manage your plan, invoices, and payments in one sleek dashboard."
        />

        <a
          href="/#pricing"
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative flex items-center gap-3 w-full justify-center">
            <Plus
              size={22}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span>View Plans</span>
            <CreditCard
              size={18}
              className="opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </a>
      </div>

      <div className="flex flex-col gap-y-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Current Subscription Card */}
        {subscription ? (
          <div className="relative overflow-hidden bg-white/90 rounded-3xl shadow-xl border border-white/30 backdrop-blur-sm">
            <div
              className={`absolute top-0 left-0 right-0 h-2 ${getPlanGradient(
                subscription.plan
              )}`}
            ></div>

            <div className="p-8">
              {/* Plan Header */}
              <div className="flex mb-6 flex-col">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-2xl ${getPlanGradient(
                        subscription.plan
                      )} shadow-lg`}
                    >
                      {getPlanIcon(subscription.plan)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {subscription.plan} Plan
                        {subscription.status === "active" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Active
                          </span>
                        )}
                      </h2>
                      {typeof daysLeft === "number" && (
                        <p className="text-slate-600 text-sm mt-1">
                          Next billing in <b>{Math.max(daysLeft, 0)}</b> days
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Desktop Renew CTA */}
                  {showRenewCTA && (
                    <button
                      onClick={() =>
                        handleRenewNow(
                          { currentUserData: userData, subscriptionData },
                          deps
                        )
                      }
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-semibold shadow hover:shadow-md transition disabled:opacity-50"
                    >
                      <Calendar className="h-4 w-4" />
                      {isProcessing ? "Processing..." : "Renew Now"}
                    </button>
                  )}
                </div>

                <div className="text-right mt-4">
                  <p className="text-3xl font-bold text-slate-900">
                    {currency(subscription.price)}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1 justify-end">
                    <Calendar className="h-4 w-4" />
                    Next: {subscription.nextBilling}
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {subscription.features.map((feature, i) => (
                  <div
                    key={i}
                    className="group p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Empty state
          <div className="bg-white/90 rounded-3xl shadow-xl border border-white/30 backdrop-blur-sm p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-700 text-lg font-medium">
              No active subscription found
            </p>
            <a
              href="/#pricing"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <Plus
                  size={22}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span>View Plans</span>
                <CreditCard
                  size={18}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </a>
          </div>
        )}

        {/* Billing History  */}
        <div className="hidden lg:block bg-white/90 rounded-3xl shadow-lg border border-white/30 backdrop-blur-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Billing History
              </h2>
              {totalDue > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currency(totalDue)} overdue
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Invoice ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Period
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-slate-900">
                        {invoice.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-800">
                        {new Date(invoice.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-900">
                        {invoice.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">
                        {invoice.period}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-slate-900">
                        {currency(invoice.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDownloadInvoice(invoice, userData)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl transition font-semibold"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}

                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-600 text-lg font-medium">
                          No invoices available
                        </p>
                        <p className="text-slate-400 text-sm">
                          Your billing history will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="px-6 py-4 text-sm text-gray-600 bg-gray-50 border-t">
              Tip: Renew early to avoid any service interruption.
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden divide-y divide-slate-200">
          {invoices.length > 0 ? (
            invoices.map((invoice, index) => {
              const status = String(invoice.status || "")
                .trim()
                .toLowerCase();
              const canRenew = ["pending", "unpaid", "overdue"].includes(status);
              const isLatest = index === 0; // sorted = latest first

              return (
                <div key={invoice.id} className="p-4 space-y-2 bg-white shadow-sm">
                  <div className="text-sm font-mono text-slate-700">
                    <strong>Invoice ID:</strong> {invoice.id}
                  </div>
                  <div className="text-sm text-slate-700">
                    <strong>Date:</strong>{" "}
                    {new Date(invoice.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-slate-900 font-semibold">
                    <strong>Description:</strong> {invoice.description}
                  </div>
                  <div className="text-sm text-slate-700">
                    <strong>Period:</strong> {invoice.period}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    <strong>Amount:</strong> {currency(invoice.amount)}
                  </div>
                  <div className="text-sm text-slate-700">
                    <strong>Status:</strong>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 ml-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadInvoice(invoice, userData)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl transition font-semibold"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>

                    {showRenewCTA && canRenew && isLatest && (
                      <button
                        onClick={() =>
                          handleRenewNow(
                            { currentUserData: userData, subscriptionData },
                            deps
                          )
                        }
                        disabled={isProcessing}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 text-white bg-amber-500 hover:bg-amber-600 border border-amber-500 hover:border-amber-600 rounded-xl transition font-semibold disabled:opacity-50"
                      >
                        <Calendar className="h-4 w-4" />
                        {isProcessing ? "Processing..." : "Renew"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-600 text-sm">
              <FileText className="mx-auto h-10 w-10 text-slate-300 mb-4" />
              No invoices available.
              <div className="mt-4">
                <a
                  href="/#pricing"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition font-semibold"
                >
                  <Plus className="h-4 w-4" /> View Plans
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
