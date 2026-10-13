import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Circle, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_KIT_ITEMS } from '../../data/demoKit';

export const EmergencyKitPage: React.FC = () => {
  const { kitCompletedIds, toggleKitItem, resetKit } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const completedCount = kitCompletedIds.length;
  const totalCount = INITIAL_KIT_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const filteredItems = INITIAL_KIT_ITEMS.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">72-Hour Emergency Survival Kit</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Essential supplies required for family survival during immediate post-disaster isolation.
          </p>
        </div>

        <button
          onClick={resetKit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Checklist</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 to-slate-900 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-sm tracking-wide">Preparation Level</span>
          </div>
          <span className="font-mono font-black text-lg text-purple-300">
            {completedCount} / {totalCount} Items ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-purple-500/30">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-xs text-purple-200">
          {progressPercent === 100
            ? '🎉 Excellent! Your emergency survival bag is fully prepared for immediate disaster response.'
            : 'Check off items as you place them in a waterproof go-bag near your main entrance door.'}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'water_food', label: '🥤 Water & Food' },
          { id: 'medical', label: '🩺 Medical' },
          { id: 'tools', label: '🔦 Flashlight & Tools' },
          { id: 'documents', label: '📄 Documents' },
          { id: 'supplies', label: '🔋 Power & Supplies' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Checklist Grid */}
      <div className="space-y-2.5">
        {filteredItems.map(item => {
          const isCompleted = kitCompletedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleKitItem(item.id)}
              className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                isCompleted
                  ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-300 dark:border-purple-900/60 text-purple-950 dark:text-purple-200'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div className="space-y-0.5 flex-1">
                <span className={`font-bold text-sm block ${isCompleted ? 'line-through opacity-80' : ''}`}>
                  {item.title}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
