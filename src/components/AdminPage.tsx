import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart2, Users, CreditCard, Layers, Megaphone, Bell, Shield, ShieldAlert, 
  Trash2, Search, Filter, RefreshCw, X, CheckSquare, Settings, Check, 
  ChevronRight, AlertTriangle, Play, Pause, Circle, Calendar, List, 
  Plus, DollarSign, Ban, Unlock, UserCheck, Trash, UserMinus, HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

interface AdminPageProps {
  appUser: any;
  onLogout: () => void | Promise<void>;
  navigateTo: (path: string) => void;
}

type AdminTab = 'dashboard' | 'users' | 'credits' | 'subscriptions' | 'pages' | 'broadcasts' | 'teams' | 'announcements' | 'billing';

export default function AdminPage({ appUser, onLogout, navigateTo }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  // Filtering states
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'suspended' | 'active'>('all');
  const [broadcastSearch, setBroadcastSearch] = useState('');
  const [broadcastFilter, setBroadcastFilter] = useState('all');
  const [pageSearch, setPageSearch] = useState('');

  // Loading & refresh triggers
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Selected details modal state
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userBroadcasts, setUserBroadcasts] = useState<any[]>([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  // Operation Modals
  const [creditsModal, setCreditsModal] = useState<{ isOpen: boolean; email: string; currentCredits: number; isTrial?: boolean }>({
    isOpen: false,
    email: '',
    currentCredits: 0,
    isTrial: false
  });
  const [creditAmount, setCreditAmount] = useState<number>(100);
  const [creditMode, setCreditMode] = useState<'set' | 'add' | 'deduct'>('add');

  const [subModal, setSubModal] = useState<{ isOpen: boolean; email: string; pageId: string; pageName: string; currentEnd: string }>({
    isOpen: false,
    email: '',
    pageId: '',
    pageName: '',
    currentEnd: ''
  });
  const [subDays, setSubDays] = useState<number>(30);

  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });

  // Toast alert states
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'danger' | 'info' }[]>([]);

  const addToast = (msg: string, type: 'success' | 'danger' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Fetch admin verification and state
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const verifyRes = await axios.post('/api/admin/verify');
        if (!verifyRes.data.success) {
          addToast("Admin verification failed. Redirection active.", "danger");
          navigateTo('/overview');
          return;
        }

        // Parallel retrieval of stats and details
        const [statsRes, usersRes, broadcastsRes, pagesRes, announcementsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/users'),
          axios.get('/api/admin/broadcasts'),
          axios.get('/api/admin/pages'),
          axios.get('/api/announcements').catch(() => ({ data: { announcements: [] } }))
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data.users || []);
        setBroadcasts(broadcastsRes.data.broadcasts || []);
        setPages(pagesRes.data.pages || []);
        setOrders(statsRes.data.orders || []);
        setAnnouncements(announcementsRes.data.announcements || []);
      } catch (err: any) {
        console.error("Failed to load administrative overview:", err);
        addToast(err.response?.data?.error || "Error fetching admin data", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  // View User Full Details
  const viewUserDetails = async (email: string) => {
    setLoadingUserDetails(true);
    try {
      const userRes = await axios.get(`/api/admin/users/${encodeURIComponent(email)}`);
      setSelectedUser(userRes.data.user);
      
      const bcastRes = await axios.get(`/api/admin/users/${encodeURIComponent(email)}/broadcasts`);
      setUserBroadcasts(bcastRes.data.broadcasts || []);
    } catch (err: any) {
      addToast("Failed to fetch user details", "danger");
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Delete User Action
  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete user ${email}? This action wipes all Firestore assets and is completely irreversible.`)) return;
    try {
      await axios.delete(`/api/admin/users/${encodeURIComponent(email)}`);
      addToast(`Permanently deleted user ${email}`, "success");
      setSelectedUser(null);
      handleRefresh();
    } catch (err: any) {
      addToast(err.response?.data?.error || "Failed to delete user", "danger");
    }
  };

  // Suspend User Action
  const handleToggleSuspend = async (email: string, currentSuspended: boolean) => {
    try {
      const endpoint = currentSuspended ? 'unsuspend' : 'suspend';
      await axios.post(`/api/admin/users/${encodeURIComponent(email)}/${endpoint}`);
      addToast(`User ${email} ${currentSuspended ? 'unsuspended' : 'suspended'} successfully`, "success");
      if (selectedUser?.email === email) {
        setSelectedUser((prev: any) => ({ ...prev, suspended: !currentSuspended }));
      }
      handleRefresh();
    } catch (err: any) {
      addToast(err.response?.data?.error || "Action failed", "danger");
    }
  };

  // Set / Add Credits Action
  const handleUpdateCredits = async () => {
    if (!creditsModal.email) return;
    try {
      const endpoint = creditsModal.isTrial 
        ? `/api/admin/users/${encodeURIComponent(creditsModal.email)}/trial-credits` 
        : `/api/admin/users/${encodeURIComponent(creditsModal.email)}/credits`;

      await axios.post(endpoint, {
        mode: creditMode,
        amount: creditAmount
      });
      addToast(`${creditsModal.isTrial ? 'Trial credits' : 'Standard credits'} updated successfully for ${creditsModal.email}`, "success");
      setCreditsModal(prev => ({ ...prev, isOpen: false }));
      handleRefresh();
      if (selectedUser?.email === creditsModal.email) {
        viewUserDetails(creditsModal.email);
      }
    } catch (err: any) {
      addToast(err.response?.data?.error || `Failed to update ${creditsModal.isTrial ? "trial credits" : "credits"}`, "danger");
    }
  };

  // Reactivate Trial Action
  const handleReactivateTrial = async (email: string) => {
    if (!window.confirm(`Are you sure you want to reactivate the trial for ${email}? This will unlock the page limit and reset trial credits.`)) return;
    try {
      await axios.post(`/api/admin/users/${encodeURIComponent(email)}/reactivate-trial`);
      addToast(`Trial successfully reactivated for ${email}`, "success");
      handleRefresh();
      if (selectedUser?.email === email) {
        viewUserDetails(email);
      }
    } catch (err: any) {
      addToast(err.response?.data?.error || "Failed to reactivate trial", "danger");
    }
  };

  // Disconnect Facebook Action
  const handleDisconnectFacebook = async (email: string) => {
    if (!window.confirm(`Warning: Are you sure you want to disconnect Facebook for ${email}? This will delete connected profiles, pages, and cached credentials.`)) return;
    try {
      await axios.post(`/api/admin/users/${encodeURIComponent(email)}/disconnect-facebook`);
      addToast(`Facebook connection disconnected for ${email}`, "success");
      handleRefresh();
      if (selectedUser?.email === email) {
        viewUserDetails(email);
      }
    } catch (err: any) {
      addToast(err.response?.data?.error || "Failed to disconnect Facebook", "danger");
    }
  };

  // Bulk Add Credits Action
  const handleBulkAddCredits = async () => {
    const amountStr = prompt("Enter standard credits amount to add to ALL registered users in bulk:");
    if (!amountStr) return;
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive integer.");
      return;
    }
    if (!window.confirm(`Confirm: bulk add ${amount} credits to ALL users?`)) return;

    try {
      await axios.post(`/api/admin/users/all/credits`, {
        mode: 'add',
        amount,
        bulk: true
      });
      addToast(`Bulk added ${amount} credits to all system workspaces`, "success");
      handleRefresh();
    } catch (err: any) {
      addToast("Failed to run bulk credit update", "danger");
    }
  };

  // Subscription Mechanics
  const handleUpdateSubscription = async (action: 'activate' | 'expire' | 'extend' | 'cancel') => {
    if (!subModal.email || !subModal.pageId) return;
    try {
      await axios.post(`/api/admin/users/${encodeURIComponent(subModal.email)}/subscription`, {
        pageId: subModal.pageId,
        action,
        days: subDays
      });
      addToast(`Subscription modified successfully (${action})`, "success");
      setSubModal(prev => ({ ...prev, isOpen: false }));
      handleRefresh();
    } catch (err: any) {
      addToast(err.response?.data?.error || "Failed to update subscription", "danger");
    }
  };

  // Disconnect connected Facebook page from user workspace
  const handleDisconnectPage = async (ownerEmail: string, pageId: string) => {
    if (!window.confirm("Verify: disconnect other user's connected page? This stops campaign execution, synchronizations, and active automation threads for this specific Facebook page.")) return;
    try {
      await axios.post(`/api/admin/users/${encodeURIComponent(ownerEmail)}/subscription`, {
        pageId: pageId,
        action: 'cancel'
      });
      addToast("Page disconnected successfully", "success");
      handleRefresh();
    } catch (err: any) {
      addToast("Failed to disconnect facebook page", "danger");
    }
  };

  // Cancel any running transmission broadcast Campaign
  const handleCancelBroadcast = async (ownerEmail: string, bcastId: string) => {
    if (!window.confirm("Confirm cancelling this active message transmission broadcast campaign? This immediately pauses and marks the document as Cancelled.")) return;
    try {
      // Direct leverage of existing client/action-based endpoints or admin specific handler
      await axios.post(`/api/facebook/broadcasts/cancel`, { email: ownerEmail }, {
        params: { id: bcastId }
      });
      addToast("Broadcast campaign cancellation transmitted", "success");
      handleRefresh();
    } catch (err: any) {
      addToast("Failed to cancel system broadcast", "danger");
    }
  };

  // Create system announcements
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) {
      addToast("Both template title and announcement context are strictly required.", "danger");
      return;
    }
    try {
      await axios.post('/api/admin/announce', announcementForm);
      addToast("Announcement written and transmitted to active user panels", "success");
      setAnnouncementForm({ title: '', content: '' });
      handleRefresh();
    } catch (err: any) {
      addToast("Failed to write system announcement modal", "danger");
    }
  };

  // Manual payment updates
  const handleMarkOrderPaid = async (ownerEmail: string, orderId: string) => {
    if (!window.confirm("Confirm making this pending payment transaction manually marked as Paid? This unlocks and extends associated page subscriptions.")) return;
    try {
      await axios.post(`/api/billing/order/${orderId}/pay`, {}, {
        headers: { 'x-user-email': ownerEmail }
      });
      addToast(`Order ${orderId} reconciled as Paid. Active page subscriptions updated.`, "success");
      handleRefresh();
    } catch (err: any) {
      addToast("Failed to reconcile payment transaction", "danger");
    }
  };

  // Dynamic status filters
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email?.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.workspaceId?.toLowerCase().includes(userSearch.toLowerCase());
    if (userFilter === 'suspended') return matchesSearch && u.suspended === true;
    if (userFilter === 'active') return matchesSearch && !u.suspended;
    return matchesSearch;
  });

  const filteredBroadcasts = broadcasts.filter(b => {
    const matchesSearch = b.name?.toLowerCase().includes(broadcastSearch.toLowerCase()) || 
                          b.pageName?.toLowerCase().includes(broadcastSearch.toLowerCase()) ||
                          b.ownerEmail?.toLowerCase().includes(broadcastSearch.toLowerCase());
    if (broadcastFilter !== 'all') return matchesSearch && b.status === broadcastFilter;
    return matchesSearch;
  });

  const filteredPages = pages.filter(p => {
    return p.name?.toLowerCase().includes(pageSearch.toLowerCase()) || 
           p.id?.toLowerCase().includes(pageSearch.toLowerCase()) ||
           p.ownerEmail?.toLowerCase().includes(pageSearch.toLowerCase());
  });

  // Calculate high level numbers
  const totalCreditsInSystem = users.reduce((acc, curr) => acc + (curr.credits || 0), 0);
  const totalActiveSubscriptions = pages.filter(p => p.status === 'Active' || p.status === 'Active Subscription').length;
  const totalRevenue = orders.filter(o => o.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium font-mono text-xs tracking-widest animate-pulse">BOOTSTRAPPING PORTAL CONTROLS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Floating Sparkles & Gradients background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Floating Action Toasts */}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm w-full">
        {toasts.map(t => (
          <div key={t.id} className={`p-4 rounded-2xl border text-sm font-semibold flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${t.type === 'success' ? 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200' : t.type === 'danger' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <span>{t.msg}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-current/50 hover:text-current ml-3">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* SIDEBAR NAVIGATION CONTROL */}
      <aside className="w-full md:w-80 bg-slate-900/40 backdrop-blur-3xl border-b md:border-b-0 md:border-r border-slate-800/60 p-6 flex flex-col justify-between shrink-0 relative z-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wider uppercase text-indigo-400">ADMIN CONTROL</h2>
              <p className="text-[10px] text-slate-500 font-bold font-mono">PERSEUS ENTERPRISE</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Overview Panel', icon: BarChart2 },
              { id: 'users', label: 'User Workspaces', icon: Users },
              { id: 'credits', label: 'Credits Matrix', icon: DollarSign },
              { id: 'subscriptions', label: 'Page Subscriptions', icon: CreditCard },
              { id: 'pages', label: 'Facebook Pages', icon: Layers },
              { id: 'broadcasts', label: 'Broadcast History', icon: Megaphone },
              { id: 'teams', label: 'Team Alliances', icon: CheckSquare },
              { id: 'announcements', label: 'Announcements', icon: Bell },
              { id: 'billing', label: 'Orders & Reconciles', icon: List }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/80 mt-8 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-xs font-black text-indigo-300 border border-indigo-500/10">
              AH
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Ahsan Shabbir</p>
              <p className="text-[10px] text-indigo-400/80 font-medium truncate">Master Administrator</p>
            </div>
          </div>
          <button 
            onClick={() => navigateTo('/overview')}
            className="w-full py-2.5 px-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-colors border border-slate-800 flex items-center justify-center gap-2"
          >
            Go back to App
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full relative z-10">
        
        {/* TOP ROW */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-slate-800/50">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Perseus Bot Dashboard</span>
              <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono py-0.5 px-2 rounded-full uppercase tracking-wider font-semibold">
                SYSTEM CORE LIVE
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Operational command center, metric reconciliations, subscription limits, and server-authoritative parameters override.</p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Full Data Sync</span>
            </button>
          </div>
        </header>

        {/* TAB CONTENTS CONTAINER */}
        <div className="space-y-8">
          
          {/* TAB 1: OVERVIEW PANEL */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Metric stats card deck */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                {[
                  { title: "Total Accounts", value: users.length, description: "All-time registrations", color: "from-blue-600 to-indigo-600" },
                  { title: "Total Broadcasts", value: broadcasts.length, description: "Sent across platform", color: "from-purple-600 to-indigo-600" },
                  { title: "Active Page Lines", value: totalActiveSubscriptions, description: "Live page endpoints", color: "from-emerald-600 to-teal-600" },
                  { title: "System Credits", value: totalCreditsInSystem, description: "Aggregated wallet size", color: "from-yellow-600 to-amber-600" },
                  { title: "Reconciled Revenue", value: `$${totalRevenue.toLocaleString()}`, description: "Platform invoice aggregate", color: "from-rose-600 to-pink-600" },
                  { title: "Live Facebook Pages", value: pages.length, description: "Connected fb objects", color: "from-indigo-600 to-fuchsia-600" }
                ].map((card, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl hover:border-slate-700/80 transition-all flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">{card.title}</p>
                      <h3 className="text-2xl font-black text-white leading-none mt-2">{card.value}</h3>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-3">{card.description}</p>
                  </div>
                ))}
              </div>

              {/* Chart segment */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue & Accounts Activity Chart */}
                <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl relative overflow-hidden">
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-6 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-500" /> Platform Billing & Growth Chart
                  </h4>
                  <div className="h-64 sm:h-80 w-full font-mono text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={orders.slice(-10)}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="created_at" stroke="#64748b" tickFormatter={(v) => v ? new Date(v).toLocaleDateString() : ''} />
                        <YAxis stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                        <Area type="monotone" dataKey="amount" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" name="Order Revenue ($)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Subscriptions distribution structure */}
                <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-6 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-500" /> Subscription distribution
                    </h4>
                    <div className="space-y-4">
                      {[
                        { status: "Active Premium Line", count: pages.filter(p => p.status === 'Active' || p.status === 'Active Subscription').length, pct: pages.length ? Math.round((pages.filter(p => p.status === 'Active' || p.status === 'Active Subscription').length / pages.length) * 100) : 0, color: "bg-emerald-500" },
                        { status: "Trial & Evaluation", count: pages.filter(p => p.status === 'Trial').length, pct: pages.length ? Math.round((pages.filter(p => p.status === 'Trial').length / pages.length) * 100) : 0, color: "bg-indigo-500" },
                        { status: "Expired or Past Due", count: pages.filter(p => p.status === 'Expired' || p.status === 'Disabled').length, pct: pages.length ? Math.round((pages.filter(p => p.status === 'Expired' || p.status === 'Disabled').length / pages.length) * 100) : 0, color: "bg-rose-500" }
                      ].map((subItem, sIdx) => (
                        <div key={sIdx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-400">{subItem.status} ({subItem.count})</span>
                            <span className="text-white">{subItem.pct}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`${subItem.color} h-full`} style={{ width: `${subItem.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal mt-6 font-medium">Auto-synced and resolved across connected Facebook messenger access lines.</p>
                </div>

              </div>

              {/* Recent Orders Overview */}
              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-6 flex items-center gap-2">
                  Recent payment logs
                </h4>
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-xs text-left text-slate-400">
                    <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/60 pb-3">
                      <tr>
                        <th className="py-3">Order ID</th>
                        <th className="py-3">Workspace owner</th>
                        <th className="py-3">Created</th>
                        <th className="py-3">Amount</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.slice(-5).reverse().map((item, idx) => (
                        <tr key={`${item.workspace_id || 'system'}-order-${item.id || idx}`} className="hover:bg-slate-900/30">
                          <td className="py-3.5 font-bold font-mono tracking-wider text-white">{item.id}</td>
                          <td className="py-3.5 font-semibold text-slate-300">{item.workspace_id}</td>
                          <td className="py-3.5 font-semibold text-slate-400">{new Date(item.created_at).toLocaleDateString()}</td>
                          <td className="py-3.5 font-black text-emerald-400">${item.amount}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {item.status !== 'Paid' && (
                              <button 
                                onClick={() => handleMarkOrderPaid(item.workspace_id, item.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 font-bold font-sans text-[10px] text-white rounded-lg transition-colors cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: USER WORKSPACES */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Filter controls bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by workspace, full name, or email address..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-11 pr-5 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-600 rounded-2xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={userFilter}
                    onChange={(e: any) => setUserFilter(e.target.value)}
                    className="flex-1 sm:flex-initial bg-slate-900 border border-slate-800 focus:border-indigo-600 px-4 py-2.5 rounded-2xl text-xs font-bold focus:outline-none"
                  >
                    <option value="all">All Registrants</option>
                    <option value="suspended">Suspended Accounts Only</option>
                    <option value="active">Active Accounts Only</option>
                  </select>
                </div>
              </div>

              {/* Users list grid table */}
              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl">
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-xs text-left text-slate-400">
                    <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/60 pb-3">
                      <tr>
                        <th className="py-3">Email Address</th>
                        <th className="py-3">Workspace name</th>
                        <th className="py-3">Join Date</th>
                        <th className="py-3">Credits</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredUsers.map((u) => (
                        <tr key={u.email} className="hover:bg-slate-905/30 transition-all cursor-pointer" onClick={() => viewUserDetails(u.email)}>
                          <td className="py-3.5">
                            <div>
                              <p className="font-bold text-white">{u.fullName || 'No Name Provided'}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{u.email}</p>
                            </div>
                          </td>
                          <td className="py-3.5 font-bold text-slate-300">{u.workspaceName || `${u.fullName}'s Workspace`}</td>
                          <td className="py-3.5 font-semibold text-slate-400">
                            {u.createdAt ? (
                              typeof u.createdAt === 'string' ? new Date(u.createdAt).toLocaleDateString() : 'Active Member'
                            ) : 'Platform Original'}
                          </td>
                           <td className="py-3.5">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-500 font-extrabold uppercase">BAL:</span>
                                <span className="font-mono font-black text-indigo-400">${(u.credits || 0.00).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-500 font-extrabold uppercase">TRIAL:</span>
                                <span className="font-mono font-black text-yellow-500">${(u.trialCredits || 0.00).toFixed(2)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${u.suspended ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                              {u.suspended ? 'Suspended' : 'Active'}
                            </span>
                          </td>
                          <td className="py-3.5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => {
                                setCreditsModal({
                                  isOpen: true,
                                  email: u.email,
                                  currentCredits: u.credits || 0,
                                  isTrial: false
                                });
                                setCreditAmount(100);
                              }}
                              className="px-2 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/10 rounded-xl text-[10px] font-black transition-colors cursor-pointer"
                            >
                              Bal +/-
                            </button>
                            <button 
                              onClick={() => {
                                setCreditsModal({
                                  isOpen: true,
                                  email: u.email,
                                  currentCredits: u.trialCredits || 0,
                                  isTrial: true
                                });
                                setCreditAmount(100);
                              }}
                              className="px-2 py-1.5 bg-yellow-600/10 hover:bg-yellow-505 text-yellow-300 hover:text-white border border-yellow-500/10 rounded-xl text-[10px] font-black transition-colors cursor-pointer"
                            >
                              Trial +/-
                            </button>
                            <button 
                              onClick={() => handleToggleSuspend(u.email, !!u.suspended)}
                              className={`px-2.5 py-1.5 border rounded-xl text-[10px] font-black transition-colors cursor-pointer ${u.suspended ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-600 hover:text-white' : 'bg-rose-600/10 border-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white'}`}
                            >
                              {u.suspended ? 'Unsuspend' : 'Suspend'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.email)}
                              className="px-2.5 py-1.5 bg-rose-650/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/10 rounded-xl text-[10px] font-black transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CREDITS MATRIX */}
          {activeTab === 'credits' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Actions Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-slate-900/30 border border-slate-800/80 rounded-3xl gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">Universal Credit Modifier Hub</h4>
                  <p className="text-slate-400 text-xs mt-1">Allows bulk credit modifications, custom addition allocations, or setting balances to exact figures for all clients.</p>
                </div>
                <button
                  onClick={handleBulkAddCredits}
                  className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 self-start cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Bulk Add Credits (All Users)
                </button>
              </div>

              {/* Credits balancing list */}
              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl">
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-xs text-left text-slate-400">
                    <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/60 pb-3">
                      <tr>
                        <th className="py-3">Member email</th>
                        <th className="py-3">Full Name</th>
                        <th className="py-3">Current Credit Balance</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {users.map((u) => (
                        <tr key={u.email} className="hover:bg-slate-900/10">
                          <td className="py-3.5 font-bold text-slate-300">{u.email}</td>
                          <td className="py-3.5 font-extrabold text-white">{u.fullName || 'No Name Provided'}</td>
                          <td className="py-3.5">
                            <div className="flex flex-col gap-0.5">
                              <div>
                                <span className="text-[10px] text-slate-500 font-extrabold uppercase mr-1">Bal:</span>
                                <span className="font-mono text-medium font-black text-indigo-400">${(u.credits || 0.00).toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 font-extrabold uppercase mr-1">Trial:</span>
                                <span className="font-mono text-medium font-black text-yellow-500">${(u.trialCredits || 0.00).toFixed(2)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setCreditsModal({
                                  isOpen: true,
                                  email: u.email,
                                  currentCredits: u.credits || 0,
                                  isTrial: false
                                });
                                setCreditAmount(100);
                              }}
                              className="px-3 py-1.5 bg-indigo-650 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/10 rounded-xl text-[10px] transition-colors cursor-pointer"
                            >
                              Bal +/-
                            </button>
                            <button 
                              onClick={() => {
                                setCreditsModal({
                                  isOpen: true,
                                  email: u.email,
                                  currentCredits: u.trialCredits || 0,
                                  isTrial: true
                                });
                                setCreditAmount(100);
                              }}
                              className="px-3 py-1.5 bg-yellow-600 hover:bg-slate-800 text-yellow-300 hover:text-white border border-yellow-500/10 rounded-xl text-[10px] transition-colors cursor-pointer"
                            >
                              Trial +/-
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: PAGE SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6 animate-in fade-in duration-300">

              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl">
                <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-6">
                  Page billing subscriptions list
                </h4>
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-xs text-left text-slate-400">
                    <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/60 pb-3">
                      <tr>
                        <th className="py-3">Page Name (ID)</th>
                        <th className="py-3">Workspace owner</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Expiry target</th>
                        <th className="py-3 text-right">Overrides</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {users.flatMap(u => {
                        const subsMap = u.billing?.subscriptions || {};
                        return Object.keys(subsMap).map(pageId => {
                          const sub = subsMap[pageId];
                          return (
                            <tr key={`${u.email}-${pageId}`} className="hover:bg-slate-900/10">
                              <td className="py-3.5">
                                <div>
                                  <p className="font-bold text-white">{sub.name || `Page ${pageId}`}</p>
                                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {pageId}</p>
                                </div>
                              </td>
                              <td className="py-3.5 font-bold text-slate-300">{u.email}</td>
                              <td className="py-3.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  sub.status === 'Active' || sub.status === 'Active Subscription' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                  sub.status === 'Trial' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {sub.status || "Trial"}
                                </span>
                              </td>
                              <td className="py-3.5 font-semibold text-slate-400">
                                {sub.subscription_ends_at ? new Date(sub.subscription_ends_at).toLocaleDateString() : 
                                 sub.trial_ends_at ? `${new Date(sub.trial_ends_at).toLocaleDateString()} (Trial)` : 'No target date'}
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  onClick={() => {
                                    setSubModal({
                                      isOpen: true,
                                      email: u.email,
                                      pageId,
                                      pageName: sub.name || `Page ${pageId}`,
                                      currentEnd: sub.subscription_ends_at || sub.trial_ends_at || ''
                                    });
                                    setSubDays(30);
                                  }}
                                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                  Modify Period
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: FACEBOOK PAGES */}
          {activeTab === 'pages' && (
            <div className="space-y-6 animate-in fade-in duration-300">

              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter pages by name, ID, or owner..."
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  className="w-full pl-11 pr-5 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-600 rounded-2xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl">
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-xs text-left text-slate-400">
                    <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/60 pb-3">
                      <tr>
                        <th className="py-3">Page Name (ID)</th>
                        <th className="py-3">Owner address</th>
                        <th className="py-3">Subscribers</th>
                        <th className="py-3">Last Synchronized</th>
                        <th className="py-3 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredPages.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/10">
                          <td className="py-3.5 font-bold text-white">
                            <div>
                              <span>{p.name}</span>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {p.id}</p>
                            </div>
                          </td>
                          <td className="py-3.5 font-semibold text-indigo-400">{p.ownerEmail}</td>
                          <td className="py-3.5 font-bold text-white">{p.subscribersCount ?? 0} subscribers</td>
                          <td className="py-3.5 font-semibold text-slate-400">
                            {p.lastSyncTime ? new Date(p.lastSyncTime).toLocaleString() : 'Never Synced'}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDisconnectPage(p.ownerEmail, p.id)}
                              className="px-3.5 py-1.5 bg-rose-650/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/10 rounded-xl text-xs font-black transition-colors cursor-pointer"
                            >
                              Disconnect Page
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: BROADCAST HISTORY */}
          {activeTab === 'broadcasts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by broadcast template, page name, or owner email..."
                    value={broadcastSearch}
                    onChange={(e) => setBroadcastSearch(e.target.value)}
                    className="w-full pl-11 pr-5 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-600 rounded-2xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
                <select
                  value={broadcastFilter}
                  onChange={(e) => setBroadcastFilter(e.target.value)}
                  className="w-full sm:w-48 bg-slate-900 border border-slate-800 focus:border-indigo-600 px-4 py-2.5 rounded-2xl text-xs font-bold focus:outline-none"
                >
                  <option value="all">All Campaign States</option>
                  <option value="running">In Transmission (Running)</option>
                  <option value="completed">Completed Projects</option>
                  <option value="failed">Terminated Failed Runs</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl">
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-xs text-left text-slate-400">
                    <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/60 pb-3">
                      <tr>
                        <th className="py-3">Campaign Context</th>
                        <th className="py-3">Initiating Member</th>
                        <th className="py-3">Success / Total Targets</th>
                        <th className="py-3">Executed At</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Intervention</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredBroadcasts.map((b, bIdx) => (
                        <tr key={`${b.ownerEmail || 'system'}-${b.id || bIdx}`} className="hover:bg-slate-900/10">
                          <td className="py-3.5">
                            <div>
                              <p className="font-bold text-white">{b.name || 'Standalone Broadcast'}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Page: {b.pageName || 'Unknown Page'}</p>
                            </div>
                          </td>
                          <td className="py-3.5 font-bold text-indigo-400">{b.ownerEmail}</td>
                          <td className="py-3.5 font-sans font-black text-slate-300">
                            {b.successCount ?? 0} / {b.sentCount ?? 0}
                          </td>
                          <td className="py-3.5 font-semibold text-slate-400">{b.createdAt ? new Date(b.createdAt).toLocaleString() : 'Pending'}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              b.status === 'running' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse' : 
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {b.status === 'running' && (
                              <button
                                onClick={() => handleCancelBroadcast(b.ownerEmail, b.id)}
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                              >
                                Abort Loop
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: TEAM ALLIANCES */}
          {activeTab === 'teams' && (
            <div className="space-y-6 animate-in fade-in duration-300">

              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl">
                <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-6 flex items-center gap-2">
                  System Multi-User Workspace Affiliations
                </h4>
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-xs text-left text-slate-400">
                    <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/60 pb-3">
                      <tr>
                        <th className="py-3">Workspace Owner</th>
                        <th className="py-3">Associated team members</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {users.map((owner) => {
                        const members = owner.teamMembers || [];
                        return (
                          <tr key={owner.email} className="hover:bg-slate-900/5 align-top">
                            <td className="py-4 font-bold text-white w-1/3">
                              <div>
                                <p>{owner.fullName || 'No Name Provided'}</p>
                                <p className="text-[10px] text-indigo-400 font-mono mt-0.5">{owner.email}</p>
                              </div>
                            </td>
                            <td className="py-4">
                              {members.length === 0 ? (
                                <span className="text-slate-500 font-semibold italic text-xs">No team configurations mapped. All actions client self-administered.</span>
                              ) : (
                                <div className="space-y-3.5">
                                  {members.map((member: any, mIdx: number) => (
                                    <div key={`member-${member.email || mIdx}`} className="bg-slate-900/50 border border-slate-800/50 p-3 rounded-2xl flex items-center justify-between">
                                      <div>
                                        <p className="font-bold text-slate-350">{member.name || member.email?.split('@')[0]}</p>
                                        <p className="text-[10px] text-slate-500 font-mono">{member.email} ({member.role})</p>
                                      </div>
                                      <button
                                        onClick={async () => {
                                          if (!window.confirm(`Disassociate team member ${member.email} from owner ${owner.email}?`)) return;
                                          try {
                                            await axios.post('/api/team/delete', { memberEmail: member.email }, {
                                              headers: { 'x-user-email': owner.email }
                                            });
                                            addToast("Team scope membership removed", "success");
                                            handleRefresh();
                                          } catch (err) {
                                            addToast("Failed to remove member", "danger");
                                          }
                                        }}
                                        className="px-2.5 py-1 bg-rose-650/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/10 rounded-lg text-[10px] transition-colors cursor-pointer"
                                      >
                                        Remove Member
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
              
              {/* Publication Module */}
              <form onSubmit={handleCreateAnnouncement} className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl space-y-5 h-fit">
                <h4 className="text-sm font-black uppercase text-indigo-400 tracking-wider">
                  Create Platform Notification
                </h4>
                <p className="text-slate-400 text-xs leading-normal">Transmit high-priority news, operational maintenance guidelines, or promotional campaigns instantly to all user dashboard panels.</p>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-slate-400 font-extrabold">Title/Header</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Scheduled Core Upgrades v3.0"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-600 rounded-xl text-xs font-semibold focus:outline-none placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-slate-400 font-extrabold">Message Body</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Welcome to the updated system. We have completed maintenance loops on automated subscription flows..."
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:border-indigo-600 rounded-xl text-xs font-semibold focus:outline-none placeholder:text-slate-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" /> Publish Announcement
                </button>
              </form>

              {/* Announcements History Stack list */}
              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl space-y-5">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                  Active announcements feed ({announcements.length})
                </h4>
                {announcements.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-400 text-xs italic">No system announcements published yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((a: any, aIdx: number) => (
                      <div key={`announcement-${a.id || aIdx}`} className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-2xl shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-sm text-indigo-300">{a.title}</h5>
                          <span className="text-[10px] text-slate-500 font-mono">{new Date(a.createdAt || a.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{a.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 9: ORDERS & RECONCILES */}
          {activeTab === 'billing' && (
            <div className="space-y-6 animate-in fade-in duration-350">
              
              <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-3xl">
                <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-6">
                  Complete Billing Orders Tracker ({orders.length})
                </h4>
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full text-xs text-left text-slate-400">
                    <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-slate-800/60 pb-3">
                      <tr>
                        <th className="py-3">Order Code</th>
                        <th className="py-3">Workspace owner</th>
                        <th className="py-3">Created</th>
                        <th className="py-3">Billed Pages</th>
                        <th className="py-3">Amount</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Intervention</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.map((o, idx) => (
                        <tr key={`${o.workspace_id || 'system'}-order-${o.id || idx}`} className="hover:bg-slate-900/10">
                          <td className="py-3.5 font-bold font-mono text-white tracking-wider">{o.id}</td>
                          <td className="py-3.5 font-semibold text-slate-300">{o.workspace_id}</td>
                          <td className="py-3.5 text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="py-3.5 text-xs">
                            {Array.isArray(o.pages) ? o.pages.map((p: any) => p.name).join(', ') : 'Direct subscription Line'}
                          </td>
                          <td className="py-3.5 font-black text-emerald-400">${o.amount}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${o.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {o.status !== 'Paid' && (
                              <button 
                                onClick={() => handleMarkOrderPaid(o.workspace_id, o.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 font-bold font-sans text-[10px] text-white rounded-lg transition-colors cursor-pointer"
                              >
                                Reconcile Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* USER DETAILS SIDE-PANEL/BACKDROP MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-300" onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800/80 p-8 flex flex-col justify-between overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedUser.fullName || 'Client Profile'}</h3>
                  <p className="text-xs text-indigo-400 font-mono tracking-wide mt-0.5">{selectedUser.email}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Credits & General Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase">Standard Wallet</p>
                    <p className="text-lg font-black text-white mt-1">${(selectedUser.credits || 0.00).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCreditsModal({
                        isOpen: true,
                        email: selectedUser.email,
                        currentCredits: selectedUser.credits || 0,
                        isTrial: false
                      });
                      setCreditAmount(100);
                    }}
                    className="px-2 py-1 bg-indigo-605/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/10 rounded-xl text-[10px] font-black transition-colors cursor-pointer"
                  >
                    Adjust
                  </button>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase">Trial Wallet</p>
                    <p className="text-lg font-black text-yellow-500 mt-1">${(selectedUser.trialCredits || 0.00).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCreditsModal({
                        isOpen: true,
                        email: selectedUser.email,
                        currentCredits: selectedUser.trialCredits || 0,
                        isTrial: true
                      });
                      setCreditAmount(100);
                    }}
                    className="px-2 py-1 bg-yellow-605/15 hover:bg-yellow-600 text-yellow-300 hover:text-white border border-yellow-500/10 rounded-xl text-[10px] font-black transition-colors cursor-pointer"
                  >
                    Adjust
                  </button>
                </div>
              </div>

              {/* Connected Pages section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wide">Connected Facebook Pages</h4>
                {(!selectedUser.facebookWorkspaces || Object.keys(selectedUser.facebookWorkspaces).length === 0) ? (
                  <p className="text-xs text-slate-500 italic">No Facebook workspaces mapped.</p>
                ) : (
                  Object.keys(selectedUser.facebookWorkspaces).flatMap(wsId => {
                    const ws = selectedUser.facebookWorkspaces[wsId];
                    const pagelist = ws.pages || [];
                    if (pagelist.length === 0) return [];
                    return pagelist.map((p: any, idx: number) => {
                      const subStatus = selectedUser.billing?.subscriptions?.[p.id] || { status: 'Trial' };
                      return (
                        <div key={`${wsId}-page-${p.id || idx}`} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-white truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono truncate">{p.id}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ml-2 ${
                            subStatus.status === 'Active' || subStatus.status === 'Active Subscription' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}>
                            {subStatus.status}
                          </span>
                        </div>
                      );
                    });
                  })
                )}
              </div>

               {/* Recent user campaigns */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wide">Campaign Output Archive</h4>
                {userBroadcasts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No historical transmissions found.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userBroadcasts.map((b: any, bIdx: number) => (
                       <div key={`user-broadcast-${b.id || bIdx}`} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-300">{b.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{b.pageName}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Emergency Integrations Operations */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wide">Emergency Diagnostics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReactivateTrial(selectedUser.email)}
                    className="py-2.5 px-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-transparent text-[10px] font-extrabold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    🚀 Reactivate Trial
                  </button>
                  <button
                    onClick={() => handleDisconnectFacebook(selectedUser.email)}
                    className="py-2.5 px-3 bg-orange-600/10 hover:bg-orange-600 text-orange-300 hover:text-white border border-orange-500/20 hover:border-transparent text-[10px] font-extrabold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    🔌 Disconnect FB
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center gap-4">
              <button
                onClick={() => handleToggleSuspend(selectedUser.email, !!selectedUser.suspended)}
                className={`flex-1 py-3 border font-bold text-xs rounded-2xl transition-colors ${selectedUser.suspended ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-600/10 border-rose-500/20 text-rose-300'}`}
              >
                {selectedUser.suspended ? 'Activate Account' : 'Suspend Account'}
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser.email)}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl transition-all"
              >
                Delete Lifetime Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREDITS OVERRIDE MODAL */}
      {creditsModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300" onClick={() => setCreditsModal(prev => ({ ...prev, isOpen: false }))}>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Adjust {creditsModal.isTrial ? 'Trial Credits' : 'Credits Balance'}</h3>
              <button onClick={() => setCreditsModal(prev => ({ ...prev, isOpen: false }))} className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 leading-normal">
              Adjust {creditsModal.isTrial ? 'trial credit' : 'wallet'} balance of workspace belonging to <strong className="text-white">{creditsModal.email}</strong>. Currently at <strong className={`${creditsModal.isTrial ? 'text-yellow-400' : 'text-indigo-400'} font-mono`}>${(creditsModal.currentCredits || 0).toFixed(2)}</strong>.
            </p>

            <div className="grid grid-cols-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {[
                { label: 'Set exact', val: 'set' },
                { label: 'Add to', val: 'add' },
                { label: 'Deduct', val: 'deduct' }
              ].map((m) => (
                <button
                  key={m.val}
                  type="button"
                  onClick={() => setCreditMode(m.val as 'set' | 'add' | 'deduct')}
                  className={`py-2 text-[10px] uppercase tracking-wider font-extrabold rounded-xl transition-all ${creditMode === m.val ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-extrabold text-slate-500 pl-1">Amount ($ / Credits)</label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-600 rounded-2xl text-xs font-bold focus:outline-none"
              />
            </div>

            <button
              onClick={handleUpdateCredits}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition-all shadow-lg"
            >
              Verify & Authorize Adjustment
            </button>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION DATER MODAL */}
      {subModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300" onClick={() => setSubModal(prev => ({ ...prev, isOpen: false }))}>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Modify billing lines</h3>
              <button onClick={() => setSubModal(prev => ({ ...prev, isOpen: false }))} className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-300 font-extrabold">{subModal.pageName}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{subModal.email}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold text-slate-500 pl-1">Extend subscription days</label>
                <input
                  type="number"
                  value={subDays}
                  onChange={(e) => setSubDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-600 rounded-2xl text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateSubscription('activate')}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors"
                >
                  Force Activate
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSubscription('extend')}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors"
                >
                  Extend Period
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateSubscription('expire')}
                  className="flex-1 py-2.5 bg-yellow-650 hover:bg-yellow-650 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors"
                >
                  Force Expire
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSubscription('cancel')}
                  className="flex-1 py-2.5 bg-rose-650 hover:bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-colors"
                >
                  Disable sub
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
