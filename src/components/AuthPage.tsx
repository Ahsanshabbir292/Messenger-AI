import React, { useState } from 'react';
import axios from 'axios';
import { 
  Bot, Mail, Lock, Github, CheckCircle2, ArrowLeft, Facebook, 
  Sparkles, User, ShieldCheck, Eye, EyeOff, Globe, CheckCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AuthPage({ 
  initialMode = 'signin', 
  onBack, 
  onLoginSuccess,
  inviteData,
  onClearInvite
}: { 
  initialMode?: 'signin' | 'signup', 
  onBack: () => void,
  onLoginSuccess: () => void,
  inviteData?: any,
  onClearInvite?: () => void,
  key?: string // Support React.Key
}) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: inviteData?.name || '',
    email: inviteData?.email || '',
    confirmEmail: inviteData?.email || '',
    password: '',
    confirmPassword: '',
    workspaceName: ''
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (inviteData?.email) {
      setFormData({
        fullName: inviteData.name || '',
        email: inviteData.email || '',
        confirmEmail: inviteData.email || '',
        password: '',
        confirmPassword: '',
        workspaceName: ''
      });
      setMode('signup');
    }
  }, [inviteData]);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.email !== formData.confirmEmail) {
      setError("Emails do not match");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/send-verification', { 
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        workspaceName: formData.workspaceName
      });
      
      setMode('verify');
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/team/verify-and-register', { 
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        token: inviteData.token,
        role: inviteData.role
      });
      if (onClearInvite) onClearInvite();
      onLoginSuccess();
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to accept workspace invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post('/api/auth/verify-code', { 
        email: formData.email, 
        code: verificationCode 
      });
      onLoginSuccess();
    } catch (error: any) {
      setError(error.response?.data?.error || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post('/api/auth/signin', { 
        email: formData.email, 
        password: formData.password 
      });
      onLoginSuccess();
    } catch (error: any) {
      setError(error.response?.data?.error || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -ml-20 -mb-20 opacity-30" />

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-50 border border-red-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-bold text-red-900 whitespace-pre-wrap max-w-lg break-words">{error}</p>
            <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-900">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side: Brand & Visuals */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.1)_0%,transparent_50%)]" />
        
        <div className="relative z-10">
          <button onClick={onBack} className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Hub
          </button>
          
          <div className="mt-32">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                   <Facebook className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">Messenger<span className="text-indigo-500">AI</span></span>
             </div>
             <h2 className="text-5xl font-black text-white tracking-tight leading-[0.95] mb-8">Elevate your customer <br /> conversations.</h2>
             <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm italic">
                "The shift to AI-first automation has doubled our engagement rates in under 3 weeks."
             </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">SOC-2 Type II</span>
           </div>
           <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">GDPR Compliant</span>
           </div>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-20 py-20 relative z-10 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {mode === 'verify' ? (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-12">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
                    Verify Your Email.
                  </h1>
                  <p className="text-slate-500 font-bold text-sm tracking-tight leading-relaxed">
                    We've sent a unique authentication code to <span className="text-slate-900 font-black">{formData.email}</span>. Please enter it below to initialize your workspace.
                  </p>
                </div>

                <form onSubmit={handleVerifySubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Verification Code</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] px-6 text-center focus:bg-white focus:border-indigo-100 outline-none transition-all font-black text-2xl tracking-[0.5em] placeholder:tracking-normal" 
                        placeholder="000000" 
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || verificationCode.length < 6}
                    className="w-full h-16 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Verify & Complete Setup
                      </>
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <button 
                      type="button"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                      onClick={() => alert("Code resent!")}
                    >
                      Didn't receive code? Resend
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="mb-12">
                  {inviteData ? (
                    <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-5 mb-6 text-indigo-950 animate-in fade-in slide-in-from-top-4 duration-350">
                      <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-widest mb-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                        Workspace Invitation
                      </div>
                      <p className="text-[13px] font-bold text-indigo-900 leading-normal">
                        Bhai, <strong>{inviteData.inviter}</strong> has invited you to manage their workspace as a <strong>{inviteData.role.toUpperCase()}</strong>. Complete registration below to claim access.
                      </p>
                      {onClearInvite && (
                        <button 
                          type="button"
                          onClick={onClearInvite}
                          className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest mt-2 block hover:underline"
                        >
                          Cancel & Create Standalone Account
                        </button>
                      )}
                    </div>
                  ) : null}
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">
                    {mode === 'signin' ? 'Welcome Back.' : (inviteData ? 'Join Workspace' : 'Create your account')}
                  </h1>
                </div>

                <form className="space-y-6" onSubmit={mode === 'signin' ? handleSigninSubmit : (inviteData ? handleInviteSubmit : handleSignupSubmit)}>
                  {mode === 'signup' && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-[13px] font-bold text-slate-900 mb-2 block">Full name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-sm" 
                        />
                      </div>
                      
                      <div>
                        <label className="text-[13px] font-bold text-slate-900 mb-2 block">Email address</label>
                        <input 
                          type="email" 
                          required
                          disabled={!!inviteData}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed" 
                        />
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-slate-900 mb-2 block">Confirm email address</label>
                        <input 
                          type="email" 
                          required
                          disabled={!!inviteData}
                          value={formData.confirmEmail}
                          onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
                          className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed" 
                        />
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-slate-900 mb-2 block">Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={8}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-sm pr-12" 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">Minimum 8 characters</p>
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-slate-900 mb-2 block">Confirm password</label>
                        <div className="relative">
                          <input 
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-sm pr-12" 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[13px] font-bold text-slate-900 mb-2 block">Workspace name</label>
                        <input 
                          type="text" 
                          placeholder="Optional - defaults to 'Your Name's Workspace'"
                          value={formData.workspaceName}
                          onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                          className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-sm" 
                        />
                      </div>

                      {/* Turnstile Mock */}
                      <div className="bg-[#F9FAFB] border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                               <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[14px] font-bold text-slate-700">Success!</span>
                         </div>
                         <div className="text-right">
                           <div className="flex items-center gap-1">
                              <span className="text-[8px] font-black italic text-[#F38020] uppercase tracking-tighter">Cloudflare</span>
                           </div>
                           <div className="flex items-center gap-2 text-[8px] text-slate-400 font-bold">
                              <span>Privacy</span>
                              <div className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                              <span>Help</span>
                           </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {mode === 'signin' && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-[13px] font-bold text-slate-900 mb-2 block">Email address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-sm" 
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[13px] font-bold text-slate-900 block">Password</label>
                          <button type="button" className="text-blue-600 text-[11px] font-bold hover:underline">Forgot password?</button>
                        </div>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full h-12 bg-white border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-sm pr-12" 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#1d63ff] hover:bg-blue-700 text-white rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>{mode === 'signin' ? 'Sign in' : 'Sign up'}</>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-500">
                    {mode === 'signin' ? (
                      <>
                        Don't have an account? {' '}
                        <button onClick={() => setMode('signup')} className="text-blue-600 font-bold hover:underline ml-1">Sign up</button>
                      </>
                    ) : (
                      <>
                        Already have an account? {' '}
                        <button onClick={() => setMode('signin')} className="text-blue-600 font-bold hover:underline ml-1">Sign in</button>
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
