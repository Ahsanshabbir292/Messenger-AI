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
import LegalPages from './components/LegalPages';

type ViewMode = 'landing' | 'signin' | 'signup' | 'dashboard' | 'legal';

export default function App() {
  const [view, setView] = useState<ViewMode>('landing');
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'deletion' | 'faq-support'>('privacy');
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
      setView('signup');
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
          setView('dashboard');
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
              setView('dashboard');
              setLoading(false);
              return;
            }
          } catch (e) {}
        }

        // Not logged in or error
        const savedView = localStorage.getItem('app_view') as ViewMode;
        if (savedView === 'dashboard') {
           setView('landing'); // Force back to landing if session is gone
        } else {
           setView(savedView || 'landing');
        }
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [appUser?.email]);

  const updateView = (newView: ViewMode) => {
    setView(newView);
    localStorage.setItem('app_view', newView);
  };

  const goToLanding = () => updateView('landing');
  const goToSignIn = () => updateView('signin');
  const goToSignUp = () => updateView('signup');
  const goToLegal = (tab: 'privacy' | 'terms' | 'deletion' | 'faq-support') => {
    setLegalTab(tab);
    updateView('legal');
  };
  const handleLoginSuccess = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setAppUser(res.data.user);
      if (res.data.user) {
        localStorage.setItem('current_app_user', JSON.stringify(res.data.user));
        axios.defaults.headers.common['x-user-email'] = res.data.user.email;
      }
      updateView('dashboard');
    } catch (err) {
      updateView('dashboard');
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

      {view === 'legal' && (
        <LegalPages 
          initialTab={legalTab} 
          onBack={goToLanding} 
          currentUserEmail={appUser?.email}
          onLogout={handleLogout}
        />
      )}

      {view !== 'dashboard' && <ChatWidget />}
    </>
  );
}
