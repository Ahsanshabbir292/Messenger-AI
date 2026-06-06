import React from 'react';
import { UserPlus, Lock, Trash2, Info, AlertTriangle } from 'lucide-react';
import { SafeAvatar } from './SafeAvatar';

interface TeamPageProps {
  teamSubMode: 'list' | 'add';
  setTeamSubMode: (mode: 'list' | 'add') => void;
  currentActiveRole: string;
  addMemberEmail: string;
  setAddMemberEmail: (email: string) => void;
  addMemberName: string;
  setAddMemberName: (name: string) => void;
  addMemberRole: string;
  setAddMemberRole: (role: string) => void;
  addMemberAssignedPages: string[];
  setAddMemberAssignedPages: (pages: string[]) => void;
  teamMembers: any[];
  setTeamMembers: React.Dispatch<React.SetStateAction<any[]>>;
  appUser: any;
  pages: any[];
  addToast: (msg: string, type?: 'success' | 'err' | 'info') => void;
  setMemberToRemove: (member: any) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({
  teamSubMode,
  setTeamSubMode,
  currentActiveRole,
  addMemberEmail,
  setAddMemberEmail,
  addMemberName,
  setAddMemberName,
  addMemberRole,
  setAddMemberRole,
  addMemberAssignedPages,
  setAddMemberAssignedPages,
  teamMembers,
  setTeamMembers,
  appUser,
  pages,
  addToast,
  setMemberToRemove
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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
          <div className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {[...teamMembers]
                .map((member) => {
                  const isCurrentUser = member.email && appUser?.email && member.email.toLowerCase() === appUser?.email?.toLowerCase();
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
              className="p-2 border border-slate-150 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all cursor-pointer bg-transparent"
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
                addToast("Please fill in all standard configuration inputs.", 'err');
                return;
              }

              // Check uniqueness
              const alreadyExists = teamMembers.some(m => m.email.toLowerCase() === addMemberEmail.trim().toLowerCase());
              if (alreadyExists) {
                addToast("This user is already registered in this workspace registry.", 'err');
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
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-150 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
              >
                <option value="">Select a role...</option>
                <option value="admin">Admin - Full access including billing & team</option>
                <option value="agent">Agent - Full access to inbox, no billing</option>
                <option value="support">Support - Limited to designated pages only</option>
              </select>
            </div>

            {/* ASSIGNED PAGES IF SUPPORT */}
            {addMemberRole === 'support' && (
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-150 space-y-4">
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
  );
};
