import React from 'react';
import { Home, Bell, ShieldAlert, BookOpen, Bot, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenSOSModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onNavigate, onOpenSOSModal }) => {
  const { userEnvironment } = useApp();

  if (userEnvironment !== 'citizen') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === 'home'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('alerts')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === 'alerts'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span>Alerts</span>
        </button>

        {/* SOS Center High Impact Button */}
        <button
          onClick={onOpenSOSModal}
          className="flex flex-col items-center gap-0.5 px-3 py-1 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/30 active:scale-95 transition-transform -mt-4 border-2 border-white dark:border-slate-900"
        >
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <span className="text-[10px] font-black tracking-wider">SOS</span>
        </button>

        <button
          onClick={() => onNavigate('guides')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === 'guides'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Guides</span>
        </button>

        <button
          onClick={() => onNavigate('ai')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === 'ai'
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>SafeAI</span>
        </button>
      </div>
    </nav>
  );
};
