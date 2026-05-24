import React, { useState } from 'react';
import { HelpCircle, ArrowLeft, Send, CheckCircle2, User, Mail, RefreshCw, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

interface SupportFAQPageProps {
  onBack: () => void;
  currentUserEmail?: string;
}

export default function SupportFAQPage({ onBack, currentUserEmail }: SupportFAQPageProps) {
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState(currentUserEmail || '');
  const [supportSubject, setSupportSubject] = useState('General Support');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportResult, setSupportResult] = useState<{
    success: boolean;
    ticketId: string;
    message: string;
  } | null>(null);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Why are my automated custom Messenger replies not triggering?",
      a: "Perseus Bot orchestrates dynamic replies by integrating Meta Page subscription access tokens, webhook callbacks, and secure Google Gemini API keys. If your automation triggers are silent, please verify that: (1) Your Facebook Page has been accurately synchronized on your dashboard controls. (2) Your 14-day page trial has been activated and is not locked due to subscription expiry. (3) A valid GEMINI_API_KEY is configured within your Workspace Settings panel. If these validation conditions are met, our webhook listeners will receive, process, and reply to user queries instantly."
    },
    {
      q: "How secure is my customer conversation data and operational metadata?",
      a: "Security and data integrity represent the core foundation of our architectural standard. All in-transit customer database records, session streams, and webhook logs are guarded by industry-grade TLS 1.3 cryptographic channels. Stored configurations, application profile matrices, and active subscriptions are persisted under strict Firestore access rules, isolated on a per-user level. We operate under strict corporate non-disclosure protocols; your operational chat logs are never distributed, leased, or sold to any administrative networks, nor are they utilized for direct public model training sequences. You retain absolute control and can instruct our engines to destroy your configuration history at any moment via our self-service compliance dashboard."
    },
    {
      q: "How does the active page billing and evaluation trial model work?",
      a: "Each newly connected Facebook commercial page is automatically credentialed with an initial, risk-free 14-Day Free Evaluation Trial. Throughout this testing period, the full spectrum of our Gemini AI-driven automation engine is accessible without hidden charges. Upon conclusion of the trial cycle, a flat, transparent subscription rate of $10 per connected page per month is billed to continue production replies. The billing sequence features a premium, zero-hidden-fees commitment, and you are free to unsubscribe or deactivate automation triggers via your Billing dashboard interface whenever desired."
    },
    {
      q: "What is the Ethereal test email framework during registration?",
      a: "During the user sign-up process, we prioritize friction-free developer tests. To maintain instant sandboxed accounts without relying on traditional mail server latency, we offer direct support for Ethereal simulated mailboxes. You can access developer codes within local console logs, or utilize the universal test bypass sequence '000000' during active development to instantly verify user authentication mechanisms and unlock your SaaS developer playground features immediately."
    },
    {
      q: "How do I disconnect my connected Facebook Developer Applications?",
      a: "To disable Page permissions, you can toggle active synchronizations to 'Disconnected' directly within your central multi-page dashboard panel. Alternatively, to permanently revoke all application scopes from Meta's infrastructure, you may visit your personal Facebook settings panel under 'Apps and Websites', search for the 'Perseus Bot' integration card, and click the standard 'Remove' trigger to wipe current OAuth session references immediately."
    }
  ];

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportEmail || !supportMessage) return;

    setIsSendingSupport(true);
    setSupportResult(null);

    try {
      const res = await axios.post('/api/legal/support', {
        name: supportName.trim(),
        email: supportEmail.trim(),
        subject: supportSubject,
        message: supportMessage.trim()
      });

      setSupportResult({
        success: true,
        ticketId: res.data.ticketId,
        message: "Support ticket created successfully! Our data protection and compliance team will review your query and contact you within 24 hours."
      });

      setSupportMessage('');
      setSupportSubject('General Support');
    } catch (err: any) {
      setSupportResult({
        success: false,
        ticketId: '',
        message: err.response?.data?.error || "Failed to submit support ticket. Please retry."
      });
    } finally {
      setIsSendingSupport(false);
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
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.025)] p-8 md:p-12 space-y-12"
        >
          <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Support & FAQ</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">SaaS COMPLIANCE HELPLINE AND AUTOMATED REPLIES EXPLANATIONS</p>
            </div>
          </div>

          {/* FAQ Accordions block */}
          <div className="space-y-6">
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Frequently Asked Questions (FAQ)</h3>
            <div className="divide-y divide-slate-100">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="py-5">
                    <button 
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left font-black text-sm text-slate-800 hover:text-indigo-600 transition-colors gap-5 focus:outline-none cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className={`text-slate-450 text-xl transition-transform ${isOpen ? 'rotate-45 text-indigo-600' : ''}`}>+</span>
                    </button>
                    {isOpen && (
                      <div className="mt-4 text-xs text-slate-500 font-semibold leading-relaxed pl-1 space-y-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Helpline ticket support desk */}
          <div className="bg-slate-50 rounded-[2rem] p-6 lg:p-10 space-y-6 border border-slate-105">
            <div className="flex items-center gap-3">
              <Send className="w-5 h-5 text-indigo-600" />
              <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest">SaaS Ticket Support Helpline</h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Need clarification regarding our GDPR guidelines, have issues authorizing your page, or want guidance configuring your server-side Gemini API credentials? Create an official compliance ticket below. Our support agents record, review, and track all complaints programmatically within our system database.
            </p>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Your Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="text"
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-white border border-slate-150 focus:border-indigo-600 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Contact Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type="email"
                      required
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-white border border-slate-150 focus:border-indigo-600 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Support Topic Category</label>
                <select 
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="w-full bg-white border border-slate-150 focus:outline-none focus:border-indigo-600 rounded-xl px-4 py-3.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  <option value="General Support">General Support Helpline</option>
                  <option value="Facebook Connection Issue">Facebook Sync Connection Error</option>
                  <option value="Gemini API settings error">Gemini AI response settings issue</option>
                  <option value="Billing and Refund policy">Billing configuration, billing errors</option>
                  <option value="Compliance and Data Deletion error">GDPR & Data Deletion validation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Explain Ticket Details</label>
                <textarea 
                  required
                  rows={4}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Please provide explicit details of your inquiry or technical bug..."
                  className="w-full bg-white border border-slate-150 focus:border-indigo-600 rounded-xl px-4 py-3.5 text-xs font-semibold focus:outline-none transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isSendingSupport || !supportEmail || !supportMessage}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest mt-2 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingSupport ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Submitting Ticket Request...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Save Ticket & Notify Representative
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {supportResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`rounded-2xl p-5 border ${supportResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold leading-relaxed">{supportResult.message}</p>
                      {supportResult.ticketId && (
                        <div className="bg-white rounded-lg px-3 py-1.5 inline-block border border-emerald-150 font-mono text-[9px] uppercase font-black text-indigo-600 mt-2 tracking-widest">
                          TICKET ID: {supportResult.ticketId} (Status: Open)
                        </div>
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
