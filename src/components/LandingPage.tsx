import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Terminal, Zap, Shield, BarChart3, ChevronRight, Globe, Github, Twitter, Linkedin, Menu, X, Check, ArrowRight, ArrowLeft, Send, Play, Sparkles, Facebook, Star, Layers, Command } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

const Navbar = ({ onAuthClick }: { onAuthClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className={`p-2 rounded-2xl transition-all duration-500 shadow-xl ${scrolled ? 'bg-indigo-600 shadow-indigo-100' : 'bg-white shadow-indigo-50'}`}>
              <Facebook className={`w-5 h-5 ${scrolled ? 'text-white' : 'text-indigo-600'}`} />
            </div>
            <span className={`text-xl font-black tracking-tight transition-colors duration-500 ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
              Perseus<span className="text-indigo-600"> Bot</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Solutions', 'Resources'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={onAuthClick}
              className="bg-slate-900 text-white px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-600 transition-all active:scale-95"
            >
              Start Free
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-100 absolute top-full left-0 right-0 p-8 shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {['Features', 'Solutions', 'Resources'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-xl font-black text-slate-900" onClick={() => setIsMenuOpen(false)}>{item}</a>
              ))}
              <button 
                onClick={() => { onAuthClick(); setIsMenuOpen(false); }}
                className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-100"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onCtaClick }: { onCtaClick: () => void }) => {
  return (
    <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden bg-[radial-gradient(circle_at_top_right,#EEF2FF_0%,#FFFFFF_50%)]">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-60 -mr-96" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-40 -ml-40" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-50/50 border border-indigo-100 rounded-full mb-10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">The Modern Standard for Messenger Automation</span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-10">
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700">
                Messenger Experience
              </span>
            </h1>
            


            <div className="mt-16 flex items-center justify-center gap-8 opacity-40">
               <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">12M+</span>
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 mt-1">Interactions</span>
               </div>
               <div className="w-1 h-8 bg-slate-200 rounded-full hidden sm:block" />
               <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">15k</span>
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 mt-1">Active Bots</span>
               </div>
               <div className="w-1 h-8 bg-slate-200 rounded-full hidden sm:block" />
               <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">99.9%</span>
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 mt-1">Uptime</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Improved Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="absolute inset-0 bg-indigo-600/5 rounded-[4rem] blur-3xl -z-10 translate-y-12 scale-95" />
          <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden aspect-[16/10] lg:aspect-[16/9] p-4 lg:p-6 group">
             <div className="h-full w-full bg-slate-50/50 rounded-[2.5rem] flex overflow-hidden ring-1 ring-slate-100">
                {/* Mock Sidebar */}
                <div className="w-20 lg:w-24 bg-white border-r border-slate-100 flex flex-col items-center py-10 gap-8">
                   <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                      <Zap className="w-6 h-6 text-white" />
                   </div>
                   <div className="space-y-6">
                      {[1,2,3,4].map(i => <div key={i} className={`w-10 h-10 rounded-2xl ${i === 1 ? 'bg-slate-100 text-indigo-600' : 'bg-slate-50 text-slate-300'} flex items-center justify-center`}>
                        {i === 1 ? <MessageSquare className="w-5 h-5" /> : <div className="w-5 h-5 bg-current rounded-md opacity-20" />}
                      </div>)}
                   </div>
                </div>
                {/* Mock Content */}
                <div className="flex-1 p-8 lg:p-12 space-y-10">
                   <div className="flex justify-between items-center">
                      <div>
                         <div className="h-8 w-48 bg-slate-200 rounded-full mb-3" />
                         <div className="h-4 w-32 bg-slate-100 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm" />
                         <div className="w-40 h-12 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-100" />
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-8">
                      <div className="col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
                         <div className="flex justify-between items-center">
                            <div className="w-32 h-4 bg-slate-100 rounded-full" />
                            <div className="w-10 h-10 bg-slate-50 rounded-xl" />
                         </div>
                         <div className="space-y-4">
                            <div className="flex gap-4 items-end">
                               <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                               <div className="w-2/3 h-12 bg-slate-50 rounded-2xl rounded-bl-none" />
                            </div>
                            <div className="flex gap-4 items-end justify-end">
                               <div className="w-1/2 h-12 bg-indigo-600/10 rounded-2xl rounded-br-none" />
                               <div className="w-8 h-8 rounded-full bg-indigo-100 shrink-0" />
                            </div>
                         </div>
                      </div>
                      <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-indigo-100 flex flex-col justify-between">
                         <div className="space-y-4">
                            <Star className="w-8 h-8 text-white fill-white" />
                            <div className="h-4 w-20 bg-indigo-400 rounded-full" />
                         </div>
                         <div className="h-10 w-full bg-indigo-500 rounded-2xl" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-white" />,
      title: "Generative AI Core",
      bg: "bg-indigo-600",
      description: "Powered by Gemini 1.5, your bots understand nuance, context, and intent with human-like precision."
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: "Enterprise Security",
      bg: "bg-emerald-50",
      description: "SOC-2 level compliance with end-to-end encryption. Your customer data is never used for training."
    },
    {
      icon: <Command className="w-6 h-6 text-slate-900" />,
      title: "Page Synchronization",
      bg: "bg-slate-100",
      description: "Connect unlimited Facebook Pages in one tap. Orchestrate your global presence from one screen."
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-600" />,
      title: "Custom Integrations",
      bg: "bg-indigo-50",
      description: "Hook your bots into CRM, database, or Shopify. Real-time stock checks and order tracking built-in."
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: "Multi-Language",
      bg: "bg-blue-50",
      description: "Instantly deploy in 50+ languages. Auto-translation ensures every customer feels at home."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      title: "Conversion Intel",
      bg: "bg-purple-50",
      description: "Deep analytics on sentiment, conversion rates, and ROI. Know exactly how much revenue AI is driving."
    }
  ];

  return (
    <section id="features" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-8">Outsmart the average bot with <span className="text-indigo-600">Pure Intelligence.</span></h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed uppercase tracking-[0.2em] text-[10px]">Everything you need to automate your digital storefront</p>
          </div>
          <div className="hidden lg:block pb-2">
             <button className="bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">Explore Documentation</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-10 rounded-[3rem] border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-100 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.08)] transition-all duration-500"
            >
              <div className={`w-16 h-16 ${feature.bg} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-100 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface Article {
  id: string;
  category: string;
  title: string;
  readTime: string;
  summary: string;
  date: string;
  author: string;
  avatar: string;
  content: string[];
}

const SOLUTIONS_DATA = [
  {
    id: "ecommerce",
    title: "E-Commerce Automation",
    subtitle: "Turn conversations into checkout lines",
    accentText: "Cart Recovery & Stock Check",
    icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
    description: "Connect your Shopify, WooCommerce, or custom ERP. The AI instantly answers pricing queries, checks local warehouse stock, recommends size options, and shares secure check-out links directly in the Facebook Messenger chat thread.",
    features: ["Instant Cart Recovery", "Live SKU Checks", "Visual Multi-Variant Cards", "In-Chat Direct Checkout"],
    chatMock: [
      { sender: "user", text: "Is the Premium Linen lawn suit in medium size and black color available in stock?" },
      { sender: "bot", text: "Yes, absolutely! **Premium Linen Lawn Suit (Medium - Black)** is currently available in stock. \n\nPrice: **$54.90**.\n\nWould you like me to share the secure checkout link or provide more product specifications?" },
      { sender: "user", text: "Yes, check it out and share the link please." },
      { sender: "bot", text: "Perfect! 🛍️ I have generated a checkout cart link for you. Click the button below to complete your order:\n\n*Secure checkout via Stripe / Lemon Squeezy.*" }
    ]
  },
  {
    id: "leadgen",
    title: "Qualified Lead Generation",
    subtitle: "24/7 lead capture while you sleep",
    accentText: "CASUAL CRM INJECTOR",
    icon: <Zap className="w-5 h-5 text-emerald-600" />,
    description: "Instead of directing Facebook ad Traffic to boring landing pages, direct them straight to Messenger. Our Gemini-backed conversational engine qualifies prospects, gathers their business metrics, captures verified info, and syncs immediately to HubSpot or Salesforce.",
    features: ["Smart Form-less qualifying", "Phone & Email regex validation", "Automatic calendar booking", "Direct CRM sync"],
    chatMock: [
      { sender: "user", text: "I am looking to book a real estate consultation. What are your pricing brackets?" },
      { sender: "bot", text: "I can absolutely assist you with listing brackets! To match you with the right specialist group:\n\nCould you please share your preferred location and approximate design budget (e.g. $100k - $250k)?" },
      { sender: "user", text: "Downtown area, budget around $300k." },
      { sender: "bot", text: "Excellent choice! Downtown is seeing premier growth. 🏡 I have matched you with our Elite Segment executive. Let's schedule a brief 10-min Google Meet call.\n\nPlease share your phone number so we can register your appointment:" }
    ]
  },
  {
    id: "support",
    title: "24/7 Customer Support",
    subtitle: "Deflect 85% of inbound tickets instantly",
    accentText: "HUMAN HANDOVER COMPLIANT",
    icon: <Shield className="w-5 h-5 text-blue-600" />,
    description: "No more waiting hours for an agent response. AI handles standard FAQs about refunds, order tracking status, shipping delays, and office hours. If a customer is frustrated, the bot automatically flags a support agent via Meta Handover.",
    features: ["NLP Intent Detection", "Meta Handover Protocol", "Sentiment Analysis tracking", "Dynamic PDF Knowledge Base Base"],
    chatMock: [
      { sender: "user", text: "My refund hasn't arrived yet, it has been 3 days." },
      { sender: "bot", text: "I am very sorry for the delayed status check! 😔\n\nPlease share your **Order ID** (such as #MESS-1049) so that I can look up the real-time transaction API." },
      { sender: "user", text: "My order is #MESS-8842" },
      { sender: "bot", text: "Thank you! I have checked Order #MESS-8842. The refund is approved and has been dispatched from our end. It will credit to your local bank account in **24-48 hours**." }
    ]
  },
  {
    id: "hosting",
    title: "Vercel & Domain Deployments",
    subtitle: "Zero latency webhooks globally",
    accentText: "SELF HOSTED / CLOUD RUN SUPPORT",
    icon: <Command className="w-5 h-5 text-slate-900" />,
    description: "Are you uploading this code onto Vercel, VPS, or Cloud Run containers? Perseus Bot is completely optimized for custom domain mapping, providing secure SSL handshakes, and bypassing standard IP blockades so authentication works flawlessly without blank screens.",
    features: ["Custom Domain mapping", "SMTP Relay Fallback support", "Vercel edge functions ready", "Bypass trial-IP limitations"],
    chatMock: [
      { sender: "user", text: "I deployed the app to Vercel but the validation email is not arriving?" },
      { sender: "bot", text: "This common issue happens when custom host variables, secure DB access rules, or standard SMTP server parameters are unconfigured.\n\nSolution: Map **SMTP_HOST**, **SMTP_PORT**, **SMTP_PASS**, and **FIREBASE_PROJECT_ID** in your `.env`. Otherwise, system-simulated code warnings automatically launch as sandboxed safe fallbacks." }
    ]
  }
];

const ARTICLES_DATA: Article[] = [
  {
    id: "vercel-smtp-guide",
    category: "Deployment",
    title: "Hosting & SMTP Guide: Solving 'Verification Code' & SMTP Issues on Custom domains",
    readTime: "6 min read",
    summary: "A step-by-step masterclass on fixing authentication mail dispatches, custom domain mapping, and database permission blockages when migrating your app from local sandbox to Vercel/VPS.",
    date: "May 23, 2026",
    author: "Ahsan Shabbir (SecOps Lead)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    content: [
      "## Introduction to Production Deployments",
      "During early development phases within local sandboxes, server actions run with zero outbound blockers. However, when you deploy your Perseus Bot package onto Vercel, Cloud Run, or custom domains, strict firewall architectures, mail relay blockades, or database security permissions may intercept outbound requests, resulting in 'Failed to send verification code' errors or completely blank registration screens. This guide addresses how to resolve these quickly.",
      "### 1. Connecting SMTP Mail Server correctly (No Redundant Blocks)",
      "Vercel serves code in serverless functions. These functions are transient and shut down within seconds if mail processing hangs. To ensure verification codes dispatch instantly, always construct a robust, authenticated SMTP relay:",
      "```env\n# Required SMTP credentials inside Vercel Dashboard Environment Variables\nSMTP_HOST=smtp.gmail.com (or your private mail relay)\nSMTP_PORT=465\nSMTP_USER=marketing@yourdomain.com\nSMTP_PASS=xxxx xxxx xxxx xxxx (App-specific-password for Gmail)\nFROM_EMAIL=\"Perseus Bot Support\" <noreply@yourdomain.com>\n```\nNever expose raw, plain password texts or rely on standard, non-secured ports such as 25 (Vercel outright blocks unencrypted traffic on Port 25). Use SSL security on Port 465 or TLS on 587.",
      "### 2. Solving 'Blank Register Screens' causing by IP Abuse Locks",
      "By default, standard software code prevents spam bot registration. To do this, it validates the request IP. However, Vercel hosts all your APIs under shared global server IPs. As a result, the backend thinks multiple registrations are coming from 'one machine' and registers a trial abuse blockade! We have resolved this inside our updated code by bypassing strict IP checks in development layouts, but for production, ensure to define your **FIREBASE_PROJECT_ID** and connect standard security credentials.",
      "### 3. Enabling Firebase Firestore Console API rules",
      "If you receive 'Permission Denied: Cloud Firestore API has not been used' errors in your console, this simply means Google Firestore database was not activated inside your Firebase Console yet. Follow these simple steps:",
      "#### Step 3.1: Visit Firebase Console",
      "Go to https://console.firebase.google.com and open your specific project 'Perseus Bot'.",
      "#### Step 3.2: Create Database in Firestore",
      "Click on 'Firestore Database' under the Build menu, and click 'Create Database'. Select 'Start in Test Mode' during early sandbox trials, then set locations nearest to your customers (e.g. us-central or asia-southeast). Click Enable.",
      "#### Step 3.3: Map configuration variables",
      "Map your environment variables inside your production host dashboard (`FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc.), then trigger `restart_dev_server` or redeploy."
    ]
  },
  {
    id: "khaadi-case-study",
    category: "Case Study",
    title: "Scaling Retail Workflows: How Pakistan's Top Brand Handled 50,000+ Daily Chat Logs",
    readTime: "8 min read",
    summary: "Discover how Pakistan's leading fashion lifestyle retailer automated summer launch queries with 94.2% semantic correctness and streamlined orders using our Gemini 1.5 core schema.",
    date: "May 20, 2026",
    author: "Zainab Malik",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: [
      "## The Challenge: Flash Sales & Support Congestions",
      "During seasonal flash sales, Retail networks face extreme congestion. Customer support lines become backlogged instantly with basic repeated questions like 'Price?', 'Size available?', or 'DHA outlet open?'. For Pakistani lifestyle brand Khaadi, average response wait times on peak sales days spiked past 4 hours.",
      "### The Solution: Gemini-Powered Webhook Orchestration",
      "By deploying Perseus Bot across Khaadi’s primary commercial page hubs, the brand transitioned from manual ticketing to real-time conversational fulfillment. Our engine reads incoming message blocks, consults real-time inventory databases, and crafts customized localized replies.",
      "### Key Achievements Matrix",
      "1. **82% Customer Deflection**: Standard pricing, stock lookups, and sizing guides are answered instantly within 1.2 seconds, completely freeing up human agents.\n2. **Handover Protocol**: When customers requested returns, custom size complaints, or complex pricing issues, the AI handed control back to a physical customer representative back of house seamlessly using Meta Developer hooks.\n3. **35% Conversion Boost**: Prompting the client towards directly mapping pre-filled checkout carts boosted conversions from casual questions to checkouts."
    ]
  },
  {
    id: "webhook-handover-tutorial",
    category: "Developer Manual",
    title: "Mastering Facebook Page Webhooks and Messenger Handover Protocol",
    readTime: "5 min read",
    summary: "A technical walkthrough of configuring Page Subscriptions, SSL handshakes, Page Access Tokens, and secondary hub controls inside Meta's Developer Dashboard.",
    date: "May 18, 2026",
    author: "Hamza Farooq",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: [
      "## Understanding Facebook Page Webhooks",
      "Webhooks are the medium through which Facebook sends real-time message events to your custom Node.js server. If webhooks are not configured securely, your bot is essentially blind.",
      "### Verification Handshake",
      "When registering a webhook URL inside developers.facebook.com, Meta dispatches a GET request with a verification string. Your endpoint must match that verification string instantly to complete the security circle.",
      "```typescript\n// Secure verification handshake endpoint\napp.get('/api/webhook', (req, res) => {\n  const mode = req.query['hub.mode'];\n  const token = req.query['hub.verify_token'];\n  const challenge = req.query['hub.challenge'];\n\n  if (mode && token === process.env.FB_VERIFY_TOKEN) {\n    return res.status(200).send(challenge);\n  }\n  res.sendStatus(403);\n});\n```",
      "### Configuring Page Access Tokens",
      "For your server to post reply messages back to Facebook Messenger, you must generate a permanent Page Access Token. Do this by linking your Facebook Page to your developer app, ensuring you request `messages`, `messaging_postbacks`, and `pages_messaging` scopes. Mount this token on your `.env` workspace variables to activate outbound responses."
    ]
  }
];

const SolutionsSection = () => {
  const [activeTab, setActiveTab] = useState("ecommerce");
  const selectedSolution = SOLUTIONS_DATA.find(s => s.id === activeTab) || SOLUTIONS_DATA[0];

  return (
    <section id="solutions" className="py-40 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 block">Industry Solutions</span>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter">
            Built for Real Transactions.
          </h2>
          <p className="mt-6 text-slate-500 font-medium text-lg leading-relaxed">
            Stop relying on dumb, rule-based keyword bots. Deploy AI that understands customer intent, fetches real database metrics, and boosts conversions.
          </p>
        </div>

        {/* Tab Buttons bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 lg:mb-24">
          {SOLUTIONS_DATA.map(sol => (
            <button
              key={sol.id}
              onClick={() => setActiveTab(sol.id)}
              className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === sol.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-150 scale-105" : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-350"}`}
            >
              {sol.title}
            </button>
          ))}
        </div>

        {/* Interactive Industry layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Details text */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              {selectedSolution.icon}
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{selectedSolution.accentText}</span>
            </div>
            
            <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
              {selectedSolution.subtitle}
            </h3>
            
            <p className="text-slate-500 font-medium leading-relaxed">
              {selectedSolution.description}
            </p>

            <ul className="space-y-4 pt-4 border-t border-slate-200">
              {selectedSolution.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-black text-slate-800 uppercase tracking-wider">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Check className="w-3 h-3" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Chat Mockup Simulator */}
          <div className="lg:col-span-7 bg-white rounded-[3.5rem] border border-slate-200 shadow-[0_50px_100px_-20px_rgba(30,41,59,0.06)] p-6 md:p-8 relative">
            <div className="absolute top-6 right-6 flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">GEMINI LIVE REPLIES</span>
            </div>

            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 relative">
                <Facebook className="w-6 h-6 text-white" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-tight">Messenger Agent</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online & Training</p>
              </div>
            </div>

            {/* Chat Thread */}
            <div className="space-y-4 min-h-[300px] flex flex-col justify-end">
              {selectedSolution.chatMock.map((chat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: chat.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className={`flex gap-3 max-w-[85%] ${chat.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {chat.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                  <div className={`p-4 rounded-3xl ${chat.sender === "user" ? "bg-slate-900 text-white rounded-tr-none text-right" : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none"} text-sm font-medium leading-relaxed whitespace-pre-wrap`}>
                    {chat.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mock input field */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
              <div className="flex-1 bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>Write response or ask anything...</span>
                <Send className="w-4 h-4 text-slate-350" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ResourcesSection = ({ onReadArticle }: { onReadArticle: (art: Article) => void }) => {
  return (
    <section id="resources" className="py-40 bg-white border-y border-slate-150 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 block">Deep Knowledge & Resources</span>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Deploy without <span className="text-indigo-600">The Fluff.</span>
            </h2>
            <p className="mt-6 text-slate-500 font-medium text-lg leading-relaxed">
              Read through our deep developer logs, real-world deployment manuals, case studies, and configuration blueprints. Complete functional coverage.
            </p>
          </div>
          <div className="shrink-0 flex gap-4">
            <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-black text-xs uppercase tracking-widest px-8 py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2">
              <Facebook className="w-4 h-4" /> Firebase console
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTICLES_DATA.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50/50 rounded-[3rem] border border-slate-200/50 overflow-hidden hover:bg-white hover:border-slate-300 hover:shadow-[0_45px_90px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col group p-2"
            >
              <div className="p-8 pb-10 flex-1">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                    {art.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {art.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                  {art.title}
                </h3>

                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                  {art.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <img src={art.avatar} alt={art.author} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md shadow-slate-200" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-900 leading-tight">{art.author}</p>
                    <p className="text-[9px] font-bold text-slate-400">{art.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => onReadArticle(art)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 hover:bg-indigo-600 hover:text-white border border-slate-100 hover:border-indigo-600 transition-all shadow-sm active:scale-90"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArticleReader = ({ article, onClose }: { article: Article, onClose: () => void }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white relative z-50 pt-28 pb-40 font-sans text-slate-800"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Back control */}
        <button 
          onClick={onClose}
          className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all mb-12 border border-slate-200 hover:border-indigo-100 px-6 py-3 rounded-xl bg-white shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>

        {/* Article header */}
        <div className="space-y-6 mb-16 pb-12 border-b border-slate-100">
          <div className="inline-flex items-center gap-3 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
            {article.category}
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
            {article.title}
          </h1>

          <p className="text-slate-500 font-medium text-lg lg:text-xl leading-relaxed">
            {article.summary}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <img src={article.avatar} alt={article.author} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-50 shadow-md" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900">{article.author}</p>
              <p className="text-[10px] font-bold text-slate-400">{article.date} &bull; {article.readTime}</p>
            </div>
          </div>
        </div>

        {/* Article Body Content */}
        <article className="prose prose-indigo max-w-none space-y-8 font-medium text-slate-600 leading-relaxed text-base lg:text-lg">
          {article.content.map((block, idx) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={idx} className="text-2xl lg:text-4xl font-black text-slate-950 mt-16 mb-6 tracking-tight leading-none pt-4 select-none">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            if (block.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-xl lg:text-2xl font-black text-slate-900 mt-10 mb-5 tracking-tight uppercase tracking-widest text-[11px]">
                  {block.replace("### ", "")}
                </h3>
              );
            }
            if (block.startsWith("#### ")) {
              return (
                <h4 key={idx} className="text-lg font-black text-slate-900 mt-8 mb-3 tracking-normal">
                  {block.replace("#### ", "")}
                </h4>
              );
            }
            if (block.startsWith("```")) {
              const codeLines = block.split("\n").filter(l => !l.startsWith("```"));
              return (
                <div key={idx} className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-x-auto border border-white/5 shadow-2xl relative my-8">
                  <div className="absolute top-3 right-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">ENV MATRIX</div>
                  <pre>{codeLines.join("\n")}</pre>
                </div>
              );
            }
            if (block.startsWith("1. ") || block.startsWith("- ")) {
              const listItems = block.split("\n");
              return (
                <ul key={idx} className="space-y-4 my-6 pl-6 list-disc marker:text-indigo-600">
                  {listItems.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-slate-600 font-medium">
                      {item.replace(/^- |^\d+\.\s*/, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-slate-600 leading-loose">
                {block}
              </p>
            );
          })}
        </article>

        {/* Read Next CTA */}
        <div className="mt-24 p-12 bg-indigo-600 rounded-[3.5rem] text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl lg:text-5xl font-black mb-6 tracking-tight">Verify & Automate Your Pages Now</h2>
            <p className="text-indigo-100 text-sm max-w-md mx-auto mb-10 font-bold uppercase tracking-widest">Connect with SMTP, build rules, and let Gemini answer on Facebook Facebook.</p>
            <button 
              onClick={onClose}
              className="bg-white text-indigo-600 px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-2xl shadow-indigo-900/50"
            >
              Start Sync Dashboard
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Footer = ({ 
  onPrivacyClick, 
  onTermsClick, 
  onDeletionClick, 
  onSupportClick 
}: { 
  onPrivacyClick: () => void; 
  onTermsClick: () => void; 
  onDeletionClick: () => void; 
  onSupportClick: () => void; 
}) => {
  return (
    <footer className="bg-slate-900 text-slate-500 py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-indigo-600 rounded-xl">
                 <Facebook className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-sans">Perseus<span className="text-indigo-400"> Bot</span></span>
            </div>
            <p className="max-w-md text-slate-400 font-medium leading-loose">
              Perseus Bot is the enterprise-grade automation platform building the future of customer interaction on Facebook Messenger. Intelligence, delivered at scale.
            </p>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Product</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li><a href="/privacy" onClick={(e) => { e.preventDefault(); onPrivacyClick(); }} className="hover:text-indigo-400 hover:underline transition-all text-left block cursor-pointer">Privacy Policy</a></li>
              <li><a href="/terms" onClick={(e) => { e.preventDefault(); onTermsClick(); }} className="hover:text-indigo-400 hover:underline transition-all text-left block cursor-pointer">Terms & Conditions</a></li>
              <li><a href="/deletion" onClick={(e) => { e.preventDefault(); onDeletionClick(); }} className="hover:text-amber-400 hover:underline transition-all text-left block cursor-pointer">Data Deletion</a></li>
              <li><a href="/faq-support" onClick={(e) => { e.preventDefault(); onSupportClick(); }} className="hover:text-indigo-400 hover:underline transition-all text-left block cursor-pointer">FAQ & Help Desk</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Support Desk</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li><a href="/faq-support" onClick={(e) => { e.preventDefault(); onSupportClick(); }} className="hover:text-indigo-400 hover:underline text-left block cursor-pointer">Submit Support Ticket</a></li>
              <li><a href="/deletion" onClick={(e) => { e.preventDefault(); onDeletionClick(); }} className="hover:text-red-400 hover:underline text-left block cursor-pointer">Platform Data Deletion</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Developer Status</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-30">&copy; 2026 Perseus Bot Automation. All rights reserved.</span>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest">
             <a href="/privacy" onClick={(e) => { e.preventDefault(); onPrivacyClick(); }} className="hover:text-white transition-colors cursor-pointer uppercase font-black text-[10px] tracking-widest">Privacy Policy</a>
             <a href="/terms" onClick={(e) => { e.preventDefault(); onTermsClick(); }} className="hover:text-white transition-colors cursor-pointer uppercase font-black text-[10px] tracking-widest">Terms & Conditions</a>
             <a href="/deletion" onClick={(e) => { e.preventDefault(); onDeletionClick(); }} className="hover:text-red-400 transition-colors cursor-pointer uppercase font-black text-[10px] tracking-widest">Delete Data</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onDeletionClick: () => void;
  onSupportClick: () => void;
}

export default function LandingPage({ 
  onSignIn, 
  onSignUp,
  onPrivacyClick,
  onTermsClick,
  onDeletionClick,
  onSupportClick
}: LandingPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
        <Navbar onAuthClick={onSignIn} />
        <ArticleReader 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
        <Footer 
          onPrivacyClick={onPrivacyClick} 
          onTermsClick={onTermsClick} 
          onDeletionClick={onDeletionClick} 
          onSupportClick={onSupportClick} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Navbar onAuthClick={onSignIn} />
      <main>
        <Hero onCtaClick={onSignUp} />
        
        {/* Logo Cloud - Premium Style */}
        <div className="py-24 border-y border-slate-50 bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12 text-center">Processing messages for hyper-growth teams</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
               <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">TECHFLOW</span>
               <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">STELAR</span>
               <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">LUMINA</span>
               <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">OXYGEN</span>
               <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">KINETIC</span>
            </div>
          </div>
        </div>

        <FeatureSection />

        {/* Dynamic Solutions Section */}
        <SolutionsSection />

        {/* Dynamic CTA */}
        <section className="py-40 px-6">
          <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[4rem] p-12 lg:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_-20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center mb-10 backdrop-blur-xl ring-1 ring-white/30">
                   <Zap className="w-10 h-10 text-white fill-white" />
                </div>
                <h2 className="text-4xl lg:text-7xl font-black text-white mb-10 tracking-tighter leading-[0.95]">Automate your growth. <br /> Start free today.</h2>
                <p className="text-indigo-100 text-lg lg:text-xl mb-12 max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-widest text-[10px]">Zero credit card required. Sync in 60 seconds.</p>
                <button 
                  onClick={onSignUp}
                  className="bg-white text-indigo-600 px-12 py-7 rounded-[2rem] text-sm lg:text-base font-black hover:bg-slate-900 hover:text-white transition-all shadow-2xl shadow-indigo-900/50 active:scale-95 uppercase tracking-widest"
                >
                  Create Your Free Bot
                </button>
             </div>
          </div>
        </section>

        {/* Dynamic Resources Section */}
        <ResourcesSection onReadArticle={(art) => setSelectedArticle(art)} />
      </main>
      <Footer 
        onPrivacyClick={onPrivacyClick} 
        onTermsClick={onTermsClick} 
        onDeletionClick={onDeletionClick} 
        onSupportClick={onSupportClick} 
      />
    </div>
  );
}
