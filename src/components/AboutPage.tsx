import React from 'react';
import { User, ArrowLeft, Award, Globe, Facebook, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans selection:bg-indigo-600 selection:text-white pb-16">
      {/* Header Landmark Role */}
      <header role="banner" className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs py-5 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            id="btn-back-home"
            onClick={onBack}
            className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100 transition-all font-black text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Main Site
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Facebook className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Perseus<span className="text-indigo-600"> Bot</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Landmark Role */}
      <main role="main" className="max-w-4xl mx-auto px-6 lg:px-8 mt-12">
        {/* Breadcrumb Navigation Schema & UI Component */}
        <nav role="navigation" aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <li>
              <button onClick={onBack} className="hover:text-indigo-600 transition-colors uppercase">Home</button>
            </li>
            <li className="select-none text-slate-300">&gt;</li>
            <li className="text-slate-600" aria-current="page">About Us</li>
          </ol>
        </nav>

        <motion.div 
          id="about-card-container"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.025)] p-8 md:p-12 space-y-10"
        >
          {/* Main Title Section */}
          <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">About Perseus Bot</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">THE VISIONARY MESSENGER INTEL ENGINE & ECOSYSTEM</p>
            </div>
          </div>

          {/* About us Description */}
          <div className="text-slate-600 space-y-6 text-sm leading-relaxed font-medium">
            <p className="text-slate-600 leading-relaxed font-semibold text-base mb-6">
              Perseus Bot is built to redefine customer interactions inside Facebook Messenger. Combining the power of Google's Gemini generative AI models with direct enterprise inventory triggers, Perseus Bot converts random social media chat logs into high-converting storefront checkout lines.
            </p>

            <h2 className="text-slate-950 font-black text-lg uppercase tracking-wider mb-2">Our Mission</h2>
            <p>
              We believe conversational storefront commerce should not be bound by rigid, frustration-inducing keyword systems. By implementing a self-healing semantic pipeline, we empower corporate networks, physical retailers, and digital developers to synchronize client inquiries seamlessly with secure checkout portals, delivering 24/7 client satisfaction at fraction of the typical support desk overhead.
            </p>

            {/* Author Info / Byline Section (YMYL + Authoritativeness check) */}
            <div className="border-t border-slate-100 pt-10" id="author-byline-section">
              <h2 className="text-slate-950 font-black text-lg uppercase tracking-wider mb-6">Editorial & Technical Leadership</h2>
              
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&fm=webp" 
                  alt="Ahsan Shabbir" 
                  loading="lazy"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl object-cover border-2 border-indigo-100 shrink-0 shadow-md"
                />
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className="font-sans font-black text-lg text-slate-900 leading-tight">Ahsan Shabbir</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      <Award className="w-3.5 h-3.5" /> Founder & Lead Engineer
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    SecOps Expert & Meta Accredited Developer | BS Computer Science
                  </p>
                  
                  <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-xl">
                    With over 7 years in conversational ecommerce deployment and custom APIs, Ahsan guides the secure infrastructure, SMTP fallback layers, and cloud database integrations powering Perseus Bot globally. Under his leadership, the platform manages over 12 million monthly transactional logs with zero service downtime.
                  </p>

                  <div className="flex items-center gap-4 pt-1">
                    <a 
                      href="mailto:ahsan.shabbir292@gmail.com" 
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" /> Contact Author Bio
                    </a>
                    <span className="text-slate-350 select-none">|</span>
                    <a 
                      href="https://ai.studio/build" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-bold text-slate-400 hover:text-indigo-600 hover:underline transition-colors flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" /> Google AI Studio Developer Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
