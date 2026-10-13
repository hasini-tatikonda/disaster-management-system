import React from 'react';
import { ShieldAlert, Target, Cpu, Sparkles, Layers, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-red-600 dark:text-red-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">About ResQ</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Smart India Hackathon (SIH) Prototype Architecture for Input-Driven Emergency Assistance & Rescue Coordination.
        </p>
      </div>

      {/* Hero Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-900">
          CORE DESIGN PHILOSOPHY
        </span>
        <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
          Citizen Input → ResQ Engine → Incident Processing → Control Center → Responder Assignment → Status Resolution
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          ResQ bridges the critical response gap during floods, cyclones, earthquakes, and fires by providing an immediate, no-login emergency SOS workflow for citizens, an incident management dashboard for Control Center operators, and a dedicated portal for field responders.
        </p>
      </div>

      {/* Grid: Problem Statement & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Problem Statement */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Target className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Problem Statement</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            During sudden disaster situations, citizens face fragmented helpline numbers, unverified shelter locations, delayed emergency dispatch, and panic due to lack of structured guidance. Traditional login forms block individuals in distress, while rescue teams lack real-time structured victim counts and medical needs.
          </p>
        </div>

        {/* Objectives */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Key Objectives</h3>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            <li>No-login input-driven progressive SOS workflow.</li>
            <li>Centralized Control Center with real-time incident queues.</li>
            <li>Dedicated Responder Portal for step-by-step status updates.</li>
            <li>Multilingual support across 14+ Indian languages.</li>
            <li>SafeGuide AI powered by Gemini with local fallback knowledge.</li>
          </ul>
        </div>

      </div>

      {/* Tech Stack */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Cpu className="w-5 h-5" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Technology Stack</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-extrabold block text-slate-900 dark:text-white">Frontend</span>
            <span className="text-slate-500">React 19 + TypeScript + Vite + Tailwind CSS</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-extrabold block text-slate-900 dark:text-white">Backend Proxy</span>
            <span className="text-slate-500">Express + Node.js</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-extrabold block text-slate-900 dark:text-white">AI Engine</span>
            <span className="text-slate-500">@google/genai (Gemini 2.5 Flash) + Offline KB</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-extrabold block text-slate-900 dark:text-white">Storage</span>
            <span className="text-slate-500">Browser Geolocation & LocalStorage API</span>
          </div>
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 to-slate-900 text-white border border-indigo-900 space-y-3">
        <div className="flex items-center gap-2 text-indigo-300">
          <Layers className="w-5 h-5" />
          <h3 className="font-bold text-base">Production Integration Roadmap</h3>
        </div>
        <p className="text-xs text-indigo-200 leading-relaxed">
          Future enhancements for government integration include NDMA/112 API connectors, WebSockets for multi-device real-time updates, GIS satellite map overlays, automated SMS/WhatsApp alerts, and IoT sensor feeds for river gauge monitoring.
        </p>
      </div>

    </div>
  );
};
