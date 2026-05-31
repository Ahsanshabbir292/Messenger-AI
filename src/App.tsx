/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/ChatWidget';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import DeletionPage from './components/DeletionPage';
import SupportFAQPage from './components/SupportFAQPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

type ViewMode = 'landing' | 'signin' | 'signup' | 'dashboard' | 'privacy' | 'terms' | 'deletion' | 'faq-support' | 'about' | 'contact';

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
      if (appUser?.email) {
        axios.defaults.headers.common['x-user-email'] = appUser.email;
      }
      try {
        const res = await axios.get('/api/auth/me', {
          params: appUser?.email ? { email: appUser.email } : undefined
        });
        if (res.data.user) {
          setAppUser(res.data.user);
          localStorage.setItem('current_app_user', JSON.stringify(res.data.user));
          axios.defaults.headers.common['x-user-email'] = res.data.user.email;
          if (currentPath === '/' || currentPath === '/signin' || currentPath === '/signup') {
            navigateTo('/dashboard');
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
                navigateTo('/dashboard');
              }
              setLoading(false);
              return;
            }
          } catch (e) {}
        }

        // If trying to access protected dashboard, redirect to signin
        if (currentPath === '/dashboard') {
          navigateTo('/signin');
        }
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [appUser?.email, currentPath]);

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
      navigateTo('/dashboard');
    } catch (err) {
      navigateTo('/dashboard');
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
  if (currentPath === '/signin') {
    view = 'signin';
  } else if (currentPath === '/signup') {
    view = 'signup';
  } else if (currentPath === '/dashboard') {
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
    <>
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
        <Dashboard onLogout={handleLogout} appUser={appUser} />
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

      {view !== 'dashboard' && <ChatWidget />}
    </>
  );
}
