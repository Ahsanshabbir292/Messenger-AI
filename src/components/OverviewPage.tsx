import React from 'react';
import { 
  Layers, MessageSquare, MessageCircle, CircleDollarSign, 
  Megaphone, Sparkles, Zap, Clock, ChevronRight, Facebook, 
  RefreshCw, Globe, CreditCard, Users, Settings, AlertCircle
} from 'lucide-react';
import { SafeAvatar } from './SafeAvatar';

interface OverviewPageProps {
  pages: any[];
  broadcastsHistory: any[];
  workspaceCredits: Record<string, number>;
  currentWorkspaceId: string;
  currentPlan: 'trial' | 'architect' | 'empire' | 'expired';
  userProfile: any;
  appUser: any;
  syncing: boolean;
  handleSyncPages: () => void | Promise<void>;
  setActiveTab: (tab: string) => void;
  setBillingSubView: (view: 'list' | 'buy' | 'history') => void;
  addToast: (message: string, type?: 'success' | 'err' | 'info') => void;
  setCurrentPlan?: (plan: 'trial' | 'architect' | 'empire' | 'expired') => void;
  onUpgradePlan?: () => void;
  conversations?: any[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  pages,
  broadcastsHistory,
  workspaceCredits,
  currentWorkspaceId,
  currentPlan,
  userProfile,
  appUser,
  syncing,
  handleSyncPages,
  setActiveTab,
  setBillingSubView,
  addToast,
  setCurrentPlan,
  onUpgradePlan,
  conversations = [],
}) => {
  const totalMessagesSent = broadcastsHistory.reduce((acc: number, curr: any) => acc + (curr.successCount || 0), 0);
  const remainingTrialCredits = Math.max(0, 5000 - totalMessagesSent);
  const totalCampaignsRun = broadcastsHistory.length;
  const totalConversationsCount = conversations.length;
  // Compute true messages exchanged this month (inbox logs + broadcast transmissions)
  const totalMessagesExchanged = conversations.reduce((acc: number, curr: any) => acc + (curr.messages?.data?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {/* Active Pages */}
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 sm:p-5 flex items-center gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E9EFFF] rounded-xl flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[#4F46E5]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">Active Pages</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{pages.length}</h4>
            </div>
          </div>
          <button onClick={() => setActiveTab('pages')} className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-indigo-600 text-[10px] sm:text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors">
            Manage pages <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Conversations */}
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 sm:p-5 flex items-center gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E8F8F0] rounded-xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">Conversations</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{totalConversationsCount.toLocaleString()}</h4>
            </div>
          </div>
          <button onClick={() => setActiveTab('chat')} className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-indigo-600 text-[10px] sm:text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors">
            View inbox <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Messages This Month */}
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full text-left">
          <div className="p-4 sm:p-5 flex items-center gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5F1FF] rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5CF6]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">Messages This Month</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{totalMessagesExchanged.toLocaleString()}</h4>
            </div>
          </div>
          <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-slate-400 text-[10px] sm:text-xs font-medium">
            Since current period
          </div>
        </div>

        {/* Credit Balance */}
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 sm:p-5 flex items-center gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FEF9E7] rounded-xl flex items-center justify-center shrink-0">
              <CircleDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">Credit Balance</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">${(workspaceCredits[currentWorkspaceId] || 0.00).toFixed(2)}</h4>
            </div>
          </div>
          <button onClick={() => setActiveTab('billing')} className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-indigo-600 text-[10px] sm:text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors">
            View billing <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Broadcasts */}
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 sm:p-5 flex items-center gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFF1F2] rounded-xl flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-[#F43F5E]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">Total Broadcasts</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{totalCampaignsRun.toLocaleString()}</h4>
            </div>
          </div>
          <button onClick={() => setActiveTab('broadcast')} className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-indigo-600 text-[10px] sm:text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors">
            Manage campaigns <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Trial Credit */}
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 sm:p-5 flex items-center gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E6F7F0] rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">Trial Credit</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{remainingTrialCredits.toLocaleString()}</h4>
            </div>
          </div>
          <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-slate-400 text-[10px] sm:text-xs font-semibold truncate">
            Out of 5,000 max
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Area: Page Status */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
            <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 flex items-center justify-between gap-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Page Status</h3>
              {setCurrentPlan && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shrink-0">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Preview State:</span>
                  <select
                    value={currentPlan}
                    onChange={(e) => {
                      setCurrentPlan(e.target.value as any);
                      addToast(`Switched page status preview to: ${e.target.value.toUpperCase()}`, "info");
                    }}
                    className="text-[10px] font-black text-slate-700 bg-transparent border-none outline-none cursor-pointer focus:ring-0 p-0"
                  >
                    <option value="trial">Free Trial</option>
                    <option value="architect">Architect Plan</option>
                    <option value="empire">Empire Plan</option>
                    <option value="expired">Expired State</option>
                  </select>
                </div>
              )}
            </div>
            
            {currentPlan === 'expired' ? (
              <div className="p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 sm:w-7 sm:h-7 stroke-[2]" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                      No Active Pages
                    </h4>
                    <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-red-100 text-red-600 border border-red-200">
                      Expired
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                    All page trials/subscriptions have expired. Subscribe to regain access to your inbox.
                  </p>
                  <button 
                    onClick={() => {
                      if (onUpgradePlan) {
                        onUpgradePlan();
                      } else {
                        setActiveTab('billing');
                        setBillingSubView('buy');
                        addToast("Opening billing subscriptions setup...", "info");
                      }
                    }}
                    className="mt-5 w-full sm:w-auto justify-center bg-[#2563EB] hover:bg-blue-750 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-200 active:scale-95 cursor-pointer border-none"
                  >
                    <Sparkles className="w-4 h-4" /> Subscribe Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${
                  currentPlan === 'empire' ? 'bg-purple-50 text-purple-600' :
                  currentPlan === 'architect' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {currentPlan === 'empire' ? <Sparkles className="w-6 sm:w-7 sm:h-7" /> :
                   currentPlan === 'architect' ? <Zap className="w-6 sm:w-7 sm:h-7" /> :
                   <Clock className="w-6 sm:w-7 sm:h-7" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {currentPlan === 'empire' ? 'Empire Plan' :
                       currentPlan === 'architect' ? 'Architect Plan' :
                       'Free Trial'}
                    </h4>
                    <span className={`inline-block self-center text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      currentPlan === 'empire' ? 'bg-purple-100 text-purple-700' :
                      currentPlan === 'architect' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-[#E9EFFF] text-[#4F46E5]'
                    }`}>
                      {currentPlan === 'empire' ? 'Premium Enterprise' :
                       currentPlan === 'architect' ? 'Active Subscription' :
                       '3 pages on trial'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                    {currentPlan === 'empire' ? (
                      <span>You are currently on the supreme <strong className="text-slate-800">Empire Plan</strong> ($199/mo). Unlimited Facebook pages authorized.</span>
                    ) : currentPlan === 'architect' ? (
                      <span>You have upgraded to the <strong className="text-slate-800">Architect Plan</strong> ($49/mo). 10 Synced Pages authorized under your subscription.</span>
                    ) : (
                      <span>Your pages have up to <span className="font-bold text-slate-700">3 days</span> remaining in trial.</span>
                    )}
                  </p>
                  <button 
                    onClick={() => {
                      if (onUpgradePlan) {
                        onUpgradePlan();
                      } else {
                        setActiveTab('billing');
                        setBillingSubView('buy');
                        addToast("Navigated to secure prepaid billing gateway", "info");
                      }
                    }}
                    className="mt-5 w-full sm:w-auto justify-center bg-[#2563EB] hover:bg-blue-750 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-lg shadow-blue-100 cursor-pointer border-none"
                  >
                    <Sparkles className="w-4 h-4" /> {currentPlan === 'trial' ? 'Upgrade Now' : 'Change Plan'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Sidebar Cards */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          {/* Facebook Account */}
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
            <div className="p-5 sm:p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Facebook Account</h3>
              <div className={`w-2 h-2 rounded-full ${userProfile ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-col xs:flex-row items-center xs:items-start text-center xs:text-left gap-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-slate-50 shadow-sm bg-slate-50">
                    <SafeAvatar src={userProfile?.picture?.data?.url} name={userProfile?.name || appUser?.fullName || "User"} className="w-full h-full" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-[#EBF5FF] border-2 border-white rounded-full flex items-center justify-center">
                    <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1877F2]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-base sm:text-lg leading-tight truncate">
                    {userProfile?.name || appUser?.fullName || "Not Connected"}
                  </p>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-1">
                    {userProfile ? "Synchronization active" : "Integration required"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {!userProfile ? (
                  <button 
                    onClick={handleSyncPages}
                    disabled={syncing}
                    className="w-full py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-[0.98]"
                  >
                    {syncing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Facebook className="w-4 h-4" />
                        Connect Facebook
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button 
                      onClick={handleSyncPages}
                      className="w-full py-2.5 border border-slate-100 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh Permissions
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400">Linked Assets</span>
                  <span className="text-slate-900 font-bold">{pages.length} Pages</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
            <div className="p-5 sm:p-6 border-b border-slate-50">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Quick Actions</h3>
            </div>
            <div className="flex flex-col divide-y divide-slate-50">
              {[
                { label: 'Manage Pages', icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />, tab: 'pages' },
                { label: 'Billing & Orders', icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />, tab: 'billing' },
                { label: 'Manage Team', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, tab: 'team' },
                { label: 'Workspace Settings', icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />, tab: 'settings' }
              ].map((action, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTab(action.tab)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {action.icon}
                    </div>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm">{action.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
