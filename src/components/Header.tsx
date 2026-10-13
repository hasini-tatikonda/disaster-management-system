import React, { useState } from 'react';
import {
  ShieldAlert,
  Globe,
  Zap,
  HelpCircle,
  Radio,
  UserCheck,
  Building2,
  PhoneCall,
  Sun,
  Moon,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResQLogo } from './ResQLogo';
import { DemoModeBadge } from './DemoModeBadge';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { BeginnerTutorialModal } from './BeginnerTutorialModal';
import { getTranslation, SUPPORTED_LANGUAGES } from '../locales/translations';
import { UserEnvironment } from '../types';

interface HeaderProps {
  activeTab?: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab = 'home', onNavigate }) => {
  const {
    activeLanguage,
    activeTheme,
    setTheme,
    emergencyMode,
    toggleEmergencyMode,
    userEnvironment,
    setUserEnvironment
  } = useApp();

  const [langModalOpen, setLangModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);

  const handleEnvChange = (env: UserEnvironment) => {
    setUserEnvironment(env);
    if (onNavigate) {
      if (env === 'citizen') onNavigate('home');
      if (env === 'control-center') onNavigate('control-center');
      if (env === 'responder') onNavigate('responder');
      if (env === 'donation-center') onNavigate('donations');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
            {/* Logo & Badge */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => handleEnvChange('citizen')}
                className="flex items-center text-left group transition-transform active:scale-98"
              >
                <ResQLogo size="md" showSubtitle={true} />
              </button>

              <span className="hidden sm:inline-block">
                <DemoModeBadge compact />
              </span>
            </div>

            {/* Desktop Navigation Environment Tabs */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => handleEnvChange('citizen')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  userEnvironment === 'citizen'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>

              <button
                onClick={() => handleEnvChange('control-center')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  userEnvironment === 'control-center'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Control Center</span>
              </button>

              <button
                onClick={() => handleEnvChange('responder')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  userEnvironment === 'responder'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Responder Portal</span>
              </button>

              <button
                onClick={() => handleEnvChange('donation-center')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  userEnvironment === 'donation-center'
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Donation Center</span>
              </button>
            </div>

            {/* Action Tools */}
            <div className="flex items-center gap-2">
              
              {/* Emergency Mode Toggle */}
              <button
                onClick={toggleEmergencyMode}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  emergencyMode
                    ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-500 ring-offset-2'
                    : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900'
                }`}
                title="Toggle High-Contrast Emergency Mode"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">EMERGENCY MODE</span>
              </button>

              {/* Simple Light / Dark Mode Toggle */}
              <button
                onClick={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-800"
                title={`Switch to ${activeTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {activeTheme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden lg:inline text-[11px] font-bold">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    <span className="hidden lg:inline text-[11px] font-bold">Dark</span>
                  </>
                )}
              </button>

              {/* Language Selector */}
              {(() => {
                const curLangObj = SUPPORTED_LANGUAGES.find(l => l.code === activeLanguage) || SUPPORTED_LANGUAGES[0];
                return (
                  <button
                    onClick={() => setLangModalOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-800 shadow-2xs"
                    title="Change Language / भाषा बदलें"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{curLangObj.nativeName}</span>
                    <span className="uppercase text-[10px] text-slate-400 font-mono font-normal">({activeLanguage})</span>
                  </button>
                );
              })()}

              {/* Tutorial Replay */}
              <button
                onClick={() => setTutorialModalOpen(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
                title="Beginner Tutorial"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Mobile Environment Selector Ribbon */}
          <div className="flex lg:hidden items-center justify-between py-1.5 border-t border-slate-100 dark:border-slate-800/60 text-xs font-medium text-slate-600 dark:text-slate-400 overflow-x-auto">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 shrink-0 mr-1">
              Portal:
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleEnvChange('citizen')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  userEnvironment === 'citizen'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => handleEnvChange('control-center')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  userEnvironment === 'control-center'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                Control Center
              </button>
              <button
                onClick={() => handleEnvChange('responder')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  userEnvironment === 'responder'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                Responder
              </button>
              <button
                onClick={() => handleEnvChange('donation-center')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  userEnvironment === 'donation-center'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}
              >
                NGO Center
              </button>
            </div>
            <div className="shrink-0 ml-2 sm:hidden">
              <DemoModeBadge compact />
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <LanguageSelectorModal isOpen={langModalOpen} onClose={() => setLangModalOpen(false)} />
      <BeginnerTutorialModal isOpen={tutorialModalOpen} onClose={() => setTutorialModalOpen(false)} />
    </>
  );
};
