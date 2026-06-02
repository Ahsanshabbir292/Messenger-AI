import React from 'react';
import { Megaphone, Layers, Info, ArrowLeft } from 'lucide-react';

interface BroadcastChoiceProps {
  onSelect: (mode: 'single' | 'bulk') => void;
  onBack: () => void;
}

export const BroadcastChoice: React.FC<BroadcastChoiceProps> = ({ onSelect, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-300">
      {/* Back to registry navigation */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="p-3 border border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-[1.25rem] transition-all cursor-pointer bg-white shadow-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">New Broadcast</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            Choose how you want to send your message
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 font-sans">
        {/* Card 1: Single Page Messaging */}
        <div 
          onClick={() => onSelect('single')}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-indigo-600 transition-all shadow-xl hover:shadow-indigo-100/40 group cursor-pointer flex flex-col justify-between min-h-[340px]"
        >
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Megaphone className="w-8 h-8" />
            </div>
            
            <div className="space-y-2 text-left">
              <h3 className="text-lg font-black text-slate-900">Single Page Messaging</h3>
              <p className="text-xs text-slate-400 font-bold">
                Send a broadcast to one Facebook Page at a time
              </p>
            </div>

            <ul className="space-y-3.5 border-t border-slate-50 pt-5 text-xs text-slate-500 font-bold text-left">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Select one page
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Full recipient details
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Sync before sending
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-indigo-600 pt-6 border-t border-slate-50 mt-4 group-hover:text-slate-950 transition-colors">
            <span>Get Started</span>
            <span className="text-lg group-hover:translate-x-1.5 transition-transform font-mono inline-block">&rarr;</span>
          </div>
        </div>

        {/* Card 2: Bulk Pages Messaging */}
        <div 
          onClick={() => onSelect('bulk')}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-indigo-600 transition-all shadow-xl hover:shadow-indigo-100/40 group cursor-pointer flex flex-col justify-between min-h-[340px]"
        >
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Layers className="w-8 h-8" />
            </div>

            <div className="space-y-2 text-left">
              <h3 className="text-lg font-black text-slate-900">Bulk Pages Messaging</h3>
              <p className="text-xs text-slate-400 font-bold">
                Send the same message to multiple pages at once
              </p>
            </div>

            <ul className="space-y-3.5 border-t border-slate-50 pt-5 text-xs text-slate-500 font-bold text-left">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Select multiple pages
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Combined recipient count
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                All pages broadcast together
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-indigo-600 pt-6 border-t border-slate-50 mt-4 group-hover:text-slate-950 transition-colors">
            <span>Get Started</span>
            <span className="text-lg group-hover:translate-x-1.5 transition-transform font-mono inline-block">&rarr;</span>
          </div>
        </div>
      </div>

      {/* Not sure tip */}
      <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-[1.75rem] text-left items-start">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Need guidance?</p>
          <p className="text-xs text-slate-500 font-bold leading-relaxed mt-1">
            Not sure which to choose? Use <strong className="text-slate-800">Single Page</strong> for targeted campaigns with detailed control. Use <strong className="text-slate-800">Bulk Pages</strong> when sending the same announcement to all your pages.
          </p>
        </div>
      </div>
    </div>
  );
};
