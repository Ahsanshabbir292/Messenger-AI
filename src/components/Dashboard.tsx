import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bot, LayoutDashboard, MessageSquare, Settings, 
  Plus, MoreHorizontal, Activity, BarChart2,
  ChevronDown, Bell, LogOut,
  Edit, Play, ExternalLink, Facebook, RefreshCw, Link2, CheckCircle2,
  Send, User, Image as ImageIcon, File as FileIcon, Mic, Paperclip, X, Music, Download, Megaphone,
  CreditCard, History, Sparkles, Clock, Star, Shield, Zap, Users, UserPlus, Mail, ShieldAlert, Trash2, Lock, AlertTriangle, Info, ArrowLeft, ArrowRight, Radio,
  Search, Filter, CheckSquare, Layers, ToggleLeft as Toggle, Globe, Power, ChevronRight, MessageCircle, CircleDollarSign, Menu
} from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { BroadcastChoice } from './BroadcastChoice';
import { BroadcastSingle } from './BroadcastSingle';
import { BroadcastBulk } from './BroadcastBulk';
import { AudiencePage } from './AudiencePage';
import { AnalyticsPage } from './AnalyticsPage';
import { BroadcastDetailsView } from './BroadcastDetailsView';
import { OverviewPage } from './OverviewPage';
import { PagesPage } from './PagesPage';
import { ChatPage } from './ChatPage';
import { TeamPage } from './TeamPage';
import { BillingPage } from './BillingPage';
import { SettingsPage } from './SettingsPage';

