import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  BookOpen,
  Hospital,
  Briefcase,
  Bot,
  Bell,
  ChevronRight,
  Zap,
  HelpCircle,
  FileCheck,
  HeartHandshake,
  Utensils
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../locales/translations';
import { InteractiveMapView } from '../../components/InteractiveMapView';

interface CitizenHomeProps {
  onOpenSOSModal: () => void;
  onOpenRescueStatusModal?: () => void;
  onNavigate: (page: string) => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  onOpenSOSModal,
  onOpenRescueStatusModal,
  onNavigate
}) => {
  const { activeLanguage, alerts, emergencyMode, toggleEmergencyMode, currentIncidentId, incidents } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const activeIncident = currentIncidentId ? incidents.find(inc => inc.id === currentIncidentId) : null;

  return (
    <div className="space-y-8 pb-12">

      {/* ACTIVE SOS RESCUE TRACKER CARD IF SOS FIRED */}
      {activeIncident && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-2 border-red-600 text-white shadow-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg animate-pulse">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-red-400">
                    Active Rescue SOS Signal Registered
                  </span>
                  <span className="text-[10px] bg-red-500/30 text-red-300 font-mono font-bold px-2 py-0.5 rounded-full border border-red-500/50">
                    #{activeIncident.id}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white capitalize">
                  Status: {activeIncident.status.replace('_', ' ')}
                </h3>
                <p className="text-xs text-slate-300">
                  {activeIncident.location.area || activeIncident.location.address || 'Location Submitted'} • {activeIncident.affectedPeopleCount} affected people
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenRescueStatusModal?.()}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-2xl shadow-xl flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <span>View Full Rescue Dispatch Status</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* EMERGENCY MODE HIGH CONTRAST RIBBON IF ACTIVATED */}
      {emergencyMode && (
        <div className="bg-red-600 text-white p-4 rounded-3xl shadow-2xl border-4 border-yellow-400 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 fill-current" />
              <h2 className="text-xl font-black tracking-wider uppercase">EMERGENCY MODE ACTIVATED</h2>
            </div>
            <button
              onClick={toggleEmergencyMode}
              className="text-xs bg-black text-white px-3 py-1 rounded-full font-bold"
            >
              Exit Emergency Mode
            </button>
          </div>
          <p className="text-xs font-semibold">
            Simplified controls for rapid emergency action. Select an immediate action below:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={onOpenSOSModal}
              className="p-4 bg-yellow-400 text-black font-black text-lg rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <ShieldAlert className="w-8 h-8" />
              <span>TRIGGER SOS</span>
            </button>

            <button
              onClick={() => onNavigate('nearby')}
              className="p-4 bg-white text-black font-black text-sm rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <Hospital className="w-7 h-7 text-red-600" />
              <span>NEARBY HELP</span>
            </button>

            <button
              onClick={() => onNavigate('guides')}
              className="p-4 bg-white text-black font-black text-sm rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <BookOpen className="w-7 h-7 text-blue-600" />
              <span>GUIDES</span>
            </button>

            <button
              onClick={() => onNavigate('contacts')}
              className="p-4 bg-white text-black font-black text-sm rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <Bell className="w-7 h-7 text-amber-600" />
              <span>HELPLINES</span>
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION — Input-Driven Choice Cards */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
            INPUT-DRIVEN DISASTER ASSISTANCE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {getTranslation(activeLanguage, 'needHelpHeading')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Select what you need right now to get step-by-step guidance, trigger emergency rescue SOS, or prepare for disasters.
          </p>
        </div>

        {/* 6 Core Input Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
          
          {/* Card 1: Emergency SOS */}
          <button
            onClick={onOpenSOSModal}
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-1 transition-all text-left flex flex-col justify-between overflow-hidden border border-red-500"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <ShieldAlert className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  {getTranslation(activeLanguage, 'emergencySOS')}
                </h3>
                <p className="text-xs text-red-100 mt-1 leading-relaxed">
                  Trapped in flood, fire, earthquake, or medical emergency. Step-by-step 7-question SOS request.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-red-100 group-hover:translate-x-1 transition-transform">
              <span>Start Emergency Workflow</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 2: Report a Disaster */}
          <button
            onClick={onOpenSOSModal}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-amber-500 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {getTranslation(activeLanguage, 'reportDisaster')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Report rising water levels, structural damage, gas leak, or fallen trees in your area.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Submit Report</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 3: Safety Guidance */}
          <button
            onClick={() => onNavigate('guides')}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {getTranslation(activeLanguage, 'safetyGuidance')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Before, During, and After safety guides for Earthquakes, Floods, Cyclones, Fires & Heatwaves.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Read Safety Guides</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 4: Nearby Help */}
          <button
            onClick={() => onNavigate('nearby')}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-emerald-500 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Hospital className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {getTranslation(activeLanguage, 'nearbyHelp')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Find nearest trauma hospitals, police stations, fire brigade units, and cyclone shelters.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Locate Facilities</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 5: Prepare Emergency Kit */}
          <button
            onClick={() => onNavigate('kit')}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-purple-500 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Briefcase className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {getTranslation(activeLanguage, 'prepareKit')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Interactive 72-hour emergency survival bag checklist with LocalStorage persistence.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Check Survival Kit</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 6: Ask SafeGuide AI */}
          <button
            onClick={() => onNavigate('ai')}
            className="group p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl shadow-indigo-900/20 hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between border border-indigo-700/50"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/40">
                <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {getTranslation(activeLanguage, 'askAI')}
                </h3>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                  Ask natural-language questions to SafeGuide AI (Gemini powered with local knowledge fallback).
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">
              <span>Ask SafeGuide AI</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

        </div>

        {/* PROMINENT DONATION CENTER & RELIEF FUND CALLOUT BANNER */}
        <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white shadow-xl border border-amber-400/40 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] uppercase tracking-wider border border-white/30">
                ResQ Relief Fund
              </span>
              <span className="text-xs font-extrabold text-amber-200">100% Direct Aid</span>
            </div>
            <h3 className="text-xl font-black text-white">
              Donate Food, Drinking Water & Relief Funds
            </h3>
            <p className="text-xs text-amber-100 leading-relaxed font-medium">
              Your contribution directly feeds stranded families and supplies trauma paramedic kits to disaster shelters.
            </p>
          </div>

          <button
            onClick={() => onNavigate('donations')}
            className="px-6 py-3 bg-white text-rose-700 hover:bg-amber-50 font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            <span>Open Donation Center</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ACTIVE DISASTER ALERTS PREVIEW */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600 dark:text-red-400 animate-bounce" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {getTranslation(activeLanguage, 'activeAlerts')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <span>View All Alerts ({activeAlerts.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeAlerts.slice(0, 2).map(alert => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-red-900 dark:text-red-200">{alert.title}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white shrink-0">
                  {alert.severity}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 line-clamp-2">{alert.instructions}</p>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                <span>Area: {alert.area}</span>
                <span>{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE RADAR MAP PREVIEW */}
      <InteractiveMapView />

      {/* SECONDARY QUICK NAV LINKS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('evacuation')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-red-500 transition-all flex flex-col justify-between space-y-2 shadow-xs"
        >
          <FileCheck className="w-5 h-5 text-red-600 dark:text-red-400" />
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">Evacuation Protocol</span>
            <span className="text-[10px] text-slate-500">Route & Shelter Rules</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('contacts')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-500 transition-all flex flex-col justify-between space-y-2 shadow-xs"
        >
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">Emergency Contacts</span>
            <span className="text-[10px] text-slate-500">112, 108, NDRF Numbers</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('about')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-purple-500 transition-all flex flex-col justify-between space-y-2 shadow-xs"
        >
          <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-white block">About Project</span>
            <span className="text-[10px] text-slate-500">SIH Architecture Story</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('control-center')}
          className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 text-left hover:border-cyan-500 transition-all flex flex-col justify-between space-y-2 shadow-xs"
        >
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="font-bold text-xs text-white block">Control Center</span>
            <span className="text-[10px] text-slate-400">Operator Dashboard</span>
          </div>
        </button>
      </section>

    </div>
  );
};
