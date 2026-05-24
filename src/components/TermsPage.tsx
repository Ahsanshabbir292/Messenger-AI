import React from 'react';
import { FileCheck, ArrowLeft, Lock, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsPageProps {
  onBack: () => void;
}

export default function TermsPage({ onBack }: TermsPageProps) {
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
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">SAAS MASTER SERVICE AGREEMENT AND USER CONDUCT POLICY</p>
            </div>
          </div>

          <div className="text-slate-600 space-y-6 text-sm leading-relaxed font-normal">
            <p className="text-slate-550 leading-relaxed font-semibold mb-6">
              Welcome to Perseus Bot! Please read this comprehensive Master Service Agreement and Terms of Service carefully before registering an account, integrating your business assets, or deploying automated messaging agents. By establishing a user account, authenticating through our landing interfaces, or synchronizing Facebook Page tokens within our dashboard, you officially acknowledge, accept, and agree to be contractually bound by these Master Terms. If you do not agree to the complete ruleset delineated herein, you are strictly prohibited from utilizing our software, accessing our interface panels, or connecting messaging channels to our system webhooks.
            </p>

            <div>
              <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">1. Permitted Use & Authorized Workspace Registration</h3>
              <p>
                To operate Perseus Bot, clean and verified coordinates are required. Each registrant warrants that they possess the legal authority to bind their enterprise, and that all inputted database variables (such as email systems, profile records, and security passphrases) are complete and accurate:
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
              <p className="mt-2 text-slate-700">
                If our Gemini AI conversation engine fails to process your webhooks, disconnects frequently due to underlying system defects, or fails to deliver the expected features within seven (7) calendar days of starting a paid subscription, you may request a refund. Contact our billing support with your order reference, and our credit compliance team will verify your claim and issue an absolute refund of your payment within 5 to 7 business days to your original payment method.
              </p>
            </div>

            <div>
              <h3 className="text-slate-950 font-black text-base uppercase tracking-wider mb-2">5. Complete Limitation of Warranties and Liability Exclusions</h3>
              <p>
                Perseus Bot leverages server-side Generative artificial intelligence models to compile automated replies. Since models draw context estimations and natural text sequences, we do not guarantee of absolute accuracy or factual precision of AI-generated chat outputs. The platform is provided strictly "As Is" and "As Available". We disclaim all implied warranties of merchantability, specific fitness, and continuous uptime. Under no conditions shall Perseus Bot, its underlying developers, or server partners be held liable for commercial loss, customer dissatisfaction, revenue reductions, or Meta developer access suspensions resulting from the deployment, behavior, or actions of your connected AI bot.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
