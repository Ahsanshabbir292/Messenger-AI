import React from 'react';
import { Globe, Zap, Clock, Power, Facebook, Lock } from 'lucide-react';
import { SafeAvatar } from './SafeAvatar';

interface PagesPageProps {
  pages: any[];
  selectedPageIds: string[];
  trialLocked: boolean;
  handleSyncPages: () => void | Promise<void>;
  handleSelectTrialPage: (pageId: string, selected: boolean) => void | Promise<void>;
}

export const PagesPage: React.FC<PagesPageProps> = ({
  pages,
  selectedPageIds,
  trialLocked,
  handleSyncPages,
  handleSelectTrialPage
}) => {
  return (
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
                  <td className="px-4 sm:px-10 py-4 sm:py-8">
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
                  <td className="px-4 sm:px-10 py-4 sm:py-8">
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
  );
};
