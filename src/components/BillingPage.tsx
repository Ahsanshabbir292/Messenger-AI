import React from 'react';
import { Plus, History, Facebook, Search, Lock, AlertTriangle, CreditCard } from 'lucide-react';
import { SafeAvatar } from './SafeAvatar';

interface BillingPageProps {
  billingSubView: 'dashboard' | 'orders' | 'order-detail' | 'payment' | 'buy';
  setBillingSubView: (view: 'dashboard' | 'orders' | 'order-detail' | 'payment' | 'buy') => void;
  isBillingLoading: boolean;
  billingData: any;
  pages: any[];
  selectedOrderId: string;
  setSelectedOrderId: (id: string) => void;
  buySelectedPageIds: string[];
  setBuySelectedPageIds: (ids: string[]) => void;
  searchPageQuery: string;
  setSearchPageQuery: (q: string) => void;
  billingDiscountCode: string;
  setBillingDiscountCode: (code: string) => void;
  promoError: string | null;
  setPromoError: (err: string | null) => void;
  appliedPromo: string | null;
  setAppliedPromo: (promo: string | null) => void;
  cardholderName: string;
  setCardholderName: (name: string) => void;
  cardNumber: string;
  setCardNumber: (num: string) => void;
  cardExpiry: string;
  setCardExpiry: (exp: string) => void;
  cardCvc: string;
  setCardCvc: (cvc: string) => void;
  isProcessingPayment: boolean;
  appUser: any;
  handleCreateOrder: (pageIds: string[], promoCode?: string) => void | Promise<void>;
  handleDeleteOrder: (orderId: string) => void | Promise<void>;
  handleEditOrder: (orderId: string, pageIds: string[], promoCode?: string) => void | Promise<void>;
  handlePayOrder: (orderId: string) => void | Promise<void>;
  fetchBillingData: () => void | Promise<void>;
}

