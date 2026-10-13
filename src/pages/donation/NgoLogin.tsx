import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, Lock, ArrowRight, Building, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NgoLogin: React.FC = () => {
  const { loginNgoEmployee } = useApp();
  
  const [employeeId, setEmployeeId] = useState('NGO-EMP-802');
  const [orgName, setOrgName] = useState('Annapurna Relief Foundation');
  const [selectedRole, setSelectedRole] = useState('Relief Logistics & Supply Coordinator');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginNgoEmployee(employeeId, orgName);
      setIsSubmitting(false);
    }, 600);
  };

  const handleQuickDemoLogin = (empId: string, org: string, role: string) => {
    setEmployeeId(empId);
    setOrgName(org);
    setSelectedRole(role);
    loginNgoEmployee(empId, org);
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-rose-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <HeartHandshake className="w-9 h-9" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900 inline-block mb-1.5">
            AUTHORIZED RELIEF PERSONNEL PORTAL
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            NGO Employee & Relief Center Login
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          Restricted login for verified NGO staff, humanitarian workers, and fund auditors to manage food distribution, verify vendor dispatches, and log relief expenditures.
        </p>
      </div>

      {/* Preset Demo Personnel Switcher */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 space-y-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Select Preset NGO Demo Personnel:</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('NGO-EMP-802', 'Annapurna Relief Foundation', 'Relief Logistics & Supply Coordinator')}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-800 text-left hover:border-amber-500 transition-all shadow-2xs group"
          >
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>S. Verma (Logistics)</span>
              <UserCheck className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100" />
            </div>
            <div className="text-[10px] text-slate-500">Annapurna Relief • ID: NGO-802</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('NGO-AUD-104', 'Care Together India', 'Fund Disbursement Auditor')}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-800 text-left hover:border-amber-500 transition-all shadow-2xs group"
          >
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Meera Nair (Auditor)</span>
              <UserCheck className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100" />
            </div>
            <div className="text-[10px] text-slate-500">Care Together • ID: NGO-104</div>
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            NGO Organization / Foundation Name:
          </label>
          <div className="relative">
            <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Employee Badge / Staff ID:
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Role Responsibility:
          </label>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
          >
            <option value="Relief Logistics & Supply Coordinator">Relief Logistics & Supply Coordinator</option>
            <option value="Fund Disbursement Auditor">Fund Disbursement Auditor</option>
            <option value="Food & Ration Dispatch Manager">Food & Ration Dispatch Manager</option>
            <option value="Medical Shelter Field Supervisor">Medical Shelter Field Supervisor</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Access NGO Donation Center</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 text-center leading-tight">
        🔒 Demo NGO Portal Security — Authorized staff accounts can audit donations and issue emergency relief purchases.
      </div>

    </div>
  );
};
