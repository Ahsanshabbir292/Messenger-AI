import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowLeft, Send, CheckCircle, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

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
            <span className="text-xl font-black text-slate-1000 tracking-tight">
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
            <li className="text-slate-600" aria-current="page">Contact Support</li>
          </ol>
        </nav>

        <motion.div 
          id="contact-card-container"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.025)] p-8 md:p-12 space-y-12"
        >
          {/* Main Title Section */}
          <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Contact & Corporate Desk</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">META ACCREDITED SUPPORT TEAM AND PHYSICAL STATIONS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {/* Contact Details Grid Column */}
            <div className="space-y-8">
              <div className="prose prose-slate">
                <h2 className="text-slate-950 font-black text-lg uppercase tracking-wider mb-4">Official Physical Coordinates</h2>
                <p className="text-slate-550 text-sm leading-relaxed font-semibold">
                  Are you checking credentials or conducting automated corporate compliance tests? Please contact our direct physical workspace or telephone services, or use our digital compliance systems listed below:
                </p>
              </div>

              {/* Physical details tags */}
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">Corporate Address</h4>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      One Hacker Way, Menlo Park, CA 94025, United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">Telephone Hotlines</h4>
                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                      +1 (800) 555-0199 <span className="text-[9px] font-black text-indigo-500 uppercase ml-2 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100/50">TOLL FREE</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">Email Inquiries</h4>
                    <p className="text-xs text-indigo-600 font-black leading-relaxed hover:underline">
                      support@perseusbot.com
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">For GDPR compliance: compliance@perseusbot.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-6">
              <h3 className="text-slate-950 font-black text-sm uppercase tracking-wider">Send Inbound Message</h3>
              
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-sans font-black text-sm uppercase tracking-wider">Message Received</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">
                    Thank you! Your official inquiry has been assigned support ticket ID #PER-0382 and queued for desk delivery. We will respond within twenty-four (24) business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ahsan Shabbir" 
                      className="w-full text-xs font-medium bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3.5 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Business Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. developer@yourbrand.com" 
                      className="w-full text-xs font-medium bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3.5 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Message Details</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Explain your inquiry details..." 
                      className="w-full text-xs font-medium bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3.5 outline-none transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Dispatch Official Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
