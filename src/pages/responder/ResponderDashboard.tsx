import React, { useState } from 'react';
import { Radio, ShieldAlert, Truck, CheckCircle2, AlertOctagon, Phone, LogOut, Check, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoModeBadge } from '../../components/DemoModeBadge';
import { IncidentStatus } from '../../types';

export const ResponderDashboard: React.FC = () => {
  const {
    responderSessionId,
    responders,
    incidents,
    updateIncidentStatus,
    logoutResponder
  } = useApp();

  const [noteInput, setNoteInput] = useState('');

  const currentResponder = responders.find(r => r.id === responderSessionId);
  if (!currentResponder) return null;

  // Find assigned incident
  const assignedIncident = incidents.find(
    i => i.assignedResponderId === currentResponder.id || i.id === currentResponder.currentIncidentId
  );

  const handleUpdateStatus = (newStatus: IncidentStatus, defaultNote: string) => {
    if (!assignedIncident) return;
    const noteText = noteInput.trim() || defaultNote;
    updateIncidentStatus(assignedIncident.id, newStatus, currentResponder.teamName, noteText);
    setNoteInput('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {currentResponder.teamName}
              </h1>
              <DemoModeBadge compact />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Leader: <strong>{currentResponder.leaderName}</strong> • Unit: {currentResponder.vehicle}
            </p>
          </div>
        </div>

        <button
          onClick={logoutResponder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Team</span>
        </button>
      </div>

      {/* ACTIVE ASSIGNMENT SECTION */}
      {!assignedIncident ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Clock className="w-10 h-10 text-emerald-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Active Emergency Assignment</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your team is currently on Standby / Available in sector <strong>{currentResponder.area}</strong>.
            New incident assignments from the Control Center will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Incident Banner Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base text-red-600 dark:text-red-400">
                  {assignedIncident.id}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white capitalize">
                  {assignedIncident.disasterType} Emergency Case
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white">
                  {assignedIncident.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target Sector: <strong>{assignedIncident.location.area || assignedIncident.location.address || 'Reported Location'}</strong>
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold">
              Status: {assignedIncident.status}
            </div>
          </div>

          {/* Situation Report */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-red-600 dark:text-red-400">
              Field Situation Report
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
              <div><strong>People Affected:</strong> {assignedIncident.affectedPeopleCount} people</div>
              <div><strong>Special Needs:</strong> {assignedIncident.specialAssistance.join(', ')}</div>
              <div><strong>Required Help:</strong> {assignedIncident.requiredHelp.join(', ')}</div>
              <div><strong>Location Address:</strong> {assignedIncident.location.address || 'Approximate Location'}</div>
            </div>
            <div className="pt-1 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <strong>Citizen Description:</strong> &quot;{assignedIncident.description}&quot;
            </div>
          </div>

          {/* STATUS UPDATE ACTION WORKFLOW BUTTONS */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Update Response Progress:
            </h3>

            {/* Optional Custom Note */}
            <input
              type="text"
              placeholder="Add optional operational note (e.g., 2 rescue boats deployed, entering street...)"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleUpdateStatus('ACCEPTED', 'Assignment acknowledged by team leader.')}
                className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                  assignedIncident.status === 'ACCEPTED'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>1. ACCEPT</span>
              </button>

              <button
                onClick={() => handleUpdateStatus('EN_ROUTE', 'Team en route with rescue vehicles.')}
                className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                  assignedIncident.status === 'EN_ROUTE'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>2. EN ROUTE</span>
              </button>

              <button
                onClick={() => handleUpdateStatus('ARRIVED', 'Team arrived on incident scene.')}
                className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                  assignedIncident.status === 'ARRIVED'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>3. ARRIVED</span>
              </button>

              <button
                onClick={() => handleUpdateStatus('ASSISTANCE_STARTED', 'Active evacuation / medical rescue in progress.')}
                className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                  assignedIncident.status === 'ASSISTANCE_STARTED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>4. ASSISTANCE STARTED</span>
              </button>

              <button
                onClick={() => handleUpdateStatus('ADDITIONAL_SUPPORT', 'Requested additional support from Control Center.')}
                className="p-3 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-md col-span-2 sm:col-span-1"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>NEED ADDITIONAL SUPPORT</span>
              </button>

              <button
                onClick={() => handleUpdateStatus('RESOLVED', 'Rescue complete. Citizens safely transported to shelter.')}
                className="p-3 rounded-2xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md col-span-2 sm:col-span-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>MARK RESOLVED</span>
              </button>
            </div>
          </div>

          {/* Incident History Log */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rescue Activity Log</h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {assignedIncident.timeline.map(evt => (
                <div key={evt.id} className="text-xs p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-2">[{evt.status}]</span>
                    <span className="text-slate-700 dark:text-slate-300">{evt.note}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
