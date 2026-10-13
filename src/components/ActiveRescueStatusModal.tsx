import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  Truck,
  PhoneCall,
  MapPin,
  Users,
  AlertTriangle,
  Send,
  X,
  MessageSquare,
  Sparkles,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentStatus } from '../types';

interface ActiveRescueStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveRescueStatusModal: React.FC<ActiveRescueStatusModalProps> = ({ isOpen, onClose }) => {
  const { currentIncidentId, incidents, updateIncidentStatus } = useApp();
  const [noteInput, setNoteInput] = useState('');
  const [escalated, setEscalated] = useState(false);

  if (!isOpen || !currentIncidentId) return null;

  const currentIncident = incidents.find(inc => inc.id === currentIncidentId);
  if (!currentIncident) return null;

  const STATUS_STEPS: { status: IncidentStatus; label: string; desc: string }[] = [
    { status: 'NEW', label: 'SOS Request Registered', desc: 'Alert logged in Control Center emergency queue' },
    { status: 'ACCEPTED', label: 'Field Team Assigned', desc: 'Emergency team unit accepted dispatch order' },
    { status: 'EN_ROUTE', label: 'Rescue Team En Route', desc: 'Emergency vehicle navigating to your coordinates' },
    { status: 'ARRIVED', label: 'Team Arrived at Scene', desc: 'First responders reached location sector' },
    { status: 'ASSISTANCE_STARTED', label: 'Rescue Operations Active', desc: 'Field assistance, extraction & first aid active' },
    { status: 'RESOLVED', label: 'Incident Resolved & Safe', desc: 'Citizens safely evacuated or treated' }
  ];

  const getStepIndex = (status: IncidentStatus) => {
    switch (status) {
      case 'NEW': return 0;
      case 'ACCEPTED': return 1;
      case 'EN_ROUTE': return 2;
      case 'ARRIVED': return 3;
      case 'ASSISTANCE_STARTED': return 4;
      case 'RESOLVED': return 5;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentIncident.status);

  const handleAddCitizenNote = () => {
    if (!noteInput.trim()) return;
    updateIncidentStatus(
      currentIncident.id,
      currentIncident.status,
      'Citizen (You)',
      `[Citizen Update]: ${noteInput.trim()}`
    );
    setNoteInput('');
  };

  const handleUrgentEscalate = () => {
    setEscalated(true);
    updateIncidentStatus(
      currentIncident.id,
      currentIncident.status,
      'Citizen (You)',
      `🚨 URGENT CITIZEN PING: Water level rising / condition worsening. Priority dispatch requested!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto relative space-y-0">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-b border-red-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  SOS Rescue Dispatch Tracker
                </h2>
                <span className="text-[10px] bg-red-500/20 text-red-400 font-extrabold px-2 py-0.5 rounded-full border border-red-500/40 font-mono">
                  #{currentIncident.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live multi-agency emergency response tracking for your location
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Rescue Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                Current Operational Status
              </span>
              <span className="text-base font-extrabold text-red-400 capitalize">
                {currentIncident.status.replace('_', ' ')}
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Disaster: <strong className="capitalize text-white">{currentIncident.disasterType}</strong> • {currentIncident.affectedPeopleCount} Affected Person(s)
              </p>
            </div>

            {currentIncident.assignedResponderName ? (
              <div className="bg-blue-950/60 border border-blue-800/80 p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-blue-300 block uppercase">
                  Assigned Field Unit
                </span>
                <p className="text-xs font-black text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>{currentIncident.assignedResponderName}</span>
                </p>
                {currentIncident.assignedResponderPhone && (
                  <a
                    href={`tel:${currentIncident.assignedResponderPhone}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-lg"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Team ({currentIncident.assignedResponderPhone})</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-amber-950/40 border border-amber-800/60 px-3 py-2 rounded-xl text-amber-300 text-xs font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin text-amber-400" />
                <span>Control Center Dispatching Nearest NDRF Unit...</span>
              </div>
            )}
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Live Dispatch Progression
            </h3>

            <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const isPending = idx > currentStepIdx;

                return (
                  <div key={step.status} className="relative group">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-red-600 text-white ring-4 ring-red-600/30 animate-pulse'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : isCurrent ? (
                        <Truck className="w-3.5 h-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black ${
                            isCurrent
                              ? 'text-red-400 text-sm'
                              : isCompleted
                              ? 'text-emerald-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] bg-red-600 text-white px-2 py-0.2 rounded-full font-bold">
                            ACTIVE STEP
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] ${
                          isCurrent ? 'text-slate-200 font-medium' : 'text-slate-500'
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Info Breakdown */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300">Location Sector</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {currentIncident.location.area || currentIncident.location.address || 'Coordinates Submitted'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300">Required Assistance</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {currentIncident.requiredHelp.map((h, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700 uppercase"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Reported Timestamp</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {currentIncident.timestamp}
              </span>
            </div>
          </div>

          {/* Citizen Emergency Note & Urgent Ping */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Send Real-Time Message to Responders</span>
              </h4>

              <button
                onClick={handleUrgentEscalate}
                disabled={escalated}
                className={`text-[10px] font-extrabold px-3 py-1 rounded-xl flex items-center gap-1 transition-all ${
                  escalated
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>{escalated ? 'Escalation Sent' : 'Urgent Escalation Ping'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type additional details (e.g. 'We are on the roof, 2 elderly people with us')..."
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCitizenNote()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddCitizenNote}
                disabled={!noteInput.trim()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>

            {/* Timeline Notes History */}
            {currentIncident.notes.length > 0 && (
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 max-h-36 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Incident Log & Dispatch Notes
                </span>
                {currentIncident.notes.map((n, idx) => (
                  <div key={idx} className="text-[11px] text-slate-300 border-l-2 border-blue-500/60 pl-2 py-0.5 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <strong className="text-blue-300">{n.actor}</strong>
                      <span className="font-mono text-[9px]">{n.time}</span>
                    </div>
                    <p className="text-slate-200">{n.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Direct Hotlines */}
          <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-2xl space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-300 block">
              National Emergency Direct Hotlines
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
              <a
                href="tel:112"
                className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-md flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>112 (National)</span>
              </a>
              <a
                href="tel:108"
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>108 (Ambulance)</span>
              </a>
              <a
                href="tel:1070"
                className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>1070 (NDRF)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium text-[11px]">
            Keep your phone charged and stay on high ground.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
