import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Shield, 
  BarChart3, 
  ChevronRight, 
  Menu, 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Facebook, 
  Star, 
  Layers, 
  Command, 
  HelpCircle, 
  Users, 
  Sliders, 
  Calendar, 
  Play, 
  TrendingUp, 
  ShieldCheck, 
  Laptop, 
  XCircle, 
  CircleDot, 
  User, 
  PlusCircle, 
  LogIn 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from 'recharts';

// --- Navbar Component ---
const Navbar = ({ 
  onSignIn, 
  onSignUp,
  onAboutClick,
  onContactClick
}: { 
  onSignIn: () => void;
  onSignUp: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav role="navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-3.5 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`p-2 rounded-xl transition-all duration-300 shadow-md ${scrolled ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>
              <Facebook className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
              Perseus<span className="text-indigo-600"> Bot</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              FAQ
            </button>
            <button 
              onClick={onAboutClick}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={onContactClick}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Desktop Right Buttons (Login & Trial) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onSignIn}
              className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer px-4 py-2"
            >
              Log in
            </button>
            <button 
              onClick={onSignUp}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer"
            >
              Start free trial
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-900 cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-100 absolute top-full left-0 right-0 p-8 shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              <button onClick={() => scrollToSection('features')} className="text-lg font-bold text-slate-900 text-left">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-lg font-bold text-slate-900 text-left">How it works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-lg font-bold text-slate-900 text-left">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="text-lg font-bold text-slate-900 text-left">FAQ</button>
              <button onClick={() => { onAboutClick(); setIsMenuOpen(false); }} className="text-lg font-bold text-slate-900 text-left">About Us</button>
              <button onClick={() => { onContactClick(); setIsMenuOpen(false); }} className="text-lg font-bold text-slate-900 text-left">Contact Help</button>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                <button 
                  onClick={() => { onSignIn(); setIsMenuOpen(false); }}
                  className="w-full text-slate-700 py-3.5 rounded-xl font-bold text-center border border-slate-200"
                >
                  Log in
                </button>
                <button 
                  onClick={() => { onSignUp(); setIsMenuOpen(false); }}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/10 text-center"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Macbook & Software Live Workspace Simulator ---
const MacbookLiveSimulator = ({ onAuthClick }: { onAuthClick: () => void }) => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'chat' | 'pages' | 'audience' | 'analytics'>('broadcast');
  
  // Real-time incremental sending simulator state
  const [isSending, setIsSending] = useState(true);
  const [sendingStats, setSendingStats] = useState({ sent: 10, delivered: 10, queued: 1237 });
  const [logItems, setLogItems] = useState([
    { id: 1, initials: 'TS', name: 'Taylor Smith', status: 'delivered', text: 'Campaign message dispatched successfully !' },
    { id: 2, initials: 'JL', name: 'Jordan Lee', status: 'delivered', text: 'Message delivered & read' },
    { id: 3, initials: 'CM', name: 'Casey Morgan', status: 'sending', text: 'Processing handshake ...' },
    { id: 4, initials: 'EW', name: 'Emma Williams', status: 'queued', text: 'In outbound delivery queue' },
    { id: 5, initials: 'AM', name: 'Alex Marrow', status: 'queued', text: 'Pending' }
  ]);

  // Chat/Inbox Simulation
  const [chatLog, setChatLog] = useState([
    { id: 1, sender: 'user', text: 'Assalamu Alaikum! Summer Lawn suit in size Medium price please?' },
    { id: 2, sender: 'bot', text: 'Walaikum Assalam! Our Premium Linen Summer Lawn Suit (Medium) is currently in stock at Rs. 4,990.\n\nWould you like me to share a secure checkout link?' },
    { id: 3, sender: 'user', text: 'Yes, please share the checkout link.' },
    { id: 4, sender: 'bot', text: 'Awesome! 🛍️ Generated checkout cart link:\n👉 pay.perseusbot.com/checkout?lnk=99283\n\nFull cash on delivery is supported! Let me know if you need sizing help.' }
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Connected Pages simulator
  const [connectedPages, setConnectedPages] = useState([
    { id: 1, name: 'Perseus Bot Store', category: 'Retail & Fashion', connected: true, msgCount: '12,490' },
    { id: 2, name: 'Brand Outreach Hub', category: 'Marketing', connected: false, msgCount: '0' },
    { id: 3, name: 'StyleHub Pakistan', category: 'Shopping Brand', connected: true, msgCount: '4,103' }
  ]);

  // Audience directory mock search
  const [audienceFilter, setAudienceFilter] = useState('');
  const [audienceList, setAudienceList] = useState([
    { name: 'Taylor Smith', email: 'taylor.smith@gmail.com', tag: 'Lead', phone: '+92 300 4821211' },
    { name: 'Jordan Lee', email: 'jordan.lee@outlook.com', tag: 'VIP Subscriber', phone: '+92 321 8291002' },
    { name: 'Casey Morgan', email: 'casey.m@yahoo.com', tag: 'Lead', phone: '+92 334 9283831' },
    { name: 'Emma Williams', email: 'emma.williams@hotmail.com', tag: 'Active Customer', phone: '+1 415 9028911' },
    { name: 'Zainab Malik', email: 'zainab@retail.pk', tag: 'Broadcasting List', phone: '+92 312 8829199' }
  ]);

  // Live Auto-play generator for Broadcaster Sending loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSending) {
      interval = setInterval(() => {
        setSendingStats(prev => {
          const inc = Math.floor(Math.random() * 2) + 1;
          const nextSent = prev.sent + inc;
          const nextDelivered = prev.delivered + (Math.random() > 0.25 ? inc : inc - 1);
          const nextQueued = Math.max(0, prev.queued - inc);

          // Stagger the list of status updates
          setLogItems(oldItems => {
            const updated = [...oldItems];
            // Find one in sending, set to delivered, choose next queued and set to sending
            const sendingIdx = updated.findIndex(item => item.status === 'sending');
            if (sendingIdx !== -1) {
              updated[sendingIdx].status = 'delivered';
              updated[sendingIdx].text = 'Delivered & read live - 100% policy-safe';
            }
            const queuedIdx = updated.findIndex(item => item.status === 'queued');
            if (queuedIdx !== -1) {
              updated[queuedIdx].status = 'sending';
              updated[queuedIdx].text = 'Dialing token webhook handshake ...';
            } else {
              // Append a new simulated contact to keep list endless
              const newNames = ['Sarah Mitchell', 'Hamza Farooq', 'Alex Ross', 'Sadia Khan', 'John Baker'];
              const customName = newNames[Math.floor(Math.random() * newNames.length)] + ` (${nextSent})`;
              return [
                { id: Date.now(), initials: customName.split(' ').map(n=>n[0]).join(''), name: customName, status: 'sending', text: 'Processing bulk broadcast message...' },
                ...oldItems.slice(0, 4)
              ];
            }
            return updated;
          });

          return {
            sent: nextSent,
            delivered: nextDelivered,
            queued: nextQueued
          };
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSending]);

  const handlePostChatMessage = () => {
    if (!newChatText.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: newChatText };
    setChatLog(prev => [...prev, userMsg]);
    setNewChatText('');

    // Simulated quick auto-answer mimicking our live backend's AI automation
    setTimeout(() => {
      const responsePool = [
        "JazakAllah for your response! Perseus Bot API is listening live. We can schedule a custom compliance message block for you.",
        "Your broadcast action is recorded. Standard compliance algorithms protect your Page from reach blocks.",
        "Yes, our direct Stripe & WhatsApp integration delivers a checkout button within 0.3 seconds!"
      ];
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: responsePool[Math.floor(Math.random() * responsePool.length)] };
      setChatLog(prev => [...prev, botMsg]);
    }, 1200);
  };

  const filteredAudience = audienceList.filter(user => 
    user.name.toLowerCase().includes(audienceFilter.toLowerCase()) || 
    user.tag.toLowerCase().includes(audienceFilter.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl bg-slate-900 shadow-2xl p-4 md:p-6 border-4 border-slate-700/80">
      
      {/* Laptop top metallic bar & screen header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        
        {/* Address mock bar representing our real workspace */}
        <div className="bg-slate-800/80 text-slate-400 text-[10px] md:text-xs px-6 py-1.5 rounded-full font-mono text-center w-1/2 md:w-2/3 truncate flex items-center justify-center gap-1">
          <span className="text-emerald-500">●</span> perseusbot.com/app/live-workspace
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/50 bg-indigo-600/30 font-black px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block">LIVE SIMULATION</span>
        </div>
      </div>

      {/* Simulator Inner Workspace */}
      <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-inner text-slate-100 flex flex-col md:flex-row min-h-[460px] max-h-[580px] font-sans">
        
        {/* Workspace Mini Sidebar */}
        <div className="w-full md:w-56 bg-slate-900 border-r border-slate-800/50 flex flex-col p-4 justify-between gap-4">
          <div className="space-y-4">
            {/* Nav brand info */}
            <div className="px-2 py-1.5 flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Facebook className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-black select-none text-white tracking-widest leading-none">MESSENGER HUB</h4>
                <span className="text-[8px] text-indigo-400 font-bold tracking-widest">PERSEUS BOT WORKSPACE</span>
              </div>
            </div>

            {/* Nav tabs list */}
            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab('broadcast')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold leading-none tracking-tight transition-all cursor-pointer ${activeTab === 'broadcast' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Zap className="w-4 h-4" />
                Live Broadcaster
              </button>
              
              <button 
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold leading-none tracking-tight transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <MessageSquare className="w-4 h-4" />
                Compliant Inbox
              </button>

              <button 
                onClick={() => setActiveTab('pages')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold leading-none tracking-tight transition-all cursor-pointer ${activeTab === 'pages' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Check className="w-4 h-4" />
                Page Connections
              </button>

              <button 
                onClick={() => setActiveTab('audience')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold leading-none tracking-tight transition-all cursor-pointer ${activeTab === 'audience' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Users className="w-4 h-4" />
                Audience CRM
              </button>

              <button 
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold leading-none tracking-tight transition-all cursor-pointer ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <BarChart3 className="w-4 h-4" />
                Campaign Metrics
              </button>
            </div>
          </div>

          {/* Connected User Mock Info */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 font-black text-xs flex items-center justify-center">
              PB
            </div>
            <div className="truncate">
              <p className="text-[10px] font-black leading-tight text-white">Business Demo</p>
              <span className="text-[8px] text-slate-500 block leading-tight">Perseus Bot Active</span>
            </div>
          </div>
        </div>

        {/* Content Area Panel */}
        <div className="flex-1 bg-slate-950 p-5 md:p-6 overflow-y-auto min-h-[300px]">
          
          {/* TAB 1: Live Broadcaster (campaign progress) */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    <h3 className="text-base font-black text-white tracking-tight">Live Broadcast Campaign</h3>
                  </div>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">Campaign ID: Broadcast-9932</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsSending(!isSending)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer ${isSending ? 'bg-red-500/25 text-red-400 border border-red-500/30' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                  >
                    {isSending ? 'Pause Dispatch' : 'Resume Bulk Send'}
                  </button>
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded">
                    <CircleDot className="w-3.5 h-3.5 animate-pulse" /> Live Status
                  </span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Sent</span>
                  <p className="text-xl md:text-2xl font-black text-indigo-500 mt-1">{sendingStats.sent}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Delivered</span>
                  <p className="text-xl md:text-2xl font-black text-emerald-400 mt-1">{sendingStats.delivered}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Queued Left</span>
                  <p className="text-xl md:text-2xl font-black text-slate-300 mt-1">{sendingStats.queued}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-xs mb-2 font-bold text-slate-400">
                  <span>Outbound Thread Progress</span>
                  <span>1% Completed</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: '4%' }} />
                </div>
              </div>

              {/* Dispatch feed log */}
              <div className="space-y-2.5">
                <h4 className="text-xs uppercase font-black tracking-widest text-slate-400">Real-Time Event Stream</h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {logItems.map((item, idx) => (
                    <div key={item.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/50 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 font-black text-slate-300 flex items-center justify-center text-[10px]">
                          {item.initials}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs leading-none">{item.name}</p>
                          <span className="text-[10px] text-slate-500 block mt-1">{item.text}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded leading-none uppercase ${item.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' : item.status === 'sending' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Inbox/Complaint Chat */}
          {activeTab === 'chat' && (
            <div className="space-y-4 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">Gemini Conversational AI Core</h3>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block leading-tight">Continuous learning active</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1 rounded text-slate-400 font-mono">
                    Model: Gemini-Pro-Flash
                  </span>
                </div>

                {/* Conversation Box */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto p-1">
                  {chatLog.map(msg => (
                    <div key={msg.id} className={`flex max-w-[85%] gap-2.5 ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-slate-800 text-slate-300' : 'bg-indigo-600 text-white'}`}>
                        {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-slate-900 text-slate-200 rounded-tr-none' : 'bg-indigo-900/20 text-slate-200 border border-indigo-500/20 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input Area */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2.5">
                <input 
                  type="text" 
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostChatMessage()}
                  placeholder="Type a query to simulate automated sales trigger ..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-600 uppercase tracking-wider font-bold"
                />
                <button 
                  onClick={handlePostChatMessage}
                  className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Facebook Pages connecting */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white">Connected Facebook Pages</h3>
                <p className="text-slate-400 text-xs mt-1">Connect multiple public and commercial Facebook pages securely via official Facebook permissions.</p>
              </div>

              <div className="space-y-3">
                {connectedPages.map(page => (
                  <div key={page.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-300">
                        <Facebook className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">{page.name}</h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{page.category} &bull; {page.connected ? `${page.msgCount} audience reached` : 'Not linked'}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setConnectedPages(prev => prev.map(p => p.id === page.id ? { ...p, connected: !p.connected } : p));
                      }}
                      className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${page.connected ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow shadow-indigo-500/10'}`}
                    >
                      {page.connected ? 'Disconnect' : 'Connect Page'}
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={onAuthClick}
                className="w-full bg-slate-800 hover:bg-slate-750 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-700 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-indigo-500" /> OAuth Link More Pages
              </button>
            </div>
          )}

          {/* TAB 4: Audience CRM */}
          {activeTab === 'audience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-sm font-black text-white">Audience CRM Matrix</h3>
                  <p className="text-slate-400 text-xs mt-1">Review page interactions, qualify tags, and isolate compliance opt-ins.</p>
                </div>
                <input 
                  type="text" 
                  placeholder="Search user or tag..." 
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-600 w-full sm:w-48 font-bold uppercase tracking-wider"
                />
              </div>

              {/* Subscriber Grid Table */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {filteredAudience.map((subscriber, idx) => (
                  <div key={idx} className="bg-slate-900/65 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/15 text-indigo-400 font-bold flex items-center justify-center text-[11px] shrink-0">
                        {subscriber.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-white truncate leading-none">{subscriber.name}</p>
                        <span className="text-[10px] text-slate-500 block mt-1 truncate">{subscriber.email} &bull; {subscriber.phone}</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-indigo-500/15 border border-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase font-black shrink-0">
                      {subscriber.tag}
                    </span>
                  </div>
                ))}
                {filteredAudience.length === 0 && (
                  <p className="text-center text-slate-500 py-6 text-xs font-bold uppercase">No matching demographic results found.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Campaign Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-white">Global Campaign Analytics</h3>
                <p className="text-slate-400 text-xs mt-1">Live updates evaluating response engagement, link conversions, and safe delivery rates.</p>
              </div>

              {/* Mini Stats Cards */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Delivery Rate</span>
                  <p className="text-lg font-black text-white mt-1">98.24%</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Avg Outbound latency</span>
                  <p className="text-lg font-black text-indigo-400 mt-1">&lt; 0.28s</p>
                </div>
              </div>

              {/* Delivery Chart */}
              <div className="bg-slate-900 rounded-2xl h-36 border border-slate-800 p-2 text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'M1', volume: 400 },
                    { name: 'M2', volume: 900 },
                    { name: 'M3', volume: 2200 },
                    { name: 'M4', volume: 1800 },
                    { name: 'M5', volume: 3100 },
                    { name: 'M6', volume: 3549 }
                  ]}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Area type="monotone" dataKey="volume" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVolume)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Simulated laptop base keyboard shadow */}
      <div className="w-full h-4 bg-slate-800 rounded-b-3xl border-t border-slate-700 flex justify-center items-center">
        <div className="w-24 h-1 bg-slate-950 rounded-full" />
      </div>

    </div>
  );
};

// --- Segment/Metric comparison before vs after ---
const TransformComparison = () => {
  const data = [
    { name: 'Month 1', Without: 100, With: 100 },
    { name: 'Month 3', Without: 110, With: 220 },
    { name: 'Month 6', Without: 115, With: 450 },
    { name: 'Month 9', Without: 120, With: 890 },
    { name: 'Month 12', Without: 128, With: 1240 }
  ];

  return (
    <section className="py-24 bg-white border-y border-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full">TRANSFORMING RETAIL OUTCOME</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4">
            Transform Your Marketing Results
          </h2>
          <p className="mt-4 text-slate-500 font-medium text-sm md:text-base">
            See the dramatic difference between manual messaging and Perseus Bot's automated broadcast system. Real results from real businesses.
          </p>
        </div>

        {/* Side-by-side comparative grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Before Column */}
          <div className="p-8 rounded-[2.5rem] bg-slate-50/70 border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/50">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-black text-slate-800 leading-none">Before Perseus Bot</h3>
                </div>
                <span className="text-[10px] text-red-500 bg-red-105 font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full">THE OLD MANUAL WAY</span>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/40">
                  <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Hours spent on manual messaging</span>
                  <span className="text-red-500 font-black text-sm select-none">4+ hrs/day</span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/40">
                  <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Low engagement rates</span>
                  <span className="text-red-500 font-black text-sm select-none">&lt; 5%</span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/40">
                  <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Limited audience reach</span>
                  <span className="text-red-500 font-black text-sm select-none">~100/day</span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/40">
                  <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">No performance tracking</span>
                  <span className="text-red-500 font-black text-sm select-none">None</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest text-center mt-6">Frustrated resources & stagnant marketing conversion rates</p>
          </div>

          {/* With Column */}
          <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-indigo-500/35">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  <h3 className="text-lg font-black text-white leading-none">With Perseus Bot</h3>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full">COMPLIANT SPEED</span>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center bg-indigo-700/50 p-4 rounded-xl border border-indigo-500/30">
                  <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Automated broadcast delivery</span>
                  <span className="text-white font-black text-sm select-none">&lt; 5 min</span>
                </div>
                <div className="flex justify-between items-center bg-indigo-700/50 p-4 rounded-xl border border-indigo-500/30">
                  <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider">High engagement rates</span>
                  <span className="text-emerald-400 font-black text-sm select-none">35%+</span>
                </div>
                <div className="flex justify-between items-center bg-indigo-700/50 p-4 rounded-xl border border-indigo-500/30">
                  <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Massive audience reach</span>
                  <span className="text-white font-black text-sm select-none">10,000+/hr</span>
                </div>
                <div className="flex justify-between items-center bg-indigo-700/50 p-4 rounded-xl border border-indigo-500/30">
                  <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Real-time analytics</span>
                  <span className="text-emerald-400 font-black text-sm select-none">Live tracking</span>
                </div>
              </div>
            </div>

            <p className="text-indigo-200 text-[10px] uppercase font-bold tracking-widest text-center mt-6">Secure, fully policy-compliant broadcasting loops</p>
          </div>
        </div>

        {/* Recharts live chart comparison and analytics card summary */}
        <div className="bg-slate-900 rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/10 to-transparent" />
          
          <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-center">
            <div className="w-full xl:w-2/3 h-72">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest block">Live Performance</span>
                  <h4 className="text-lg font-black tracking-tight mt-0.5 text-white">Engagement Growth Over Time</h4>
                </div>
                <div className="flex items-center gap-4 text-[9px] uppercase font-bold tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-1.5 bg-slate-600 rounded-full" /> Without Tool (+28% yr)
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <span className="w-2.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" /> With Perseus Bot (+340% yr)
                  </span>
                </div>
              </div>

              {/* Responsive Container for Chart */}
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={data}>
                  <XAxis dataKey="name" stroke="#475569" strokeWidth={1} style={{ fontSize: 9, fontWeight: 900 }} />
                  <YAxis stroke="#475569" strokeWidth={1} style={{ fontSize: 9, fontWeight: 900 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff' }} />
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="Without" name="Without Perseus Bot" stroke="#475569" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="With" name="With Perseus Bot" stroke="#6366f1" strokeWidth={4} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats summary list next to the growth graph */}
            <div className="w-full xl:w-1/3 grid grid-cols-2 gap-4">
              <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Growth Rate</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">312%</p>
                <span className="text-[8px] text-slate-500 block mt-1 uppercase font-bold tracking-widest">Yearly increment</span>
              </div>
              <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-indigo-400">Messages Sent</span>
                <p className="text-2xl font-black text-white mt-1">3,549</p>
                <span className="text-[8px] text-slate-500 block mt-1 uppercase font-bold tracking-widest">Simulated bulk count</span>
              </div>
              <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">ROI Return</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">12x</p>
                <span className="text-[8px] text-slate-500 block mt-1 uppercase font-bold tracking-widest">Average business gain</span>
              </div>
              <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Delivery Accuracy</span>
                <p className="text-2xl font-black text-white mt-1">98%</p>
                <span className="text-[8px] text-slate-500 block mt-1 uppercase font-bold tracking-widest">Standard safe rating</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// --- Step guides for Facebook Connection ---
const StepsGuide = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50/50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">HOW TO START</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Start Broadcasting in Minutes
          </h2>
          <p className="mt-4 text-slate-500 text-sm md:text-base leading-relaxed">
            Connect your Facebook Page and start sending compliant broadcast messages to your audience in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm relative overflow-hidden group">
            <span className="text-4xl font-black text-slate-100 group-hover:text-indigo-50/70 transition-colors absolute right-8 top-8 select-none">01</span>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-8 font-black">
              1
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2 leading-none uppercase tracking-wide">Connect Your Page</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Link your Facebook Page with clean, secure Meta OAuth handshake. Just one click creates a compliant instant pipeline connection.
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm relative overflow-hidden group">
            <span className="text-4xl font-black text-slate-100 group-hover:text-indigo-50/70 transition-colors absolute right-8 top-8 select-none">02</span>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-8 font-black">
              2
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2 leading-none uppercase tracking-wide">Build Your Audience</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Observe and catalogue everyone who has initiated chat logs on your catalog pages. Filter parameters, isolate segments, and tag prospects.
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm relative overflow-hidden group">
            <span className="text-4xl font-black text-slate-100 group-hover:text-indigo-50/70 transition-colors absolute right-8 top-8 select-none">03</span>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-8 font-black">
              3
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2 leading-none uppercase tracking-wide">Send Broadcasts</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Draft compliant templates with pre-filled Stripe checkout links, specify segment tags, and broadcast safely to thousands with high delivery guarantees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Features Grid (lightning, compliance, smart sorting, logs, scheduling) ---
const FeaturesGrid = () => {
  const list = [
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
      title: "Lightning-Fast Bulk Messages",
      desc: "Reach thousands of customers in minutes, not hours. Our smart Delivery Priority checks guarantee maximum reach without lag."
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      title: "100% Meta compliant rules",
      desc: "Breathe easy knowing Perseus Bot restricts messages to compliant tags. Automated timers guarantee safe rate protection."
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      title: "Smart customer targeting",
      desc: "Isolate contacts using behavioral tags and engagement periods. Deliver focused messages directly to those willing to buy."
    },
    {
      icon: <Calendar className="w-5 h-5 text-violet-500" />,
      title: "Schedule & Automate Campaigns",
      desc: "Draft campaigns ahead. Configure optimum delivery slots and allow the cron runner to handle distribution cycles."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-indigo-500" />,
      title: "Real-Time ROI Analytics",
      desc: "Track every message event as it dispatches. Access delivery statistics, customer opt-ins, and checkout clicks live."
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
      title: "Gemini AI-Powered Live Chat",
      desc: "Integrate Gemini 1.5 to automatedly handle recurring questions about design prices, size guides, and branch timings."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full">CORE FEATURES MANUAL</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight leading-tight">
            The Complete Toolkit for Messenger Domination
          </h2>
          <p className="mt-4 text-slate-500 font-medium text-sm md:text-base leading-relaxed">
            Everything you need to turn your Facebook Page into a revenue-generating machine. Reach more customers, drive more sales, grow faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((item, idx) => (
            <div key={idx} className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                {item.icon}
              </div>
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide leading-tight mb-2">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Testimonial Block ---
const Testimonial = () => {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_50%)]" />
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="flex justify-center gap-1 text-yellow-400 mb-6 text-xl">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
        </div>
        <p className="text-xl md:text-2xl font-black leading-relaxed tracking-tight italic text-slate-100">
          "Perseus Bot transformed our customer communication. We've seen a 40% increase in engagement since switching to their broadcast tool."
        </p>
        
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 font-black flex items-center justify-center">
            SM
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-white">Sarah Mitchell</h4>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Marketing Director, StyleHub</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Pricing Grid with Cycle Toggle and dynamic Calculations ---
const PricingTable = ({ onSignUp }: { onSignUp: () => void }) => {
  const [cycle, setCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const discount = cycle === 'quarterly' ? 0.1 : cycle === 'yearly' ? 0.2 : 0;

  const calculatePrice = (base: number) => {
    const discounted = base * (1 - discount);
    return Math.round(discounted);
  };

  const plans = [
    {
      name: "Starter",
      purpose: "Try the platform with low commitment",
      basePrice: 8,
      credits: "30,000",
      perMsg: "$0.00026",
      inbox: "Inbox Add-on Required",
      features: [
        "30,000 Monthly Credits",
        "1 Facebook page connection",
        "Broadcast messages",
        "Live chat panel dashboard",
        "Basic analytics & tracking",
        "Schedule broadcasts anytime",
        "Personalized outreach"
      ],
      recommended: false
    },
    {
      name: "Growth",
      purpose: "Essential tools for scaling teams",
      basePrice: 22,
      credits: "300,000",
      perMsg: "$0.000073",
      inbox: "Premium Inbox Included",
      features: [
        "300,000 Monthly Credits",
        "3 Connected Facebook pages",
        "Broadcast + Bulk messaging",
        "Premium Live Chat platform",
        "Full analytics reports dashboard",
        "Team access (3 members limit)",
        "Automated delivery Priority checks"
      ],
      recommended: true
    },
    {
      name: "Pro",
      purpose: "Scale your outreach effectively",
      basePrice: 49,
      credits: "800,000",
      perMsg: "$0.000061",
      inbox: "Premium Inbox Included",
      features: [
        "800,000 Monthly Credits",
        "10 Connected Facebook pages",
        "All broadcast forms activated",
        "Premium Live Chat platform",
        "Advanced analytics & triggers",
        "Team access (10 members limit)",
        "Priority active help desk support"
      ],
      recommended: false
    },
    {
      name: "Business",
      purpose: "Advanced power for pros",
      basePrice: 99,
      credits: "2,000,000",
      perMsg: "$0.000049",
      inbox: "Premium Inbox Included",
      features: [
        "2,000,000 Monthly Credits",
        "Unlimited page connections",
        "Access to all premium features",
        "Unlimited workspace team members",
        "Dedicated account manager",
        "Live tracking triggers"
      ],
      recommended: false
    },
    {
      name: "Enterprise",
      purpose: "Maximum volume & SLA support",
      basePrice: 219,
      credits: "4,500,000",
      perMsg: "$0.000048",
      inbox: "Premium Inbox Included",
      features: [
        "4,500,000 Monthly Credits",
        "Unlimited page connections",
        "White-label branding options",
        "Custom enterprise API integrations",
        "SLA delivery level guarantees",
        "One-on-one onboarding call",
        "Priority dedicated care support"
      ],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50/70 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">PLAN OPTIONS</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-slate-500 font-medium text-sm md:text-base leading-relaxed">
            Pay only for what you use. No hidden fees. Credits are valid until plan expiry.
          </p>
        </div>

        {/* Toggle pricing cycle */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <button 
            onClick={() => setCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold leading-none uppercase tracking-wide transition-all cursor-pointer ${cycle === 'monthly' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' : 'bg-white text-slate-500 hover:text-slate-800'}`}
          >
            Monthly
          </button>
          
          <button 
            onClick={() => setCycle('quarterly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold leading-none uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${cycle === 'quarterly' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' : 'bg-white text-slate-500 hover:text-slate-800'}`}
          >
            Quarterly-10% <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded leading-none">SAVE</span>
          </button>

          <button 
            onClick={() => setCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold leading-none uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${cycle === 'yearly' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' : 'bg-white text-slate-500 hover:text-slate-800'}`}
          >
            Half-Yearly-20% <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded leading-none">SAVE</span>
          </button>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-[2.5rem] bg-white border flex flex-col justify-between transition-all duration-300 relative ${plan.recommended ? 'border-indigo-500 shadow-xl shadow-indigo-500/5 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-350 shadow-sm'}`}
            >
              {plan.recommended && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest bg-yellow-400 text-slate-950 px-3.5 py-1.5 rounded-full leading-none shadow">
                  RECOMMENDED
                </span>
              )}

              <div>
                <h3 className="text-xl font-black text-slate-800 leading-none">{plan.name}</h3>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tight mt-1 leading-tight">{plan.purpose}</p>

                {/* Pricing Box */}
                <div className="my-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 leading-none">${calculatePrice(plan.basePrice)}</span>
                    <span className="text-slate-400 text-xs font-bold leading-none">/mo</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">{plan.credits} credits &bull; {plan.perMsg}/msg</p>
                </div>

                {/* Inbox Addon Badge */}
                <div className="mb-6">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded inline-block ${plan.inbox === 'Premium Inbox Included' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {plan.inbox}
                  </span>
                </div>

                {/* Features list */}
                <ul className="space-y-3 pt-6 border-t border-slate-150 text-left">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button 
                  onClick={onSignUp}
                  className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors ${plan.recommended ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/25' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- FAQ Accordion Section ---
const FAQSection = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is Perseus Bot and how does it help Facebook Page owners?",
      a: "Perseus Bot is an enterprise-qualified broadcasting and CRM tool for Facebook Messenger. It enables brand and page owners to send automated bulk campaigns to subscribers with full compliance, retrieve real-time inventory metrics, and qualify leads without trigger manual fatigue index boundaries."
    },
    {
      q: "Is Perseus Bot free to try?",
      a: "Yes! Creating an account delivers a complimentary trial with safe messaging limits. No credit cards or upfront billing details are required. You can sync your page in under 60 seconds."
    },
    {
      q: "Will using Perseus Bot put my Facebook Page at risk?",
      a: "Absolutely not. We operate strictly in compliance with official Facebook Developer APIs and guidelines. The platform includes smart features like rate protection throttling and automated message tag assignment, preventing standard profile or page blockades."
    },
    {
      q: "How quickly can I send my first broadcast?",
      a: "Virtually instantly. Within 5 minutes, you can register, integrate your Facebook Page via a single OAuth action, compile your contact lists, formulate your messaging strategy, and initiate safe bulk campaigns."
    },
    {
      q: "How many people can I reach in one broadcast?",
      a: "You can reach thousands of users who have actively massaged or checked out on your page in the past. Safe throttling spaces these dispatches out, respecting Facebook rate limits automatically."
    },
    {
      q: "Do I need technical skills to use Perseus Bot?",
      a: "None. Our fully modular and responsive, zero-code administrative panel eliminates the configuration complexity of terminal operations or REST handshake coding. Everything is ready-made."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white border-t border-slate-50 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">SUPPORT DESK</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-500 font-medium text-sm md:text-base leading-relaxed">
            Everything you need to know about Perseus Bot
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-slate-200/80 rounded-[1.5rem] bg-white overflow-hidden transition-all duration-300 hover:border-slate-300"
            >
              <button 
                onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                className="w-full flex justify-between items-center px-6 py-5 cursor-pointer text-left font-sans text-slate-800"
              >
                <span className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-800 leading-snug">{faq.q}</span>
                <HelpCircle className={`w-5 h-5 text-indigo-550 shrink-0 transition-transform ${activeFAQ === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
              </button>

              <AnimatePresence initial={false}>
                {activeFAQ === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-100 bg-slate-55/40"
                  >
                    <p className="px-6 py-5 text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Footer Component ---
const Footer = ({ 
  onSignIn, 
  onSignUp,
  onPrivacyClick,
  onTermsClick,
  onDeletionClick,
  onSupportClick
}: { 
  onSignIn: () => void;
  onSignUp: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onDeletionClick: () => void;
  onSupportClick: () => void;
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-white/5 relative overflow-hidden" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Facebook className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight uppercase">Perseus Bot</span>
            </div>
            <p className="max-w-md text-slate-400 text-sm leading-relaxed">
              Perseus Bot is the leading Facebook Messenger broadcast tool. Send bulk messages to your Page audience with full Meta policy compliance.
            </p>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Product</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-indigo-400 transition-colors cursor-pointer block text-left">Features</button></li>
              <li><button onClick={onSignIn} className="hover:text-indigo-400 transition-colors cursor-pointer block text-left">Login</button></li>
              <li><button onClick={onSignUp} className="hover:text-indigo-400 transition-colors cursor-pointer block text-left">Pricing PLANS</button></li>
              <li><button onClick={onSupportClick} className="hover:text-indigo-400 transition-colors cursor-pointer block text-left">Support FAQ</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Legal Care</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
              <li><button onClick={onPrivacyClick} className="hover:text-indigo-400 transition-colors cursor-pointer block text-left">Privacy Policy</button></li>
              <li><button onClick={onTermsClick} className="hover:text-indigo-400 transition-colors cursor-pointer block text-left">Terms & Conditions</button></li>
              <li><button onClick={onDeletionClick} className="hover:text-red-400 transition-colors cursor-pointer block text-left">Request Data Deletion</button></li>
            </ul>
          </div>

        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-35">
            &copy; {new Date().getFullYear()} Perseus Bot Broadcast Automation. All rights reserved.
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-35 uppercase">
            Trusted by 10,000+ businesses worldwide
          </span>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN Component entry point ---
interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onDeletionClick: () => void;
  onSupportClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
}

export default function LandingPage({ 
  onSignIn, 
  onSignUp,
  onPrivacyClick,
  onTermsClick,
  onDeletionClick,
  onSupportClick,
  onAboutClick,
  onContactClick
}: LandingPageProps) {

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        onSignIn={onSignIn} 
        onSignUp={onSignUp}
        onAboutClick={onAboutClick}
        onContactClick={onContactClick}
      />

      <main>
        {/* HERO Section with custom copy and Macbook Simulator */}
        <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden bg-[radial-gradient(circle_at_top_right,#F5F3FF_0%,#FFFFFF_45%)]">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-60 -mr-96" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-30 -ml-40" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column Text branding and stats */}
              <div className="lg:col-span-5 space-y-8 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 fill-indigo-50" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">100% Meta Policy Compliant</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                    Facebook Messenger <br />
                    <span className="text-indigo-600">Broadcast Tool</span>
                  </h1>

                  <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                    Send bulk messages to your Facebook Page audience instantly. The most trusted Messenger marketing platform with full compliance.
                  </p>
                </div>

                {/* Login buttons integrated */}
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={onSignUp}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    Start Free Trial <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onSignIn}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all border border-slate-200/80 cursor-pointer active:scale-95"
                  >
                    Sign In
                  </button>
                </div>

                {/* Stars social evidence */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-150">
                  <div className="flex text-yellow-400 gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-xs">
                    <span className="font-sans font-black text-slate-800">4.9/5</span> &bull; <span className="text-slate-500 font-medium text-[11px]">10,000+ businesses trust Perseus Bot</span>
                  </div>
                </div>
              </div>

              {/* Right Column: MacBook Live simulation of our workspace */}
              <div className="lg:col-span-7">
                <MacbookLiveSimulator onAuthClick={onSignIn} />
              </div>

            </div>
          </div>
        </section>

        {/* Features list details */}
        <FeaturesGrid />

        {/* Metric progression analysis charts */}
        <TransformComparison />

        {/* Sequence connection guide */}
        <StepsGuide />

        {/* Customer assessment blockquote */}
        <Testimonial />

        {/* Pricing tier maps */}
        <PricingTable onSignUp={onSignUp} />

        {/* Dynamic Expandable FAQ */}
        <FAQSection />

        {/* Final Outbound conversions banner */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-800 to-transparent opacity-90" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(circle_at_bottom_center,rgba(255,255,255,0.1),transparent_75%)]" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                Ready to Grow Your <br /> Messenger Audience?
              </h2>
              <p className="text-indigo-100 text-sm max-w-xl font-bold uppercase tracking-widest block">
                Join thousands of businesses using Perseus Bot for Facebook Messenger marketing. Start your free trial today.
              </p>

              <div className="pt-4 flex flex-col gap-4">
                <button 
                  onClick={onSignUp}
                  className="bg-white hover:bg-slate-50 text-indigo-650 font-black text-xs uppercase tracking-widest px-10 py-5 rounded-2xl transition-all shadow-xl active:scale-95 cursor-pointer block"
                >
                  Start Free Trial
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider text-indigo-200">
                  <span>No credit card required</span>
                  <span>&bull;</span>
                  <span>Free trial included</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Styled Footnote */}
      <Footer 
        onSignIn={onSignIn} 
        onSignUp={onSignUp} 
        onPrivacyClick={onPrivacyClick} 
        onTermsClick={onTermsClick} 
        onDeletionClick={onDeletionClick} 
        onSupportClick={onSupportClick} 
      />
    </div>
  );
}