const getAvatarColors = (name: string) => {
  const themes = [
    { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'from-indigo-500 to-purple-600' },
    { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'from-emerald-500 to-teal-600' },
    { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'from-rose-500 to-pink-600' },
    { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'from-amber-500 to-orange-600' },
    { bg: 'bg-sky-50 text-sky-700 border-sky-200', text: 'from-sky-500 to-blue-600' },
    { bg: 'bg-violet-50 text-violet-700 border-violet-200', text: 'from-violet-500 to-fuchsia-600' },
  ];
  if (!name) return themes[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return themes[sum % themes.length];
};

const SafeAvatar = ({ src, name, className = "w-12 h-12 rounded-xl" }: { src?: string, name?: string, className?: string }) => {
  const [error, setError] = useState(false);
  const initials = name ? name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
  const theme = getAvatarColors(name || '');

  useEffect(() => {
    setError(false);
  }, [src]);

  if (src && !error) {
    const isExternalUrl = src.startsWith('http://') || src.startsWith('https://');
    const displaySrc = isExternalUrl ? `/api/proxy-image?url=${encodeURIComponent(src)}` : src;

    return (
      <img 
        src={displaySrc} 
        alt={name || "Avatar"} 
        className={`${className} object-cover`}
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center font-black border ${theme.bg} shrink-0 select-none`}>
      {initials}
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

const PageSyncCard = ({ name, id, pictureUrl, isSynced, onSync, onChat }: { name: string, id: string, pictureUrl?: string, isSynced: boolean, onSync?: () => void | Promise<void>, onChat?: () => void, key?: React.Key }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:border-indigo-200 transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:border-indigo-600 transition-all overflow-hidden shrink-0">
        <SafeAvatar src={pictureUrl} name={name} className="w-full h-full" />
      </div>
      <div>
        <p className="text-sm font-black text-slate-900 leading-tight">{name}</p>
        <p className="text-[10px] text-slate-400 font-bold font-mono tracking-wider">ID: {id}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {isSynced ? (
        <>
          <button 
            onClick={onChat}
            className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Chat
          </button>
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 ml-2">
            <CheckCircle2 className="w-3 h-3" /> SYNCED
          </span>
        </>
      ) : (
        <button 
          onClick={onSync}
          className="text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-100"
        >
          CONNECT
        </button>
      )}
    </div>
  </div>
);

interface Workspace {
  id: string;
  name: string;
  avatar?: string;
}

const formatAxiosError = (err: any, fallbackMessage: string): string => {
  if (!err) return fallbackMessage;
  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === "string") {
      return data;
    }
    if (data.error) {
      if (typeof data.error === "object") {
        return data.error.message || data.error.details || JSON.stringify(data.error);
      }
      return data.error;
    }
    if (data.message) {
      if (typeof data.message === "object") {
        return data.message.message || JSON.stringify(data.message);
      }
      return data.message;
    }
  }
  return err.message || String(err) || fallbackMessage;
};

export default function Dashboard({ onLogout, appUser, currentPath, navigateTo }: { onLogout: () => void, appUser?: any, currentPath?: string, navigateTo?: (path: string) => void }) {
  const getTabFromPath = (path?: string) => {
    if (!path) return 'overview';
    const cleanPath = path.replace(/^\//, '');
    const firstSegment = cleanPath.split('/')[0];
    const tabs = ['overview', 'pages', 'chat', 'audience', 'broadcast', 'analytics', 'team', 'billing', 'settings'];
    if (tabs.includes(firstSegment)) {
      return firstSegment;
    }
    const segments = path.split('/');
    if (segments[1] === 'dashboard' && segments[2]) {
      return segments[2];
    }
    return 'overview';
  };

  const [activeTab, setActiveTabInternal] = useState(() => getTabFromPath(currentPath));

  // Sync activeTab state from URL path (e.g. back/forward buttons)
  useEffect(() => {
    if (currentPath) {
      const tab = getTabFromPath(currentPath);
      if (tab !== activeTab) {
        setActiveTabInternal(tab);
      }
    }
  }, [currentPath, activeTab]);

  const setActiveTab = (tab: string) => {
    setActiveTabInternal(tab);
    if (navigateTo) {
      navigateTo(`/${tab}`);
    }
  };

  // Switch to billing tab if payment parameter exists in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setActiveTab('billing');
    }
  }, []);
  const [syncing, setSyncing] = useState(false);
  const [fbSyncModalOpen, setFbSyncModalOpen] = useState(false);
  const [fbAuthUrl, setFbAuthUrl] = useState("");
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    if (appUser?.workspaces && Array.isArray(appUser.workspaces) && appUser.workspaces.length > 0) {
      return appUser.workspaces;
    }
    if (appUser?.workspaceName) {
      return [{ id: '1', name: appUser.workspaceName }];
    }
    try {
      const saved = localStorage.getItem('current_app_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.workspaces && Array.isArray(parsed.workspaces) && parsed.workspaces.length > 0) {
            return parsed.workspaces;
          }
          if (parsed.workspaceName) {
            return [{ id: '1', name: parsed.workspaceName }];
          }
        }
      }
    } catch (e) {}
    return [
      { id: '1', name: 'Khaadi' },
      { id: '2', name: 'Microphone Hub' },
    ];
  });
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(workspaces[0]?.id || '1');

  useEffect(() => {
    if (appUser?.workspaces && Array.isArray(appUser.workspaces) && appUser.workspaces.length > 0) {
      setWorkspaces(appUser.workspaces);
    } else if (appUser?.workspaceName) {
      setWorkspaces([{ id: '1', name: appUser.workspaceName }]);
    }
  }, [appUser?.workspaces, appUser?.workspaceName]);

  useEffect(() => {
    setSelectedPage(null);
    setConversations([]);
    setSelectedConversation(null);
  }, [currentWorkspaceId]);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Message', message: 'You have a new message from Zain.', time: '2 mins ago', type: 'message', unread: true },
    { id: '2', title: 'System Update', message: 'Version 2.4 has been successfully deployed.', time: '1 hour ago', type: 'system', unread: false },
    { id: '3', title: 'Payment Success', message: 'Your credit balance has been updated.', time: '5 hours ago', type: 'billing', unread: false },
  ]);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [trialLocked, setTrialLocked] = useState<boolean>(false);
  // Simulated workspace-specific pages (initially empty, fetched from API)
  // In a real app, pages would be assigned to a workspace in the DB.
  // For this demo, we can assign them to the current workspace when they are fetched.
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'trial' | 'architect' | 'empire' | 'expired'>(() => {
    const saved = localStorage.getItem('current_plan_v1');
    return (saved as any) || 'trial';
  });

  useEffect(() => {
    localStorage.setItem('current_plan_v1', currentPlan);
  }, [currentPlan]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [creditBalance, setCreditBalance] = useState(5000.00);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<'admin' | 'agent' | 'support'>('admin');

  // --- BROADCAST STATES & HELPERS ---
  const [broadcastSubTab, setBroadcastSubTab] = useState<'list' | 'analytics'>('list');
  const [broadcastView, setBroadcastView] = useState<'dashboard' | 'choice' | 'single' | 'bulk'>('dashboard');
  const [broadcastSendTo, setBroadcastSendTo] = useState<'all' | 'group'>('all');
  const [broadcastGroupId, setBroadcastGroupId] = useState<string>("");
  const [selectedBulkPageIds, setSelectedBulkPageIds] = useState<string[]>([]);
  const [broadcastScheduleDate, setBroadcastScheduleDate] = useState("");
  const [broadcastScheduleTime, setBroadcastScheduleTime] = useState("");
  const [broadcastMessageTag, setBroadcastMessageTag] = useState("UTILITY");
  const [activeMessageInputType, setActiveMessageInputType] = useState<'text' | 'image' | 'both'>('text');
  const [isRecipientSlugDropdownOpen, setIsRecipientSlugDropdownOpen] = useState(false);
  const [broadcastSearchQuery, setBroadcastSearchQuery] = useState("");
  const [broadcastsHistory, setBroadcastsHistory] = useState<any[]>([]);
  const [selectedBroadcastId, setSelectedBroadcastId] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState<any>(null);
  const [broadcastLiveLogs, setBroadcastLiveLogs] = useState<string[]>([]);
  const [broadcastPageId, setBroadcastPageId] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastFile, setBroadcastFile] = useState<File | null>(null);
  const [broadcastAttachmentType, setBroadcastAttachmentType] = useState<string>("image");
  const [isSubmittingBroadcast, setIsSubmittingBroadcast] = useState(false);

  // --- Campaign Broadcasts Filter States ---
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPageId, setFilterPageId] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [filterOnlyFailures, setFilterOnlyFailures] = useState<boolean>(false);

  const [appliedFilters, setAppliedFilters] = useState({
    status: "all",
    pageId: "all",
    type: "all",
    tag: "all",
    startDate: "",
    endDate: "",
    onlyFailures: false
  });

  const getBroadcastHistory = useCallback(async () => {
    try {
      const res = await axios.get('/api/facebook/broadcasts');
      setBroadcastsHistory(res.data.broadcasts || []);
    } catch (err) {
      console.error("Failed to get broadcast history", err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'broadcast' || activeTab === 'analytics' || activeTab === 'overview') {
      getBroadcastHistory();
    }
  }, [activeTab, getBroadcastHistory]);

  useEffect(() => {
    if (!socket) return;

    const handleProgress = (data: any) => {
      setBroadcastProgress(data);
      setIsBroadcasting(true);
      
      const isReadOrReplied = data.latestStatus === 'read' || data.latestStatus === 'replied';
      const logLine = isReadOrReplied
        ? `[${new Date().toLocaleTimeString()}] Recipient "${data.latestRecipient}" ${data.latestStatus === 'replied' ? '💬 REPLIED' : '👁️ OPENED / READ'}`
        : `[${new Date().toLocaleTimeString()}] Delivered to ${data.latestRecipient}... ${data.latestStatus === 'delivered' ? '✅ SUCCESS' : '❌ FAILED'}`;
      
      setBroadcastLiveLogs(prev => [logLine, ...prev]);

      // Update campaigns history list in real-time matching competitor live behavior
      setBroadcastsHistory(prev => {
        const exists = prev.some(b => b.id === data.broadcastId);
        if (!exists) {
          const newB = {
            id: data.broadcastId,
            status: "running",
            sentCount: data.sentCount,
            successCount: data.successCount,
            failCount: data.failCount,
            totalRecipients: data.total,
            recipientsStatus: data.recipientsStatus || {},
            created_at: new Date().toISOString()
          };
          return [newB, ...prev];
        }
        return prev.map(b => {
          if (b.id === data.broadcastId) {
            return {
              ...b,
              status: data.latestStatus === 'read' || data.latestStatus === 'replied' ? b.status : "running",
              sentCount: data.sentCount,
              successCount: data.successCount,
              failCount: data.failCount,
              totalRecipients: data.total,
              recipientsStatus: data.recipientsStatus || b.recipientsStatus
            };
          }
          return b;
        });
      });
    };

    const handleCompleted = (data: any) => {
      setIsBroadcasting(false);
      setBroadcastProgress(null);
      addToast(`Broadcast completed! Sent to ${data.total} users successfully.`, "success");
      setBroadcastsHistory(prev => {
        const exists = prev.some(b => b.id === data.broadcastId);
        if (!exists) {
          const newB = {
            id: data.broadcastId,
            status: "completed",
            sentCount: data.sentCount || data.total,
            successCount: data.successCount || data.total,
            failCount: data.failCount || 0,
            totalRecipients: data.total,
            recipientsStatus: {},
            created_at: new Date().toISOString()
          };
          return [newB, ...prev];
        }
        return prev.map(b => {
          if (b.id === data.broadcastId) {
            return {
              ...b,
              status: "completed",
              sentCount: data.total,
              successCount: data.successCount || data.total,
              failCount: data.failCount || 0
            };
          }
          return b;
        });
      });
      getBroadcastHistory();
      getPages();
    };

    socket.on("broadcast_progress", handleProgress);
    socket.on("broadcast_completed", handleCompleted);

    return () => {
      socket.off("broadcast_progress", handleProgress);
      socket.off("broadcast_completed", handleCompleted);
    };
  }, [socket, getBroadcastHistory]);

  const handleStartBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastPageId) {
      addToast("Please select a Facebook Page to broadcast from.", "error");
      return;
    }
    if (!broadcastMessage && !broadcastFile) {
      addToast("Please enter a message or upload an attachment to broadcast.", "error");
      return;
    }

    setIsSubmittingBroadcast(true);
    setBroadcastLiveLogs([`[${new Date().toLocaleTimeString()}] Initializing broadcast connection...`]);

    const formData = new FormData();
    formData.append("pageId", broadcastPageId);
    if (broadcastMessage) formData.append("message", broadcastMessage);
    if (broadcastFile) {
      formData.append("file", broadcastFile);
      formData.append("attachmentType", broadcastAttachmentType);
    }

    try {
      const res = await axios.post("/api/facebook/broadcast", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        addToast(res.data.message || "Broadcast initialized!", "success");
        setIsBroadcasting(true);
        setBroadcastMessage("");
        setBroadcastFile(null);
        getBroadcastHistory();
      }
    } catch (err: any) {
      const friendlyErr = err.response?.data?.error || "Failed to start broadcast. Make sure your Page has conversation threads.";
      addToast(friendlyErr, "error");
      setBroadcastLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] Broadcast aborted: ${friendlyErr}`, ...prev]);
    } finally {
      setIsSubmittingBroadcast(false);
    }
  };

  const handleSingleSubmit = async (data: any) => {
    setBroadcastPageId(data.pageId);
    setBroadcastMessage(data.message);
    setBroadcastFile(data.file);
    setBroadcastAttachmentType(data.attachmentType);
    setBroadcastView('dashboard');
    setBroadcastSubTab('list');

    setIsSubmittingBroadcast(true);
    setBroadcastLiveLogs([`[${new Date().toLocaleTimeString()}] Initializing single broadcast connection...`]);

    const formData = new FormData();
    formData.append("pageId", data.pageId);
    if (data.message) formData.append("message", data.message);
    if (data.file) {
      formData.append("file", data.file);
      formData.append("attachmentType", data.attachmentType);
    }
    if (data.targetAudience) {
      formData.append("targetAudience", data.targetAudience);
    }

    try {
      const res = await axios.post("/api/facebook/broadcast", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        addToast(res.data.message || "Broadcast initialized!", "success");
        setIsBroadcasting(true);
        setBroadcastMessage("");
        setBroadcastFile(null);
        getBroadcastHistory();
        if (res.data.broadcastId) {
          setSelectedBroadcastId(res.data.broadcastId);
        }
      }
    } catch (err: any) {
      const friendlyErr = err.response?.data?.error || "Failed to start broadcast. Make sure your Page has conversation threads.";
      addToast(friendlyErr, "error");
      setBroadcastLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] Broadcast aborted: ${friendlyErr}`, ...prev]);
    } finally {
      setIsSubmittingBroadcast(false);
    }
  };

  const handleBulkSubmit = async (data: any) => {
    setIsSubmittingBroadcast(true);
    setIsBroadcasting(true);
    setBroadcastLiveLogs([`[${new Date().toLocaleTimeString()}] Initializing bulk broadcast queue for ${data.pageIds.length} pages...`]);
    setBroadcastView('dashboard');
    setBroadcastSubTab('list');

    try {
      for (const pageId of data.pageIds) {
        const pageName = pages.find(p => p.id === pageId)?.name || 'Connected Page';
        setBroadcastLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] Dispatching message for page: ${pageName}...`, ...prev]);
        
        const formData = new FormData();
        formData.append("pageId", pageId);
        if (data.message) formData.append("message", data.message);
        if (data.file) {
          formData.append("file", data.file);
          formData.append("attachmentType", data.attachmentType);
        }
        if (data.targetAudience) {
          formData.append("targetAudience", data.targetAudience);
        }
        
        try {
          await axios.post("/api/facebook/broadcast", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          setBroadcastLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] Broadcast queued successfully for: ${pageName}`, ...prev]);
        } catch (err: any) {
          const friendlyErr = err.response?.data?.error || "Failed. page might have no conversations.";
          setBroadcastLiveLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Failed for ${pageName}: ${friendlyErr}`, ...prev]);
        }
      }
      
      addToast("All selected bulk page broadcasts dispatched!", "success");
      setBroadcastMessage("");
      setBroadcastFile(null);
      getBroadcastHistory();
    } catch (err) {
      console.error("Bulk broadcast failure", err);
    } finally {
      setIsSubmittingBroadcast(false);
    }
  };

  // --- SETTINGS STATES & SUB-VIEWS ---
  const [settingsSubTab, setSettingsSubTab] = useState<'workspace' | 'profile'>('workspace');
  
  // Workspace Edit name
  const [isEditWorkspaceModalOpen, setIsEditWorkspaceModalOpen] = useState(false);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");

  // Edit profile info
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfileEmail, setEditProfileEmail] = useState("");

  // Change Password
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Active Sessions Management
  const [isManageSessionsModalOpen, setIsManageSessionsModalOpen] = useState(false);
  const [sessionsList, setSessionsList] = useState([
    { id: 's1', device: 'Chrome on Windows', location: 'Rawalpindi, Pakistan', active: true, ip: '182.180.122.95' },
    { id: 's2', device: 'Safari on iPhone (iOS)', location: 'Lahore, Pakistan', active: false, ip: '39.40.155.22' },
    { id: 's3', device: 'Firefox on macOS', location: 'Karachi, Pakistan', active: false, ip: '119.160.116.14' },
  ]);
  
  // --- TOAST NOTIFICATIONS STATE & HELPERS ---
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const getTrialDaysLeft = (endsAtStr?: string) => {
    if (!endsAtStr) return 0;
    const diff = new Date(endsAtStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // --- TEAM STATE / ACCESS CONTROL STATE ---
  const [currentActiveRole, setCurrentActiveRole] = useState<'owner' | 'admin' | 'agent' | 'support'>('owner');
  const [teamSubMode, setTeamSubMode] = useState<'list' | 'add'>('list');
  const [memberToRemove, setMemberToRemove] = useState<any | null>(null);

  // New Team Member Form States
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [addMemberName, setAddMemberName] = useState("");
  const [addMemberRole, setAddMemberRole] = useState<'admin' | 'agent' | 'support' | ''>('');
  const [addMemberAssignedPages, setAddMemberAssignedPages] = useState<string[]>([]);

  const [teamMembers, setTeamMembers] = useState<any[]>(() => {
    const saved = localStorage.getItem('team_members_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: '1',
        name: 'Ahsan Shabbir',
        email: appUser?.email || 'ahsan.shabbir292@gmail.com',
        role: 'owner',
        avatar_url: null,
        joined_at: '2026-05-01T12:00:00Z',
        assigned_pages: []
      }
    ];
  });

  // Save teamMembers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('team_members_v3', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Support Assigned Pages mapping
  // Get all support-assigned page IDs for active calculations
  const getSimulatedAssignedPages = () => {
    // If testing as mock support role, let's claim the support user has access to specific pages
    // We can auto-assign whichever pages are currently selected for trial so the tester can interact!
    const activePages = pages.filter(p => selectedPageIds.includes(p.id));
    if (activePages.length > 0) {
      return [activePages[0].id]; // assign the first active page by default for simulated testing
    }
    return [];
  };

  const currentUserAssignedPageIds = currentActiveRole === 'support' 
    ? getSimulatedAssignedPages() 
    : [];

  const [workspaceCredits, setWorkspaceCredits] = useState<Record<string, number>>({
    '1': 0.00,
    '2': 45.50
  });

  const [chatSearch, setChatSearch] = useState("");
  const [chatFilter, setChatFilter] = useState<'all' | 'unread'>('all');
  const [chatPageFilter, setChatPageFilter] = useState<string>('all');

  // --- BILLING STATE VARIABLES ---
  const [billingSubView, setBillingSubView] = useState<'dashboard' | 'buy' | 'orders' | 'order-detail' | 'payment'>('dashboard');
  const [billingData, setBillingData] = useState<{ subscriptions: Record<string, any>; orders: any[] } | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [buySelectedPageIds, setBuySelectedPageIds] = useState<string[]>([]);
  const [billingDiscountCode, setBillingDiscountCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [searchPageQuery, setSearchPageQuery] = useState("");
  
  // Card checkout credentials
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load billing data
  const fetchBillingData = useCallback(async () => {
    setIsBillingLoading(true);
    try {
      const res = await axios.get('/api/billing/data');
      setBillingData(res.data);
    } catch (err) {
      console.error("Failed to fetch billing data", err);
    } finally {
      setIsBillingLoading(false);
    }
  }, []);

  // Fetch billing data whenever user changes onto tab === 'billing'
  useEffect(() => {
    if (activeTab === 'billing') {
      fetchBillingData();

      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        addToast("Payment successful! Your pages are now active.", 'success');
        // Safely strip query params so the toast doesn't re-trigger on subsequent re-renders or updates
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [activeTab, fetchBillingData]);

  // Handler to create of order
  const handleCreateOrder = async (pageIds: string[], code?: string) => {
    setIsBillingLoading(true);
    try {
      const res = await axios.post('/api/billing/order', { pageIds, discountCode: code });
      if (res.data.success) {
        await fetchBillingData();
        setSelectedOrderId(res.data.order.id);
        setBillingSubView('order-detail');
        // Clear buy selection state
        setBuySelectedPageIds([]);
        setBillingDiscountCode("");
        setAppliedPromo(null);
        setPromoError(null);
      }
    } catch (err: any) {
      alert(formatAxiosError(err, "Failed to create order"));
    } finally {
      setIsBillingLoading(false);
    }
  };

  // Handler for custom order payment simulated via UI
  const handlePayOrder = async (orderId: string) => {
    setIsProcessingPayment(true);
    try {
      const res = await axios.post(`/api/billing/order/${orderId}/pay`);
      if (res.data.success) {
        alert(`Payment of $${res.data.order.amount} has been successfully processed! Connected pages have been activated.`);
        await fetchBillingData();
        setBillingSubView('dashboard');
        setCardholderName("");
        setCardNumber("");
        setCardExpiry("");
        setCardCvc("");
      }
    } catch (err: any) {
      alert(formatAxiosError(err, "Failed to process payment"));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handler for order delete or cancellation
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete/cancel this order?")) return;
    setIsBillingLoading(true);
    try {
      await axios.post(`/api/billing/order/${orderId}/delete`);
      await fetchBillingData();
      setBillingSubView('orders');
      addToast("Order deleted successfully", "success");
    } catch (err: any) {
      addToast(err.response?.data?.error || "Failed to delete order", "error");
    } finally {
      setIsBillingLoading(false);
    }
  };

  // Handler for editing order (cancels previous, populates checkboxes, takes user to buy)
  const handleEditOrder = async (orderId: string, pageIds: string[], discountCode?: string) => {
    setIsBillingLoading(true);
    try {
      await axios.post(`/api/billing/order/${orderId}/delete`);
      await fetchBillingData();
      setBuySelectedPageIds(pageIds);
      if (discountCode) {
        setAppliedPromo(discountCode);
        setBillingDiscountCode(discountCode);
      } else {
        setAppliedPromo("");
        setBillingDiscountCode("");
      }
      setBillingSubView('buy');
      addToast("Selected previous order items. You can now adjust and create a new order.", "success");
    } catch (err: any) {
      addToast(err.response?.data?.error || "Failed to prepare order edit", "error");
    } finally {
      setIsBillingLoading(false);
    }
  };
  
  const [pendingFile, setPendingFile] = useState<{ file: File | Blob, type: 'image' | 'audio' | 'file', name: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const getPages = useCallback(async () => {
    try {
      const res = await axios.get('/api/facebook/pages');
      setPages(res.data.pages || []);
      setSelectedPageIds(res.data.selectedPageIds || []);
      setTrialLocked(!!res.data.trialLocked);
      if (typeof res.data.credits === 'number') {
        setCreditBalance(res.data.credits);
      }
    } catch (err) {
      console.error("Failed to get pages", err);
    }
  }, []);

  const handleSelectTrialPage = async (pageId: string, selected: boolean) => {
    try {
      const res = await axios.post('/api/facebook/select-trial-page', { pageId, selected });
      setSelectedPageIds(res.data.selectedPageIds);
    } catch (err: any) {
      alert(formatAxiosError(err, "Failed to update page selection"));
    }
  };

  const handleLockTrial = async () => {
    if (selectedPageIds.length === 0) {
      alert("Please select at least 1 page to activate your trial.");
      return;
    }
    if (selectedPageIds.length > 3) {
      alert("You can only select up to 3 pages for trial.");
      return;
    }
    const confirmLock = window.confirm("Are you sure you want to activate your trial? Once activated, you CANNOT change your selected trial pages anymore.");
    if (!confirmLock) return;

    try {
      const res = await axios.post('/api/facebook/lock-trial');
      if (res.data.success) {
        setTrialLocked(true);
        alert("Free trial activated! Selected pages have been locked successfully.");
        getPages();
      }
    } catch (err: any) {
      alert(formatAxiosError(err, "Failed to activate trial"));
    }
  };

  const getUserProfile = useCallback(async () => {
    try {
      const res = await axios.get('/api/facebook/me');
      if (res.data) {
        setUserProfile(res.data);
      }
    } catch (err: any) {
      console.error("Failed to get profile", err);
      // Removed onLogout call to stay on dashboard
    }
  }, []);

  const getConversations = async (pageId: string) => {
    setIsLoading(true);
    try {
      if (pageId === "all") {
        const activePages = pages.filter(p => selectedPageIds.includes(p.id));
        const promises = activePages.map(page => 
          axios.get(`/api/facebook/conversations/${page.id}`)
            .then(res => (res.data.conversations || []).map((c: any) => ({
              ...c,
              _associatedPageId: page.id
            })))
            .catch(err => {
              console.error(`Failed to get conversations for page ${page.id}`, err);
              return [];
            })
        );
        const results = await Promise.all(promises);
        const merged = results.flat();
        merged.sort((a, b) => {
          const tA = new Date(a.updated_time || 0).getTime();
          const tB = new Date(b.updated_time || 0).getTime();
          return tB - tA;
        });
        setConversations(merged);
      } else {
        const res = await axios.get(`/api/facebook/conversations/${pageId}`);
        setConversations(res.data.conversations || []);
      }
    } catch (err) {
      console.error("Failed to get conversations", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChatFromAudience = async (userId: string, pageId: string, userName?: string) => {
    let page = pages.find((p: any) => p.id === pageId);
    if (!page) {
      try {
        const res = await axios.get('/api/facebook/pages');
        const fetchedPages = res.data.pages || [];
        setPages(fetchedPages);
        setSelectedPageIds(res.data.selectedPageIds || []);
        setTrialLocked(!!res.data.trialLocked);
        page = fetchedPages.find((p: any) => p.id === pageId);
      } catch (err) {
        console.error("Failed to fetch pages dynamically on audience chat click", err);
      }
    }

    if (page) {
      setSelectedPage(page);
      setActiveTab('chat');
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/facebook/conversations/${pageId}`);
        const convs = res.data.conversations || [];
        setConversations(convs);
        
        const targetConv = convs.find((c: any) => 
          c.participants?.data?.some((p: any) => p.id === userId)
        );
        
        if (targetConv) {
          setSelectedConversation(targetConv);
          setShowChatDetail(true);
        } else {
          const tempConv = {
            id: `conv_sim_${userId}`,
            participants: {
              data: [
                { name: userName || "Customer", id: userId },
                { name: page.name, id: pageId }
              ]
            },
            messages: { data: [] },
            updated_time: new Date().toISOString()
          };
          setSelectedConversation(tempConv);
          setShowChatDetail(true);
        }
      } catch (err) {
        console.error("Error setting custom conversation thread", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setActiveTab('chat');
    }
  };

  const handleReply = async () => {
    if (!selectedPage || !selectedConversation || !replyMessage.trim()) return;
    
    setIsSending(true);
    try {
      const activePageId = selectedConversation._associatedPageId || selectedPage.id;
      const recipientId = selectedConversation.participants.data.find((p: any) => p.id !== activePageId)?.id;
      if (!recipientId) throw new Error("Could not find recipient");

      await axios.post('/api/facebook/reply', {
        pageId: activePageId,
        recipientId,
        message: replyMessage
      });
      
      setReplyMessage("");
      getConversations(selectedPage.id);
    } catch (err: any) {
      console.error("Failed to send reply", err);
      const serverFriendlyError = err.response?.data?.error;
      const details = err.response?.data?.details;
      alert(serverFriendlyError || details?.error?.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendFile = async () => {
    if (!selectedPage || !selectedConversation || !pendingFile) return;

    setIsSending(true);
    try {
      const activePageId = selectedConversation._associatedPageId || selectedPage.id;
      const recipientId = selectedConversation.participants.data.find((p: any) => p.id !== activePageId)?.id;
      if (!recipientId) throw new Error("Could not find recipient");

      const formData = new FormData();
      formData.append('pageId', activePageId);
      formData.append('recipientId', recipientId);
      formData.append('type', pendingFile.type);
      formData.append('file', pendingFile.file);

      await axios.post('/api/facebook/send-attachment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPendingFile(null);
      getConversations(selectedPage.id);
    } catch (err: any) {
      console.error("Failed to send attachment", err);
      alert("Failed to send attachment. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile({ file, type, name: file.name });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setPendingFile({ file: blob, type: 'audio', name: 'Voice Message.webm' });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Microphone permission zaroori hai.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSyncPages = async () => {
    setSyncing(true);
    try {
      const res = await axios.get('/api/auth/facebook/url', {
        params: { email: appUser?.email, workspaceId: currentWorkspaceId }
      });
      const { url } = res.data;
      setFbAuthUrl(url);

      const width = 600, height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      let popup: Window | null = null;
      try {
        popup = window.open(url, 'fb_oauth', `width=${width},height=${height},left=${left},top=${top}`);
      } catch (err) {
        console.warn("[FB_OAUTH] Failed to open popup due to sandboxing constraint:", err);
      }
      
      if (popup) {
        let isSuccessDetected = false;
        
        const checkSuccess = async () => {
          try {
            const profileRes = await axios.get('/api/facebook/me');
            if (profileRes.data && profileRes.data.id) {
              isSuccessDetected = true;
              console.log("[AutoSync] Facebook authentication success detected via background API poll!");
              getPages();
              getUserProfile();
              return true;
            }
          } catch (e) {
            // Unauthenticated responses or pending connection are ignored during polling
          }
          return false;
        };

        const pollTimer = setInterval(async () => {
          if (popup && popup.closed) {
            clearInterval(pollTimer);
            console.log("[AutoSync] Popup window detected as closed. Making final page/profile retrieval...");
            getPages();
            getUserProfile();
          } else if (!isSuccessDetected) {
            const connected = await checkSuccess();
            if (connected) {
              clearInterval(pollTimer);
            }
          }
        }, 1500);
      } else {
        // Automatically activate fallback modal if popup is blocked
        console.log("[FB-Simulator] Popup blocked or not openable. Activating visual synchronization wizard.");
        setFbSyncModalOpen(true);
      }
    } catch (err: any) {
      alert(formatAxiosError(err, "Failed to retrieve Facebook auth URL."));
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    const socketUrl = (window as any).__BACKEND_URL__ || undefined;
    const newSocket = socketUrl ? io(socketUrl, { path: '/socket.io' }) : io();
    setSocket(newSocket);
    newSocket.on("new_message", (data) => {
      getConversations(selectedPage?.id);
    });
    return () => { newSocket.close(); };
  }, [selectedPage]);

  useEffect(() => {
    if (appUser?.email) {
      axios.defaults.headers.common['x-user-email'] = appUser.email;
    }
    if (currentWorkspaceId) {
      axios.defaults.headers.common['x-workspace-id'] = currentWorkspaceId;
    } else {
      delete axios.defaults.headers.common['x-workspace-id'];
    }
    getPages();
    getUserProfile();
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FB_AUTH_SUCCESS') {
        getPages();
        getUserProfile();
      } else if (event.data?.type === 'FB_AUTH_ERROR') {
        addToast(event.data.message || "Facebook authentication failed due to account constraints.", "error");
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'FB_AUTH_SUCCESS' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          // Only trigger if it's recent (less than 15 seconds old) to avoid stale triggers
          if (data && Date.now() - data.timestamp < 15000) {
            getPages();
            getUserProfile();
            // Clear the storage item so it won't trigger continuously 
            localStorage.removeItem('FB_AUTH_SUCCESS');
          }
        } catch (e) {
          console.error("Storage event parse error:", e);
        }
      } else if (event.key === 'FB_AUTH_ERROR' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data && Date.now() - data.timestamp < 15000) {
            addToast(data.message || "This Facebook account is already connected to another workspace.", "error");
            localStorage.removeItem('FB_AUTH_ERROR');
          }
        } catch (e) {
          console.error("Storage event error parsing validation:", e);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [getPages, getUserProfile, currentWorkspaceId]);

  useEffect(() => {
    if (socket) {
      if (pages.length > 0) {
        pages.forEach(p => socket.emit("join_page", p.id));
      }
      if (selectedPage) {
        if (selectedPage.id === "all") {
          selectedPageIds.forEach(id => socket.emit("join_page", id));
        } else {
          socket.emit("join_page", selectedPage.id);
        }
        getConversations(selectedPage.id);
      }
    } else if (selectedPage) {
      getConversations(selectedPage.id);
    }
  }, [selectedPage, socket, selectedPageIds, pages]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showChatDetail, setShowChatDetail] = useState(false);

  useEffect(() => {
    if (selectedConversation) {
      setShowChatDetail(true);
    } else {
      setShowChatDetail(false);
    }
  }, [selectedConversation]);

  const activeWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  const activeOrder = billingData?.orders?.find((o: any) => o.id === selectedOrderId);

  const isTabAllowedMap: Record<string, string[]> = {
    overview: ['owner', 'admin', 'agent', 'support'],
    pages: ['owner', 'admin', 'agent'],
    chat: ['owner', 'admin', 'agent', 'support'],
    audience: ['owner', 'admin', 'agent', 'support'],
    broadcast: ['owner', 'admin'],
    analytics: ['owner', 'admin', 'agent', 'support'],
    team: ['owner', 'admin'],
    billing: ['owner', 'admin'],
    settings: ['owner'],
  };

  const isCurrentTabAllowed = isTabAllowedMap[activeTab]?.includes(currentActiveRole);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-[70] flex flex-col p-6 h-full shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center gap-3 px-2 group cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Perseus Bot</span>
          </div>

          {/* Workspace Switcher */}
          <div className="relative z-50">
            <button 
              className="w-full flex items-center justify-between gap-3 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-200 transition-all shadow-sm cursor-pointer"
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0">
                  {workspaces.find(w => w.id === currentWorkspaceId)?.name.charAt(0)}
                </div>
                <span className="text-xs font-black text-slate-900 truncate uppercase tracking-widest text-left">
                  {workspaces.find(w => w.id === currentWorkspaceId)?.name}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            
            {isWorkspaceDropdownOpen && (
              <>
                {/* Backdrop to close the dropdown when clicking anywhere outside */}
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsWorkspaceDropdownOpen(false)}></div>
                
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden z-50 p-2 transform origin-top scale-100 transition-all">
                  <div className="max-h-60 overflow-y-auto scrollbar-hide">
                    {workspaces.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setCurrentWorkspaceId(w.id);
                          setIsWorkspaceDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all mb-1 cursor-pointer border-none bg-transparent ${currentWorkspaceId === w.id ? 'bg-indigo-50 text-indigo-600 font-black' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        <div className={`w-8 h-8 ${currentWorkspaceId === w.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'} rounded-xl flex items-center justify-center text-[10px] font-black shrink-0`}>
                          {w.name.charAt(0)}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest truncate">{w.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-50 mt-2 pt-2">
                    <button 
                      onClick={() => {
                        setIsCreateWorkspaceModalOpen(true);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-all border-none bg-transparent cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      New Workspace
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <nav className="flex-1 space-y-1.5">
          <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }} />
          
          {(currentActiveRole === 'owner' || currentActiveRole === 'admin' || currentActiveRole === 'agent') && (
            <SidebarItem icon={<Globe className="w-5 h-5" />} label="Pages" active={activeTab === 'pages'} onClick={() => { setActiveTab('pages'); setIsMobileMenuOpen(false); }} />
          )}
          
          <SidebarItem icon={<MessageSquare className="w-5 h-5" />} label="Conversations" active={activeTab === 'chat'} onClick={() => { setActiveTab('chat'); setIsMobileMenuOpen(false); }} />
          
          <SidebarItem icon={<Users className="w-5 h-5" />} label="Audience" active={activeTab === 'audience'} onClick={() => { setActiveTab('audience'); setIsMobileMenuOpen(false); }} />
          
          {(currentActiveRole === 'owner' || currentActiveRole === 'admin') && (
            <SidebarItem icon={<Megaphone className="w-5 h-5" />} label="Broadcast" active={activeTab === 'broadcast'} onClick={() => { setActiveTab('broadcast'); setIsMobileMenuOpen(false); }} />
          )}

          <SidebarItem icon={<BarChart2 className="w-5 h-5" />} label="Analytics" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }} />
          
          {(currentActiveRole === 'owner' || currentActiveRole === 'admin') && (
            <SidebarItem icon={<Users className="w-5 h-5" />} label="Team" active={activeTab === 'team'} onClick={() => { setTeamSubMode('list'); setActiveTab('team'); setIsMobileMenuOpen(false); }} />
          )}
          
          {(currentActiveRole === 'owner' || currentActiveRole === 'admin') && (
            <SidebarItem icon={<CreditCard className="w-5 h-5" />} label="Billing" active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setIsMobileMenuOpen(false); }} />
          )}
          
          {currentActiveRole === 'owner' && (
            <SidebarItem icon={<Settings className="w-5 h-5" />} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} />
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm font-black text-xs text-indigo-700">
              {currentActiveRole === 'owner' ? (
                <SafeAvatar src={userProfile?.picture?.data?.url} name={userProfile?.name || appUser?.fullName || "Owner"} className="w-full h-full" />
              ) : (
                <span>
                  {currentActiveRole === 'admin' ? 'AD' :
                   currentActiveRole === 'agent' ? 'AG' : 'SP'}
                </span>
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-black text-slate-900 truncate">
                {currentActiveRole === 'owner' 
                  ? (userProfile?.name || appUser?.fullName || "Ahsan Shabbir") 
                  : (currentActiveRole === 'admin' ? 'Zain Ul Abideen' :
                     currentActiveRole === 'agent' ? 'Sara Khan' : 'Bilal Ahmed')}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">Role: {currentActiveRole}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-black hover:bg-red-50 rounded-xl transition-all text-xs uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b px-4 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3 lg:gap-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-100 lg:hidden text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg lg:text-xl font-black text-slate-900 capitalize tracking-tight">
                {activeTab === 'team' && teamSubMode === 'add' ? 'Add Member' : activeTab}
              </h2>
              {(userProfile || appUser) && (
                <p className="hidden xs:block text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Welcome back, {(userProfile?.name || appUser?.fullName || "").split(' ')[0]}!</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Custom Role Tester Badge Dropdown */}
            <div className="flex items-center gap-2 bg-indigo-50/50 border border-indigo-100/40 rounded-2xl px-3 py-1.5 shadow-sm">
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-wider text-slate-400">Testing Role:</span>
              <select 
                value={currentActiveRole}
                onChange={(e) => {
                  const newRole = e.target.value as any;
                  setCurrentActiveRole(newRole);
                  
                  // Immediate redirection if changing to a restricted tab
                  if (newRole === 'agent' && (activeTab === 'billing' || activeTab === 'team' || activeTab === 'settings')) {
                    setActiveTab('overview');
                  } else if (newRole === 'support' && (activeTab === 'billing' || activeTab === 'team' || activeTab === 'pages' || activeTab === 'settings')) {
                    setActiveTab('overview');
                  } else if (newRole === 'admin' && activeTab === 'settings') {
                    setActiveTab('overview');
                  }
                  
                  addToast(`Switched active mock role to ${newRole.toUpperCase()}`, 'info');
                }}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-wider text-indigo-600 focus:outline-none cursor-pointer pr-1"
              >
                <option value="owner">Owner (Full)</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="support">Support</option>
              </select>
            </div>

            <button 
              onClick={() => setActiveTab('settings')}
              className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-indigo-50 transition-colors cursor-pointer group border-none outline-none"
            >
              <Settings className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:rotate-45 transition-all" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8 scroll-smooth h-full">
          {!isCurrentTabAllowed ? (
            <div className="max-w-md mx-auto my-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-10 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-red-500 shadow-md">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Access Denied</h3>
              <p className="text-slate-500 font-medium text-xs leading-relaxed mt-2">
                Your current security clearance level (<strong className="text-indigo-650 font-black">{currentActiveRole.toUpperCase()}</strong>) does not permit access to this secure division.
              </p>
              
              <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                  <span>Division</span>
                  <span>Requires Role</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 capitalize">{activeTab}</span>
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-650 rounded-lg">
                    {activeTab === 'settings' ? 'OWNER' : 
                     (activeTab === 'team' || activeTab === 'billing') ? 'OWNER | ADMIN' :
                     'OWNER | ADMIN | AGENT'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="bg-indigo-600 text-white font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 border-none"
                >
                  Back to Overview
                </button>
                <button 
                  onClick={() => {
                    setCurrentActiveRole('owner');
                    addToast("Switched active role to OWNER for full access", 'success');
                  }}
                  className="text-indigo-600 font-extrabold text-xs uppercase tracking-widest py-3 hover:bg-indigo-50 rounded-2xl transition-all border-none bg-transparent"
                >
                  Switch to Owner (Tester)
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewPage
                  pages={pages}
                  broadcastsHistory={broadcastsHistory}
                  workspaceCredits={workspaceCredits}
                  currentWorkspaceId={currentWorkspaceId}
                  currentPlan={currentPlan}
                  userProfile={userProfile}
                  appUser={appUser}
                  syncing={syncing}
                  handleSyncPages={handleSyncPages}
                  setActiveTab={setActiveTab}
                  setBillingSubView={setBillingSubView}
                  addToast={addToast}
                  setCurrentPlan={setCurrentPlan}
                  onUpgradePlan={() => setIsUpgradeModalOpen(true)}
                />
              )}

          {activeTab === 'pages' && (
            <PagesPage
              pages={pages}
              selectedPageIds={selectedPageIds}
              trialLocked={trialLocked}
              handleSyncPages={handleSyncPages}
              handleSelectTrialPage={handleSelectTrialPage}
              currentPlan={currentPlan}
              onUpgrade={() => setActiveTab('billing')}
            />
          )}

          {false && (
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">
               {/* Summary Cards */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                     { label: 'Total Pages', value: pages.length, icon: <Globe />, color: 'bg-indigo-600' },
                     { label: 'Active Bots', value: pages.filter(p => p.isSynced).length, icon: <Zap />, color: 'bg-emerald-500' },
                     { label: 'Trial Mode', value: pages.length, icon: <Clock />, color: 'bg-amber-500' },
                     { label: 'Inactive', value: 0, icon: <Power />, color: 'bg-slate-400' }
                  ].map((stat, i) => (
                     <div key={i} className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 flex items-center gap-4 sm:gap-6">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                           {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
                        </div>
                        <div>
                           <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{stat.label}</p>
                           <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{stat.value}</h4>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Table Section */}
               <div className="bg-white rounded-2xl sm:rounded-[1.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
                  <div className="p-5 sm:p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center sm:items-start md:items-center gap-4 bg-slate-50/25 text-center sm:text-left">
                     <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Connected Facebook Pages</h3>
                        <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mt-1">Status of your linked commercial pages and automated bots</p>
                     </div>
                     <button 
                        onClick={handleSyncPages}
                        className="w-full sm:w-auto justify-center bg-slate-900 text-white px-6 sm:px-8 py-3.5 sm:py-4.5 rounded-xl sm:rounded-[1.25rem] font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-indigo-650 transition-all shadow-md active:scale-95 flex items-center gap-3 shrink-0"
                     >
                        <Facebook className="w-4 h-4" /> Sync Facebook Pages
                     </button>
                  </div>

                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b border-slate-50 bg-slate-50/5">
                              <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Page Identity</th>
                              <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security / Role</th>
                              <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence Status</th>
                              <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subscription</th>
                              <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Controls</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {pages.map((p: any) => (
                              <tr key={p.id} className="group hover:bg-slate-50/30 transition-all duration-300">
                                 <td className="px-4 sm:px-10 py-4 sm:py-8">
                                    <div className="flex items-center gap-4 sm:gap-5">
                                       <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-xl sm:rounded-[1.5rem] border-2 sm:border-4 border-white shadow-xl overflow-hidden ring-1 ring-slate-100 group-hover:scale-105 transition-transform shrink-0">
                                          <SafeAvatar src={p.picture?.data?.url} name={p.name} className="w-full h-full" />
                                       </div>
                                       <div>
                                          <p className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{p.name}</p>
                                          <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold tracking-widest mt-1">ID: {p.id}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-4 sm:px-10 py-4 sm:py-8">
                                    <div className="flex flex-col gap-1">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Administrator</span>
                                       <span className="text-[9px] font-bold text-slate-400">Full Control Granted</span>
                                    </div>
                                 </td>
                                 <td className="px-4 sm:px-10 py-4 sm:py-8">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${selectedPageIds.includes(p.id) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                                       <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPageIds.includes(p.id) ? 'text-emerald-600' : 'text-slate-400'}`}>
                                          {selectedPageIds.includes(p.id) ? 'Active / Synchronized' : 'Ready / Limited'}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="space-y-1">
                                       {selectedPageIds.includes(p.id) ? (
                                         <>
                                           <span className="inline-flex px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                             {trialLocked ? 'Trial Active' : 'Selected for Trial'}
                                           </span>
                                           <p className="text-[9px] font-bold text-amber-500 flex items-center gap-1.5 mt-1">
                                              <Clock className="w-3 h-3" /> 3 days left
                                           </p>
                                         </>
                                       ) : (
                                         <span className="inline-flex px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Ready</span>
                                       )}
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                       {trialLocked || selectedPageIds.includes(p.id) ? (
                                         <span className={`px-4 py-2 border rounded-xl font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 ${
                                           selectedPageIds.includes(p.id)
                                             ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                             : 'bg-slate-50 text-slate-300 border-slate-100'
                                         }`}>
                                           <Lock className="w-3 h-3" /> {selectedPageIds.includes(p.id) ? 'Active / Locked' : 'Locked'}
                                         </span>
                                       ) : (
                                         <button 
                                            onClick={() => handleSelectTrialPage(p.id, !selectedPageIds.includes(p.id))}
                                            disabled={!selectedPageIds.includes(p.id) && selectedPageIds.length >= 3}
                                            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${
                                              selectedPageIds.includes(p.id) 
                                                ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
                                                : selectedPageIds.length >= 3
                                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                  : 'bg-indigo-600 text-white hover:bg-slate-900 active:scale-95'
                                            }`}
                                         >
                                            {selectedPageIds.includes(p.id) ? 'Remove Page' : 'Add Page'}
                                         </button>
                                       )}
                                    </div>
                                 </td>
                              </tr>
                           ))}
                           
                           {pages.length > 3 && selectedPageIds.length < 3 && !trialLocked && (
                             <tr className="bg-indigo-50/20">
                               <td colSpan={5} className="px-10 py-8">
                                 <div className="text-center">
                                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Select up to {3 - selectedPageIds.length} more pages for your free trial</p>
                                 </div>
                               </td>
                             </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <ChatPage
              pages={pages}
              conversations={conversations}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              selectedPageIds={selectedPageIds}
              chatSearch={chatSearch}
              setChatSearch={setChatSearch}
              chatFilter={chatFilter}
              setChatFilter={setChatFilter}
              showChatDetail={showChatDetail}
              setShowChatDetail={setShowChatDetail}
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
              pendingFile={pendingFile}
              setPendingFile={setPendingFile}
              isRecording={isRecording}
              recordingTime={recordingTime}
              startRecording={startRecording}
              stopRecording={stopRecording}
              isSending={isSending}
              handleSendFile={handleSendFile}
              handleReply={handleReply}
              handleFileChange={handleFileChange}
              isLoading={isLoading}
              getPages={getPages}
            />
          )}


          {false && (
            <div className="h-full flex flex-col lg:flex-row gap-0 bg-white rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
               <div className={`w-full lg:w-[26rem] bg-white border-r border-slate-100 flex flex-col h-full ${showChatDetail ? 'hidden lg:flex' : 'flex'}`}>
                  <div className="p-4 lg:p-8 border-b border-slate-50 space-y-4 lg:space-y-6">
                     <div className="flex justify-between items-center">
                        <h3 className="font-black text-xl lg:text-2xl tracking-tight text-slate-900">Inbox</h3>
                        <button onClick={getPages} className="p-2.5 lg:p-3 bg-indigo-50 text-indigo-600 rounded-xl lg:rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                           <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5" />
                        </button>
                     </div>

                    {/* Page Filter Dropdown */}
                    <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Facebook className="w-4 h-4" />
                       </div>
                       <select 
                          value={selectedPage?.id || ""} 
                          onChange={(e) => {
                             const page = e.target.value === "all" ? { id: "all", name: "Select All Pages" } : pages.find(p => p.id === e.target.value);
                             setSelectedPage(page);
                          }}
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-10 py-4 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-indigo-100 outline-none appearance-none transition-all cursor-pointer"
                       >
                          <option value="">Select Facebook Page</option>
                          {pages.filter(p => selectedPageIds.includes(p.id)).length > 0 && (
                              <option value="all">Select All Pages</option>
                           )}
                           {pages.filter(p => selectedPageIds.includes(p.id)).map((p: any) => (
                             <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <ChevronDown className="w-4 h-4" />
                       </div>
                    </div>

                    {/* Search & Tabs */}
                    <div className="space-y-4">
                       <div className="relative">
                          <input 
                             placeholder="Search messages..." 
                             value={chatSearch}
                             onChange={(e) => setChatSearch(e.target.value)}
                             className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-5 py-4 text-xs font-black focus:bg-white focus:border-indigo-100 outline-none transition-all" 
                          />
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       </div>

                       <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                          <button 
                             onClick={() => setChatFilter('all')}
                             className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chatFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             All Chats
                          </button>
                          <button 
                             onClick={() => setChatFilter('unread')}
                             className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chatFilter === 'unread' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             Unread
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Conversations List */}
                 <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
                    {!selectedPage ? (
                       <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
                          <ShieldAlert className="w-12 h-12" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Select a page to view chats</p>
                       </div>
                    ) : isLoading ? (
                       <div className="p-20 text-center animate-pulse">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl mx-auto mb-4"></div>
                          <div className="h-2 w-24 bg-slate-100 mx-auto rounded-full"></div>
                       </div>
                    ) : conversations.length === 0 ? (
                       <div className="p-20 text-center opacity-30 flex flex-col items-center gap-4">
                          <MessageSquare className="w-12 h-12" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No conversations found</p>
                       </div>
                    ) : (conversations || []).filter((c: any) => {
                       const activePageId = c._associatedPageId || selectedPage?.id;
                       const other = c.participants?.data?.find((p: any) => p.id !== activePageId);
                       const matchesSearch = other?.name?.toLowerCase().includes(chatSearch.toLowerCase());
                       const isUnread = c.unread_count > 0 || c.unread === true || (c.messages?.data?.[0]?.from?.id !== (c._associatedPageId || selectedPage?.id) && selectedConversation?.id !== c.id);
                       const matchesUnread = chatFilter === 'all' || isUnread;
                       return matchesSearch && matchesUnread;
                    }).map((c: any) => {
                       const activePageId = c._associatedPageId || selectedPage?.id;
                       const other = c.participants.data.find((p: any) => p.id !== activePageId);
                       const isActive = selectedConversation?.id === c.id;
                       const lastMsg = c.messages?.data?.[0]?.message;
                       const isUnread = c.unread_count > 0 || c.unread === true || (c.messages?.data?.[0]?.from?.id !== activePageId && !isActive);
                       return (
                          <button 
                             key={c.id}
                             onClick={() => {
                                setSelectedConversation(c);
                                setShowChatDetail(true);
                                // Clear unread property immediately client-side
                                c.unread_count = 0;
                                c.unread = false;
                             }}
                             className={`w-full p-4 sm:p-5 lg:p-6 flex gap-3 sm:gap-4 transition-all group relative border-b border-slate-50/50 ${isActive ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                          >
                             {isActive && <div className="absolute left-0 top-4 bottom-4 w-0.5 sm:w-1 bg-indigo-600 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>}
                             <div className="relative shrink-0">
                                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${isActive ? 'border-indigo-600 scale-105 shadow-xl' : 'border-white bg-slate-100'}`}>
                                   <SafeAvatar src={other?.picture?.data?.url} name={other?.name} className="w-full h-full" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                             </div>
                             <div className="flex-1 min-w-0 pr-1 sm:pr-4">
                                <div className="flex justify-between items-center mb-1">
                                   <p className={`font-black text-[10px] sm:text-xs uppercase tracking-tight truncate ${isActive ? 'text-indigo-900' : isUnread ? 'text-slate-900' : 'text-slate-700'}`}>{other?.name || 'Customer'}</p>
                                   <div className="flex items-center gap-1.5">
                                      <span className="text-[8px] font-black opacity-30 uppercase">{new Date(c.updated_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                      {isUnread && (
                                         <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.8)] shrink-0"></div>
                                      )}
                                   </div>
                                </div>
                                <p className={`text-[10px] sm:text-[11px] truncate leading-relaxed ${isActive ? 'text-indigo-600/70 font-semibold' : isUnread ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'}`}>{lastMsg || 'Sent an attachment...'}</p>
                             </div>
                          </button>
                       )
                    })}
                 </div>
              </div>

              {/* Right Panel: Chat View */}
              <div className={`flex-1 bg-[#F8FAFC] flex flex-col h-full overflow-hidden relative ${showChatDetail ? 'fixed inset-0 z-[60] bg-white translate-x-0' : 'hidden lg:flex'}`}>
                 {selectedConversation ? (
                    <>
                       {/* Header */}
                       <div className="p-3 lg:p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 shadow-sm sticky top-0">
                          <div className="flex items-center gap-3 lg:gap-5">
                             <button 
                                onClick={() => {
                                   setSelectedConversation(null);
                                   setShowChatDetail(false);
                                }}
                                className="p-2 -ml-1 rounded-xl hover:bg-slate-100 lg:hidden text-slate-400"
                             >
                                <ChevronRight className="w-6 h-6 rotate-180" />
                             </button>
                             <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-xl lg:rounded-[1.5rem] overflow-hidden border-2 lg:border-4 border-slate-100 shadow-lg lg:shadow-xl">
                                {(() => {
                                   const activePageId = selectedConversation._associatedPageId || selectedPage?.id;
                                   const other = selectedConversation.participants.data.find((p: any) => p.id !== activePageId);
                                   return <SafeAvatar src={other?.picture?.data?.url} name={other?.name} className="w-full h-full" />;
                                })()}
                             </div>
                             <div className="min-w-0">
                                <h4 className="font-black text-sm lg:text-xl text-slate-900 tracking-tight truncate max-w-[120px] sm:max-w-none">{selectedConversation.participants.data.find((p: any) => p.id !== (selectedConversation._associatedPageId || selectedPage?.id))?.name || 'Conversation'}</h4>
                                <div className="flex items-center gap-1.5 lg:mt-1">
                                   <div className="w-1.5 lg:w-2 h-1.5 lg:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                   <p className="text-[8px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap font-mono tracking-wider">Perseus Bot</p>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2 lg:gap-3">
                             <button className="hidden sm:flex p-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm transition-all"><Activity className="w-5 h-5" /></button>
                             <button className="p-2.5 lg:p-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl lg:rounded-2xl shadow-sm transition-all"><Settings className="w-5 h-5" /></button>
                          </div>
                       </div>

                       {/* Messages */}
                       <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
                          {[...(selectedConversation.messages?.data || [])].reverse().map((m: any, idx: number) => {
                             const isMe = m.from.id === (selectedConversation._associatedPageId || selectedPage?.id);
                             const sender = selectedConversation.participants.data.find((p: any) => p.id === m.from.id);
                             return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start items-end gap-5'} group`}>
                                   {!isMe && (
                                      <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-xl shadow-slate-200/50 mb-1 shrink-0">
                                         <SafeAvatar src={sender?.picture?.data?.url} name={sender?.name} className="w-full h-full" />
                                      </div>
                                   )}
                                   <div className="max-w-[70%]">
                                      {!isMe && <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{sender?.name || 'Customer'}</p>}
                                      <div className={`p-6 rounded-[2.25rem] text-sm font-semibold leading-relaxed shadow-xl ${
                                         isMe 
                                            ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100' 
                                            : 'bg-white text-slate-800 rounded-bl-none shadow-slate-200/50'
                                      }`}>
                                         {m.message}
                                         {m.attachments?.data?.map((att: any, attIdx: number) => (
                                            <div key={attIdx} className="mt-5 rounded-2xl overflow-hidden shadow-2xl">
                                               {att.type === 'image' && <img src={att.payload?.url?.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(att.payload.url)}` : (att.payload?.url || '')} alt="Attachment" className="max-w-full hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />}
                                               {att.type === 'audio' && <div className="bg-black/5 p-4"><audio controls className="w-full h-8 opacity-80"><source src={att.payload?.url} /></audio></div>}
                                               {att.type === 'file' && (
                                                 <a href={att.payload?.url} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-4 rounded-xl text-xs font-black transition-all ${isMe ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-slate-50 hover:bg-slate-100'}`}>
                                                    <Download className="w-5 h-5" /> Download Attachment
                                                 </a>
                                               )}
                                            </div>
                                         ))}
                                      </div>
                                      <p className={`text-[8px] mt-2 font-black uppercase tracking-widest opacity-30 ${isMe ? 'text-right pr-2' : 'text-left pl-2'}`}>{new Date(m.created_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                   </div>
                                </div>
                             )
                          })}
                       </div>

                       {/* Input Area */}
                       <div className="p-10 bg-white border-t border-slate-100 relative">
                          {pendingFile && (
                             <div className="absolute left-10 right-10 bottom-full mb-6 animate-in slide-in-from-bottom-4 duration-300">
                                <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                         <ImageIcon className="w-6 h-6" />
                                      </div>
                                      <div>
                                         <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Upload Queue</p>
                                         <p className="text-xs font-black truncate max-w-xs">{pendingFile.name}</p>
                                      </div>
                                   </div>
                                   <button onClick={() => setPendingFile(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                                      <X className="w-5 h-5" />
                                   </button>
                                </div>
                             </div>
                          )}

                          {isRecording && (
                            <div className="absolute left-10 right-10 bottom-full mb-6 animate-in slide-in-from-bottom-4 duration-300">
                               <div className="bg-red-600 text-white p-6 rounded-[2.5rem] shadow-2xl flex justify-between items-center animate-pulse">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center animate-ping duration-1000"><Mic className="w-5 h-5" /></div>
                                     <p className="text-xs font-black uppercase tracking-widest">RECORDING VOICE... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</p>
                                  </div>
                                  <button onClick={stopRecording} className="bg-white text-red-600 px-8 py-3 rounded-2xl text-xs font-black hover:bg-slate-100 transition-all shadow-xl">STOP & SEND</button>
                               </div>
                            </div>
                          )}

                          <div className="flex items-center gap-5">
                             <div className="flex gap-2 bg-slate-50 p-2 rounded-[2rem]">
                                <label className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95">
                                   <Paperclip className="w-5 h-5" />
                                   <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'file')} />
                                </label>
                                <button 
                                  onClick={isRecording ? stopRecording : startRecording}
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-md active:scale-95 ${isRecording ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white hover:text-indigo-600'}`}>
                                   <Mic className="w-5 h-5" />
                                </button>
                             </div>
                             
                             <div className="flex-1 relative">
                                <input 
                                   value={replyMessage}
                                   onChange={(e) => setReplyMessage(e.target.value)}
                                   onKeyDown={(e) => e.key === 'Enter' && (pendingFile ? handleSendFile() : handleReply())}
                                   placeholder="Reply to this conversation..."
                                   className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-[2rem] px-8 py-5 text-sm font-bold outline-none transition-all pr-24 shadow-inner"
                                />
                                <button 
                                   onClick={pendingFile ? handleSendFile : handleReply}
                                   disabled={isSending || (!replyMessage.trim() && !pendingFile)}
                                   className="absolute right-3 top-3 bottom-3 w-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 disabled:opacity-30"
                                >
                                   <Send className="w-6 h-6" />
                                </button>
                             </div>
                          </div>
                       </div>
                    </>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-[#F8FAFC]">
                       <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mb-10 rotate-6 hover:rotate-0 transition-transform duration-700 border border-slate-50">
                          <MessageSquare className="w-16 h-16 text-indigo-50" />
                       </div>
                       <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-4">No Conversation Selected</h4>
                       <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] max-w-[15rem] leading-loose">Choose a profile from your list to initiate command control.</p>
                    </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'audience' && (
            <AudiencePage onOpenChat={handleOpenChatFromAudience} addToast={addToast} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage 
              pages={pages} 
              creditBalance={creditBalance} 
              broadcastsHistory={broadcastsHistory} 
              addToast={addToast} 
              onSelectBroadcast={(id) => {
                setActiveTab('broadcast');
                setSelectedBroadcastId(id);
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              settingsSubTab={settingsSubTab}
              setSettingsSubTab={setSettingsSubTab}
              activeWorkspace={activeWorkspace}
              editWorkspaceName={editWorkspaceName}
              setEditWorkspaceName={setEditWorkspaceName}
              isEditWorkspaceModalOpen={isEditWorkspaceModalOpen}
              setIsEditWorkspaceModalOpen={setIsEditWorkspaceModalOpen}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              pages={pages}
              syncing={syncing}
              handleSyncPages={handleSyncPages}
              teamMembers={teamMembers}
              setTeamSubMode={setTeamSubMode}
              setActiveTab={setActiveTab}
              addToast={addToast}
              editProfileName={editProfileName}
              setEditProfileName={setEditProfileName}
              editProfileEmail={editProfileEmail}
              setEditProfileEmail={setEditProfileEmail}
              isEditProfileModalOpen={isEditProfileModalOpen}
              setIsEditProfileModalOpen={setIsEditProfileModalOpen}
              isChangePasswordModalOpen={isChangePasswordModalOpen}
              setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isManageSessionsModalOpen={isManageSessionsModalOpen}
              setIsManageSessionsModalOpen={setIsManageSessionsModalOpen}
              sessionsList={sessionsList}
              setSessionsList={setSessionsList}
              currentWorkspaceId={currentWorkspaceId}
              setWorkspaces={setWorkspaces}
              appUser={appUser}
            />
          )}

          {false && (
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-[#0B1527] tracking-tight mb-2 text-center sm:text-left">
                    {settingsSubTab === 'workspace' ? 'Workspace Settings' : 'Settings'}
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium text-center sm:text-left">
                    {settingsSubTab === 'workspace' 
                      ? `Manage settings for ${activeWorkspace?.name || 'khaadi'}` 
                      : 'Manage your account settings and preferences.'}
                  </p>
                </div>
                
                {/* Sub-navigation Toggles */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40 w-full sm:w-auto shrink-0 justify-center">
                  <button 
                    onClick={() => {
                      setSettingsSubTab('workspace');
                      addToast("Switched to Workspace Settings tab", "info");
                    }}
                    className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${settingsSubTab === 'workspace' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Workspace Settings
                  </button>
                  <button 
                    onClick={() => {
                      setSettingsSubTab('profile');
                      addToast("Switched to Profile & Security settings tab", "info");
                    }}
                    className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${settingsSubTab === 'profile' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Profile & Security
                  </button>
                </div>
              </div>

              {/* ----------------- WORKSPACE SETTINGS TAB ----------------- */}
              {settingsSubTab === 'workspace' && (
                <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* WORKSPACE DETAILS CARD */}
                  <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 bg-[#F9FAFB]/30 flex justify-between items-center">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Workspace Details</h3>
                      <button 
                        onClick={() => {
                          setEditWorkspaceName(activeWorkspace?.name || "khaadi");
                          setIsEditWorkspaceModalOpen(true);
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-lg sm:rounded-xl transition-all cursor-pointer border-none"
                      >
                        Edit Details
                      </button>
                    </div>
                    <div className="p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2 border-b border-slate-50">
                        <span className="text-slate-500 font-semibold text-xs sm:text-sm">Name</span>
                        <span className="text-slate-900 font-bold text-xs sm:text-sm tracking-tight">{activeWorkspace?.name || "khaadi"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2 border-b border-slate-50">
                        <span className="text-slate-500 font-semibold text-xs sm:text-sm">Status</span>
                        <span className="inline-block self-start sm:self-auto bg-[#EBFDF5] text-[#10B981] text-[9px] sm:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#D1FAE5]">Active</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2 border-b border-slate-50">
                        <span className="text-slate-500 font-semibold text-xs sm:text-sm">Owner</span>
                        <span className="text-slate-900 font-bold text-xs sm:text-sm tracking-tight">{(userProfile?.name || appUser?.fullName || "Ahsan Shabbir")}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2">
                        <span className="text-slate-500 font-semibold text-xs sm:text-sm">Created</span>
                        <span className="text-slate-900 font-bold text-xs sm:text-sm tracking-tight">May 18, 2026</span>
                      </div>
                    </div>
                  </div>

                  {/* FACEBOOK CONNECTION CARD */}
                  <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 bg-[#F9FAFB]/30">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Facebook Connection</h3>
                    </div>
                    <div className="p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-750/10 rounded-full flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm shrink-0">
                            <SafeAvatar src={userProfile?.picture?.data?.url} name={userProfile?.name || "Connected Profile"} className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                              {userProfile ? userProfile.name : "Not Connected"}
                            </p>
                            {userProfile ? (
                              <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider font-mono mt-1">Provider ID: {userProfile.id}</p>
                            ) : (
                              <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider font-mono mt-1">Provider ID: None</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {userProfile ? (
                            <span className="inline-block bg-[#EBFDF5] text-[#10B981] text-[9px] sm:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#D1FAE5]">Connected</span>
                          ) : (
                            <span className="inline-block bg-slate-100 text-slate-500 text-[9px] sm:text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200">Integration required</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-5 sm:pt-6 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${userProfile ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                          <p className="text-xs sm:text-sm font-black text-slate-700">
                            {userProfile ? `${pages.length} active targeting pages synchronized` : "No Facebook account connected"}
                          </p>
                        </div>
                        {userProfile ? (
                          <button 
                            onClick={() => {
                              setActiveTab('pages');
                              addToast("Redirected to active page management", "info");
                            }}
                            className="w-full sm:w-auto justify-center px-4 py-2.5 sm:px-6 sm:py-3 border border-slate-200 hover:border-indigo-600 hover:bg-slate-50 text-slate-900 hover:text-[#2563EB] rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 bg-transparent"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Manage Page Access
                          </button>
                        ) : (
                          <button 
                            onClick={handleSyncPages}
                            disabled={syncing}
                            className="w-full sm:w-auto justify-center px-4 py-2.5 sm:px-6 sm:py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-0"
                          >
                            {syncing ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Facebook className="w-3.5 h-3.5" /> Connect Facebook
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TEAM SUMMARY CARD */}
                  <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 bg-[#F9FAFB]/30 flex justify-between items-center">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Workspace Team Members</h3>
                      <button 
                        onClick={() => {
                          setTeamSubMode('list');
                          setActiveTab('team');
                          addToast("Displaying full team details", "info");
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-lg sm:rounded-xl transition-all cursor-pointer border-none"
                      >
                        Manage Team
                      </button>
                    </div>
                    <div className="p-4 sm:p-6 md:p-8">
                      <div className="divide-y divide-slate-50">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="py-3 sm:py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 text-[#2563EB] border border-indigo-100/60 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-[10px] sm:text-xs uppercase shrink-0">
                                {member.name ? member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'US'}
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-slate-950">{member.name}</p>
                                <p className="text-[10px] sm:text-[11px] text-slate-450 font-mono tracking-tight">{member.email}</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] font-black uppercase tracking-wider rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                              {member.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- MY PROFILE & SECURITY TAB ----------------- */}
              {settingsSubTab === 'profile' && (
                <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Profile Section */}
                  <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 bg-[#F9FAFB]/30 flex justify-between items-center">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Profile</h3>
                      <button 
                        onClick={() => {
                          setEditProfileName(userProfile?.name || "Ahsan Shabbir");
                          setEditProfileEmail(userProfile?.email || "ahsan.shabbir292@gmail.com");
                          setIsEditProfileModalOpen(true);
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-lg sm:rounded-xl transition-all cursor-pointer border-none"
                      >
                        Update Profile
                      </button>
                    </div>
                    <div className="p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2 border-b border-slate-50 last:border-b-0 pb-3">
                        <span className="text-slate-500 font-semibold text-xs sm:text-sm">Name</span>
                        <span className="text-slate-900 font-bold text-xs sm:text-sm tracking-tight">{userProfile?.name || "Ahsan Shabbir"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2 border-b border-slate-50 last:border-b-0 pb-3">
                        <span className="text-slate-500 font-semibold text-xs sm:text-sm">Email</span>
                        <span className="text-slate-900 font-bold text-xs sm:text-sm tracking-tight">{userProfile?.email || "ahsan.shabbir292@gmail.com"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2 border-b border-slate-50 last:border-b-0 pb-3">
                        <span className="text-slate-500 font-semibold text-xs sm:text-sm">Email verified</span>
                        <span className="inline-block self-start sm:self-auto bg-[#EBFDF5] text-[#10B981] text-[9px] sm:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#D1FAE5]">Verified</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-2">
                        <span className="text-slate-500 font-semibold text-xs sm:text-sm">Member since</span>
                        <span className="text-slate-900 font-bold text-xs sm:text-sm tracking-tight">May 18, 2026</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 bg-[#F9FAFB]/30">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Security</h3>
                    </div>
                    <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5 sm:pb-6">
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-bold text-sm mb-1">Password</p>
                          <p className="text-slate-500 text-xs sm:text-sm font-medium">Update your password. All other sessions will be logged out.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                            setIsChangePasswordModalOpen(true);
                          }}
                          className="w-full sm:w-auto text-center px-4 py-2.5 sm:px-6 sm:py-3 border border-slate-200 hover:border-[#2563EB] text-slate-800 hover:text-[#2563EB] bg-transparent rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-bold text-sm mb-1">Active sessions</p>
                          <p className="text-slate-500 text-xs sm:text-sm font-medium">See all devices where you're logged in and revoke access.</p>
                        </div>
                        <button 
                          onClick={() => setIsManageSessionsModalOpen(true)}
                          className="w-full sm:w-auto text-center px-4 py-2.5 sm:px-6 sm:py-3 border border-slate-200 hover:border-[#2563EB] text-slate-800 hover:text-[#2563EB] bg-transparent rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* INTERACTIVE SETTINGS MODAL DIALOGS CONTENT OVERLAY */}
              {/* ========================================================= */}

              {/* 1. EDIT WORKSPACE NAME MODAL */}
              {isEditWorkspaceModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#000000]/40 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-950 tracking-tight">Edit Workspace Name</h3>
                      <button 
                        onClick={() => setIsEditWorkspaceModalOpen(false)}
                        className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Workspace Name</label>
                        <input 
                          type="text"
                          value={editWorkspaceName}
                          onChange={(e) => setEditWorkspaceName(e.target.value)}
                          className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={() => setIsEditWorkspaceModalOpen(false)}
                          className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={async () => {
                            if (!editWorkspaceName.trim()) {
                              addToast("Workspace name cannot be empty.", "error");
                              return;
                            }
                            const newName = editWorkspaceName.trim();
                            // Update local UI state
                            setWorkspaces(prev => prev.map(w => w.id === currentWorkspaceId ? { ...w, name: newName } : w));
                            
                            try {
                              const res = await axios.post('/api/auth/update-settings', { workspaceName: newName });
                              if (res.data.user) {
                                localStorage.setItem('current_app_user', JSON.stringify(res.data.user));
                                if (appUser) {
                                  appUser.workspaceName = newName;
                                }
                              }
                              addToast(`Workspace renamed to "${newName}" successfully!`, "success");
                            } catch (e: any) {
                              console.warn("Could not persist workspace settings to database:", e);
                              addToast(`Workspace renamed to "${newName}" locally (DB sync failed).`, "success");
                            }
                            setIsEditWorkspaceModalOpen(false);
                          }}
                          className="flex-1 py-3.5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EDIT PROFILE MODAL */}
              {isEditProfileModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#000000]/40 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-950 tracking-tight">Edit Profile Info</h3>
                      <button 
                        onClick={() => setIsEditProfileModalOpen(false)}
                        className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Display Name</label>
                        <input 
                          type="text"
                          value={editProfileName}
                          onChange={(e) => setEditProfileName(e.target.value)}
                          className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                        <input 
                          type="email"
                          value={editProfileEmail}
                          onChange={(e) => setEditProfileEmail(e.target.value)}
                          className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={() => setIsEditProfileModalOpen(false)}
                          className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none"
                        >
                          Cancel
                        </button>
                         <button 
                          onClick={async () => {
                            if (!editProfileName.trim() || !editProfileEmail.trim()) {
                              addToast("All input parameters must be completely populated.", "error");
                              return;
                            }
                            const newName = editProfileName.trim();
                            setUserProfile(prev => ({
                              ...prev,
                              name: newName,
                              email: editProfileEmail.trim()
                            }));
                            
                            try {
                              const res = await axios.post('/api/auth/update-settings', { fullName: newName });
                              if (res.data.user) {
                                localStorage.setItem('current_app_user', JSON.stringify(res.data.user));
                                if (appUser) {
                                  appUser.fullName = newName;
                                }
                              }
                              addToast("Profile credentials synchronized successfully!", "success");
                            } catch (e: any) {
                              console.warn("Could not persist profile settings to database:", e);
                              addToast("Profile credentials synchronized locally (DB sync failed).", "success");
                            }
                            setIsEditProfileModalOpen(false);
                          }}
                          className="flex-1 py-3.5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none"
                        >
                          Save Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. CHANGE PASSWORD MODAL */}
              {isChangePasswordModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#000000]/40 backdrop-blur-sm animate-in fade-in duration-200">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!currentPassword || !newPassword || !confirmPassword) {
                        addToast("All credential lines must be populated.", "error");
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        addToast("Confirmation input mismatches new password value.", "error");
                        return;
                      }
                      addToast("Security password updated. Other active tokens terminated.", "success");
                      setIsChangePasswordModalOpen(false);
                    }}
                    className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-950 tracking-tight">Change Password</h3>
                      <button 
                        type="button" 
                        onClick={() => setIsChangePasswordModalOpen(false)}
                        className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Current Password</label>
                        <input 
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex justify-between">
                          <span>New Password</span>
                          <span className="text-indigo-600 text-[9px]">Strong level</span>
                        </label>
                        <input 
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Confirm New Password</label>
                        <input 
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="button"
                          onClick={() => setIsChangePasswordModalOpen(false)}
                          className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none shadow-xl shadow-slate-100"
                        >
                          Save Password
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* 4. MANAGE ACTIVE SESSIONS MODAL */}
              {isManageSessionsModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#000000]/40 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-950 tracking-tight">Active Sessions Directory</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Authorized terminals currently signed in</p>
                      </div>
                      <button 
                        onClick={() => setIsManageSessionsModalOpen(false)}
                        className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 my-6 divide-y divide-slate-100">
                      {sessionsList.map((session) => (
                        <div key={session.id} className="pt-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                              {session.device.includes('iPhone') ? <Toggle className="w-5 h-5 text-indigo-500" /> : <Globe className="w-5 h-5 text-indigo-500" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                {session.device} 
                                {session.active && (
                                  <span className="bg-[#EBFDF5] text-[#10B981] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-[#D1FAE5]">Current</span>
                                )}
                              </p>
                              <p className="text-xs text-slate-400 font-medium">IP: {session.ip} &bull; {session.location}</p>
                            </div>
                          </div>
                          {!session.active && (
                            <button 
                              onClick={() => {
                                setSessionsList(prev => prev.filter(s => s.id !== session.id));
                                addToast(`Revoked session session identity: ${session.device}`, "success");
                              }}
                              className="text-red-500 hover:text-white bg-transparent hover:bg-red-500 font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-500 transition-all cursor-pointer"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                      {sessionsList.length === 1 && (
                        <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest pt-4">No other active terminals detected.</p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-4">
                      <button 
                        onClick={() => {
                          setSessionsList(sessionsList.filter(s => s.active));
                          addToast("Revoked security access for all other active credentials.", "success");
                        }}
                        className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none"
                      >
                        Terminate All Other Sessions
                      </button>
                      <button 
                        onClick={() => setIsManageSessionsModalOpen(false)}
                        className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'broadcast' && (() => {
            const hasHistory = broadcastsHistory.length > 0;
            
            // Map real history or use premium default mock points
            const realChartData = broadcastsHistory.map((b, idx) => {
              const success = b.successCount || 0;
              const fail = b.failCount || 0;
              const total = b.totalRecipients || (success + fail) || 1;
              const rate = Math.round((success / total) * 100);
              return {
                id: b.id,
                name: b.createdAt ? new Date(b.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : `Campaign ${idx + 1}`,
                dateLabel: b.createdAt ? new Date(b.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A',
                messageShort: b.message ? (b.message.length > 30 ? b.message.substring(0, 30) + '...' : b.message) : (b.attachmentType ? `${b.attachmentType.toUpperCase()} Campaign` : 'No Text'),
                messageFull: b.message || (b.attachmentType ? `Attachment type: ${b.attachmentType}` : 'No text body content'),
                Delivered: success,
                Failed: fail,
                Total: total,
                successRate: rate,
                pageName: b.pageName || 'Connected Page',
                status: b.status || 'completed'
              };
            }).reverse();

            const chartData = hasHistory ? realChartData : [];

            const totalDelivered = hasHistory 
              ? broadcastsHistory.reduce((acc, curr) => acc + (curr.successCount || 0), 0)
              : 0;

            const totalFailed = hasHistory 
              ? broadcastsHistory.reduce((acc, curr) => acc + (curr.failCount || 0), 0)
              : 0;

            const outstandingRatio = totalDelivered + totalFailed;
            const finalSuccessPercentage = outstandingRatio > 0 ? Math.round((totalDelivered / outstandingRatio) * 100) : 0;

            const pieData = [
              { name: 'Delivered', value: totalDelivered, color: '#10b981' },
              { name: 'Failed', value: totalFailed, color: '#f43f5e' }
            ];

            const CustomTooltip = ({ active, payload, label }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl font-sans text-xs text-white">
                    <p className="text-slate-400 font-bold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                      <p key={index} className="font-extrabold flex items-center gap-2" style={{ color: entry.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                        {entry.name}: {entry.value.toLocaleString()} messages
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            };

            // Render modular sub-views depending on broadcastView
            if (broadcastView === 'choice') {
              return (
                <BroadcastChoice 
                  onSelect={(mode) => setBroadcastView(mode)}
                  onBack={() => setBroadcastView('dashboard')}
                />
              );
            }

            if (broadcastView === 'single') {
              return (
                <BroadcastSingle
                  pages={pages}
                  creditBalance={creditBalance}
                  onCancel={() => setBroadcastView('dashboard')}
                  onSubmit={handleSingleSubmit}
                  isSubmitting={isSubmittingBroadcast}
                />
              );
            }

            if (broadcastView === 'bulk') {
              return (
                <BroadcastBulk
                  pages={pages}
                  creditBalance={creditBalance}
                  onCancel={() => setBroadcastView('dashboard')}
                  onSubmit={handleBulkSubmit}
                  isSubmitting={isSubmittingBroadcast}
                />
              );
            }

            // If a specific broadcast is selected, show the detailed design
            if (selectedBroadcastId) {
              const selectedBSelection = broadcastsHistory.find(x => x.id === selectedBroadcastId);
              if (selectedBSelection) {
                return (
                  <BroadcastDetailsView 
                    broadcast={selectedBSelection}
                    onBack={() => {
                      setSelectedBroadcastId(null);
                      getBroadcastHistory();
                    }}
                    isLiveBroadcasting={isBroadcasting}
                    liveProgress={broadcastProgress}
                  />
                );
              }
            }

            const hasActiveFilters = 
              appliedFilters.status !== "all" ||
              appliedFilters.pageId !== "all" ||
              appliedFilters.type !== "all" ||
              appliedFilters.tag !== "all" ||
              appliedFilters.startDate !== "" ||
              appliedFilters.endDate !== "" ||
              appliedFilters.onlyFailures;

            const filteredHistory = broadcastsHistory.filter(b => {
              // 1. Search Query filter (checks pageName, message, status)
              if (broadcastSearchQuery) {
                const query = broadcastSearchQuery.toLowerCase();
                const matchesSearch = 
                  (b.pageName && b.pageName.toLowerCase().includes(query)) ||
                  (b.message && b.message.toLowerCase().includes(query)) ||
                  (b.status && b.status.toLowerCase().includes(query));
                if (!matchesSearch) return false;
              }

              // 2. Applied Status Filter
              if (appliedFilters.status !== "all") {
                const bStatus = (b.status || "completed").toLowerCase();
                if (bStatus !== appliedFilters.status.toLowerCase()) {
                  return false;
                }
              }

              // 3. Applied Page Filter
              if (appliedFilters.pageId !== "all") {
                if (b.pageId !== appliedFilters.pageId) {
                  return false;
                }
              }

              // 4. Applied Type Filter
              if (appliedFilters.type !== "all") {
                if (appliedFilters.type === "text") {
                  if (b.hasAttachment) return false;
                } else if (appliedFilters.type === "attachment") {
                  if (!b.hasAttachment) return false;
                } else if (appliedFilters.type === "image") {
                  if (!b.hasAttachment || b.attachmentType !== "image") return false;
                } else if (appliedFilters.type === "file") {
                  if (!b.hasAttachment || b.attachmentType !== "file") return false;
                }
              }

              // 5. Applied Tag Filter (Messenger Tag)
              if (appliedFilters.tag !== "all") {
                const bTag = b.messageTag || b.tag || "UTILITY";
                if (bTag !== appliedFilters.tag) {
                  return false;
                }
              }

              // 6. Applied Date Range Filter
              if (appliedFilters.startDate) {
                const bDateStr = b.createdAt ? b.createdAt.substring(0, 10) : ""; // yyyy-mm-dd
                if (bDateStr && bDateStr < appliedFilters.startDate) {
                  return false;
                }
              }
              if (appliedFilters.endDate) {
                const bDateStr = b.createdAt ? b.createdAt.substring(0, 10) : ""; // yyyy-mm-dd
                if (bDateStr && bDateStr > appliedFilters.endDate) {
                  return false;
                }
              }

              // 7. Applied Failures Only Filter
              if (appliedFilters.onlyFailures) {
                if ((b.failCount || 0) <= 0) {
                  return false;
                }
              }

              return true;
            });

            return (
              <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-left w-full">
                
                {/* 1. Free Trial Active Top Banner */}
                <div id="trial-active-banner" className="bg-[#E6F7F0]/85 border border-[#D1F2E0] text-[#027A48] px-4.5 py-3.5 rounded-[1.25rem] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm font-semibold gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#10B981] fill-[#10B981]" />
                    <span>Free Trial active — <span className="font-bold">3 days</span> remaining</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 text-slate-600 bg-[#D1F2E0]/45 px-3 py-1 rounded-xl text-xs border border-emerald-200 border-solid font-bold">
                      <CreditCard className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
                      <span className="font-extrabold text-[#027A48]">5,000</span> trial credits
                    </span>
                    <button className="text-[#027A48] hover:text-[#025A38] font-black flex items-center gap-1 underline decoration-2 cursor-pointer bg-transparent border-none">
                      Upgrade <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Main Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Campaign Broadcasts</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Design, dispatch, and track high-impact message campaigns across connected pages</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Live Badge */}
                    <span id="badge-live" className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-full flex items-center gap-2 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="uppercase tracking-wider text-[10px]">Live Monitor</span>
                    </span>
                    
                    {/* Total Badge */}
                    <span id="badge-total" className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-sm">
                      <Radio className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="uppercase tracking-wider text-[10px]">{broadcastsHistory.length} Total</span>
                    </span>

                    {/* New Broadcast Button */}
                    <button
                      onClick={() => setBroadcastView('choice')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-[1.25rem] font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 border-none cursor-pointer hover:shadow-indigo-100 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      <span>New Broadcast</span>
                    </button>
                  </div>
                </div>

                {/* 3. Search & Control Panel Row */}
                <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
                  {/* Search bar inputs */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={broadcastSearchQuery}
                      onChange={(e) => setBroadcastSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-sm text-slate-800 placeholder-slate-400 bg-white transition-all shadow-inner"
                    />
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center justify-end gap-2.5">
                    {/* Filter Button & Popover Container */}
                    <div className="relative">
                      <button 
                        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                        className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          isFilterDropdownOpen || hasActiveFilters 
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-50 shadow-sm' 
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-solid'
                        }`}
                      >
                        <Filter className={`w-4 h-4 ${isFilterDropdownOpen || hasActiveFilters ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <span>Filters</span>
                        {hasActiveFilters && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                      </button>

                      {/* POPUP OVERLAY */}
                      {isFilterDropdownOpen && (
                        <div id="filter-dropdown-menu" className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-5.5 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                          {/* Grid Columns */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Status */}
                            <div>
                              <label className="block text-[10px] font-black text-slate-450 mb-1.5 uppercase tracking-widest">Status</label>
                              <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-150 cursor-pointer"
                              >
                                <option value="all">All Statuses</option>
                                <option value="completed">Completed</option>
                                <option value="running">Running</option>
                                <option value="failed">Failed</option>
                              </select>
                            </div>

                            {/* Page */}
                            <div>
                              <label className="block text-[10px] font-black text-slate-450 mb-1.5 uppercase tracking-widest">Page</label>
                              <select 
                                value={filterPageId}
                                onChange={(e) => setFilterPageId(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-150 cursor-pointer max-w-full truncate"
                              >
                                <option value="all">All Pages</option>
                                {pages.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            {/* Type */}
                            <div>
                              <label className="block text-[10px] font-black text-slate-450 mb-1.5 uppercase tracking-widest">Type</label>
                              <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-150 cursor-pointer"
                              >
                                <option value="all">All Types</option>
                                <option value="text">Text Only</option>
                                <option value="attachment">Attachment</option>
                                <option value="image">Image Attachment</option>
                                <option value="file">File Attachment</option>
                              </select>
                            </div>

                            {/* Tag */}
                            <div>
                              <label className="block text-[10px] font-black text-slate-450 mb-1.5 uppercase tracking-widest">Tag</label>
                              <select 
                                value={filterTag}
                                onChange={(e) => setFilterTag(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-150 cursor-pointer"
                              >
                                <option value="all">All Tags</option>
                                <option value="UTILITY">UTILITY</option>
                                <option value="CONFIRMED_EVENT_UPDATE">CONFIRMED_EVENT_UPDATE</option>
                                <option value="ACCOUNT_UPDATE">ACCOUNT_UPDATE</option>
                                <option value="POST_PURCHASE_UPDATE">POST_PURCHASE_UPDATE</option>
                              </select>
                            </div>
                          </div>

                          {/* Date Range Option */}
                          <div className="mt-4">
                            <label className="block text-[10px] font-black text-slate-450 mb-1.5 uppercase tracking-widest">Date Range</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-150 cursor-pointer"
                              />
                              <span className="text-slate-400 text-xs font-semibold">to</span>
                              <input 
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-150 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Show only with failures */}
                          <div className="mt-5 flex items-center gap-2">
                            <input 
                              type="checkbox"
                              id="failures-only"
                              checked={filterOnlyFailures}
                              onChange={(e) => setFilterOnlyFailures(e.target.checked)}
                              className="w-4 h-4 text-indigo-600 border-indigo-200 rounded focus:ring-indigo-550 cursor-pointer"
                            />
                            <label htmlFor="failures-only" className="text-xs font-bold text-slate-650 cursor-pointer select-none">
                              Show only with failures
                            </label>
                          </div>

                          {/* Divider line */}
                          <div className="border-t border-slate-100 my-4"></div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between">
                            <button 
                              type="button"
                              onClick={() => {
                                setFilterStatus("all");
                                setFilterPageId("all");
                                setFilterType("all");
                                setFilterTag("all");
                                setFilterStartDate("");
                                setFilterEndDate("");
                                setFilterOnlyFailures(false);
                                setAppliedFilters({
                                  status: "all",
                                  pageId: "all",
                                  type: "all",
                                  tag: "all",
                                  startDate: "",
                                  endDate: "",
                                  onlyFailures: false
                                });
                                setIsFilterDropdownOpen(false);
                              }}
                              className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors bg-transparent border-none cursor-pointer p-1"
                            >
                              Clear all
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                setAppliedFilters({
                                  status: filterStatus,
                                  pageId: filterPageId,
                                  type: filterType,
                                  tag: filterTag,
                                  startDate: filterStartDate,
                                  endDate: filterEndDate,
                                  onlyFailures: filterOnlyFailures
                                });
                                setIsFilterDropdownOpen(false);
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm border-none cursor-pointer"
                            >
                              Apply Filters
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
                    >
                      <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Select</span>
                    </button>
                    <button 
                      onClick={getBroadcastHistory}
                      title="Refresh"
                      className="flex items-center justify-center p-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl cursor-pointer transition-colors shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Live Progress Bar Section if broadcast is currently running */}
                {isBroadcasting && broadcastProgress && (
                  <div className="bg-white border border-indigo-100 rounded-[2rem] p-8 shadow-md relative overflow-hidden animate-pulse">
                    <div className="absolute inset-y-0 left-0 bg-indigo-50/20 w-1/3"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#155EEF]">Active Broadcast Delivery Queue</span>
                          </div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                            Sending message to active inbox contacts...
                          </h3>
                        </div>
                        <div className="px-4 py-2 bg-indigo-50 rounded-2xl text-xs font-black text-[#155EEF] uppercase tracking-wider shrink-0 text-center">
                          {broadcastProgress.sentCount} / {broadcastProgress.total} contacts processed
                        </div>
                      </div>

                      {/* Progress Bar Progress */}
                      {(() => {
                        const percentage = Math.round((broadcastProgress.sentCount / broadcastProgress.total) * 100) || 0;
                        return (
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span>Progress ({percentage}%)</span>
                              <span>{broadcastProgress.sentCount} of {broadcastProgress.total} reached</span>
                            </div>
                            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-650 rounded-full transition-all duration-300 shadow-md"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-emerald-50/65 rounded-2xl p-4 border border-emerald-100 text-center">
                          <p className="text-[10px] font-black tracking-widest uppercase text-emerald-600">Delivered</p>
                          <p className="text-2xl font-black text-emerald-700 mt-1">{broadcastProgress.successCount}</p>
                        </div>
                        <div className="bg-rose-50/65 rounded-2xl p-4 border border-rose-100 text-center">
                          <p className="text-[10px] font-black tracking-widest uppercase text-rose-600">Failed</p>
                          <p className="text-2xl font-black text-rose-700 mt-1">{broadcastProgress.failCount}</p>
                        </div>
                        <div className="bg-indigo-50/65 rounded-2xl p-4 border border-indigo-100 text-center">
                          <p className="text-[10px] font-black tracking-widest uppercase text-indigo-600">Remaining</p>
                          <p className="text-2xl font-black text-[#155EEF] mt-1">
                            {broadcastProgress.total - broadcastProgress.sentCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Main workspace block: Empty State OR Campaign List items */}
                {filteredHistory.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-16 flex flex-col items-center justify-center shadow-sm min-h-[440px] text-center w-full">
                    {/* Blue central block radio badge */}
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                      <Radio className="w-7 h-7 text-indigo-600" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {broadcastSearchQuery ? "No broadcasts matched your search" : "No broadcasts registered yet"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-sm">
                      {broadcastSearchQuery ? "Try searching for a different keyword or check your spelling." : "Design a new communication layout and broadcast your first blast to reach linked chat contacts."}
                    </p>

                    {!broadcastSearchQuery && (
                      <button
                        onClick={() => setBroadcastView('choice')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 border-none cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Create Broadcast
                      </button>
                    )}
                  </div>
                ) : (
                  /* Elegant and modern neat & clean table layout when real history is populated */
                  <div className="bg-white border border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in duration-300 w-full">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/20">
                            <th className="pl-6 pr-4 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Campaign Message</th>
                            <th className="px-4 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Connected Page</th>
                            <th className="px-4 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Status</th>
                            <th className="px-4 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Delivery Progress</th>
                            <th className="px-4 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Message Tag</th>
                            <th className="pl-4 pr-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#64748B] text-right">Created At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {filteredHistory.map((b) => {
                            const isCurrentlySelected = selectedBroadcastId === b.id;
                            const success = b.successCount || 0;
                            const fail = b.failCount || 0;
                            const total = b.totalRecipients || (success + fail) || 1;
                            const progressPercent = Math.round(((success + fail) / total) * 100) || 0;
                            
                            // Find page details from sync pages list to show the real picture
                            const matchedPage = pages.find(p => p.id === b.pageId);
                            const pagePicture = matchedPage?.picture?.data?.url;
                            const finalPageName = b.pageName || matchedPage?.name || 'Connected Page';

                            // Format tag name nicely
                            const rawTag = b.messageTag || b.tag || "UTILITY";
                            const formattedTag = rawTag.toLowerCase().split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                            // Format creation date beautifully
                            const createdTimeStr = b.createdAt ? (() => {
                              const diffMs = Date.now() - new Date(b.createdAt).getTime();
                              const diffMins = Math.floor(diffMs / 60000);
                              const diffHrs = Math.floor(diffMins / 60);
                              const diffDays = Math.floor(diffHrs / 24);
                              if (diffMins < 1) return 'Just now';
                              if (diffMins < 60) return `${diffMins}m ago`;
                              if (diffHrs < 24) return `${diffHrs}h ago`;
                              if (diffDays < 30) return `${diffDays}d ago`;
                              return new Date(b.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
                            })() : 'N/A';

                            const progressText = b.status === 'running' 
                              ? `${(success + fail).toLocaleString()} / ${total.toLocaleString()} processed` 
                              : `${success.toLocaleString()} delivered`;

                            return (
                              <React.Fragment key={b.id || Math.random().toString()}>
                                <tr 
                                  className={`hover:bg-slate-50/50 transition-colors cursor-pointer text-xs ${isCurrentlySelected ? 'bg-indigo-50/10' : ''}`}
                                  onClick={() => setSelectedBroadcastId(selectedBroadcastId === b.id ? null : b.id)}
                                >
                                  {/* Campaign Name Column */}
                                  <td className="pl-6 pr-4 py-4 min-w-[200px]">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isCurrentlySelected ? 'rotate-90 text-indigo-650 font-black' : ''}`} />
                                      <div className="min-w-0">
                                        <p className="truncate font-black text-slate-800 leading-tight" title={b.message}>
                                          {b.message || "Sent an Attachment file."}
                                        </p>
                                        {b.hasAttachment && (
                                          <span className="inline-flex items-center gap-1 text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-1 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100/50">
                                            📎 {b.attachmentType || 'File'} Attached
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Facebook Page Column */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-100 border shrink-0 flex items-center justify-center font-bold text-slate-500 uppercase text-[10px] shadow-inner">
                                        {pagePicture ? (
                                          <img src={pagePicture} alt={finalPageName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                          finalPageName.substring(0, 2)
                                        )}
                                      </div>
                                      <span className="font-extrabold text-slate-700 text-xs truncate max-w-[150px]">
                                        {finalPageName}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Status Column */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
                                      <span className={`w-2 h-2 rounded-full ${
                                        b.status === 'running' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                                      }`} />
                                      <span className="capitalize">{b.status || 'completed'}</span>
                                    </span>
                                  </td>

                                  {/* Progress Column */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-1 w-44">
                                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                        <div 
                                          className={`h-full rounded-full transition-all duration-300 ${
                                            b.status === 'running' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                                          }`}
                                          style={{ width: `${progressPercent}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                        <span className="text-emerald-600 font-black">{progressPercent}%</span> ({progressText})
                                      </span>
                                    </div>
                                  </td>

                                  {/* Tag Column */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md text-[9px] font-black text-indigo-700 uppercase tracking-widest">
                                      {formattedTag}
                                    </span>
                                  </td>

                                  {/* Created Date Column */}
                                  <td className="pl-4 pr-6 py-4 text-right whitespace-nowrap text-xs font-extrabold text-slate-400">
                                    {createdTimeStr}
                                  </td>
                                </tr>

                                {/* Expansion Delivery Log Row */}
                                {isCurrentlySelected && (
                                  <tr className="bg-slate-50/15">
                                    <td colSpan={6} className="px-6 py-4">
                                      <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200 shadow-inner max-h-60 overflow-y-auto space-y-3.5">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-450 tracking-wider">
                                          <span>Delivery Log Details ({b.recipientsStatus?.length || 0} contacts)</span>
                                          <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Success Rate: {Math.round((success / total) * 100)}%</span>
                                        </div>
                                        {b.recipientsStatus && b.recipientsStatus.length > 0 ? (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {b.recipientsStatus.map((r: any, idx: number) => (
                                              <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm">
                                                <span className="truncate">{r.name}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${r.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                                    {r.status}
                                                  </span>
                                                  {r.error && (
                                                    <span className="text-[10px] text-rose-500 max-w-[100px] truncate" title={r.error}>
                                                      ({r.error})
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-slate-400 font-medium italic text-center py-4">No individual contact delivery logs recorded yet.</p>
                                        )}
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
                  </div>
                )}
                
              </div>
            );
          })()}

          {activeTab === 'team' && (
            <TeamPage
              teamSubMode={teamSubMode}
              setTeamSubMode={setTeamSubMode}
              currentActiveRole={currentActiveRole}
              addMemberEmail={addMemberEmail}
              setAddMemberEmail={setAddMemberEmail}
              addMemberName={addMemberName}
              setAddMemberName={setAddMemberName}
              addMemberRole={addMemberRole}
              setAddMemberRole={setAddMemberRole}
              addMemberAssignedPages={addMemberAssignedPages}
              setAddMemberAssignedPages={setAddMemberAssignedPages}
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
              appUser={appUser}
              pages={pages}
              addToast={addToast}
              setMemberToRemove={setMemberToRemove}
            />
          )}

          {false && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              {teamSubMode === 'list' ? (
                <>
                  {/* HEADER */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Team Members</h2>
                      <p className="text-xs text-slate-400 font-bold mt-1">Manage who has access to this workspace and their permissions.</p>
                    </div>
                    {/* Add Team Member (only visible/clickable if current user is owner/admin) */}
                    {(currentActiveRole === 'owner' || currentActiveRole === 'admin') ? (
                      <button 
                        onClick={() => {
                          setTeamSubMode('add');
                          setAddMemberEmail('');
                          setAddMemberName('');
                          setAddMemberRole('');
                          setAddMemberAssignedPages([]);
                        }}
                        className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-2 border-none cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" /> Add Team Member
                      </button>
                    ) : (
                      <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-4.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-sm">
                        <Lock className="w-3.5 h-3.5" /> View Only Access
                      </div>
                    )}
                  </div>

                  {/* MEMBERS LIST */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="divide-y divide-slate-100">
                      {[...teamMembers]
                        .map((member) => {
                          const isCurrentUser = member.email.toLowerCase() === appUser?.email?.toLowerCase() || member.email === 'ahsan.shabbir292@gmail.com';
                          return (
                            <div key={member.id} className="p-6 md:p-8 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-center gap-4">
                                {/* Color Coded Initials Fallback */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm uppercase shrink-0 border shadow-sm ${
                                  member.role === 'owner' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                  member.role === 'admin' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                                  member.role === 'agent' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                  'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                  {member.name ? member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'US'}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-black text-slate-900 truncate">
                                      {member.name}
                                    </h4>
                                    {isCurrentUser && (
                                      <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 rounded-md">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-bold font-mono tracking-wide truncate">{member.email}</p>
                                  {member.role === 'support' && (
                                    <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-wider">
                                      {member.assigned_pages && member.assigned_pages.length > 0
                                        ? `Access restricted: ${member.assigned_pages.length} Pages assigned`
                                        : 'No pages assigned yet'}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Badge on Right Side */}
                                <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border shrink-0 ${
                                  member.role === 'owner' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                  member.role === 'admin' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                                  member.role === 'agent' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                  'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                  {member.role}
                                </span>

                                {/* Remove Button (if not owner and not current workspace user) */}
                                {member.role !== 'owner' && !isCurrentUser && (currentActiveRole === 'owner' || currentActiveRole === 'admin') && (
                                  <button 
                                    onClick={() => setMemberToRemove(member)}
                                    title="Remove this workspace member"
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* ROLE PERMISSIONS GRAPHIC SECTION */}
                  <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200/60 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Workspace Permissions Directory</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Summary of features authorized to each role context.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Owner */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-purple-50 text-purple-700 rounded-lg border border-purple-100">Owner</span>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">Full access and ownership authority including secure agency setups, subscriptions & workspace parameters.</p>
                        </div>
                        <div className="text-[9px] font-black uppercase text-purple-600 tracking-wider mt-4 font-mono">Full Workspace Ingress</div>
                      </div>

                      {/* Admin */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-sky-50 text-sky-700 rounded-lg border border-sky-100">Admin</span>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">Full privilege escalation minus root workspace deletion. Authorized to add other Admin/Agent users and execute billing.</p>
                        </div>
                        <div className="text-[9px] font-black uppercase text-sky-600 tracking-wider mt-4 font-mono">Manage Team & Billing</div>
                      </div>

                      {/* Agent */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">Agent</span>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">Operational role. Complete visual handling of inbox conversations, automatic response configurations, but no credentials controls.</p>
                        </div>
                        <div className="text-[9px] font-black uppercase text-emerald-600 tracking-wider mt-4 font-mono">Active Inbox Operations</div>
                      </div>

                      {/* Support */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 rounded-lg border border-amber-100">Support</span>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">Granular access. Exclusively allowed to read and response messages associated with designated connected assets.</p>
                        </div>
                        <div className="text-[9px] font-black uppercase text-amber-600 tracking-wider mt-4 font-mono">Specific Pages Only</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* ADD TEAM MEMBER FORM */
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setTeamSubMode('list')}
                      className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all cursor-pointer bg-transparent"
                    >
                      &larr; Back
                    </button>
                    <div>
                      <h3 className="text-xl font-black text-slate-950 tracking-tight">Add Workspace Team Member</h3>
                      <p className="text-xs text-slate-400 font-bold">Invite a co-worker to collaborate inside this active instance.</p>
                    </div>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      
                      if (!addMemberEmail || !addMemberRole || !addMemberName) {
                        addToast("Please fill in all standard configuration inputs.", 'error');
                        return;
                      }

                      // Check uniqueness
                      const alreadyExists = teamMembers.some(m => m.email.toLowerCase() === addMemberEmail.trim().toLowerCase());
                      if (alreadyExists) {
                        addToast("This user is already registered in this workspace registry.", 'error');
                        return;
                      }

                      const createdMember = {
                        id: 'm_' + Date.now().toString(),
                        name: addMemberName.trim(),
                        email: addMemberEmail.trim().toLowerCase(),
                        role: addMemberRole,
                        avatar_url: null,
                        joined_at: new Date().toISOString(),
                        assigned_pages: addMemberRole === 'support' ? addMemberAssignedPages : []
                      };

                      setTeamMembers(prev => [...prev, createdMember]);
                      addToast(`Successfully added ${createdMember.name} as ${createdMember.role.toUpperCase()}`, 'success');
                      setTeamSubMode('list');
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Member Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Zain Ul Abideen"
                        value={addMemberName}
                        onChange={(e) => setAddMemberName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="colleague@youragency.com"
                        value={addMemberEmail}
                        onChange={(e) => setAddMemberEmail(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3 text-indigo-500 shrink-0" /> The user must already have an account.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">System Authorization Role</label>
                      <select 
                        required
                        value={addMemberRole}
                        onChange={(e: any) => {
                          setAddMemberRole(e.target.value);
                          setAddMemberAssignedPages([]);
                        }}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
                      >
                        <option value="">Select a role...</option>
                        <option value="admin">Admin - Full access including billing & team</option>
                        <option value="agent">Agent - Full access to inbox, no billing</option>
                        <option value="support">Support - Limited to designated pages only</option>
                      </select>
                    </div>

                    {/* ASSIGNED PAGES IF SUPPORT */}
                    {addMemberRole === 'support' && (
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Designate Permitted Assets</h4>
                          <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed mt-1">This support member will be dynamically locked out of processing incoming messages for non-selected resources.</p>
                        </div>

                        {pages.length > 0 ? (
                          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                            {pages.map((p) => {
                              const checked = addMemberAssignedPages.includes(p.id);
                              return (
                                <label 
                                  key={p.id} 
                                  className="flex items-center gap-3 p-3 bg-white hover:bg-slate-100/50 border border-slate-100 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                                >
                                  <input 
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      if (checked) {
                                        setAddMemberAssignedPages(addMemberAssignedPages.filter(id => id !== p.id));
                                      } else {
                                        setAddMemberAssignedPages([...addMemberAssignedPages, p.id]);
                                      }
                                    }}
                                    className="accent-indigo-600 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                  />
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-indigo-50 border border-indigo-100 rounded flex items-center justify-center shrink-0 overflow-hidden">
                                      <SafeAvatar src={p.picture?.data?.url} name={p.name} className="w-full h-full" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800">{p.name}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl text-xs font-bold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-3.5 shrink-0" />
                            No pages synced yet. Sync Facebook pages first to select specific permissions.
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setTeamSubMode('list')}
                        className="flex-1 py-4 bg-slate-0 shadow-lg hover:bg-slate-50 border border-slate-200/50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer border-none"
                      >
                        <UserPlus className="w-4 h-4" /> Add Team Member
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <BillingPage
              billingSubView={billingSubView}
              setBillingSubView={setBillingSubView}
              isBillingLoading={isBillingLoading}
              billingData={billingData}
              pages={pages}
              selectedOrderId={selectedOrderId}
              setSelectedOrderId={setSelectedOrderId}
              buySelectedPageIds={buySelectedPageIds}
              setBuySelectedPageIds={setBuySelectedPageIds}
              searchPageQuery={searchPageQuery}
              setSearchPageQuery={setSearchPageQuery}
              billingDiscountCode={billingDiscountCode}
              setBillingDiscountCode={setBillingDiscountCode}
              promoError={promoError}
              setPromoError={setPromoError}
              appliedPromo={appliedPromo}
              setAppliedPromo={setAppliedPromo}
              cardholderName={cardholderName}
              setCardholderName={setCardholderName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvc={cardCvc}
              setCardCvc={setCardCvc}
              isProcessingPayment={isProcessingPayment}
              appUser={appUser}
              handleCreateOrder={handleCreateOrder}
              handleDeleteOrder={handleDeleteOrder}
              handleEditOrder={handleEditOrder}
              handlePayOrder={handlePayOrder}
              fetchBillingData={fetchBillingData}
            />
          )}

          {false && (
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
                                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">Disabled</span>
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
                                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider mt-0.5">
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
                        className="w-full mt-8 bg-indigo-600 font-black text-xs text-white uppercase tracking-widest py-4 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
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
                      className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all cursor-pointer"
                      >
                        Buy subscription
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
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
                              <td className="py-5 px-6 text-[10px] font-black text-slate-400 tracking-wider">
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
                                  className="text-xs font-black text-indigo-600 hover:text-slate-900 uppercase tracking-widest transition-colors"
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
                          <div className="p-5 bg-amber-50 border-2 border-amber-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-xs font-black text-amber-900">Unpaid Checkout Order</h4>
                                <p className="text-[11px] text-amber-700 font-bold mt-0.5">
                                  Complete terminal payment of <strong className="text-sm font-black text-amber-950">${(orderObj.amount || 0).toFixed(2)}</strong> to activate or extend your workspace license.
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const numPages = orderObj.pages?.length || 1;
                                const uEmail = encodeURIComponent(appUser?.email || 'ahsan.shabbir292@gmail.com');
                                const oId = encodeURIComponent(orderObj.id);
                                const uId = encodeURIComponent(appUser?.email || 'ahsan.shabbir292@gmail.com');
                                const wsId = encodeURIComponent(orderObj.workspace_id || appUser?.workspaceId || appUser?.email || 'ahsan.shabbir292@gmail.com');
                                const checkoutUrl = `https://messengerai.lemonsqueezy.com/checkout/buy/8e9d0f54-c033-4b21-a1c7-87f6a397de4c?quantity=${numPages}&checkout[email]=${uEmail}&checkout[custom][order_id]=${oId}&checkout[custom][user_id]=${uId}&checkout[custom][workspace_id]=${wsId}`;
                                window.open(checkoutUrl, '_blank');
                              }}
                              className="px-5 py-2.5 bg-amber-600 hover:bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shrink-0"
                            >
                              Pay Now
                            </button>
                          </div>
                        )}

                        {/* Pages contained in order */}
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Line Items Subscriptions</h4>
                          <div className="divide-y divide-slate-50 border border-slate-100 bg-slate-50/20 rounded-2xl overflow-hidden">
                            {orderObj.pages?.map((p: any) => (
                              <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                                    <Facebook className="w-4 h-4 text-slate-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-slate-900">{p.name || `Page ${p.id}`}</p>
                                    <p className="text-[9px] text-slate-400 font-bold">Allocated License ID: {p.id}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black text-slate-900">30 Days</p>
                                  <p className="text-[10px] text-indigo-600 font-black">${(p.price || 10).toFixed(2)}</p>
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
                                const uEmail = encodeURIComponent(appUser?.email || 'ahsan.shabbir292@gmail.com');
                                const oId = encodeURIComponent(orderObj.id);
                                const uId = encodeURIComponent(appUser?.email || 'ahsan.shabbir292@gmail.com');
                                const wsId = encodeURIComponent(orderObj.workspace_id || appUser?.workspaceId || appUser?.email || 'ahsan.shabbir292@gmail.com');
                                const checkoutUrl = `https://messengerai.lemonsqueezy.com/checkout/buy/8e9d0f54-c033-4b21-a1c7-87f6a397de4c?quantity=${numPages}&checkout[email]=${uEmail}&checkout[custom][order_id]=${oId}&checkout[custom][user_id]=${uId}&checkout[custom][workspace_id]=${wsId}`;
                                window.open(checkoutUrl, '_blank');
                              }}
                              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20"
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
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9.5px] font-black text-indigo-600 font-sans tracking-wide">VISA</span>
                          <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9.5px] font-black text-amber-600 font-sans tracking-wide">MASTERCARD</span>
                          <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9.5px] font-black text-sky-600 font-sans tracking-wide">DISCOVER</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
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
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Cardholder Name</label>
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
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Card Number</label>
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
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-60">
                              <span className="w-7 h-4 bg-slate-200 rounded"></span>
                              <span className="w-5 h-4 bg-slate-300 rounded"></span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Expiry Date (MM/YY)</label>
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
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">CVC Security Code</label>
                            <input 
                              type="password" 
                              required
                              maxLength={3}
                              placeholder="123"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <button 
                            type="submit"
                            disabled={isProcessingPayment}
                            className="w-full py-4 rounded-xl font-black text-xs bg-indigo-600 hover:bg-slate-900 active:scale-95 text-white uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-100"
                          >
                            {isProcessingPayment ? "Processing Transaction..." : `Pay $${(orderObj.amount || 0).toFixed(2)}`}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Right column: checkout summary */}
                    <div className="space-y-6">
                      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl space-y-4">
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
                          <div className="pt-3 border-t border-white/10 flex justify-between items-center">
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
          )}
          </>)}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex items-center justify-between lg:hidden z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        {[
          { id: 'overview', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home' },
          { id: 'pages', icon: <Globe className="w-5 h-5" />, label: 'Pages' },
          { id: 'chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Inbox' },
          { id: 'audience', icon: <Users className="w-5 h-5" />, label: 'Audience' },
          ...(currentActiveRole === 'owner' || currentActiveRole === 'admin' ? [
            { id: 'broadcast', icon: <Megaphone className="w-5 h-5" />, label: 'Broadcast' }
          ] : []),
          { id: 'analytics', icon: <BarChart2 className="w-5 h-5" />, label: 'Analytics' },
          { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setSelectedConversation(null);
              setShowChatDetail(false);
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <div className={`p-2.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-50 shadow-inner' : ''}`}>
               {item.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 lg:p-10">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsInviteModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 p-10 animate-in fade-in zoom-in-95 duration-300">
             <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                   <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Invite Team Member</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Scale your agency interactions</p>
             </div>

             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Email Address</label>
                   <input 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@agency.com" 
                      className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all" 
                   />
                </div>

                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Privilege Level</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setInviteRole('admin')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${inviteRole === 'admin' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-400 hover:bg-slate-50'}`}
                      >
                         <Shield className="w-5 h-5" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Administrator</span>
                      </button>
                      <button 
                        onClick={() => setInviteRole('member')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${inviteRole === 'member' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-400 hover:bg-slate-50'}`}
                      >
                         <User className="w-5 h-5" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Base Member</span>
                      </button>
                   </div>
                </div>

                <div className="pt-4">
                   <button 
                      onClick={() => {
                        if (inviteEmail) {
                          setTeamMembers([...teamMembers, { id: Math.random().toString(), name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, avatar: null }]);
                          setIsInviteModalOpen(false);
                          setInviteEmail("");
                        }
                      }}
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                   >
                     Send Secret Invite
                   </button>
                   <button onClick={() => setIsInviteModalOpen(false)} className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 hover:text-slate-900 transition-colors">Cancel</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {isUpgradeModalOpen && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 lg:p-10">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsUpgradeModalOpen(false)}></div>
            <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 flex flex-col lg:flex-row animate-in fade-in zoom-in-95 duration-500">
               <div className="w-full lg:w-1/3 bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="relative z-10">
                     <button onClick={() => setIsUpgradeModalOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all mb-10"><X className="w-5 h-5" /></button>
                     <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2">Premium Experience</p>
                     <h4 className="text-4xl font-black leading-tight tracking-tight mb-8">Unleash the <br /> Power of AI.</h4>
                     <ul className="space-y-6">
                        {[
                           { icon: <Zap />, text: "Unlimited Page Sync" },
                           { icon: <Star />, text: "Priority Support" },
                           { icon: <Bot />, text: "Custom Brain Training" },
                           { icon: <Shield />, text: "Enterprise Security" },
                        ].map((item, i) => (
                           <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest opacity-80">
                              <span className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">{React.cloneElement(item.icon as React.ReactElement, { className: 'w-4 h-4' })}</span>
                              {item.text}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Trusted by modern brands</p>
                  </div>
               </div>

               <div className="flex-1 p-12 lg:p-20 bg-white">
                  <div className="mb-12">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Choose Your Strategy.</h2>
                     <p className="text-slate-400 font-bold text-sm tracking-tight uppercase tracking-widest text-[10px]">Simple, transparent pricing for teams of all sizes.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                        { 
                           id: 'architect',
                           name: 'Architect', 
                           price: '49', 
                           desc: 'Perfect for growing brands scaling their social engagement.',
                           features: ['10 Synced Pages', 'Unlimited Messages', 'Standard Analytics'],
                           cta: currentPlan === 'architect' ? 'Active Plan' : 'Upgrade to Architect',
                           theme: 'bg-slate-50 border-transparent text-slate-900 hover:border-indigo-100'
                        },
                        { 
                           id: 'empire',
                           name: 'Empire', 
                           price: '199', 
                           desc: 'The ultimate tool for agencies and enterprise global teams.',
                           features: ['Unlimited Pages', 'Full White-labeling', 'API Access', 'Dedicated Manager'],
                           cta: currentPlan === 'empire' ? 'Active Plan' : 'Go Empire',
                           theme: 'bg-slate-900 text-white border-transparent shadow-2xl shadow-indigo-100 scale-105'
                        }
                     ].map((item, i) => {
                        const isCurrent = currentPlan === item.id;
                        return (
                           <div key={i} className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col justify-between ${item.theme} ${isCurrent ? 'ring-4 ring-indigo-500/30' : ''}`}>
                              <div>
                                 <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${i === 1 ? 'text-indigo-400' : 'text-slate-400'}`}>{item.name} Plan</p>
                                 <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-5xl font-black tracking-tighter">${item.price}</span>
                                    <span className="text-xs font-bold opacity-40">/mo</span>
                                 </div>
                                 <p className="text-sm font-medium leading-relaxed mb-10 opacity-70">{item.desc}</p>
                                 <ul className="space-y-4 mb-12">
                                    {item.features.map((f, fi) => (
                                       <li key={fi} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                          <CheckCircle2 className={`w-4 h-4 ${i === 1 ? 'text-indigo-400' : 'text-emerald-500'}`} /> {f}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                              <button 
                                 disabled={isCurrent}
                                 onClick={() => {
                                    setCurrentPlan(item.id as any);
                                    addToast(`Successfully upgraded to the ${item.name} Plan!`, 'success');
                                    setIsUpgradeModalOpen(false);
                                 }}
                                 className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border-none cursor-pointer ${
                                   isCurrent ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 
                                   i === 1 ? 'bg-indigo-600 text-white hover:bg-slate-800' : 
                                   'bg-slate-900 text-white hover:bg-indigo-600'
                                 }`}
                              >
                                 {item.cta}
                              </button>
                           </div>
                        );
                     })}
                  </div>

                  <div className="mt-12 text-center">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">3-Day Full Satisfaction Guarantee</p>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[9999] p-4 pointer-events-none max-w-sm w-full space-y-3">
         {toasts.map(toast => (
            <div 
               key={toast.id}
               className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                 toast.type === 'success' ? 'bg-emerald-50/95 text-emerald-800 border-emerald-150 backdrop-blur-md' :
                 toast.type === 'error' ? 'bg-red-50/95 text-red-800 border-red-150 backdrop-blur-md' :
                 'bg-indigo-50/95 text-indigo-800 border-indigo-150 backdrop-blur-md'
               }`}
            >
               <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${
                    toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    toast.type === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                     {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                      toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> :
                      <Sparkles className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold leading-tight">{toast.message}</span>
               </div>
               <button 
                 onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                 className="p-1 hover:bg-black/5 rounded-md transition-colors border-none bg-transparent cursor-pointer"
               >
                  <X className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
               </button>
            </div>
         ))}
      </div>

      {/* Custom Member Removal Confirmation Dialog */}
      {memberToRemove && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 lg:p-10 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setMemberToRemove(null)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 p-10 text-center animate-in zoom-in-95 duration-200">
             <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-md">
                <ShieldAlert className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Remove Workspace Member?</h3>
             <p className="text-slate-500 font-medium text-xs leading-relaxed p-1.5 bg-slate-50 rounded-2xl border border-slate-100 mt-4 text-left">
                Are you absolutely sure you want to remove <strong className="text-slate-900">{memberToRemove.name}</strong> (<span className="text-slate-400 font-mono text-[10px] font-black">{memberToRemove.email}</span>) from the workspace?
                <br /><span className="text-red-500 font-bold mt-1 block">This action is permanent and will revoke all current roles & access scopes instantly.</span>
             </p>

             <div className="flex flex-col gap-3 mt-8">
                <button 
                  onClick={() => {
                    const updatedList = teamMembers.filter(m => m.id !== memberToRemove.id);
                    setTeamMembers(updatedList);
                    addToast(`Successfully removed ${memberToRemove.name} from the workspace`, 'success');
                    setMemberToRemove(null);
                  }}
                  className="w-full py-4 bg-red-500 hover:bg-red-650 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-1.5 cursor-pointer border-none"
                >
                   <Trash2 className="w-4 h-4" /> Yes, Remove Member
                </button>
                <button 
                  onClick={() => setMemberToRemove(null)}
                  className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer"
                >
                   Cancel / Stay
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      {isCreateWorkspaceModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-205">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCreateWorkspaceModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative z-10 p-6 sm:p-10 animate-in zoom-in-95 duration-200 border border-slate-100">
             <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 text-indigo-600 shadow-md">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter text-center">Create New Workspace</h3>
              <p className="text-slate-500 font-medium text-xs sm:text-sm mt-2 leading-relaxed text-center">
                 Create your new workspace and authorize a distinct Facebook account to connect its associated pages.
              </p>

              <div className="my-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-450 mb-2">Workspace Name</label>
                  <input 
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Enter workspace name (e.g., Khaadi, Brand Name)"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl text-xs sm:text-sm tracking-tight focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button 
                   onClick={async () => {
                     const workspaceNameVal = newWorkspaceName.trim();
                     if (!workspaceNameVal) {
                       addToast("Please enter a workspace name.", "error");
                       return;
                     }

                     const newId = "ws_" + Math.random().toString(36).substring(7);
                     const updatedWorkspaces = [...workspaces, { id: newId, name: workspaceNameVal }];
                     
                     setWorkspaces(updatedWorkspaces);
                     setCurrentWorkspaceId(newId);
                     
                     try {
                       const res = await axios.post('/api/auth/update-settings', { workspaces: updatedWorkspaces });
                       if (res.data.user) {
                         localStorage.setItem('current_app_user', JSON.stringify(res.data.user));
                       }
                     } catch (err) {
                       console.warn("Could not persist workspace settings to database:", err);
                     }

                     addToast(`Workspace "${workspaceNameVal}" successfully created! Now, connect a new Facebook account.`, "success");
                     setIsCreateWorkspaceModalOpen(false);
                     setNewWorkspaceName("");
                     
                     handleSyncPages();
                   }}
                   className="w-full py-3.5 sm:py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer border-none"
                 >
                    <Facebook className="w-4 h-4 fill-current animate-pulse" /> Save & Connect Facebook Account
                 </button>

                 <button 
                   onClick={() => setIsCreateWorkspaceModalOpen(false)}
                   className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-950 transition-colors bg-transparent border-none cursor-pointer mt-1"
                 >
                    Cancel / Wapis Jayen
                 </button>
              </div>
           </div>
         </div>
       )}

      {/* Facebook Redirect & Helper Modal */}
      {fbSyncModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setFbSyncModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative z-10 p-6 sm:p-10 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
             <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 text-[#1877F2] shadow-md animate-bounce">
                <Facebook className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
             </div>
             
             <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">Facebook Sync Connection Portal</h3>
             <p className="text-slate-500 font-medium text-xs sm:text-sm mt-2 leading-relaxed px-4">
                Browser secure settings might have blocked the popup window. Choose an option below to connect effortlessly:
             </p>

             <div className="p-4 sm:p-5 bg-amber-50 rounded-2xl border border-amber-100/60 text-amber-800 text-left text-xs sm:text-md my-5 sm:my-6 space-y-1.5 font-medium leading-relaxed">
                <p className="font-bold text-amber-900 flex items-center gap-1.5 leading-none">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full inline-block animate-ping"></span>
                  Bypass Popup Blocks (Aasan Tareeqa):
                </p>
                <p className="text-xs sm:text-sm text-amber-850 mt-1">
                  AI Studio iframe popup window block kar deta hai. <strong>Option 1 (Direct Integration)</strong> sab se behtareen tareeqa hai jo isi tab mein connection complete kar dega!
                </p>
             </div>

             <div className="flex flex-col gap-3 sm:gap-4">
                {/* Option 1: Inline Direct Redirect (100% Works) */}
                <button 
                  onClick={() => {
                    setFbSyncModalOpen(false);
                    addToast("Bypassing popup blocking... Secure simulator open ho raha hai.", "success");
                    // Wait a moment for toast then navigate
                    setTimeout(() => {
                      window.location.href = fbAuthUrl;
                    }, 800);
                  }}
                  className="w-full py-3.5 sm:py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                   <Sparkles className="w-4 h-4" /> Option 1: Connect In This Window (Bypass Blocks)
                </button>

                {/* Option 2: Open in separate window manually */}
                <a 
                  href={fbAuthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setFbSyncModalOpen(false)}
                  className="w-full py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 text-decoration-none"
                >
                   <ExternalLink className="w-4 h-4" /> Option 2: Open In New Tab Manually
                </a>

                {/* Option 3: Cancel */}
                <button 
                  onClick={() => setFbSyncModalOpen(false)}
                  className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer mt-1"
                >
                   Wapis Jayen / Cancel
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
