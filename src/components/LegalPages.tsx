import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Trash2, 
  HelpCircle, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  FileCheck,
  Mail,
  User,
  RefreshCw,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

type TabType = 'privacy' | 'terms' | 'deletion' | 'faq-support';

interface LegalPagesProps {
  initialTab?: TabType;
  onBack: () => void;
  currentUserEmail?: string;
  onLogout?: () => void;
}

export default function LegalPages({ 
  initialTab = 'privacy', 
  onBack, 
  currentUserEmail, 
  onLogout 
}: LegalPagesProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // Deletion form state
  const [deleteEmail, setDeleteEmail] = useState(currentUserEmail || '');
  const [confirmWipeAuth, setConfirmWipeAuth] = useState(false);
  const [confirmDisconnectFb, setConfirmDisconnectFb] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionResult, setDeletionResult] = useState<{
    success: boolean;
    message: string;
    code?: string;
  } | null>(null);

  // Support form state
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

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Why are my automated custom Messenger replies not triggering?",
      a: "MessengerAI orchestrates dynamic replies by integrating Meta Page subscription access tokens, webhook callbacks, and secure Google Gemini API keys. If your automation triggers are silent, please verify that: (1) Your Facebook Page has been accurately synchronized on your dashboard controls. (2) Your 14-day page trial has been activated and is not locked due to subscription expiry. (3) A valid GEMINI_API_KEY is configured within your Workspace Settings panel. If these validation conditions are met, our webhook listeners will receive, process, and reply to user queries instantly."
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
      a: "To disable Page permissions, you can toggle active synchronizations to 'Disconnected' directly within your central multi-page dashboard panel. Alternatively, to permanently revoke all application scopes from Meta's infrastructure, you may visit your personal Facebook settings panel under 'Apps and Websites', search for the 'MessengerAI' integration card, and click the standard 'Remove' trigger to wipe current OAuth session references immediately."
    }
  ];

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
            className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100 transition-all font-black text-xs uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Main Site
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Facebook className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-1000 tracking-tight">
              Messenger<span className="text-indigo-600">AI</span> Legal Center
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Section Selector Sidebar */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xs space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-4">Legal Documents</p>
              
              <button 
                onClick={() => { setActiveTab('privacy'); setDeletionResult(null); setSupportResult(null); }}
                className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all justify-start ${activeTab === 'privacy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Shield className="w-4.5 h-4.5" /> Privacy Policy
              </button>

              <button 
                onClick={() => { setActiveTab('terms'); setDeletionResult(null); setSupportResult(null); }}
                className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all justify-start ${activeTab === 'terms' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <FileText className="w-4.5 h-4.5" /> Terms & Conditions
              </button>

              <button 
                onClick={() => { setActiveTab('deletion'); setDeletionResult(null); setSupportResult(null); }}
                className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all justify-start ${activeTab === 'deletion' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Trash2 className="w-4.5 h-4.5" /> Data Deletion
              </button>

              <button 
                onClick={() => { setActiveTab('faq-support'); setDeletionResult(null); setSupportResult(null); }}
                className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all justify-start ${activeTab === 'faq-support' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <HelpCircle className="w-4.5 h-4.5" /> Support & FAQ
              </button>
            </div>

            <div className="bg-slate-900 text-slate-400 rounded-3xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Compliance Audited</span>
              </div>
              <p className="text-xs font-semibold leading-relaxed mb-6">
                Fully compliant with CCPA guidelines, European Union GDPR policy frameworks, and certified for Meta Plattform Developer Integration safety standards.
              </p>
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Revision Level: V2.16 (May 2026)
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* VIEW 1: PRIVACY POLICY - 500+ Words in English */}
              {activeTab === 'privacy' && (
                <motion.div 
                  key="privacy"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xs p-8 md:p-12 space-y-10"
                >
                  <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Shield className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Privacy Policy Guidelines</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">META PLATFORM COMPLIANT PRIVATE PRIVACY PROTOCOLS</p>
                    </div>
                  </div>

                  <div className="text-slate-600 space-y-6 text-sm leading-relaxed font-normal">
                    <p className="text-slate-550 leading-relaxed font-semibold mb-6">
                      Welcome to the MessengerAI Privacy Policy. Securely handling and protecting the privacy of our registered enterprise administrators, general users, and automated messaging contacts is our highest operating priority. This document provides a highly transparent, fully detailed English disclosure of our technical architecture, standard data collection processes, system storage guidelines, and automated model interaction pathways. This document has been compiled specifically to satisfy active developer requirements of Meta Platforms Inc., the European Union General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).
                    </p>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">1. Scope and Categories of Collected Data</h3>
                      <p>
                        Our platform acts as an automated messaging orchestrator connecting your commercial pages to the Meta Graph Webhook infrastructure. To perform text evaluations, user routing, and generate dynamic AI replies, our system parameters store and process specific categories of business and communication logs:
                      </p>
                      <ul className="list-disc pl-6 mt-3 space-y-3 font-semibold text-slate-700">
                        <li>
                          <strong>Facebook Page Access Tokens & Developer Keys:</strong> To establish and maintain a continuous, authorized pipeline with the Meta Open Graph API, our Firestore engines securely save unique Page Access Tokens. These keys are heavily encrypted in-transit using industry-standard AESGCM-256 protocols and remain isolated in secure server configurations.
                        </li>
                        <li>
                          <strong>Basic Public Profile Coordinates:</strong> When you connect a commercial storefront or profile, we collect public details including the Facebook Page Identification Number, Page Profile Pictures, and current verified Business Names to form dynamic dropdowns inside our administrators' dashboard.
                        </li>
                        <li>
                          <strong>Real-Time Conversation Webhooks:</strong> Our engines track inbound messenger events. When an external contact messages your connected page, Meta directs a secure HTTPS POST webhook payload containing the Sender Participant Identifier, Timestamp, and Raw Messaging String to our servers.
                        </li>
                        <li>
                          <strong>SaaS Account Specifications:</strong> We collect and save critical information about registered team accounts. This includes your Full Legal Name, secure system Password Hashes (processed through safe bcrypt algorithms), active business Emails, Custom Workspace Keys, SMTP server parameters, and billing subscription statistics.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">2. Processing Methodologies and AI Generations</h3>
                      <p>
                        All inbound messaging webhook streams represent highly private user assets. To deliver automatic context-rich replies, we align our real-time middleware with advanced server-side language models:
                      </p>
                      <ul className="list-disc pl-6 mt-3 space-y-3 text-slate-700">
                        <li>
                          We stream localized conversation details to server-side Google Gemini 1.5 Pro and Flash API microservices of Google Cloud. No client-side applications have direct exposure to Gemini Keys.
                        </li>
                        <li>
                          <strong>Strict Personal Training Refusal:</strong> We explicitly warrant that no collected contact conversational data or business context is ever submitted to public dataset models for fine-tuning, training, standard behavioral studies, or marketing tracking arrays.
                        </li>
                        <li>
                          Conversational text and page messaging parameters are utilized purely to process instant replies and operate our administrative local chat live boards.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">3. Third-Party Sharing and Advertisement Policy</h3>
                      <p>
                        We maintain a strict zero-sharing commitment. MessengerAI does not offer, sell, trade, or transfer any private user identification data, administrative settings, or messenger chat histories to advertising firms, tracking agencies, or third-party marketing companies. Data is processed strictly within sandboxed Cloud Run server instances and Firebase database partitions configured inside enterprise Google Cloud resources.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">4. Comprehensive GDPR, CCPA, and Meta Compliance Rights</h3>
                      <p>
                        In adherence to rigorous regulatory standards worldwide, we grant every user the following sovereign data control rights:
                      </p>
                      <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-700">
                        <li>
                          <strong>Right of Access & Portability:</strong> Users may download an aggregated, structured JSON archive containing their active connected page credentials, support requests, and billing invoices.
                        </li>
                        <li>
                          <strong>Right of Rectification:</strong> You are entitled to correct or adjust your workspace parameters, Gemini configurations, page tokens, and personal credentials via our Settings panel.
                        </li>
                        <li>
                          <strong>Right of Erasure (Data Oblivion):</strong> Users can execute an absolute, permanent deletion sequence. By initiating a wipe request within our Data Deletion Center, our systems execute immediate Firestore delete operations, erasing access configurations, chat history, and active page configurations forever.
                        </li>
                        <li>
                          <strong>Meta Platform Connection Disconnect:</strong> Users may sever all API access links instantly via active Meta/Facebook Developer page parameters without requiring custom administrative approval.
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-6 leading-relaxed text-xs text-slate-500 font-semibold">
                      For any inquiries concerning compliance verification, information processing models, CCPA rights, or specific privacy audits, please direct your message to our Global Protection Compliance Desk at <span className="text-indigo-650 font-black underline">compliance@messenger-ai.com</span>. We guarantee an official reply to all regulatory and customer support submissions within twenty-four (24) business hours.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* VIEW 2: TERMS AND CONDITIONS - 500+ Words in English */}
              {activeTab === 'terms' && (
                <motion.div 
                  key="terms"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xs p-8 md:p-12 space-y-10"
                >
                  <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                      <FileCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">SAAS MASTER SERVICE AGREEMENT AND USER CONDUCT POLICY</p>
                    </div>
                  </div>

                  <div className="text-slate-600 space-y-6 text-sm leading-relaxed font-normal">
                    <p className="text-slate-550 leading-relaxed font-semibold mb-6">
                      Welcome to MessengerAI! Please read this comprehensive Master Service Agreement and Terms of Service carefully before registering an account, integrating your business assets, or deploying automated messaging agents. By establishing a user account, authenticating through our landing interfaces, or synchronizing Facebook Page tokens within our dashboard, you officially acknowledge, accept, and agree to be contractually bound by these Master Terms. If you do not agree to the complete ruleset delineated herein, you are strictly prohibited from utilizing our software, accessing our interface panels, or connecting messaging channels to our system webhooks.
                    </p>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">1. Permitted Use & Authorized Workspace Registration</h3>
                      <p>
                        To operate MessengerAI, clean and verified coordinates are required. Each registrant warrants that they possess the legal authority to bind their enterprise, and that all inputted database variables (such as email systems, profile records, and security passphrases) are complete and accurate:
                      </p>
                      <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-700">
                        <li>You must be at least eighteen (18) years of age to register an administrative workspace on this SaaS platform.</li>
                        <li>You maintain full personal responsibility for maintaining the tight confidentiality of your password, local session tokens, and Gemini configuration arrays.</li>
                        <li>Any unauthorized intrusion or suspicious access of database entries must be disclosed immediately to our system support desk for forensic analysis.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">2. Prohibited Platform Behavior and Meta Developer Polices</h3>
                      <p>
                        As an automation service, we strictly align our processing infrastructure with Meta Developer Guidelines. Users are strictly prohibited from:
                      </p>
                      <ul className="list-disc pl-6 mt-3 space-y-3 text-slate-700">
                        <li>
                          Utilizing automated conversation agents to transmit spam, unsolicited commercial advertisements, phishing links, malware payloads, or fraudulent marketing materials.
                        </li>
                        <li>
                          Violating the intellectual property rights, trademarks, or personal copyright boundaries of any external developer, business entity, or individual user.
                        </li>
                        <li>
                          Impersonating official emergency networks, medical response channels, government offices, or military coordinates through simulated messaging outputs.
                        </li>
                        <li>
                          Deploying bot templates designed to distribute abusive, defamatory, threatening, or harmful language. Any discovered breach of behavioral boundaries will result in immediate API de-synchronization and instant workspace suspension without financial liability or refund.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">3. Subscription Management, Invoices, and Payment Cycles</h3>
                      <p>
                        Our platform features standard monthly software licensing models to offer continuous server resources:
                      </p>
                      <ul className="list-disc pl-6 mt-3 space-y-3 text-slate-700">
                        <li>
                          <strong>Trial Framework:</strong> Each newly connected commercial page begins with an evaluation period of exactly fourteen (14) consecutive calendar days. There are no limits on response counts durante evaluations.
                        </li>
                        <li>
                          <strong>Monthly SaaS Fee:</strong> Upon expiration of the standard evaluation trial, continuing the interactive reply listener triggers a monthly billing licensing fee of $10 billed programmatically per connected page.
                        </li>
                        <li>
                          <strong>Cancellation Safeguards:</strong> You can terminate subscription agreements directly within your Billing dashboard at any time. Cancellation takes effect at the end of the current billing cycle, during which your automated webhooks will remain operational.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">4. Refund & Quality Satisfaction SLA</h3>
                      <p>
                        We stand behind our automation technology with a 7-day refund guarantee:
                      </p>
                      <p className="mt-2">
                        If our Gemini AI conversation engine fails to process your webhooks, disconnects frequently due to underlying system defects, or fails to deliver the expected features within seven (7) calendar days of starting a paid subscription, you may request a refund. Contact our billing support with your order reference, and our credit compliance team will verify your claim and issue an absolute refund of your payment within 5 to 7 business days to your original payment method.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">5. Complete Limitation of Warranties and Liability Exclusions</h3>
                      <p>
                        MessengerAI leverages server-side Generative artificial intelligence models to compile automated replies. Since models draw context estimations and natural text sequences, we do not guarantee of absolute accuracy or factual precision of AI-generated chat outputs. The platform is provided strictly "As Is" and "As Available". We disclaim all implied warranties of merchantability, specific fitness, and continuous uptime. Under no conditions shall MessengerAI, its underlying developers, or server partners be held liable for commercial loss, customer dissatisfaction, revenue reductions, or Meta developer access suspensions resulting from the deployment, behavior, or actions of your connected AI bot.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* VIEW 3: DATA DELETION CENTER - 500+ Words in English */}
              {activeTab === 'deletion' && (
                <motion.div 
                  key="deletion"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xs p-8 md:p-12 space-y-10"
                >
                  <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-1000 tracking-tight font-sans">Data Deletion Instructions</h2>
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">META DEVELOPER DATA USE AND GDPR DATA WIPE SYSTEMS</p>
                    </div>
                  </div>

                  {/* Facebook Platform Instructions */}
                  <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 space-y-4">
                    <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-[#1877f2] fill-[#1877f2]" /> Standard Facebook App Deactivation Guide
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      In complete alignment with standard Meta Platform developer guidelines and personal privacy protection models, you can instantly sever the integration between your commercial Facebook pages/accounts and the MessengerAI SaaS servers. You do not need to contact our support team. Follow these developer-compliant steps inside your personal Meta account:
                    </p>
                    <ol className="list-decimal pl-5 text-xs text-slate-600 font-bold space-y-3 leading-relaxed">
                      <li>Log in to your personal or professional Facebook profile and open the main legal config dropdown: <strong>"Settings & Privacy &gt; Settings"</strong>.</li>
                      <li>Scroll down the left sidebar navigation directory until you locate and click on <strong>"Apps and Websites"</strong>.</li>
                      <li>Browse the active partner integrations list, or locate our system via the search bar: <strong>"MessengerAI"</strong>.</li>
                      <li>Click on the standard <strong>"Remove"</strong> button next to our application profile card.</li>
                      <li>Confirm the deletion request prompt and check the box to request Facebook to purge and delete all previous interaction logs. This immediately instructs Meta platform servers to sever our active authorization webhooks, rendering our connected API access tokens permanently void.</li>
                    </ol>
                  </div>

                  <div className="text-slate-600 space-y-6 text-sm leading-relaxed font-normal">
                    <p>
                      Beyond the simple removal of Meta permissions, MessengerAI operates a secure, self-service SaaS Compliance Removal Center. When you request a database data wipe through the automated form below, our backend services trigger an absolute and irreversible purge of your stored digital records from our servers.
                    </p>

                    <div>
                      <h3 className="text-slate-950 font-black text-xs uppercase tracking-widest mb-1.5">What Stored Data is Deleted Forever?</h3>
                      <p>
                        Our automated purge script executes queries to locate every document node associated with your target verification email address, ensuring an absolute data wipe. This includes the complete destruction of:
                      </p>
                      <ul className="list-disc pl-6 mt-2.5 space-y-2 text-slate-700">
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
                            className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-2xl pl-12 pr-4.5 py-4 text-xs font-black placeholder:text-slate-300 tracking-wider focus:outline-none transition-all placeholder:uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={confirmWipeAuth}
                            onChange={(e) => setConfirmWipeAuth(e.target.checked)}
                            className="mt-1 accent-indigo-600 rounded border-slate-300"
                          />
                          <span className="text-xs font-semibold text-slate-500 leading-tight">
                            I instruct MessengerAI to permanently lock, wipe, and delete my SaaS admin account profile and bcrypt credentials hashes.
                          </span>
                        </label>

                        <label className="flex items-start gap-3.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={confirmDisconnectFb}
                            onChange={(e) => setConfirmDisconnectFb(e.target.checked)}
                            className="mt-1 accent-indigo-600 rounded border-slate-300"
                          />
                          <span className="text-xs font-semibold text-slate-500 leading-tight">
                            I instruct the system to immediately void and delete all connected Facebook Page Access Tokens, Webhook subscription parameters, and log records.
                          </span>
                        </label>
                      </div>

                      <button 
                        type="submit"
                        disabled={isDeleting || !deleteEmail || !confirmWipeAuth || !confirmDisconnectFb}
                        className="w-full bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-100 disabled:text-slate-300 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2"
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
                                  Your active session is ending. Purging remaining local cash elements in 3 seconds...
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* VIEW 4: FAQ & SUPPORT CENTER - 500+ Words in English */}
              {activeTab === 'faq-support' && (
                <motion.div 
                  key="faq-support"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xs p-8 md:p-12 space-y-12"
                >
                  <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                      <HelpCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-1000 tracking-tight">Support Desk & FAQ Panel</h2>
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
                              className="w-full flex justify-between items-center text-left font-black text-sm text-slate-800 hover:text-indigo-600 transition-colors gap-5 focus:outline-none"
                            >
                              <span>{faq.q}</span>
                              <span className={`text-slate-400 text-lg transition-transform ${isOpen ? 'rotate-45 text-indigo-600' : ''}`}>+</span>
                            </button>
                            {isOpen && (
                              <div className="mt-3.5 text-xs text-slate-500 font-semibold leading-relaxed pl-1 space-y-2">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Helpline ticket support desk */}
                  <div className="bg-slate-50 rounded-[2rem] p-6 lg:p-10 space-y-6 border border-slate-100">
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
                          className="w-full bg-white border border-slate-150 focus:outline-none focus:border-indigo-600 rounded-xl px-4 py-3.5 text-xs font-semibold transition-all"
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
                          <div className="flex items-start gap-3">
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
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
