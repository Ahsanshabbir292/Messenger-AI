import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Terminal, Zap, Shield, BarChart3, ChevronRight, Globe, Github, Twitter, Linkedin, Menu, X, Check, ArrowRight, Play, Sparkles, Facebook, Star, Layers, Command } from 'lucide-react';
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
              Messenger<span className="text-indigo-600">AI</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Solutions', 'Resources', 'Pricing'].map((item) => (
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
              {['Features', 'Solutions', 'Resources', 'Pricing'].map((item) => (
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
            
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-500 mb-12 font-medium leading-relaxed">
              Deploy hyper-intelligent AI agents directly to your Facebook Pages. Automate support, drive high-intent leads, and close deals while you sleep.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onCtaClick}
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-6 rounded-[2rem] text-sm lg:text-base font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.2)] hover:shadow-indigo-200 active:scale-95 group uppercase tracking-widest"
              >
                Sync Your First Page
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-10 py-6 text-slate-600 font-black text-sm lg:text-base uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 border-2 border-slate-100 rounded-[2rem] hover:bg-slate-50 active:scale-95">
                <Play className="w-4 h-4 fill-slate-400" /> Watch Demo
              </button>
            </div>

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

const Pricing = ({ onSignUp }: { onSignUp: () => void }) => {
  return (
    <section id="pricing" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 block">Pricing Plans</span>
           <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter">Scale with Certainty.</h2>
           <p className="mt-6 text-slate-500 font-medium max-w-xl mx-auto">No hidden fees. Every plan includes our core intelligence engine.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {[
            { 
              name: 'Builder', 
              price: '0', 
              features: ['30 Messenger Messages/mo', '3 Facebook Pages Sync', 'Community Support', 'Basic Bot Templates'],
              theme: 'bg-white border-slate-100'
            },
            { 
              name: 'Accelerator', 
              price: '49', 
              features: ['Unlimited Messages', '10 Facebook Pages Manage', 'Priority Support', 'Advanced Analytics', 'Custom Integrations'],
              theme: 'bg-slate-900 text-white shadow-2xl scale-110 relative z-10'
            },
            { 
              name: 'Enterprise', 
              price: 'Custom', 
              features: ['Unlimited Pages', 'Full White-labeling', 'Dedicated Account Executive', 'Custom AI Training', 'SLA Guarantee'],
              theme: 'bg-white border-slate-100'
            }
          ].map((plan, idx) => (
            <div key={idx} className={`p-12 rounded-[3.5rem] border ${plan.theme} relative overflow-hidden group`}>
              {idx === 1 && <div className="absolute top-0 right-0 bg-indigo-600 text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl">Most Chosen</div>}
              
              <h3 className={`text-xl font-black mb-10 ${idx === 1 ? 'text-indigo-400' : 'text-slate-900'}`}>{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-12">
                <span className="text-6xl font-black tracking-tight">{plan.price === 'Custom' ? 'Custom' : `$${plan.price}`}</span>
                {plan.price !== 'Custom' && <span className={`text-sm font-bold opacity-50 ml-2`}>/mo</span>}
              </div>
              
              <ul className="space-y-5 mb-12">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest leading-loose">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${idx === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                       <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={onSignUp}
                className={`w-full py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${idx === 1 ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-indigo-600'} active:scale-95`}
              >
                {idx === 2 ? 'Meet with Strategy' : 'Start with ' + plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
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
              <span className="text-2xl font-black text-white tracking-tight">Messenger<span className="text-indigo-400">AI</span></span>
            </div>
            <p className="max-w-md text-slate-400 font-medium leading-loose mb-10">
              MessengerAI is the enterprise-grade automation platform building the future of customer interaction on Facebook Messenger. Intelligence, delivered at scale.
            </p>
            <div className="flex gap-6">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                 <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                    <Icon className="w-5 h-5 transition-transform" />
                 </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Product</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li><button onClick={onPrivacyClick} className="hover:text-indigo-400 hover:underline transition-all text-left bg-transparent border-none p-0 cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={onTermsClick} className="hover:text-indigo-400 hover:underline transition-all text-left bg-transparent border-none p-0 cursor-pointer">Terms & Conditions</button></li>
              <li><button onClick={onDeletionClick} className="hover:text-amber-400 hover:underline transition-all text-left bg-transparent border-none p-0 cursor-pointer">Data Deletion</button></li>
              <li><button onClick={onSupportClick} className="hover:text-indigo-400 hover:underline transition-all text-left bg-transparent border-none p-0 cursor-pointer">FAQ & Help Desk</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Support Desk</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li><button onClick={onSupportClick} className="hover:text-indigo-400 hover:underline text-left bg-transparent border-none p-0 cursor-pointer">Submit Support Ticket</button></li>
              <li><button onClick={onDeletionClick} className="hover:text-red-400 hover:underline text-left bg-transparent border-none p-0 cursor-pointer">Platform Data Deletion</button></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Developer Status</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-30">&copy; 2026 MessengerAI Automation. All rights reserved.</span>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest">
             <button onClick={onPrivacyClick} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 uppercase font-black text-[10px] tracking-widest">Privacy Policy</button>
             <button onClick={onTermsClick} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 uppercase font-black text-[10px] tracking-widest">Terms & Conditions</button>
             <button onClick={onDeletionClick} className="hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none p-0 uppercase font-black text-[10px] tracking-widest">Delete Data</button>
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

        <Pricing onSignUp={onSignUp} />
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
