/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert } from 'lucide-react';

const LandingPage = React.lazy(() => import('./components/LandingPage'));
const AuthPage = React.lazy(() => import('./components/AuthPage'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ChatWidget = React.lazy(() => import('./components/ChatWidget'));
const PrivacyPage = React.lazy(() => import('./components/PrivacyPage'));
const TermsPage = React.lazy(() => import('./components/TermsPage'));
const DeletionPage = React.lazy(() => import('./components/DeletionPage'));
const SupportFAQPage = React.lazy(() => import('./components/SupportFAQPage'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const ContactPage = React.lazy(() => import('./components/ContactPage'));
const AdminPage = React.lazy(() => import('./components/AdminPage'));

type ViewMode = 'landing' | 'signin' | 'signup' | 'dashboard' | 'privacy' | 'terms' | 'deletion' | 'faq-support' | 'about' | 'contact' | 'admin';

const DASHBOARD_TABS = ['overview', 'pages', 'chat', 'audience', 'broadcast', 'analytics', 'team', 'billing', 'settings'];

const isDashboardRoute = (path: string) => {
  if (path === '/dashboard') return true;
  const segment = path.replace(/^\//, '').split('/')[0];
  return DASHBOARD_TABS.includes(segment);
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [inviteData, setInviteData] = useState<any>(null);
  const [appUser, setAppUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('current_app_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          axios.defaults.headers.common['x-user-email'] = parsed.email;
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse saved user", e);
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Synchronize state with history PopState (back/forward browser buttons)
  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Professional Dynamic Title & Meta Description Synchronization (optimized routing SEO)
  React.useEffect(() => {
    const metaDescriptions: Record<string, { title: string; desc: string }> = {
      '/': {
        title: 'Perseus Bot | Enterprise Facebook Messenger Automation',
        desc: 'Perseus Bot is an enterprise-grade platform for Facebook Messenger automation, dynamic broadcasting, real-time customer chat engagement, and analytics.'
      },
      '/signin': {
        title: 'Sign In | Perseus Bot',
        desc: 'Log in to your Perseus Bot admin panel to manage connected Facebook pages, trigger broadcasts, review chats, and optimize your customer outreach.'
      },
      '/signup': {
        title: 'Sign Up & Register | Perseus Bot',
        desc: 'Create a new Perseus Bot account today to unlock powerful bulk Messenger broadcasting, live customer support channels, and interactive flow automations.'
      },
      '/privacy': {
        title: 'Privacy Policy | Perseus Bot',
        desc: 'Read the Perseus Bot Privacy Policy. Our commitment to securing data, privacy, and compliant Facebook Messenger messaging interactions.'
      },
      '/terms': {
        title: 'Terms of Service | Perseus Bot',
        desc: 'Review Perseus Bot\'s Terms of Service for administrative accounts, billing policies, user codes of conduct, and automated messenger compliance.'
      },
      '/deletion': {
        title: 'Data Deletion Request | Perseus Bot',
        desc: 'Submit a request to delete system data, Facebook authorization tokens, and personal administrative accounts in accordance with GDPR and CCPA policies.'
      },
      '/faq-support': {
        title: 'Support & FAQs | Perseus Bot',
        desc: 'Get support for Perseus Bot, answer FAQs about broadcasting limitations, and manage tickets or help guidelines.'
      },
      '/about': {
        title: 'About Us | Perseus Bot',
        desc: 'Learn about the mission, features, security protocols, and enterprise reliability behind Perseus Bot\'s automation framework.'
      },
      '/contact': {
        title: 'Contact Us | Perseus Bot',
        desc: 'Reach out to the Perseus Bot team for custom enterprise plans, integrations, technical help, or sales inquiries.'
      },
      '/admin': {
        title: 'Super Admin Portal | Perseus Bot',
        desc: 'Access the Perseus Bot administrative management console to oversee system logs, manage active directories, and set system broadcasts.'
      }
    };

    let matched = metaDescriptions[currentPath];
    if (!matched && isDashboardRoute(currentPath)) {
      const segment = currentPath.replace(/^\//, '').split('/')[0];
      const capitalized = segment.charAt(0).toUpperCase() + segment.slice(1);
      matched = {
        title: `${capitalized} Dashboard | Perseus Bot`,
        desc: `Manage your workspace ${segment} functions, review real-time connected Facebook pages, page subscribers, and active campaigns in our high-speed panel.`
      };
    }

    const info = matched || metaDescriptions['/'];
    document.title = info.title;

    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute('content', info.desc);
  }, [currentPath]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get('invite_token');
    const email = params.get('email');
    const name = params.get('name');
    const inviter = params.get('inviter');
    const role = params.get('role');
    
    if (inviteToken && email) {
      setInviteData({
        token: inviteToken,
        email: email,
        name: name || '',
        inviter: inviter || '',
        role: role || 'member'
      });
      navigateTo('/signup');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  React.useEffect(() => {
    const checkSession = async () => {
      let emailParam = undefined;
      try {
        const saved = localStorage.getItem('current_app_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.email) {
            emailParam = parsed.email;
            axios.defaults.headers.common['x-user-email'] = parsed.email;
          }
        }
      } catch (e) {}

      try {
        const res = await axios.get('/api/auth/me', {
          params: emailParam ? { email: emailParam } : undefined
        });
        if (res.data.user) {
          setAppUser(res.data.user);
          localStorage.setItem('current_app_user', JSON.stringify(res.data.user));
          axios.defaults.headers.common['x-user-email'] = res.data.user.email;
          if (currentPath === '/' || currentPath === '/signin' || currentPath === '/signup') {
            navigateTo('/overview');
          }
        }
      } catch (err) {
        // Fallback: check if we have a robust local storage user we can trust
        const saved = localStorage.getItem('current_app_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.email) {
              setAppUser(parsed);
              axios.defaults.headers.common['x-user-email'] = parsed.email;
              if (currentPath === '/' || currentPath === '/signin' || currentPath === '/signup') {
                navigateTo('/overview');
              }
              setLoading(false);
              return;
            }
          } catch (e) {}
        }

        // If trying to access protected dashboard, redirect to signin
        if (isDashboardRoute(currentPath) || currentPath === '/admin') {
          navigateTo('/signin');
        }
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  React.useEffect(() => {
    if (!loading) {
      if (!appUser && (isDashboardRoute(currentPath) || currentPath === '/admin')) {
        navigateTo('/signin');
      }
    }
  }, [currentPath, appUser, loading]);

  const goToLanding = () => navigateTo('/');
  const goToSignIn = () => navigateTo('/signin');
  const goToSignUp = () => navigateTo('/signup');
  const goToLegal = (tab: 'privacy' | 'terms' | 'deletion' | 'faq-support' | 'about' | 'contact' | 'checkout') => {
    navigateTo(`/${tab}`);
  };
  const handleLoginSuccess = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setAppUser(res.data.user);
      if (res.data.user) {
        localStorage.setItem('current_app_user', JSON.stringify(res.data.user));
        axios.defaults.headers.common['x-user-email'] = res.data.user.email;
      }
      navigateTo('/overview');
    } catch (err) {
      navigateTo('/overview');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {}
    localStorage.removeItem('current_app_user');
    delete axios.defaults.headers.common['x-user-email'];
    setAppUser(null);
    goToLanding();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Derive active view mode from pathname
  let view: ViewMode = 'landing';
  if (currentPath === '/admin') {
    view = 'admin';
  } else if (currentPath === '/signin') {
    view = 'signin';
  } else if (currentPath === '/signup') {
    view = 'signup';
  } else if (isDashboardRoute(currentPath)) {
    view = 'dashboard';
  } else if (currentPath === '/privacy') {
    view = 'privacy';
  } else if (currentPath === '/terms') {
    view = 'terms';
  } else if (currentPath === '/deletion') {
    view = 'deletion';
  } else if (currentPath === '/faq-support') {
    view = 'faq-support';
  } else if (currentPath === '/about') {
    view = 'about';
  } else if (currentPath === '/contact') {
    view = 'contact';
  } else if (currentPath === '/checkout') {
    view = 'landing';
  }

  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    }>
      {view === 'landing' && (
        <LandingPage 
          onSignIn={goToSignIn} 
          onSignUp={goToSignUp} 
          onPrivacyClick={() => goToLegal('privacy')}
          onTermsClick={() => goToLegal('terms')}
          onDeletionClick={() => goToLegal('deletion')}
          onSupportClick={() => goToLegal('faq-support')}
          onAboutClick={() => goToLegal('about')}
          onContactClick={() => goToLegal('contact')}
        />
      )}
      
      {(view === 'signin' || view === 'signup') && (
        <AuthPage 
          key={view}
          initialMode={view} 
          onBack={goToLanding} 
          onLoginSuccess={handleLoginSuccess} 
          inviteData={inviteData}
          onClearInvite={() => setInviteData(null)}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard onLogout={handleLogout} appUser={appUser} currentPath={currentPath} navigateTo={navigateTo} onUserUpdate={setAppUser} />
      )}

      {view === 'privacy' && (
        <PrivacyPage onBack={goToLanding} />
      )}

      {view === 'terms' && (
        <TermsPage onBack={goToLanding} />
      )}

      {view === 'about' && (
        <AboutPage onBack={goToLanding} />
      )}

      {view === 'contact' && (
        <ContactPage onBack={goToLanding} />
      )}

      {view === 'deletion' && (
        <DeletionPage 
          onBack={goToLanding} 
          currentUserEmail={appUser?.email}
          onLogout={handleLogout}
        />
      )}

      {view === 'faq-support' && (
        <SupportFAQPage 
          onBack={goToLanding} 
          currentUserEmail={appUser?.email}
        />
      )}

      {view === 'admin' && (
        !appUser ? (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
          </div>
        ) : appUser.email !== 'ahsan.shabbir292@gmail.com' ? (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
            <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl max-w-sm text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-rose-600"></div>
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 text-red-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-black tracking-tight mb-2">Access Denied</h1>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                You do not have administrative privileges to access this control portal.
              </p>
              <button 
                onClick={() => navigateTo('/overview')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 w-full cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <AdminPage appUser={appUser} onLogout={handleLogout} navigateTo={navigateTo} />
        )
      )}

      {view !== 'dashboard' && view !== 'admin' && <ChatWidget />}
    </React.Suspense>
  );
}
