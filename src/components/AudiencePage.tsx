import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, MessageSquare, ChevronLeft, ChevronRight, CheckCircle2, Clock, Users, ArrowRight, User } from 'lucide-react';
import axios from 'axios';

// Get matching background/text pair based on name hashing
const getAvatarColors = (name: string) => {
  const themes = [
    { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    { bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    { bg: 'bg-sky-50 text-sky-700 border-sky-200' },
    { bg: 'bg-violet-50 text-violet-700 border-violet-200' },
  ];
  if (!name) return themes[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return themes[sum % themes.length];
};

const getInitials = (name?: string | null) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatRelativeTime = (isoString?: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

interface AudiencePageProps {
  onOpenChat: (userId: string, pageId: string, userName?: string) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function AudiencePage({ onOpenChat, addToast }: AudiencePageProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedPageId, setSelectedPageId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 25;

  // Real-time debounce states for search query
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset page on search trigger
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Audience data
  const fetchAudience = async (showSkeleton = true) => {
    if (showSkeleton) setLoading(true);
    try {
      const response = await axios.get('/api/audience', {
        params: {
          page: currentPage,
          per_page: perPage,
          search: debouncedSearch,
          page_id: selectedPageId
        }
      });
      setUsers(response.data.users || []);
      setTotal(response.data.total || 0);
      setEligibleCount(response.data.eligible_count || 0);
      setPages(response.data.pages || []);
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.error || "Failed to load audience list.", "error");
    } finally {
      if (showSkeleton) setLoading(false);
    }
  };

  // Run initial fetch and re-fetches when parameters change
  useEffect(() => {
    fetchAudience();
  }, [currentPage, debouncedSearch, selectedPageId]);

  // Handle Refresh action
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await axios.post('/api/audience/refresh');
      await fetchAudience(false);
      addToast("Audience connection is synchronized in real-time.", "success");
    } catch (err: any) {
      console.error(err);
      addToast("Connection synchronization failed.", "error");
    } finally {
      setRefreshing(false);
    }
  };

  // Pagination bounds
  const totalPages = Math.ceil(total / perPage) || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            Audience Center
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Track customer broadcast eligibility, monitor webhook activities, and directly connect to chat threads to bypass standard policy windows.
          </p>
        </div>

        {/* METADATA / STATUS INDICATORS */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
          {/* Live Webhook Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100/50 rounded-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">Webhook Connected</span>
          </div>

          {/* Pagination Info */}
          <div className="px-4 py-2 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-bold text-slate-600 tracking-wider">
            Page {currentPage} of {totalPages} · {users.length} shown
          </div>

          {/* Eligible Count Indicator */}
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-150 rounded-2xl text-xs font-black text-indigo-700 tracking-wider">
            {eligibleCount} eligible users
          </div>
        </div>
      </div>

      {/* FILTER & CONTROL BAR */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Real-time search by Name or User ID */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by name or FB user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Facebook Page dropdown filter and Sync */}
        <div className="flex w-full md:w-auto items-center gap-3">
          
          <div className="relative flex-1 md:w-64">
            <select
              value={selectedPageId}
              onChange={(e) => {
                setSelectedPageId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl px-4 py-3 text-xs font-black tracking-widest uppercase text-slate-700 outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="all">🌐 ALL FACEBOOK PAGES</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh/Sync button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 bg-indigo-50 border border-indigo-100 hover:bg-indigo-650 hover:text-white text-indigo-650 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
            title="Sync audience from Facebook"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* AUDIENCE TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400">User</th>
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Connected Page</th>
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Last Activity</th>
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400">Status Eligibility</th>
                <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                // SKELETON PLACEHOLDERS WHILE LOADING
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-slate-200 rounded-full shrink-0"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-200 rounded"></div>
                          <div className="h-3 w-20 bg-slate-150 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                        <div className="h-4 w-28 bg-slate-150 rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5.5">
                      <div className="h-4 w-20 bg-slate-150 rounded"></div>
                    </td>
                    <td className="px-6 py-5.5">
                      <div className="h-6 w-24 bg-slate-150 rounded-full"></div>
                    </td>
                    <td className="px-6 py-5.5 text-right">
                      <div className="h-8 w-16 bg-slate-200 rounded-xl inline-block"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                // EMPTY STATE IF NO USERS FOUND
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                        <Users className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">No audience members found</h4>
                      <p className="text-xs font-medium text-slate-400 leading-normal mt-1.5 max-w-xs">
                        We couldn't connect anyone matching your filter criteria. Try adjusting your search keyword or selected Page.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const avatarColor = getAvatarColors(u.name || "?");
                  const initials = getInitials(u.name);
                  
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* USER Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          {u.name ? (
                            <div className={`w-11 h-11 rounded-full border flex items-center justify-center font-bold text-sm shrink-0 select-none ${avatarColor.bg}`}>
                              {initials}
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-full border bg-slate-50 text-slate-400 border-slate-200 flex items-center justify-center shrink-0">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-extrabold text-slate-950 group-hover:text-indigo-650 transition-colors leading-tight">
                              {u.name || <span className="italic text-slate-400 font-medium">Unknown Customer</span>}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold font-mono tracking-wider mt-0.5">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* PAGE Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden">
                            <span className="text-[9px] font-black text-slate-500 uppercase">{u.page_name?.charAt(0)}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-700 truncate max-w-[12rem]">{u.page_name}</span>
                        </div>
                      </td>

                      {/* LAST ACTIVITY Column */}
                      <td className="px-6 py-4.5">
                        <span className="text-xs font-bold font-mono text-slate-500">{formatRelativeTime(u.last_activity)}</span>
                      </td>

                      {/* STATUS Column */}
                      <td className="px-6 py-4.5">
                        {u.status === "eligible" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Eligible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-150 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-xl">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            24h Window
                          </span>
                        )}
                      </td>

                      {/* ACTION Column */}
                      <td className="px-6 py-4.5 text-right">
                        <button
                          onClick={() => onOpenChat(u.id, u.page_id, u.name || '')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-650 hover:text-white rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <span className="text-xs font-bold text-slate-500 tracking-wider">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* POLICY INFORMATION CALLOUT CARD */}
      <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200/60 flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 shadow-sm">
          <Clock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Understanding Meta's 24-Hour Messaging Policy</h4>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            Meta allows pages to send broadcasts or replies freely within 24 hours of a customer's last incoming message (marked as <span className="font-extrabold text-[#10B981]">Eligible</span>). Outside this window (marked as <span className="font-bold text-slate-600">24h Window</span>), standard api broadcasts are strictly restricted to avoid shadow-banning. However, you can always use the "Chat" button above to launch manual live communications directly from your inbox using the HUMAN_AGENT tag fallback!
          </p>
        </div>
      </div>

    </div>
  );
}
