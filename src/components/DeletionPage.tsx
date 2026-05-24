import React, { useState } from 'react';
import { Trash2, ArrowLeft, Mail, AlertTriangle, RefreshCw, CheckCircle2, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

interface DeletionPageProps {
  onBack: () => void;
  currentUserEmail?: string;
  onLogout?: () => void;
}

export default function DeletionPage({ onBack, currentUserEmail, onLogout }: DeletionPageProps) {
  const [deleteEmail, setDeleteEmail] = useState(currentUserEmail || '');
  const [confirmWipeAuth, setConfirmWipeAuth] = useState(false);
  const [confirmDisconnectFb, setConfirmDisconnectFb] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionResult, setDeletionResult] = useState<{
    success: boolean;
    message: string;
    code?: string;
  } | null>(null);

  const handleDeleteDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteEmail) return;
    if (!confirmWipeAuth || !confirmDisconnectFb) {
      alert("Please check both confirmation boxes to proceed with the permanent data removal request.");
      return;
    }

    setIsDeleting(true);
    setDeletionResult(null);

    try {
      const res = await axios.post('/api/legal/delete-data', {
        email: deleteEmail.trim(),
        confirmation: true
      });
      
      setDeletionResult({
        success: true,
        message: res.data.message,
        code: res.data.confirmation_code
      });

      setConfirmWipeAuth(false);
      setConfirmDisconnectFb(false);

      if (currentUserEmail && currentUserEmail.toLowerCase() === deleteEmail.trim().toLowerCase() && onLogout) {
        setTimeout(() => {
          onLogout();
        }, 3500);
      }
    } catch (err: any) {
      setDeletionResult({
        success: false,
        message: err.response?.data?.error || "The compliance data wipe request failed. Please check your network connection."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans selection:bg-indigo-600 selection:text-white pb-16">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs py-5 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100 transition-all font-black text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Main Site
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Facebook className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-1000 tracking-tight">
              Perseus<span className="text-indigo-600"> Bot</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.025)] p-8 md:p-12 space-y-10"
        >
          <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
            <div className="w-14 h-14 bg-red-150 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Data Deletion Instructions</h1>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">META DEVELOPER DELETION CALLBACK FLOW AND COMPLIANCE PURGING SERVICES</p>
            </div>
          </div>

          {/* Facebook Platform Instructions */}
          <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 space-y-4">
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Facebook className="w-5 h-5 text-[#1877f2] fill-[#1877f2]" /> Standard Facebook App Deactivation Guide
            </h3>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              In complete alignment with standard Meta Platform developer guidelines and personal privacy protection models, you can instantly sever the integration between your commercial Facebook pages/accounts and the Perseus Bot SaaS servers. You do not need to contact our support team. Follow these developer-compliant steps inside your personal Meta account:
            </p>
            <ol className="list-decimal pl-5 text-xs text-slate-650 font-bold space-y-3 leading-relaxed">
              <li>Log in to your personal or professional Facebook profile and open the main legal config dropdown: <strong>"Settings & Privacy &gt; Settings"</strong>.</li>
              <li>Scroll down the left sidebar navigation directory until you locate and click on <strong>"Apps and Websites"</strong>.</li>
              <li>Browse the active partner integrations list, or locate our system via the search bar: <strong>"Perseus Bot"</strong>.</li>
              <li>Click on the standard <strong>"Remove"</strong> button next to our application profile card.</li>
              <li>Confirm the deletion request prompt and check the box to request Facebook to purge and delete all previous interaction logs. This immediately instructs Meta platform servers to sever our active authorization webhooks, rendering our connected API access tokens permanently void.</li>
            </ol>
          </div>

          <div className="text-slate-600 space-y-6 text-sm leading-relaxed font-normal">
            <p className="font-semibold text-slate-700">
              Beyond the simple removal of Meta permissions, Perseus Bot operates a secure, self-service SaaS Compliance Removal Center. When you request a database data wipe through the automated form below, our backend services trigger an absolute and irreversible purge of your stored digital records from our servers.
            </p>

            <div>
              <h3 className="text-slate-950 font-black text-xs uppercase tracking-widest mb-1.5">What Stored Data is Deleted Forever?</h3>
              <p>
                Our automated purge script executes queries to locate every document node associated with your target verification email address, ensuring an absolute data wipe. This includes the complete destruction of:
              </p>
              <ul className="list-disc pl-6 mt-2.5 space-y-2 text-slate-705 font-semibold">
                <li><strong>Facebook Page Authentication Access Tokens:</strong> Voiding all API routes and severing backend messaging pipelines instantly.</li>
                <li><strong>Workspace Logs and Conversations:</strong> All historic messages, intent training sets, and cached conversation telemetry metadata stored on our engines are erased from Firestore.</li>
                <li><strong>Administrative Profile Databases:</strong> Your secure authentication keys, email records, user status states, and customized webhook URLs are deleted immediately.</li>
                <li><strong>Active Subscription and Invoicing Logs:</strong> Unbilled balances are closed and card token links are permanently severed.</li>
              </ul>
            </div>
          </div>

          {/* Interactive Functional Self Service Form */}
          <div className="border border-slate-100 rounded-[2rem] p-6 lg:p-10 space-y-8 bg-white shadow-xs">
            <div className="flex items-start gap-4 text-amber-700 bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest">Permanent Database Purge Warning</h4>
                <p className="text-xs font-semibold leading-relaxed mt-1">
                  This process is absolute, real-time, and final. Once our backend verifies your identity email and processes the deletion command, all synchronized data, API triggers, and configurations are permanently destroyed. Stored information cannot be retrieved from backup servers or recovered by database engineers.
                </p>
              </div>
            </div>

            <form onSubmit={handleDeleteDataSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Verify Stored User Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4.5 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    required
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-slate-50 border-2 border-slate-105 focus:border-indigo-600 rounded-2xl pl-12 pr-4.5 py-4 text-xs font-black placeholder:text-slate-350 tracking-wider focus:outline-none transition-all placeholder:uppercase"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required
                    checked={confirmWipeAuth}
                    onChange={(e) => setConfirmWipeAuth(e.target.checked)}
                    className="mt-1 accent-indigo-600 rounded border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-500 leading-tight">
                    I instruct Perseus Bot to permanently lock, wipe, and delete my SaaS admin account profile and bcrypt credentials hashes.
                  </span>
                </label>

                <label className="flex items-start gap-3.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required
                    checked={confirmDisconnectFb}
                    onChange={(e) => setConfirmDisconnectFb(e.target.checked)}
                    className="mt-1 accent-indigo-600 rounded border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-500 leading-tight">
                    I instruct the system to immediately void and delete all connected Facebook Page Access Tokens, Webhook subscription parameters, and log records.
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={isDeleting || !deleteEmail || !confirmWipeAuth || !confirmDisconnectFb}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-100 disabled:text-slate-300 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Purging Data from Database...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Execute Absolute Data Wipe
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {deletionResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`rounded-2xl p-6 border ${deletionResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}
                >
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${deletionResult.success ? 'text-emerald-500' : 'text-red-500'}`} />
                    <div className="space-y-2">
                      <h5 className="text-xs font-black uppercase tracking-widest">{deletionResult.success ? "Compliance Data Removal Confirmed" : "Compliance Server Alert"}</h5>
                      <p className="text-xs font-semibold leading-relaxed">{deletionResult.message}</p>
                      {deletionResult.code && (
                        <div className="bg-white/90 rounded-xl p-3 inline-block border border-emerald-150 font-mono text-[10px] uppercase font-black tracking-widest">
                          Purge confirmation ID: <span className="text-indigo-600 font-extrabold">{deletionResult.code}</span>
                        </div>
                      )}
                      {deletionResult.success && currentUserEmail && deleteEmail.trim().toLowerCase() === currentUserEmail.toLowerCase() && (
                        <p className="text-[10px] font-black uppercase text-amber-600 animate-pulse tracking-widest mt-2 bg-amber-50 inline-block px-3 py-1.5 rounded-lg">
                          Your active session is ending. Purging remaining local cache elements in 3 seconds...
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
