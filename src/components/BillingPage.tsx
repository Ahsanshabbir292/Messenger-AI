import React, { useState, useEffect } from 'react';
import { Check, Zap, CreditCard, ShieldAlert, Calendar, RefreshCw, AlertCircle, X, ShieldCheck, Laptop, HelpCircle, User } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';

interface BillingPageProps {
  appUser: any;
  creditBalance: number;
  currentPlan: string | null;
  fetchBillingData: () => void | Promise<void>;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 8,
    credits: 30000,
    pages: 1,
    teamMembers: 1,
    popular: false,
    features: ["1 Facebook page", "Broadcast", "Live chat", "Basic analytics"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 22,
    credits: 300000,
    pages: 3,
    teamMembers: 3,
    popular: true,
    features: ["3 Facebook pages", "Broadcast + bulk", "Live chat", "Full analytics", "Team (3 members)"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    credits: 800000,
    pages: 10,
    teamMembers: 10,
    popular: false,
    features: ["10 Facebook pages", "All broadcast types", "Priority support", "Team (10 members)", "Advanced analytics"],
  },
  {
    id: "business",
    name: "Business",
    price: 99,
    credits: 2000000,
    pages: -1,
    teamMembers: -1,
    popular: false,
    features: ["Unlimited pages", "All features", "Unlimited team members", "Dedicated support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 219,
    credits: 4500000,
    pages: -1,
    teamMembers: -1,
    popular: false,
    features: ["Unlimited pages", "White-label option", "Custom integrations", "SLA guarantee", "Onboarding call"],
  },
];

const CREDIT_PACKS = [
  { id: "pack_50k",   credits: 50000,   price: 5  },
  { id: "pack_200k",  credits: 200000,  price: 15 },
  { id: "pack_600k",  credits: 600000,  price: 35 },
  { id: "pack_1500k", credits: 1500000, price: 75 },
];

const PLAN_DETAILS: Record<string, { name: string; description: string; features: string[] }> = {
  trial: {
    name: "3-Day Free Trial",
    description: "Ideal package to test all bot triggers and response automation parameters.",
    features: [
      "Up to 3 Connected Facebook pages",
      "10,000 automated credits",
      "3-Day trial period duration",
      "Live Chat assistant dashboard support",
      "Custom messaging options"
    ]
  },
  starter: {
    name: "Starter Plan",
    description: "Best for individuals and small startups looking to automate customer inquiries.",
    features: [
      "1 Connected Facebook page",
      "30,000 automated credits per month",
      "Live Chat assistant dashboard support",
      "Standard system response latency",
      "Custom auto-reply sequences"
    ]
  },
  growth: {
    name: "Growth Plan",
    description: "Ideal for growing brands with multiple active support touchpoints.",
    features: [
      "Up to 3 Connected Facebook pages",
      "300,000 automated credits per month",
      "Priority AI engine processing latency",
      "Broadcast messaging & batch transfers",
      "Advanced team support roles"
    ]
  },
  pro: {
    name: "Pro Plan",
    description: "Built for scaling e-commerce businesses and professional agencies.",
    features: [
      "Up to 10 Connected Facebook pages",
      "800,000 automated credits per month",
      "Dedicated multi-agent visual hub",
      "Advanced engagement analytics reports",
      "Instant priority notify & alerts sync"
    ]
  },
  business: {
    name: "Business Plan",
    description: "High volume automation with standard integration capabilities.",
    features: [
      "Unlimited Connected Facebook pages",
      "2,000,000 automated credits per month",
      "Dedicated integration manager",
      "Auto-scaling database capability",
      "Unlimited agent team profiles"
    ]
  },
  enterprise: {
    name: "Enterprise Plan",
    description: "Custom agency branding setup with white-labeled client systems.",
    features: [
      "Unlimited Connected Facebook pages",
      "4,500,000 automated credits per month",
      "White-labeled branding options",
      "Custom business rule customizer",
      "Guaranteed priority uptime SLAs"
    ]
  }
};

const PLAN_PRODUCT_IDS: Record<string, string> = {
  trial:      "trial_product_mock",
  starter:    "8716856a-757e-4422-a486-64274e64d849",
  growth:     "172a502e-9351-4fbe-ba75-65fc20a23a99",
  pro:        "1c9ff447-b279-4147-aa12-ddb4777af49c",
  business:   "0aa2f6aa-172a-4e18-9689-2aba5e2fbfb7",
  enterprise: "91e00e71-56db-41c3-ae54-af586b4ed4bb",
};

const PACK_PRODUCT_IDS: Record<string, string> = {
  pack_50k:   "e53f9351-135d-40d7-a1e8-6adb89323869",
  pack_200k:  "4fc68008-e9d0-40c1-aec8-abe47a672c89",
  pack_600k:  "3651f14d-24fc-4f5d-9970-b8aed3a73caa",
  pack_1500k: "6f4b00ca-da1e-44f2-8bdb-44576c92cce8",
};

const formatCredits = (n: number) => n.toLocaleString();

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
    // Read correct month index names
    const dMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = dMonths[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
};

const getDaysRemaining = (expireStr: string | null) => {
  if (!expireStr) return 999;
  try {
    const expireDate = new Date(expireStr);
    const diffTime = expireDate.getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (e) {
    return 999;
  }
};

export const BillingPage: React.FC<BillingPageProps> = ({
  appUser,
  creditBalance,
  currentPlan: initialCurrentPlan,
  fetchBillingData,
  addToast,
}) => {
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals status
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSwitchConfirmOpen, setIsSwitchConfirmOpen] = useState(false);
  
  const [isPackConfirmOpen, setIsPackConfirmOpen] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [packCheckoutPending, setPackCheckoutPending] = useState(false);
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [submittingAction, setSubmittingAction] = useState(false);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // Load complete billing info
  const loadBillingDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/billing/data');
      if (res.data) {
        setBillingInfo(res.data);
      }
    } catch (err) {
      console.error("Failed to load billing details", err);
      addToast("Failed to sync live billing parameters", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingDetails();
  }, [initialCurrentPlan]);

  const [fakeCardNumber, setFakeCardNumber] = useState("");
  const [fakeExpiry, setFakeExpiry] = useState("");
  const [fakeCvv, setFakeCvv] = useState("");
  const [fakeCardName, setFakeCardName] = useState("");

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setSubmittingAction(true);
      const res = await axios.post('/api/billing/cancel-subscription');
      if (res.data.success) {
        addToast("Subscription cancelled successfully", "success");
        setIsCancelModalOpen(false);
        await loadBillingDetails();
        if (fetchBillingData) await fetchBillingData();
      }
    } catch (err: any) {
      addToast(err.response?.data?.error || "Failed to cancel subscription", "error");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleSwitchClick = (planId: string) => {
    setSelectedPlanId(planId);
    setCheckoutPending(false);
    setIsSwitchConfirmOpen(true);
  };

  const handlePackClick = (packId: string) => {
    setSelectedPackId(packId);
    setPackCheckoutPending(false);
    setIsPackConfirmOpen(true);
  };

  const handleProcessCheckout = async (type: "plan" | "pack") => {
    if (type === "plan" && !selectedPlanId) return;
    if (type === "pack" && !selectedPackId) return;

    if (paymentMethod === "card") {
      if (!fakeCardNumber.trim() || !fakeExpiry.trim() || !fakeCvv.trim() || !fakeCardName.trim()) {
        addToast("Please fill in all credit card details to proceed.", "error");
        return;
      }
    }

    try {
      setSubmittingAction(true);
      addToast("Processing payment securely via direct encryption API...", "info");
      
      const payload = type === "plan" ? { planId: selectedPlanId } : { packId: selectedPackId };
      const res = await axios.post("/api/billing/confirm-order", payload);
      
      if (res.data && res.data.success) {
        addToast(res.data.message || "Payment processed and order activated successfully!", "success");
        
        // Reset states
        setFakeCardNumber("");
        setFakeExpiry("");
        setFakeCvv("");
        setFakeCardName("");
        
        if (type === "plan") {
          setIsSwitchConfirmOpen(false);
          setIsSwitchModalOpen(false);
        } else {
          setIsPackConfirmOpen(false);
        }
        
        // Reload details immediately
        await loadBillingDetails();
        if (fetchBillingData) await fetchBillingData();
      } else {
        addToast(res.data.error || "Payment approval returned status: pending. Please try again.", "error");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      addToast(err.response?.data?.error || "Transaction declined by authentication server. Please verify your mock card details.", "error");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleConfirmSwitch = async () => {
    if (!selectedPlanId) return;

    if (selectedPlanId === "trial") {
      try {
        setSubmittingAction(true);
        const res = await axios.post('/api/billing/switch-plan', {
          planId: selectedPlanId,
          paymentMethod: paymentMethod
        });
        if (res.data.success) {
          addToast(`Subscription plan successfully updated to ${selectedPlanId}`, "success");
          setIsSwitchConfirmOpen(false);
          setIsSwitchModalOpen(false);
          await loadBillingDetails();
          if (fetchBillingData) await fetchBillingData();
        }
      } catch (err: any) {
        addToast(err.response?.data?.error || "Failed to update package", "error");
      } finally {
        setSubmittingAction(false);
      }
      return;
    }

    // For paid plans, we process via the simulated payment system
    await handleProcessCheckout("plan");
  };

  const handleConfirmPack = async () => {
    await handleProcessCheckout("pack");
  };

  const activePlanId = billingInfo?.currentPlan || "trial";
  const activeDetail = PLAN_DETAILS[activePlanId] || PLAN_DETAILS["trial"];
  const daysRemaining = getDaysRemaining(billingInfo?.planExpiresAt);
  const isNearExpiry = daysRemaining >= 0 && daysRemaining <= 7;
  const isCancelled = billingInfo?.subscriptionStatus === "cancelled";
  const isPlanExpired = !!billingInfo?.planExpiresAt && new Date(billingInfo.planExpiresAt).getTime() < Date.now();

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20 px-4 sm:px-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Billing & Plans 
            {loading && <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1">Configure user accounts tier, credits packages, and active renewals.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-700 uppercase">
            Active Package: <span className="text-indigo-600 font-black">{activePlanId}</span>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-black text-indigo-700 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{formatCredits(billingInfo?.creditBalance !== undefined ? billingInfo.creditBalance : creditBalance)} Credits</span>
          </div>
        </div>
      </div>

      {/* Main Active Subscription Dashboard Block */}
      {!loading && billingInfo && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full tracking-widest ${isPlanExpired ? 'bg-rose-600 text-white' : 'bg-indigo-500 text-white'}`}>
                  {isPlanExpired ? 'Expired Subscription' : 'Active Subscription'}
                </span>
                {isPlanExpired ? (
                  <span className="text-xs bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold px-2.5 py-1 rounded-full">
                    Expired
                  </span>
                ) : isCancelled ? (
                  <span className="text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold px-2.5 py-1 rounded-full">
                    Cancelled
                  </span>
                ) : isNearExpiry ? (
                  <span className="text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black px-2.5 py-1 rounded-full animate-pulse">
                    Expiring Soon
                  </span>
                ) : (
                  <span className="text-xs bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold px-2.5 py-1 rounded-full">
                    Auto-Renew Active
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black tracking-tight">{activeDetail.name}</h1>
              <p className="text-slate-400 text-sm max-w-xl font-medium">{activeDetail.description}</p>
            </div>

            {/* Price section / payment state */}
            <div className="lg:text-right space-y-1 bg-slate-800/40 p-4 sm:p-6 rounded-2xl border border-slate-800/80 min-w-[200px]">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Recurring Amount</p>
              <p className="text-3xl font-black text-slate-100">
                ${PLANS.find(p => p.id === activePlanId)?.price || 0}
                <span className="text-xs text-slate-400 font-semibold">/mo</span>
              </p>
              <div className="pt-2 flex items-center lg:justify-end gap-1.5 text-xs text-slate-300 font-bold">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Activated: {formatDate(billingInfo.planActivatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Column 1: Dates & Warnings */}
            <div className="space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-800/40">
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider">Coverage & Expiry</h4>
              <div className="space-y-3 font-medium text-slate-300 text-sm">
                <div className="flex items-center justify-between">
                  <span>Activation Date:</span>
                  <span className="font-bold text-slate-100">{formatDate(billingInfo.planActivatedAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Expiry Date:</span>
                  <span className="font-bold text-slate-100">{formatDate(billingInfo.planExpiresAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Remaining Days:</span>
                  <span className={`font-bold ${daysRemaining <= 0 ? "text-rose-400" : "text-indigo-400"}`}>
                    {daysRemaining <= 0 ? "0 days remaining (Expired)" : `${daysRemaining} days remaining`}
                  </span>
                </div>
              </div>

              {isCancelled && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-300 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>
                    <strong>Subscription cancelled.</strong> Your full access is preserved and remains functional until {formatDate(billingInfo.planExpiresAt)}. No further payments will be requested.
                  </span>
                </div>
              )}

              {isNearExpiry && !isCancelled && (
                <div className="p-3 bg-amber-950/20 border border-amber-900/40 text-amber-300 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    <strong>Caution:</strong> Only {daysRemaining} days remaining in this billing cycle. Secure your connected bot webhooks now by configuring renewals!
                  </span>
                </div>
              )}
            </div>

            {/* Column 2: Included Features */}
            <div className="space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-800/40">
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider">Features Included</h4>
              <div className="space-y-2">
                {activeDetail.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs text-slate-200 font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Payment Source & Action Buttons */}
            <div className="space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-800/40 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-2">Payment Source</h4>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center gap-2.5 text-sm">
                  {activePlanId === "trial" ? (
                    <>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-100">No Card Required</p>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Free Evaluation Trial
                        </p>
                      </div>
                    </>
                  ) : billingInfo.paymentSourceType === "admin" ? (
                    <>
                      <User className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-black text-slate-100">Activated by Admin</p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {billingInfo.paymentSourceAdminName || "admin@perseusbot.com"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-slate-300 shrink-0" />
                      <div>
                        {billingInfo.paymentSourceType === "paypal" ? (
                          <p className="text-xs font-black text-slate-100">Purchased via PayPal</p>
                        ) : (
                          <p className="text-xs font-black text-slate-100">Purchased via Card</p>
                        )}
                        <p className="text-[10px] text-slate-400 font-mono">
                          {billingInfo.paymentSourceDetails || "Visa ****4242"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setIsSwitchModalOpen(true)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Switch Plan
                </button>

                {isCancelled ? (
                  <div className="w-full py-2.5 bg-slate-800 text-slate-400 rounded-xl font-bold text-center text-xs border border-slate-700/50">
                    Auto-Renew Turned Off — Active until {formatDate(billingInfo.planExpiresAt)}
                  </div>
                ) : (
                  <button
                    onClick={handleCancelClick}
                    className="w-full py-2.5 hover:bg-rose-950/20 border border-slate-700 hover:border-rose-900 text-slate-300 hover:text-rose-400 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer bg-transparent active:scale-95"
                  >
                    Cancel Auto-Renewal
                  </button>
                )}

                {activePlanId === "trial" && (
                  <div className="pt-2 border-t border-slate-800 space-y-1 text-center">
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Upgrade to a premium plan above to unlock automated credits and advanced AI features.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Plans Pricing Grid Section */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-1">Available Subscriptions Overview</h3>
        <p className="text-xs text-slate-400 font-bold mb-6">Select a plan tier below. Tiers can be configured or updated dynamically.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = activePlanId === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-6 flex flex-col gap-3 transition-all ${
                  plan.popular
                    ? 'border-2 border-indigo-400 shadow-lg shadow-indigo-50/50'
                    : 'border border-slate-100 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full whitespace-nowrap">
                      Most popular
                    </span>
                  </div>
                )}
                {isCurrent && !isPlanExpired && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full whitespace-nowrap">
                      Active
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">{plan.name}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    ${plan.price}<span className="text-xs font-bold text-slate-400">/mo</span>
                  </p>
                </div>

                <div className="py-3 border-y border-slate-100">
                  <p className="text-xs text-slate-500 font-bold">
                    <span className="text-slate-900 font-black">{formatCredits(plan.credits)}</span> credits/mo
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">
                    {plan.pages === -1 ? 'Unlimited pages' : `${plan.pages} page${plan.pages > 1 ? 's' : ''}`}
                  </p>
                </div>

                <div className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-[10px] font-bold text-slate-600 leading-tight">{f}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (isCurrent && !isPlanExpired) return;
                    handleSwitchClick(plan.id);
                  }}
                  className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-none cursor-pointer ${
                    isCurrent && !isPlanExpired
                      ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed font-bold'
                      : plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-slate-900 active:scale-95 shadow-md'
                      : 'bg-slate-50 text-slate-700 hover:bg-indigo-600 hover:text-white active:scale-95'
                  }`}
                >
                  {isCurrent && !isPlanExpired ? 'Current Plan ✓' : isCurrent ? 'Reactivate Plan' : `Switch Plan`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 font-bold text-center mt-4">
          All changes take effect immediately on credit balance.
        </p>
      </div>

      {/* Credit Packs Section */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-1">Extra Credit Packs</h3>
        <p className="text-xs text-slate-400 font-bold mb-6 font-semibold">One-time purchase — credits never expire.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
            >
              <div>
                <p className="text-2xl font-black text-slate-900">${pack.price}</p>
                <p className="text-xs font-black text-indigo-600 mt-1">{formatCredits(pack.credits)} credits</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Never expires</p>
              </div>
              <button
                onClick={() => handlePackClick(pack.id)}
                className="w-full py-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-none cursor-pointer active:scale-95"
              >
                Buy Pack
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-amber-600 font-bold text-center mt-4">
          ⚡ Extra credit packs never expire — use them anytime.
        </p>
      </div>

      {/* 4. Switch Plan Modal Picker */}
      <AnimatePresence>
        {isSwitchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Switch Subscription Plan</h3>
                  <p className="text-xs text-slate-400 font-medium">Choose a standard tier packages below to apply dynamically to your workspace.</p>
                </div>
                <button 
                  onClick={() => setIsSwitchModalOpen(false)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full transition-all border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PLANS.map((plan) => {
                  const isCurrent = activePlanId === plan.id;
                  const details = PLAN_DETAILS[plan.id];
                  return (
                    <div 
                      key={plan.id}
                      onClick={() => {
                        if (!isCurrent || isPlanExpired) handleSwitchClick(plan.id);
                      }}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-[230px] cursor-pointer ${
                        isCurrent && !isPlanExpired
                          ? 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-500/20' 
                          : 'border-slate-100 hover:border-indigo-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900">{plan.name}</span>
                          {isCurrent && !isPlanExpired && (
                            <span className="text-[9px] font-black text-white bg-indigo-600 px-2 py-0.5 rounded-full uppercase">
                              Current Plan
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">{details?.description}</p>
                        <p className="text-2xl font-black text-slate-900 pt-1">
                          ${plan.price}
                          <span className="text-xs font-bold text-slate-400">/mo</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold mb-2">
                          <Check className="w-3 h-3 text-emerald-500 inline mr-1" />
                          {formatCredits(plan.credits)} Monthly credits
                        </p>
                        {isCurrent && !isPlanExpired ? (
                          <div className="w-full py-1.5 text-center text-xs font-black text-indigo-600 bg-indigo-100/50 rounded-lg">
                            Current Plan ✓
                          </div>
                        ) : (
                          <div className="w-full py-1.5 text-center text-xs font-black text-slate-700 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">
                            {isCurrent ? 'Reactivate Plan' : 'Select Plan'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Switch Plan */}
      <AnimatePresence>
        {isSwitchConfirmOpen && selectedPlanId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-6 border border-slate-100"
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Confirm Plan Switch</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  You are activating the <strong className="text-indigo-600 uppercase font-black">{selectedPlanId}</strong>.
                </p>
              </div>

              {/* Package breakdown details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Monthly Fee:</span>
                  <span className="font-black text-slate-900">${PLANS.find(p => p.id === selectedPlanId)?.price}/mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Standard Credits:</span>
                  <span className="font-black text-indigo-600">{formatCredits(PLANS.find(p => p.id === selectedPlanId)?.credits || 0)}/mo</span>
                </div>
              </div>

              {/* Payment selection / No Card Trial Info */}
              {selectedPlanId === "trial" ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-1.5">
                  <div className="text-emerald-700 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    No Credit Card Required
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    Start your 3-day evaluation trial instantly with full access. No payment card details are requested or recorded.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Secure Payment Gateway</h4>
                    
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={fakeCardName}
                          onChange={(e) => setFakeCardName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={fakeCardNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                            setFakeCardNumber(val);
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={fakeExpiry}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (val.length === 2 && !val.includes('/')) {
                                val += '/';
                              }
                              setFakeExpiry(val);
                            }}
                            placeholder="12/28"
                            className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">CVC / CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={fakeCvv}
                            onChange={(e) => setFakeCvv(e.target.value.replace(/\D/g, ""))}
                            placeholder="739"
                            className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-indigo-550 font-bold bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-150 leading-relaxed text-center">
                      🔒 Enter any simulated checkout credentials to securely approve this invoice instantly.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setIsSwitchConfirmOpen(false)}
                  disabled={submittingAction}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 rounded-xl font-bold text-xs uppercase cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmSwitch}
                  disabled={submittingAction}
                  className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-md shadow-indigo-150"
                >
                  {submittingAction ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    "Authorize & Pay"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Cancel Subscription Confirmation Dialog */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-100"
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Stop Auto-Renewal?</h3>
                <div className="text-xs text-slate-500 leading-relaxed font-semibold text-center py-2 px-3 bg-rose-50/50 rounded-xl border border-rose-100">
                  "Auto-renewal will be turned off. Your <strong className="text-slate-900 font-extrabold uppercase">{activePlanId}</strong> plan remains fully active and usable until <strong className="text-slate-900 font-extrabold">{formatDate(billingInfo?.planExpiresAt)}</strong>. No automatic charges will occur after this date."
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={submittingAction}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 rounded-xl font-bold text-xs uppercase cursor-pointer"
                >
                  Keep Auto-Renew Enabled
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={submittingAction}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-md shadow-rose-100"
                >
                  {submittingAction ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : "Cancel Auto-Renewal"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Extra Credit Pack Purchase Confirmation Dialog */}
      <AnimatePresence>
        {isPackConfirmOpen && selectedPackId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-6 border border-slate-100"
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-indigo-600 animate-bounce" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Purchase Extra Credits</h3>
                <p className="text-xs text-slate-400 font-medium font-semibold">
                  Add <strong className="text-indigo-600 font-black">{formatCredits(CREDIT_PACKS.find(p => p.id === selectedPackId)?.credits || 0)}</strong> automated credits to your workspace. One-time purchase - credits never expire!
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">One-Time Fee:</span>
                  <span className="font-black text-slate-900">${CREDIT_PACKS.find(p => p.id === selectedPackId)?.price}</span>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Secure Payment Gateway</h4>
                  
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={fakeCardName}
                        onChange={(e) => setFakeCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={fakeCardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setFakeCardNumber(val);
                        }}
                        placeholder="4111 2222 3333 4444"
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={fakeExpiry}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val.length === 2 && !val.includes('/')) {
                              val += '/';
                            }
                            setFakeExpiry(val);
                          }}
                          placeholder="12/28"
                          className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={fakeCvv}
                          onChange={(e) => setFakeCvv(e.target.value.replace(/\D/g, ""))}
                          placeholder="739"
                          className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-550 font-bold bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-150 leading-relaxed text-center">
                    🔒 Enter any simulated checkout credentials to securely approve this invoice instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsPackConfirmOpen(false)}
                  disabled={submittingAction}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 rounded-xl font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPack}
                  disabled={submittingAction}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-md shadow-indigo-150"
                >
                  {submittingAction ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : "Confirm & Pay"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
