import React from 'react';
import { Navigation, ShieldAlert, HeartHandshake, Home, ArrowRight, CheckCircle2 } from 'lucide-react';

interface EvacuationPageProps {
  onNavigate: (page: string) => void;
}

export const EvacuationPage: React.FC<EvacuationPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Evacuation & Shelter Guide</h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Standard operational protocols for rapid community evacuation during flash floods and cyclones.
        </p>
      </div>

      {/* Primary Shelter CTA Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-md">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-bold">Find Nearest Designated Cyclone / Flood Shelter</h2>
          </div>
          <p className="text-xs text-emerald-100">
            View municipal relief centers equipped with clean water, medical aid, power backup, and food.
          </p>
        </div>

        <button
          onClick={() => onNavigate('nearby')}
          className="px-5 py-3 bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-lg shrink-0"
        >
          <span>Locate Shelters Radar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Evacuation Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: When Evacuation is Mandatory */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">When Evacuation is Necessary</h3>
          </div>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>When local District Collectorate issues a mandatory evacuation advisory.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>If floodwater is approaching lower floors or ground floor electrical boards.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>If smoke or chemical fumes enter your premises.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Vulnerable Group Assistance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <HeartHandshake className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Special Needs & Vulnerable Groups</h3>
          </div>
          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span><strong>Infants & Children:</strong> Pack powdered milk, extra diapers, and clean drinking water.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span><strong>Elderly & Disabled:</strong> Ensure walking aids, eyeglasses, and 7 days of daily prescription medicines are carried in go-bags.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
