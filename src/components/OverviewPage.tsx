import React from 'react';
import axios from 'axios';
import { 
  Layers, MessageSquare, MessageCircle, CircleDollarSign, 
  Megaphone, Sparkles, Zap, Clock, ChevronRight, Facebook, 
  RefreshCw, Globe, CreditCard, Users, Settings, AlertCircle, X
} from 'lucide-react';
import { SafeAvatar } from './SafeAvatar';

interface OverviewPageProps {
  pages: any[];
  broadcastsHistory: any[];
  creditBalance: number;
  currentWorkspaceId: string;
  currentPlan: any;
  userProfile: any;
  appUser: any;
  syncing: boolean;
  handleSyncPages: () => void | Promise<void>;
  setActiveTab: (tab: string) => void;
  setBillingSubView: (view: any) => void;
  addToast: (message: string, type?: 'success' | 'err' | 'info') => void;
  setCurrentPlan?: (plan: any) => void;
  onUpgradePlan?: () => void;
  conversations?: any[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  pages,
  broadcastsHistory,
  creditBalance,
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

  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = React.useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('dismissed_announcements');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    axios.get('/api/announcements')
      .then(res => {
        if (res.data && res.data.announcements) {
          setAnnouncements(res.data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  const dismissAnnouncement = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem('dismissed_announcements', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const activeAnnouncements = announcements.filter(a => a.id && !dismissedIds.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* System Announcement Banner */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100/70 p-5 rounded-3xl relative overflow-hidden shadow-sm animate-in fade-in duration-300">
          <button 
            onClick={() => dismissAnnouncement(activeAnnouncements[0].id)}
            className="absolute right-4 top-4 p-1.5 hover:bg-indigo-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors z-10"
            aria-label="Dismiss Announcement"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <Megaphone className="w-24 h-24 text-indigo-600" />
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shrink-0 mt-0.5">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="pr-8">
              <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-wider font-mono">
                Official System Announcement
              </span>
              <h4 className="text-sm font-black text-slate-900 mt-1">{activeAnnouncements[0].title}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-wrap">{activeAnnouncements[0].content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
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

        {/* Credit Balance */}
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 sm:p-5 flex items-center gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E6F7F0] rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981]" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">Credit Balance</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{(creditBalance ?? 0).toLocaleString()}</h4>
            </div>
          </div>
          <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-slate-400 text-[10px] sm:text-xs font-semibold truncate">
            Available credits
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Area: Page Status */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
            <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 flex items-center justify-between gap-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Page Status</h3>
            </div>
            
            {(() => {
              const getPlanDetails = (planId: string | null) => {
                const defaultTrial = {
                  name: "3-Day Free Trial",
                  isTrial: true,
                  color: "bg-amber-50 text-amber-600",
                  badgeClass: "bg-amber-100 text-amber-700",
                  icon: <Clock className="w-6 sm:w-7 sm:h-7" />,
                  desc: "Your pages have up to 3 days remaining in trial."
                };

                if (!planId || planId === 'trial') {
                  return defaultTrial;
                }

                const lowerId = planId.toLowerCase().trim();
                switch (lowerId) {
                  case "starter":
                    return { name: "Starter Package", isTrial: false, color: "bg-indigo-50 text-indigo-600", badgeClass: "bg-indigo-100 text-indigo-700", icon: <Zap className="w-6 sm:w-7 sm:h-7" />, desc: "You are currently on the Starter Plan. 1 Synced Page authorized." };
                  case "growth":
                    return { name: "Growth Package", isTrial: false, color: "bg-blue-50 text-blue-600", badgeClass: "bg-blue-100 text-blue-700", icon: <Zap className="w-6 sm:w-7 sm:h-7" />, desc: "You are currently on the Growth Plan. Up to 3 Synced Pages authorized." };
                  case "pro":
                    return { name: "Pro Package", isTrial: false, color: "bg-purple-50 text-purple-600", badgeClass: "bg-purple-100 text-purple-700", icon: <Layers className="w-6 sm:w-7 sm:h-7" />, desc: "You are currently on the Pro Plan. Up to 10 Synced Pages authorized." };
                  case "business":
                    return { name: "Business Package", isTrial: false, color: "bg-pink-50 text-pink-600", badgeClass: "bg-pink-100 text-pink-700", icon: <Sparkles className="w-6 sm:w-7 sm:h-7" />, desc: "You are currently on the Business Plan. Unlimited Synced Pages authorized." };
                  case "enterprise":
                    return { name: "Enterprise Package", isTrial: false, color: "bg-emerald-50 text-emerald-600", badgeClass: "bg-emerald-100 text-emerald-700", icon: <Layers className="w-6 sm:w-7 sm:h-7" />, desc: "You are currently on the Enterprise Plan. Unlimited Synced Pages authorized." };
                  default:
                    return defaultTrial;
                }
              };

              const planDetails = getPlanDetails(currentPlan);

              if (currentPlan === 'expired') {
                return (
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
                );
              }

              return (
                <div className="p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${planDetails.color}`}>
                    {planDetails.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 justify-center sm:justify-start">
                      <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {planDetails.name}
                      </h4>
                      <span className={`inline-block self-center text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${planDetails.badgeClass}`}>
                        {planDetails.isTrial ? 'Trial Mode' : 'Active Subscription'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                      {planDetails.desc}
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
                      className={`mt-6 w-full sm:w-auto justify-center px-6 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
                        planDetails.isTrial
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none'
                          : 'bg-[#2563EB] hover:bg-blue-750 text-white border-none'
                      }`}
                    >
                      {planDetails.isTrial ? (
                        <>
                          <Zap className="w-4 h-4 text-amber-100 fill-amber-100" /> Unlock Connection Limit
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 opacity-80" /> Change Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}
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
