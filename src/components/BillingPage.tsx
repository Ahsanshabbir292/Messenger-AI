import React from 'react';
import { Check, Zap } from 'lucide-react';

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

const PLAN_PRODUCT_IDS: Record<string, string> = {
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

export const BillingPage: React.FC<BillingPageProps> = ({
  appUser,
  creditBalance,
  currentPlan,
  fetchBillingData,
  addToast,
}) => {
  const openCheckout = (productId: string) => {
    const email = encodeURIComponent(appUser?.email || '');
    const userId = encodeURIComponent(appUser?.email || '');
    const url = `https://messengerai.lemonsqueezy.com/checkout/buy/${productId}?checkout[email]=${email}&checkout[custom][user_id]=${userId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Plans</h2>
          <p className="text-xs text-slate-400 font-bold mt-1">Choose the plan that fits your needs</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-700">
            Current Plan: <span className="text-indigo-600 uppercase">{currentPlan || 'No active plan'}</span>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-black text-indigo-700">
            <Zap className="w-3 h-3 inline mr-1" />
            {formatCredits(creditBalance)} credits
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-1">Subscription Plans</h3>
        <p className="text-xs text-slate-400 font-bold mb-6">Monthly credits reset each billing cycle.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-6 flex flex-col gap-3 transition-all ${
                  plan.popular
                    ? 'border-2 border-indigo-400 shadow-lg shadow-indigo-50'
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
                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full whitespace-nowrap">
                      Current
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
                    if (isCurrent) return;
                    openCheckout(PLAN_PRODUCT_IDS[plan.id]);
                  }}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-none cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-slate-900 active:scale-95'
                      : 'bg-slate-50 text-slate-700 hover:bg-indigo-600 hover:text-white active:scale-95'
                  }`}
                >
                  {isCurrent ? 'Current Plan ✓' : `Get ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 font-bold text-center mt-4">
          Monthly plan credits reset each billing cycle. Purchase extra packs below for permanent credits.
        </p>
      </div>

      {/* Credit Packs Section */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-1">Extra Credit Packs</h3>
        <p className="text-xs text-slate-400 font-bold mb-6">One-time purchase — credits never expire.</p>

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
                onClick={() => openCheckout(PACK_PRODUCT_IDS[pack.id])}
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

    </div>
  );
};
