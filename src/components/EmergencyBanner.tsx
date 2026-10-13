import React from 'react';
import { ShieldAlert, ChevronRight, CheckCircle2, Clock, Truck, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EmergencyBannerProps {
  onViewStatus: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onViewStatus }) => {
  const { currentIncidentId, incidents, clearCurrentCitizenIncident } = useApp();

  if (!currentIncidentId) return null;

  const currentIncident = incidents.find(inc => inc.id === currentIncidentId);
  if (!currentIncident) return null;

  const getStatusBadge = () => {
    switch (currentIncident.status) {
      case 'NEW':
        return { label: 'AWAITING RESPONDER ASSIGNMENT', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Clock };
      case 'ACCEPTED':
        return { label: `ASSIGNED: ${currentIncident.assignedResponderName || 'Responder Team'}`, bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: CheckCircle2 };
      case 'EN_ROUTE':
        return { label: 'RESPONDER EN ROUTE', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: Truck };
      case 'ARRIVED':
      case 'ASSISTANCE_STARTED':
        return { label: 'RESCUE ASSISTANCE IN PROGRESS', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', icon: ShieldAlert };
      case 'RESOLVED':
        return { label: 'INCIDENT RESOLVED', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: Check };
      default:
        return { label: currentIncident.status, bg: 'bg-slate-700 text-slate-200 border-slate-600', icon: Clock };
    }
  };

  const badge = getStatusBadge();
  const Icon = badge.icon;

  return (
    <div className="bg-slate-950 text-white border-b border-red-800 px-4 py-2.5 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-red-600 text-white animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-red-400">
                ACTIVE SOS TRACKING: {currentIncident.id}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                <span>{badge.label}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1">
              Disaster: <strong className="capitalize">{currentIncident.disasterType}</strong> • {currentIncident.affectedPeopleCount} people affected • {currentIncident.location.area || currentIncident.location.address || 'Location submitted'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewStatus}
            className="py-1.5 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>View Rescue Status</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {currentIncident.status === 'RESOLVED' && (
            <button
              onClick={clearCurrentCitizenIncident}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss tracking card"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
