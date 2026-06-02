import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CloudflareTurnstileProps {
  onVerify: (token: string) => void;
  resetTrigger?: any;
}

export default function CloudflareTurnstile({ onVerify, resetTrigger }: CloudflareTurnstileProps) {
  const [status, setStatus] = useState<'checking' | 'verified'>('checking');

  useEffect(() => {
    setStatus('checking');
    const timer = setTimeout(() => {
      setStatus('verified');
      onVerify('sim_turnstile_token_' + Math.random().toString(36).substring(7));
    }, 1800); // 1.8 seconds feels incredibly realistic and snappy

    return () => clearTimeout(timer);
  }, [resetTrigger, onVerify]);

  return (
    <div id="cloudflare-turnstile-container" className="w-full border border-slate-200 bg-[#f9f9f9] rounded-md px-4 py-3.5 flex items-center justify-between text-slate-850 font-sans shadow-sm select-none my-4 animate-in fade-in duration-300">
      {/* Left side: Verification Check / Spinner & Success text */}
      <div className="flex items-center gap-3">
        {status === 'checking' ? (
          <div className="relative flex items-center justify-center w-7 h-7">
            {/* Spinning track ring */}
            <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.12 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 border border-emerald-700 text-white shadow-sm"
          >
            {/* Real SVG Checkmark path */}
            <svg className="w-4.5 h-4.5 stroke-[3] stroke-white fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </motion.div>
        )}

        {/* Dynamic status labels */}
        <div className="flex flex-col">
          {status === 'checking' ? (
            <span className="text-[13px] font-semibold text-slate-700 leading-none">
              Verifying you are human...
            </span>
          ) : (
            <span className="text-[15px] font-black text-slate-800 leading-none tracking-tight">
              Success!
            </span>
          )}
        </div>
      </div>

      {/* Right side: Cloudflare cloud signature */}
      <div className="flex flex-col items-end justify-center min-w-[100px]">
        {/* Real Cloudflare Brand Marks */}
        <div className="flex items-center gap-1">
          {/* Cloudflare logo icon */}
          <svg viewBox="0 0 48 32" className="h-5 w-auto text-[#f38020]" fill="currentColor">
            <path d="M41.6 15.6c-.4 0-.8.1-1.2.2C38.9 9.3 33 5.3 26 5.3c-5.7 0-10.7 2.7-13.3 6.9-1-.5-2.2-.8-3.4-.8C4.2 11.4 0 15.6 0 20.9S4.2 30.3 9.3 30.3h32.3c3.5 0 6.4-2.8 6.4-6.3.1-4.7-2.7-8.4-6.4-8.4z" />
          </svg>
          <span className="text-[10px] font-extrabold text-slate-850 tracking-[0.08em] leading-none select-none">
            CLOUDFLARE
          </span>
        </div>

        {/* Small Privacy / Help footer link pair */}
        <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 font-semibold leading-none">
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-slate-500">
            Privacy
          </a>
          <span>•</span>
          <a href="https://support.cloudflare.com/hc/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-slate-500">
            Help
          </a>
        </div>
      </div>
    </div>
  );
}
