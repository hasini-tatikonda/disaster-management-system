import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export const DemoModeBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20 transition-all ${
          compact ? 'px-2 py-0.5 text-[10px]' : ''
        }`}
        title="Click for Demo Mode information"
      >
        <AlertTriangle className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>DEMO MODE</span>
        <Info className={compact ? 'w-2.5 h-2.5 opacity-70' : 'w-3 h-3 opacity-70'} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold">ResQ Demo System</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                <strong>ResQ</strong> is currently operating with <strong>simulated prototype data</strong> for the Smart India Hackathon (SIH) demonstration.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <li>No real emergency calls, SMS, WhatsApp, or emails are transmitted.</li>
                <li>Hospitals, shelters, alerts, and responder units are simulated demo records.</li>
                <li>SafeGuide AI operates with local disaster guidance & Gemini API fallback.</li>
                <li>All incident status updates occur locally inside browser state & LocalStorage.</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
              >
                I Understand (Continue Demo)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
