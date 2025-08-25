// src/components/razorpay.js
export const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const generateShortReceiptId = (userId, tag) => {
  const timestamp = Date.now().toString(36);
  const shortUserId = userId ? String(userId).slice(-8) : "unknown";
  const shortTag = String(tag || "SUB")
    .slice(0, 6)
    .toUpperCase();
  return `ord_${shortTag}_${shortUserId}_${timestamp}`.slice(0, 40);
};

export const processPaidSubscription = async (
  {
    mode, // "NEW" | "RENEW"
    planCode, // BASIC | PREMIUM
    billingCycle, // MONTHLY | YEARLY
    subscriptionId, // only for RENEW
    currentUserData, // user object
  },
  deps
) => {
  const { dispatch, actions, toast, setIsProcessing, navigate } = deps || {};

  if (!dispatch || !actions) {
    console.error("processPaidSubscription: missing deps/dispatch/actions");
    toast?.error?.("Payment setup issue. Please refresh.");
    return;
  }

  const sdkLoaded = await loadRazorpay();
  if (!sdkLoaded) {
    toast?.error?.("Failed to load payment system");
    return;
  }

  try {
    const plan = String(planCode || "").toUpperCase();
    const cycle = String(billingCycle || "").toUpperCase();

    if (!plan || !cycle) throw new Error("Plan/BillingCycle missing");
    if (mode === "RENEW" && !subscriptionId) {
      throw new Error("subscriptionId required for renew");
    }

    // 1) Create order (backend)
    const orderAction = await dispatch(
      actions.createRazorpayOrder({
        plan,
        billingCycle: cycle,
        receiptId: generateShortReceiptId(
          currentUserData?.id,
          `${plan}-${mode}`
        ),
        purpose: mode,
        subscriptionId: subscriptionId || undefined,
      })
    );
    const orderData = orderAction?.data || orderAction;
    if (!orderData?.id) throw new Error("Order creation failed");

    // 2) Open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount, // paise
      currency: orderData.currency, // "INR"
      name: "Airmails",
      description: `${plan} ${cycle} ${
        mode === "RENEW" ? "– Renew" : "Subscription"
      }`,
      order_id: orderData.id,
      prefill: {
        name: currentUserData?.name || "",
        email: currentUserData?.email || "",
        contact: currentUserData?.phone?.toString() || "",
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: () => {
          setIsProcessing?.(false);
          toast?.info?.("Payment cancelled");
        },
      },
      handler: async (response) => {
        try {
          const payload = {
            plan,
            billingCycle: cycle,
            razorpayOrderId: orderData.id,
            razorpayPaymentId: response.razorpay_payment_id,
          };
          if (mode === "RENEW") payload.subscriptionId = subscriptionId;

          await dispatch(actions.createOrRenewSubscriptionAction(payload));
          toast?.success?.(
            mode === "RENEW" ? "Renew successful!" : "Subscription activated!"
          );
          dispatch(actions.getMySubscription());
        } catch (err) {
          toast?.error?.(`Payment verification failed: ${err?.message || ""}`);
          console.error(err);
        } finally {
          setIsProcessing?.(false);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    // helpful failure hook
    rzp.on("payment.failed", (resp) => {
      console.error("RZP payment.failed", resp);
      toast?.error?.(resp?.error?.description || "Payment failed");
      setIsProcessing?.(false);
    });
    rzp.open();
  } catch (error) {
    console.error(`${mode} error:`, error);
    setIsProcessing?.(false);
    toast?.error?.(error?.message || `${mode} failed`);
    // optional: navigate fallback
    if (error?.message?.includes("Authentication") && navigate) {
      navigate("/login");
    }
  }
};
