import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, ShieldCheck, ArrowRight, Waves, Activity, Wind, Flame, Mountain, Zap, Sun } from 'lucide-react';
import { DISASTER_GUIDES } from '../../data/disasterGuides';

export const GuidesPage: React.FC = () => {
  const [activeGuideId, setActiveGuideId] = useState<string>('guide-flood');
  const [activePhase, setActivePhase] = useState<'before' | 'during' | 'after' | 'precautions'>('during');

  const guide = DISASTER_GUIDES.find(g => g.id === activeGuideId) || DISASTER_GUIDES[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Waves': return <Waves className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Wind': return <Wind className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Mountain': return <Mountain className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Actionable Disaster Guides</h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Step-by-step survival protocols verified for standard disaster response in India.
        </p>
      </div>

      {/* Horizontal Disaster Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DISASTER_GUIDES.map(g => {
          const isSelected = g.id === activeGuideId;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGuideId(g.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              {getIcon(g.iconName)}
              <span>{g.title.replace(' Guide', '')}</span>
            </button>
          );
        })}
      </div>

      {/* Guide Content Display */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        
        {/* Title & Summary */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            {getIcon(guide.iconName)}
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{guide.title}</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {guide.summary}
          </p>
        </div>

        {/* Phase Selector Tabs (BEFORE / DURING / AFTER / PRECAUTIONS) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
          {[
            { id: 'before', label: '1. BEFORE (Prepare)' },
            { id: 'during', label: '2. DURING (Action)' },
            { id: 'after', label: '3. AFTER (Recovery)' },
            { id: 'precautions', label: '4. PRECAUTIONS' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setActivePhase(p.id as any)}
              className={`flex-1 py-2 px-3 rounded-xl transition-all text-center ${
                activePhase === p.id
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Phase Bullet Items */}
        <div className="space-y-3 pt-2">
          {activePhase === 'before' && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Preparation & Risk Mitigation Steps (BEFORE):</span>
              </h3>
              <ul className="space-y-2">
                {guide.before.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activePhase === 'during' && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
                <span>Immediate Safety Actions (DURING):</span>
              </h3>
              <ul className="space-y-2">
                {guide.during.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 bg-red-50/50 dark:bg-red-950/20 p-3.5 rounded-2xl border border-red-200 dark:border-red-900/40">
                    <ArrowRight className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activePhase === 'after' && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Inspection & Recovery Steps (AFTER):</span>
              </h3>
              <ul className="space-y-2">
                {guide.after.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activePhase === 'precautions' && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Critical Precautions & Hazards to Avoid:</span>
              </h3>
              <ul className="space-y-2">
                {guide.precautions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/40">
                    <span className="font-bold text-amber-600">🛑</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
