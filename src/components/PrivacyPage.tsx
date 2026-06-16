import React from 'react';
import { Shield, ArrowLeft, Lock, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyPageProps {
  onBack: () => void;
}

export default function PrivacyPage({ onBack }: PrivacyPageProps) {
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
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">META PLATFORM COMPLIANT DEVELOPE ACCREDITED DATA PROTECTION MODEL</p>
            </div>
          </div>

          <div className="text-slate-600 space-y-6 text-sm leading-relaxed font-normal">
            <p className="text-slate-550 leading-relaxed font-semibold mb-6">
              Welcome to the Perseus Bot Privacy Policy. Securely handling and protecting the privacy of our registered enterprise administrators, general users, and automated messaging contacts is our highest operating priority. This document provides a highly transparent, fully detailed English disclosure of our technical architecture, standard data collection processes, system storage guidelines, and automated model interaction pathways. This document has been compiled specifically to satisfy active developer requirements of Meta Platforms Inc., the European Union General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).
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
                We maintain a strict zero-sharing commitment. Perseus Bot does not offer, sell, trade, or transfer any private user identification data, administrative settings, or messenger chat histories to advertising firms, tracking agencies, or third-party marketing companies. Data is processed strictly within secure Cloud Run server instances and Firebase database partitions configured inside enterprise Google Cloud resources.
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

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-6 leading-relaxed text-xs text-slate-500 font-semibold flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                For any inquiries concerning compliance verification, information processing models, CCPA rights, or specific privacy audits, please direct your message to our Global Protection Compliance Desk at <span className="text-indigo-650 font-black underline">compliance@perseusbot.com</span>. We guarantee an official reply to all regulatory and customer support submissions within twenty-four (24) business hours.
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
