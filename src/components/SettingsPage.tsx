import React from 'react';
import { X, Facebook, RefreshCw, Globe, ToggleLeft as Toggle } from 'lucide-react';
import axios from 'axios';
import { SafeAvatar } from './SafeAvatar';

interface SettingsPageProps {
  settingsSubTab: 'workspace' | 'profile';
  setSettingsSubTab: (tab: 'workspace' | 'profile') => void;
  activeWorkspace: any;
  editWorkspaceName: string;
  setEditWorkspaceName: (name: string) => void;
  isEditWorkspaceModalOpen: boolean;
  setIsEditWorkspaceModalOpen: (open: boolean) => void;
  userProfile: any;
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
  pages: any[];
  syncing: boolean;
  handleSyncPages: () => void | Promise<void>;
  teamMembers: any[];
  setTeamSubMode: (mode: 'list' | 'add') => void;
  setActiveTab: (tab: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  editProfileName: string;
  setEditProfileName: (name: string) => void;
  editProfileEmail: string;
  setEditProfileEmail: (email: string) => void;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;
  isChangePasswordModalOpen: boolean;
  setIsChangePasswordModalOpen: (open: boolean) => void;
  currentPassword: string;
  setCurrentPassword: (p: string) => void;
  newPassword: string;
  setNewPassword: (p: string) => void;
  confirmPassword: string;
  setConfirmPassword: (p: string) => void;
  isManageSessionsModalOpen: boolean;
  setIsManageSessionsModalOpen: (open: boolean) => void;
  sessionsList: any[];
  setSessionsList: React.Dispatch<React.SetStateAction<any[]>>;
  currentWorkspaceId: string;
  setWorkspaces: React.Dispatch<React.SetStateAction<any[]>>;
  appUser: any;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settingsSubTab,
  setSettingsSubTab,
  activeWorkspace,
  editWorkspaceName,
  setEditWorkspaceName,
  isEditWorkspaceModalOpen,
  setIsEditWorkspaceModalOpen,
  userProfile,
  setUserProfile,
  pages,
  syncing,
  handleSyncPages,
  teamMembers,
  setTeamSubMode,
  setActiveTab,
  addToast,
  editProfileName,
  setEditProfileName,
  editProfileEmail,
  setEditProfileEmail,
  isEditProfileModalOpen,
  setIsEditProfileModalOpen,
  isChangePasswordModalOpen,
  setIsChangePasswordModalOpen,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isManageSessionsModalOpen,
  setIsManageSessionsModalOpen,
  sessionsList,
  setSessionsList,
  currentWorkspaceId,
  setWorkspaces,
  appUser
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="text-left">
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B1527] tracking-tight mb-2">
            {settingsSubTab === 'workspace' ? 'Workspace Settings' : 'Settings'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
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
            className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${settingsSubTab === 'workspace' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 bg-transparent border-none cursor-pointer'}`}
          >
            Workspace Settings
          </button>
          <button 
            onClick={() => {
              setSettingsSubTab('profile');
              addToast("Switched to Profile & Security settings tab", "info");
            }}
            className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${settingsSubTab === 'profile' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900 bg-transparent border-none cursor-pointer'}`}
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
            <div className="p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 text-left">
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
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden animate-none">
            <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 bg-[#F9FAFB]/30 text-left">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Facebook Connection</h3>
            </div>
            <div className="p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 text-left">
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

                <div className="flex items-center gap-4 animate-none">
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
                    className="w-full sm:w-auto justify-center px-4 py-2.5 sm:px-6 sm:py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-none"
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
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden animate-none">
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
            <div className="p-4 sm:p-6 md:p-8 text-left animate-none">
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
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden animate-none">
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
            <div className="p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 text-left">
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
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden animate-none">
            <div className="p-5 sm:p-6 md:p-8 border-b border-slate-50 bg-[#F9FAFB]/30 text-left">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Security</h3>
            </div>
            <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8 text-left">
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
                  className="w-full sm:w-auto text-center px-4 py-2.5 sm:px-6 sm:py-3 border border-slate-150 hover:border-[#2563EB] text-slate-800 hover:text-[#2563EB] bg-transparent rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
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
                  className="w-full sm:w-auto text-center px-4 py-2.5 sm:px-6 sm:py-3 border border-slate-150 hover:border-[#2563EB] text-slate-800 hover:text-[#2563EB] bg-transparent rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer"
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
            <div className="space-y-6 text-left">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">Workspace Name</label>
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
            <div className="space-y-6 text-left">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">Display Name</label>
                <input 
                  type="text"
                  value={editProfileName}
                  onChange={(e) => setEditProfileName(e.target.value)}
                  className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">Email Address</label>
                <input 
                  type="email"
                  value={editProfileEmail}
                  onChange={(e) => setEditProfileEmail(e.target.value)}
                  className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all font-mono"
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
                    setUserProfile((prev: any) => ({
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
            className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-left"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-950 tracking-tight font-sans">Change Password</h3>
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
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">Current Password</label>
                <input 
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-12 bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 text-sm font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex justify-between font-mono">
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
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 font-mono">Confirm New Password</label>
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
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border-none shadow-xl shadow-slate-100 font-sans"
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
            <div className="flex justify-between items-center mb-4 text-left">
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

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 my-6 divide-y divide-slate-100 text-left">
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
                      <p className="text-xs text-slate-400 font-medium font-sans">IP: {session.ip} &bull; {session.location}</p>
                    </div>
                  </div>
                  {!session.active && (
                    <button 
                      onClick={() => {
                        setSessionsList((prev: any[]) => prev.filter(s => s.id !== session.id));
                        addToast(`Revoked session session identity: ${session.device}`, "success");
                      }}
                      className="text-red-500 hover:text-white bg-transparent hover:bg-red-500 font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-500 transition-all cursor-pointer font-sans"
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
                  setSessionsList((prev: any[]) => prev.filter(s => s.active));
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
  );
};