export const BillingPage: React.FC<BillingPageProps> = ({
  billingSubView,
  setBillingSubView,
  isBillingLoading,
  billingData,
  pages,
  selectedOrderId,
  setSelectedOrderId,
  buySelectedPageIds,
  setBuySelectedPageIds,
  searchPageQuery,
  setSearchPageQuery,
  billingDiscountCode,
  setBillingDiscountCode,
  promoError,
  setPromoError,
  appliedPromo,
  setAppliedPromo,
  cardholderName,
  setCardholderName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  isProcessingPayment,
  appUser,
  handleCreateOrder,
  handleDeleteOrder,
  handleEditOrder,
  handlePayOrder,
  fetchBillingData
}) => {
  const getTrialDaysLeft = (endsAtStr?: string) => {
    if (!endsAtStr) return 0;
    const diff = new Date(endsAtStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* HEADING ACCENT */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Subscriptions</h2>
          <p className="text-xs text-slate-400 font-bold mt-1">Prepaid Workspace Billing Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setBillingSubView('dashboard'); fetchBillingData(); }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${billingSubView === 'dashboard' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => { setBillingSubView('orders'); fetchBillingData(); }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${billingSubView === 'orders' || billingSubView === 'order-detail' || billingSubView === 'payment' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => { setBillingSubView('buy'); }}
            className="px-5 py-2.5 bg-indigo-50 border-2 border-indigo-100 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> BUY / EXTEND
          </button>
        </div>
      </div>

      {isBillingLoading && !billingData && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Loading Billing Records...</p>
        </div>
      )}

      {/* VIEW 1: BILLING DASHBOARD */}
      {billingSubView === 'dashboard' && billingData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats and Recent Orders */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Total Pages</p>
                <h4 className="text-2xl font-black text-slate-950">{pages.length}</h4>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Active Pages</p>
                <h4 className="text-2xl font-black text-emerald-600">
                  {pages.filter(p => billingData?.subscriptions?.[p.id]?.status === 'Active').length}
                </h4>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Per Page Cost</p>
                <h4 className="text-2xl font-black text-indigo-600">$10<span className="text-xs text-slate-400 font-bold">/30d</span></h4>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Earliest Expiry</p>
                <h4 className="text-sm font-black text-slate-900 truncate mt-1">
                  {(() => {
                    if (!billingData || !billingData.subscriptions) return "N/A";
                    const activeSubs = Object.values(billingData.subscriptions).filter((s: any) => s.status === 'Active' || s.status === 'Trial') as any[];
                    if (activeSubs.length === 0) return "N/A";
                    
                    let minDate: Date | null = null;
                    for (const s of activeSubs) {
                      const dateStr = s.subscription_ends_at || s.trial_ends_at;
                      if (dateStr) {
                        const d = new Date(dateStr);
                        if (!minDate || d < minDate) {
                          minDate = d;
                        }
                      }
                    }
                    return minDate ? minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "N/A";
                  })()}
                </h4>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/25">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" /> Recent Checkout Orders
                </h3>
                {billingData?.orders && billingData.orders.length > 0 && (
                  <button 
                    onClick={() => setBillingSubView('orders')}
                    className="text-xs font-black text-indigo-600 hover:text-slate-950 transition-colors uppercase tracking-widest"
                  >
                    View All &rarr;
                  </button>
                )}
              </div>

              <div className="p-2">
                {(!billingData?.orders || billingData.orders.length === 0) ? (
                  <div className="py-20 px-8 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                      <CreditCard className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-black text-base text-slate-900">No checkout orders found</h4>
                      <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto mt-1">
                        Create an order to purchase subscriptions, extend trial periods, or activate multiple connected target Facebook pages.
                      </p>
                    </div>
                    <button 
                      onClick={() => setBillingSubView('buy')}
                      className="mt-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-950 active:scale-95 transition-all"
                    >
                      Create your first order
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-50">
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Order ID</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Created At</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Pages Count</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Total Due</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400">Status</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {billingData.orders.slice(-5).reverse().map((ord: any) => (
                          <tr key={ord.id} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-6 py-4 font-mono text-xs font-black text-indigo-600">{ord.id}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-400">
                              {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 text-xs font-black text-slate-700">{ord.pages?.length || 0}</td>
                            <td className="px-6 py-4 text-xs font-black text-slate-900">${(ord.amount || 0).toFixed(2)}</td>
                            <td className="px-6 py-4">
                              {ord.status === "Paid" ? (
                                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wide">Paid</span>
                              ) : ord.status === "Cancelled" ? (
                                <span className="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-wide">Cancelled</span>
                              ) : (
                                <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-wide animate-pulse">Awaiting Payment</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => { setSelectedOrderId(ord.id); setBillingSubView('order-detail'); }}
                                className="text-xs font-black uppercase text-indigo-600 hover:text-slate-950 transition-colors"
                              >
                                View Detail &rarr;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Your Pages and Info Panel */}
          <div className="space-y-8">
            {/* Connected status of pages on left */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-md p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 pb-3 border-b border-slate-50">
                Your Connected Pages
              </h3>
              <div className="space-y-4 max-h-[22rem] overflow-y-auto pr-1">
                {pages.map((p: any) => {
                  const sub = billingData?.subscriptions?.[p.id];
                  return (
                    <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 hover:bg-indigo-50/20 rounded-2xl border border-slate-100 text-left transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                          <SafeAvatar src={p.picture?.data?.url} name={p.name} className="w-full h-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-950 truncate leading-tight">{p.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold">Category: {p.category || "Facebook Page"}</p>
                        </div>
                      </div>
                      {(() => {
                        if (!sub) {
                          return <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">Expired</span>;
                        }
                        const status = sub.status || "Trial";
                        if (status === 'Active') {
                          const days = Math.max(0, Math.ceil((new Date(sub.subscription_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">Active ({days}d)</span>
                          );
                        } else if (status === 'Trial') {
                          const days = Math.max(0, Math.ceil((new Date(sub.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-sky-50 text-sky-600 border border-sky-100">Trial ({days}d)</span>
                          );
                        } else if (status === 'Disabled') {
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200 block">Disabled</span>
                          );
                        } else {
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">Expired</span>
                          );
                        }
                      })()}
                    </div>
                  );
                })}
                {pages.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400 font-bold">
                    No Facebook pages connected. Connect pages from key settings/Inbox first.
                  </div>
                )}
              </div>
            </div>

            {/* Prepaid Model info box */}
            <div className="bg-slate-950 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl"></div>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Subscription Model</p>
              <h4 className="text-xl font-black mt-1">$10.00 / 30 Days</h4>
              <p className="text-slate-400 text-[11px] font-bold mt-2 leading-relaxed">
                Prepaid active page sub-licenses. Add new allocations, extend current pages, or reactivate expired subscriptions dynamically.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400">Active Pages</p>
                  <p className="text-base font-black text-emerald-400">
                    {pages.filter(p => billingData?.subscriptions?.[p.id]?.status === 'Active').length} Page(s)
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400">Trial Pages</p>
                  <p className="text-base font-black text-sky-400">
                    {pages.filter(p => billingData?.subscriptions?.[p.id]?.status === 'Trial').length} Page(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: BUY / EXTEND PAGES */}
      {billingSubView === 'buy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Pages checklist select and search */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-lg p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-6 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Buy Subscriptions</h3>
                <p className="text-xs text-slate-400 font-bold">Select the pages you want to extend or activate for 30 days.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => setBuySelectedPageIds(pages.map(p => p.id))}
                  className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-xl text-[10px] font-black uppercase text-indigo-600 transition-all"
                >
                  Select All
                </button>
                <button 
                  onClick={() => setBuySelectedPageIds([])}
                  className="px-4 py-2 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl text-[10px] font-black uppercase text-rose-600 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Search Field */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchPageQuery}
                onChange={(e) => setSearchPageQuery(e.target.value)}
                placeholder="Search connected targeting pages..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Page select items */}
            <div className="space-y-3 max-h-[25rem] overflow-y-auto pr-2 mb-6">
              {pages.filter(p => !searchPageQuery || p.name?.toLowerCase().includes(searchPageQuery.toLowerCase())).map((p: any) => {
                const isChecked = buySelectedPageIds.includes(p.id);
                const sub = billingData?.subscriptions?.[p.id];
                
                return (
                  <div 
                    key={p.id}
                    onClick={() => {
                      if (isChecked) {
                        setBuySelectedPageIds(buySelectedPageIds.filter(id => id !== p.id));
                      } else {
                        setBuySelectedPageIds([...buySelectedPageIds, p.id]);
                      }
                    }}
                    className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isChecked ? 'bg-indigo-50/30 border-indigo-200 shadow-sm' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-100"
                        />
                      </div>
                      <div className="w-11 h-11 bg-white rounded-xl overflow-hidden border border-slate-200">
                        <SafeAvatar src={p.picture?.data?.url} name={p.name} className="w-full h-full" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{p.category || "Company Page"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-xs font-black text-slate-900">$10 / 30 days</p>
                        <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mt-0.5 animate-none">
                          {sub?.status === 'Active' ? 'Active' : sub?.status === 'Trial' ? `Trial (${getTrialDaysLeft(sub?.trial_ends_at)} days left)` : 'Expired'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {pages.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400 font-bold">
                  No connected pages to display for selection.
                </div>
              )}
            </div>

            {/* Promo discount coupon */}
            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full max-w-sm">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Discount Promo Code</label>
                <div className="relative flex">
                  <input 
                    type="text" 
                    placeholder="e.g. WELCOME50, SAVE20"
                    value={billingDiscountCode}
                    onChange={(e) => {
                      setBillingDiscountCode(e.target.value);
                      setPromoError(null);
                    }}
                    className="w-full px-4 py-3 bg-slate-50 rounded-l-xl border border-slate-100 text-xs font-bold uppercase placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 border-r-0"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const code = billingDiscountCode.trim().toUpperCase();
                      if (!code) return;
                      if (["WELCOME50", "SAVE50", "SAVE20", "VIP90"].includes(code)) {
                        setAppliedPromo(code);
                        setPromoError(null);
                      } else {
                        setPromoError("Invalid promotional coupon code");
                        setAppliedPromo(null);
                      }
                    }}
                    className="px-5 py-3 bg-indigo-600 rounded-r-xl font-black text-xs text-white uppercase tracking-wider hover:bg-slate-900 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-[10px] font-black text-emerald-600 mt-2 flex items-center gap-1">
                    &bull; Promo Applied: {appliedPromo} ({appliedPromo === 'SAVE20' ? '20%' : appliedPromo === 'VIP90' ? '90%' : '50%'} Off)
                  </p>
                )}
                {promoError && (
                  <p className="text-[10px] font-black text-rose-500 mt-2">&bull; {promoError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Info */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 pb-2 border-b border-white/5">
                Order Summary
              </h3>

              <div className="space-y-4 text-xs font-bold">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Sublicenses Selected</span>
                  <span className="text-white text-sm font-black">{buySelectedPageIds.length} Page(s)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Subtotal Price</span>
                  <span className="text-white text-sm font-black">${(buySelectedPageIds.length * 10).toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Promo Discount</span>
                    <span className="text-sm font-black">
                      -${(() => {
                        const sub = buySelectedPageIds.length * 10;
                        if (appliedPromo === "SAVE20") return (sub * 0.2).toFixed(2);
                        if (appliedPromo === "VIP90") return (sub * 0.9).toFixed(2);
                        return (sub * 0.5).toFixed(2);
                      })()}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm text-indigo-300 font-black">Grand Total</span>
                  <span className="text-2xl font-black text-white">
                    ${(() => {
                      const sub = buySelectedPageIds.length * 10;
                      let disc = 0;
                      if (appliedPromo === "SAVE20") disc = sub * 0.2;
                      else if (appliedPromo === "VIP90") disc = sub * 0.9;
                      else if (appliedPromo === "WELCOME50" || appliedPromo === "SAVE50") disc = sub * 0.5;
                      return Math.max(0, sub - disc).toFixed(2);
                    })()}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => handleCreateOrder(buySelectedPageIds, appliedPromo || undefined)}
                disabled={buySelectedPageIds.length === 0}
                className="w-full mt-8 bg-indigo-600 font-black text-xs text-white uppercase tracking-widest py-4 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-none"
              >
                Create Order &rarr;
              </button>

              <p className="text-[9px] text-slate-500 font-semibold mt-4 text-center leading-relaxed">
                * Note: Each page gets 30 days added. Active pages are extended. Payment is securely managed via mock XPay integration gateway.
              </p>
            </div>

            <button 
              onClick={() => setBillingSubView('dashboard')}
              className="w-full py-4 text-center text-xs font-black uppercase text-slate-500 hover:text-slate-900 border border-slate-100 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-all cursor-pointer mb-8"
            >
              &larr; Cancel and Return
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: ORDERS ARCHIVE LIST */}
      {billingSubView === 'orders' && billingData && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-50 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-950">Subscription Invoices</h3>
              <p className="text-xs text-slate-400 font-bold">List of all historical page checkout orders.</p>
            </div>
            <button 
              onClick={() => setBillingSubView('buy')}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Plus className="w-4 h-4" /> New Order
            </button>
          </div>

          {(!billingData?.orders || billingData.orders.length === 0) ? (
            <div className="text-center py-20">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h4 className="font-black text-slate-900 text-base">No orders yet</h4>
              <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto mt-1 mb-6">Create a billing extension order to get subscription records.</p>
              <button 
                onClick={() => setBillingSubView('buy')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all cursor-pointer border-none"
              >
                Buy subscription
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border-none">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Created Date</th>
                    <th className="py-4 px-6">Quantity</th>
                    <th className="py-4 px-6">Billing Period</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {billingData.orders.map((ord: any) => (
                    <tr key={ord.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-6 font-mono text-xs font-black text-indigo-600">{ord.id}</td>
                      <td className="py-5 px-6 text-xs text-slate-500 font-bold">
                        {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-5 px-6 text-xs font-black text-slate-700">{ord.pages?.length || 0} Page(s)</td>
                      <td className="py-5 px-6 text-[10px] font-black text-slate-400 tracking-wider font-mono">
                        {new Date(ord.billing_period_start).toLocaleDateString()} - {new Date(ord.billing_period_end).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-6 text-sm font-black text-slate-950">${(ord.amount || 0).toFixed(2)}</td>
                      <td className="py-5 px-6">
                        {ord.status === "Paid" ? (
                          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider">Paid</span>
                        ) : ord.status === "Cancelled" ? (
                          <span className="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-wider">Cancelled</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-wider">Awaiting Payment</span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <button 
                          onClick={() => { setSelectedOrderId(ord.id); setBillingSubView('order-detail'); }}
                          className="text-xs font-black text-indigo-600 hover:text-slate-900 uppercase tracking-widest transition-colors border-none bg-transparent cursor-pointer font-sans"
                        >
                          View Item &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: ORDER DETAIL PAGE */}
      {billingSubView === 'order-detail' && billingData && (() => {
        const orderObj = billingData.orders.find((o: any) => o.id === selectedOrderId);
        if (!orderObj) {
          return (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-bold">
              Order record not found. Back to <button onClick={() => setBillingSubView('orders')} className="text-indigo-600 underline">Orders list</button>.
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left details pane */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-md p-8 space-y-6">
                {/* Header details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Order Receipt</span>
                    <h3 className="text-xl font-black text-slate-950 font-mono mt-1">{orderObj.id}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                      Created on {new Date(orderObj.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div>
                    {orderObj.status === "Paid" ? (
                      <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-xs font-black uppercase tracking-wider">Paid In-Full</span>
                    ) : orderObj.status === "Cancelled" ? (
                      <span className="px-3.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-wider">Cancelled</span>
                    ) : (
                      <span className="px-3.5 py-1.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-full text-xs font-black uppercase tracking-wider animate-pulse">Awaiting Payment</span>
                    )}
                  </div>
                </div>

                {/* Warning banner of Awaiting Payment status */}
                {orderObj.status === "Awaiting Payment" && (
                  <div className="p-5 bg-amber-50 border-2 border-amber-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-amber-900">Unpaid Checkout Order</h4>
                        <p className="text-[11px] text-amber-700 font-bold mt-0.5 leading-relaxed">
                          Complete terminal payment of <strong className="text-sm font-black text-amber-950">${(orderObj.amount || 0).toFixed(2)}</strong> to activate or extend your workspace license.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const numPages = orderObj.pages?.length || 1;
                        const uId = appUser?.email || 'ahsan.shabbir292@gmail.com';
                        const uEmail = encodeURIComponent(uId);
                        const oId = encodeURIComponent(orderObj.id);
                        const wsId = encodeURIComponent(orderObj.workspace_id || appUser?.workspaceId || uId);
                        const checkoutUrl = `https://messengerai.lemonsqueezy.com/checkout/buy/8e9d0f54-c033-4b21-a1c7-87f6a397de4c?quantity=${numPages}&checkout[email]=${uEmail}&checkout[custom][order_id]=${oId}&checkout[custom][user_id]=${uEmail}&checkout[custom][workspace_id]=${wsId}`;
                        window.open(checkoutUrl, '_blank');
                      }}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shrink-0 border-none cursor-pointer"
                    >
                      Pay Now
                    </button>
                  </div>
                )}

                {/* Pages contained in order */}
                <div className="text-left">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Line Items Subscriptions</h4>
                  <div className="divide-y divide-slate-50 border border-slate-100 bg-slate-50/20 rounded-2xl overflow-hidden">
                    {orderObj.pages?.map((p: any) => (
                      <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                            <Facebook className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 leading-tight">{p.name || `Page ${p.id}`}</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-1">Allocated License ID: {p.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-900">30 Days</p>
                          <p className="text-[10px] text-indigo-600 font-black mt-1">${(p.price || 10).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Period metadata */}
                <div className="p-4 bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 flex justify-between items-center">
                  <span>Billing Coverage Period</span>
                  <span className="font-black text-slate-900">
                    {new Date(orderObj.billing_period_start).toLocaleDateString()} &mdash; {new Date(orderObj.billing_period_end).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Right summary block */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 pb-2 border-b border-white/5">Order Summary</h3>
                
                <div className="space-y-3.5 text-xs font-bold text-slate-400 mb-6">
                  <div className="flex justify-between">
                    <span>Workspace Client</span>
                    <span className="text-white truncate max-w-[12rem]">{orderObj.workspace_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sublicenses (Pages)</span>
                    <span className="text-white">{orderObj.pages?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal Fee</span>
                    <span className="text-white">${((orderObj.pages?.length || 0) * 10).toFixed(2)}</span>
                  </div>
                  {orderObj.discountCode && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo coupon</span>
                      <span>{orderObj.discountCode}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm font-black text-indigo-400">Grand Total Due</span>
                    <span className="text-2xl font-black text-white">${(orderObj.amount || 0).toFixed(2)}</span>
                  </div>
                </div>

                {orderObj.status === "Awaiting Payment" && (
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        const numPages = orderObj.pages?.length || 1;
                        const uId = appUser?.email || 'ahsan.shabbir292@gmail.com';
                        const uEmail = encodeURIComponent(uId);
                        const oId = encodeURIComponent(orderObj.id);
                        const wsId = encodeURIComponent(orderObj.workspace_id || appUser?.workspaceId || uId);
                        const checkoutUrl = `https://messengerai.lemonsqueezy.com/checkout/buy/8e9d0f54-c033-4b21-a1c7-87f6a397de4c?quantity=${numPages}&checkout[email]=${uEmail}&checkout[custom][order_id]=${oId}&checkout[custom][user_id]=${uEmail}&checkout[custom][workspace_id]=${wsId}`;
                        window.open(checkoutUrl, '_blank');
                      }}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20 border-none"
                    >
                      Pay Now (Lemon Squeezy)
                    </button>
                    <button 
                      onClick={() => {
                        const pageIds = orderObj.pages?.map((p: any) => p.id) || [];
                        handleEditOrder(orderObj.id, pageIds, orderObj.discountCode);
                      }}
                      className="w-full py-3.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors cursor-pointer border-none"
                    >
                      Edit Order / Select
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => handleDeleteOrder(orderObj.id)}
                  className="w-full py-3.5 mt-3 border border-red-500/20 hover:border-red-500 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Delete Order Records
                </button>
              </div>

              <button 
                onClick={() => setBillingSubView('orders')}
                className="w-full py-4 bg-white border border-slate-100 hover:border-slate-300 text-slate-500 hover:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                &larr; Back to Order Invoices
              </button>
            </div>
          </div>
        );
      })()}

      {/* VIEW 5: PAYMENT CARD CHECKOUT */}
      {billingSubView === 'payment' && billingData && (() => {
        const orderObj = billingData.orders.find((o: any) => o.id === selectedOrderId);
        if (!orderObj) {
          return (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-bold">
              Order checkout target not found.
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Form: Credit Card Inputs */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-950">Secure Card Payment</h3>
                <p className="text-xs text-slate-400 font-bold">Add your simulated local billing details below. Gateway provided in Demo mode.</p>
              </div>

              {/* Card brand visual tags */}
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9.5px] font-black text-indigo-600 tracking-wide">VISA</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9.5px] font-black text-amber-600 tracking-wide">MASTERCARD</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9.5px] font-black text-sky-600 tracking-wide">DISCOVER</span>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 font-sans">
                  <Lock className="w-3" /> Secured by XPay
                </span>
              </div>

              {/* Payment inputs form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cardholderName || !cardNumber || !cardExpiry || !cardCvc) {
                    alert("Please fill in all layout payment fields.");
                    return;
                  }
                  handlePayOrder(orderObj.id);
                }}
                className="space-y-4 text-left"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">Cardholder Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Zain Ul Abideen"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      maxLength={19}
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => {
                        // Add spatial intervals for realistic card input visual
                        const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                        const parts = [];
                        for (let i = 0; i < v.length; i += 4) {
                          parts.push(v.substring(i, i + 4));
                        }
                        setCardNumber(parts.length > 0 ? parts.join(' ') : '');
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-mono"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-60">
                      <span className="w-7 h-4 bg-slate-200 rounded"></span>
                      <span className="w-5 h-4 bg-slate-300 rounded"></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">Expiry Date (MM/YY)</label>
                    <input 
                      type="text" 
                      required
                      maxLength={5}
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                        if (v.length >= 2) {
                          setCardExpiry(v.substring(0, 2) + '/' + v.substring(2, 4));
                        } else {
                          setCardExpiry(v);
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">CVC Security Code</label>
                    <input 
                      type="password" 
                      required
                      maxLength={3}
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-4 rounded-xl font-black text-xs bg-indigo-600 hover:bg-slate-900 active:scale-95 text-white uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-100 border-none"
                  >
                    {isProcessingPayment ? "Processing Transaction..." : `Pay $${(orderObj.amount || 0).toFixed(2)}`}
                  </button>
                </div>
              </form>
            </div>

            {/* Right column: checkout summary */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl space-y-4 text-left">
                <h4 className="text-xs font-black uppercase text-indigo-400 pb-2 border-b border-white/5 tracking-wider">Transaction Summary</h4>
                
                <div className="space-y-3.5 text-xs font-bold text-slate-400">
                  <div className="flex justify-between">
                    <span>Sublicenses Selected</span>
                    <span className="text-white">{orderObj.pages?.length || 0} Pages</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Licensing Rate</span>
                    <span className="text-white">$10.00 / Page</span>
                  </div>
                  {orderObj.discountCode && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo applied</span>
                      <span>{orderObj.discountCode}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center font-sans">
                    <span className="text-sm font-black text-indigo-400">Total Charge</span>
                    <span className="text-2xl font-black text-white">${(orderObj.amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => { setSelectedOrderId(orderObj.id); setBillingSubView('order-detail'); }}
                className="w-full py-4 bg-white border border-slate-100 hover:border-slate-300 text-slate-500 hover:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-center block"
              >
                &larr; Back to Order Detail
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
