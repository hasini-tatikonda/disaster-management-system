import React from 'react';
import { PhoneCall, ShieldCheck, AlertCircle } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../../data/emergencyContacts';

export const ContactsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Emergency Numbers & Helplines</h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verified national helplines for disaster response, medical trauma, fire dispatch, and police safety.
        </p>
      </div>

      {/* Verification Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>OFFICIAL HELPLINE VERIFICATION NOTICE</span>
        </div>
        <p>
          These numbers represent official government emergency helplines in India. Always verify local district collectorate helpline numbers during active state-level disaster bulletins.
        </p>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {EMERGENCY_CONTACTS.map(cnt => (
          <div
            key={cnt.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition-all space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {cnt.category}
                </span>
                {cnt.isOfficialVerified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Helpline
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{cnt.serviceName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{cnt.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono font-black text-lg text-red-600 dark:text-red-400">
                {cnt.numberDisplay}
              </span>
              <a
                href={`tel:${cnt.dialableNumber}`}
                onClick={e => {
                  e.preventDefault();
                  alert(`[DEMO DIALER] Initiating simulated phone call to ${cnt.serviceName}: ${cnt.numberDisplay}`);
                }}
                className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Helpline</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
