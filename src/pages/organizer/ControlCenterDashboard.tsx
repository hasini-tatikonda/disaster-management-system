import React, { useState } from 'react';
import {
  Building2,
  ShieldAlert,
  Users,
  Radio,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  UserPlus,
  X,
  LogOut,
  MapPin,
  Home,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoModeBadge } from '../../components/DemoModeBadge';
import { Incident, SeverityLevel, IncidentStatus } from '../../types';
import { DEMO_FACILITIES } from '../../data/demoFacilities';

export const ControlCenterDashboard: React.FC = () => {
  const {
    incidents,
    responders,
    alerts,
    assignResponder,
    createAlert,
    deleteAlert,
    logoutOrganizer
  } = useApp();

  const [activeTab, setActiveTab] = useState<'incidents' | 'alerts' | 'responders' | 'shelters'>('incidents');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Assign Modal State
  const [selectedIncidentForAssign, setSelectedIncidentForAssign] = useState<Incident | null>(null);
  const [selectedResponderId, setSelectedResponderId] = useState<string>('');

  // Selected Incident Detail Drawer
  const [viewDetailIncident, setViewDetailIncident] = useState<Incident | null>(null);

  // New Alert Modal Form State
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDisaster, setAlertDisaster] = useState('flood');
  const [alertSeverity, setAlertSeverity] = useState<SeverityLevel>('critical');
  const [alertArea, setAlertArea] = useState('');
  const [alertInstructions, setAlertInstructions] = useState('');

  // Summary Metrics Calculations
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;
  const awaitingCount = activeIncidents.filter(i => i.status === 'NEW').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;
  const availableResponders = responders.filter(r => r.status === 'available').length;
  const assignedResponders = responders.filter(r => r.status !== 'available').length;

  const totalPeopleAffected = activeIncidents.reduce((acc, inc) => {
    const count = parseInt(inc.affectedPeopleCount) || 3;
    return acc + count;
  }, 0);

  // Filtered Incidents List
  const filteredIncidents = incidents.filter(inc => {
    const matchesSev = severityFilter === 'all' || inc.severity === severityFilter;
    const matchesStat = statusFilter === 'all' || inc.status === statusFilter;
    return matchesSev && matchesStat;
  });

  const handleExecuteAssign = () => {
    if (!selectedIncidentForAssign || !selectedResponderId) return;
    assignResponder(selectedIncidentForAssign.id, selectedResponderId);
    setSelectedIncidentForAssign(null);
    setSelectedResponderId('');
  };

  const handleCreateAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertArea || !alertInstructions) return;
    createAlert({
      title: alertTitle,
      disasterType: alertDisaster as any,
      severity: alertSeverity,
      area: alertArea,
      instructions: alertInstructions
    });
    setAlertTitle('');
    setAlertArea('');
    setAlertInstructions('');
    setShowNewAlertModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">DisasterSafe Control Center</h1>
              <DemoModeBadge compact />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Emergency Operator Operations Center • Smart Incident Queue & Dispatch Management
            </p>
          </div>
        </div>

        <button
          onClick={logoutOrganizer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Control Center</span>
        </button>
      </div>

      {/* METRICS STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block uppercase">Active Cases</span>
          <span className="text-2xl font-black text-red-700 dark:text-red-300">{activeIncidents.length}</span>
        </div>

        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block uppercase">Critical</span>
          <span className="text-2xl font-black text-rose-700 dark:text-rose-300">{criticalCount}</span>
        </div>

        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">Awaiting</span>
          <span className="text-2xl font-black text-amber-700 dark:text-amber-300">{awaitingCount}</span>
        </div>

        <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block uppercase">People Affected</span>
          <span className="text-2xl font-black text-blue-700 dark:text-blue-300">{totalPeopleAffected}+</span>
        </div>

        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">Responders Available</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{availableResponders}</span>
        </div>

        <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase">Responders Deployed</span>
          <span className="text-2xl font-black text-purple-700 dark:text-purple-300">{assignedResponders}</span>
        </div>

        <div className="p-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block uppercase">Resolved</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-200">{resolvedCount}</span>
        </div>

        <div className="p-3.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block uppercase">Active Alerts</span>
          <span className="text-2xl font-black text-amber-800 dark:text-amber-200">{alerts.length}</span>
        </div>
      </div>

      {/* OPERATOR CONTROL TABS */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-1 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'incidents'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Incident Queue ({filteredIncidents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'alerts'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Manage Alerts ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('responders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'responders'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Field Responders ({responders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shelters')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'shelters'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Shelters Capacity</span>
        </button>
      </div>

      {/* TAB 1: INCIDENTS MANAGEMENT */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500">Severity:</span>
              {['all', 'critical', 'high', 'moderate', 'low'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                    severityFilter === sev
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500">Status:</span>
              {['all', 'NEW', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'RESOLVED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Incident Table / Cards */}
          <div className="space-y-3">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                No incidents match the selected filter parameters.
              </div>
            ) : (
              filteredIncidents.map(inc => {
                const isCritical = inc.severity === 'critical';
                const isUnassigned = inc.status === 'NEW';

                return (
                  <div
                    key={inc.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isCritical
                        ? 'bg-red-50/50 dark:bg-red-950/30 border-red-300 dark:border-red-900/60 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-red-600 dark:text-red-400">
                            {inc.id}
                          </span>
                          <span className="font-bold text-base text-slate-900 dark:text-white capitalize">
                            {inc.disasterType} Emergency
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isCritical ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Location: <strong>{inc.location.area || inc.location.address || 'Submitted Area'}</strong> • Affected: <strong>{inc.affectedPeopleCount} people</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isUnassigned ? (
                          <button
                            onClick={() => setSelectedIncidentForAssign(inc)}
                            className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 animate-pulse"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Assign Responder</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-900">
                            Assigned: {inc.assignedResponderName}
                          </span>
                        )}

                        <button
                          onClick={() => setViewDetailIncident(inc)}
                          className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 pt-2 flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <strong>Required Services:</strong> {inc.requiredHelp.join(', ')} • <strong>Special Needs:</strong> {inc.specialAssistance.join(', ')}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Reported: {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Disaster Bulletins</h2>
            <button
              onClick={() => setShowNewAlertModal(true)}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast New Alert</span>
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map(alt => (
              <div
                key={alt.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-red-600">{alt.id}</span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{alt.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white">
                      {alt.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{alt.instructions}</p>
                  <div className="text-[10px] text-slate-400">
                    Area: {alt.area} • Issued: {alt.time}
                  </div>
                </div>

                <button
                  onClick={() => deleteAlert(alt.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESPONDERS FLEET */}
      {activeTab === 'responders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {responders.map(resp => (
            <div
              key={resp.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <span className="font-mono font-bold text-xs text-blue-600">{resp.id}</span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{resp.teamName}</h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    resp.status === 'available'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {resp.status}
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Leader:</strong> {resp.leaderName}</div>
                <div><strong>Category:</strong> <span className="capitalize">{resp.category}</span></div>
                <div><strong>Sector:</strong> {resp.area}</div>
                <div><strong>Vehicle Unit:</strong> {resp.vehicle}</div>
                <div><strong>Phone:</strong> {resp.phone}</div>
                {resp.currentIncidentId && (
                  <div className="font-bold text-red-600 dark:text-red-400">
                    Assigned Incident: {resp.currentIncidentId}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SHELTERS CAPACITY */}
      {activeTab === 'shelters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {DEMO_FACILITIES.filter(f => f.type === 'shelter' || f.type === 'relief_center').map(shelter => (
            <div
              key={shelter.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{shelter.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                  OPEN RELIEF CENTER
                </span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Location:</strong> {shelter.address}</div>
                <div><strong>Capacity:</strong> {shelter.capacity || '400+ people'}</div>
                <div><strong>Supplies Available:</strong> {shelter.availability}</div>
                <div><strong>Helpline:</strong> {shelter.contact}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ASSIGN RESPONDER MODAL */}
      {selectedIncidentForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Assign Responder to {selectedIncidentForAssign.id}
              </h3>
              <button
                onClick={() => setSelectedIncidentForAssign(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div><strong>Disaster:</strong> <span className="capitalize">{selectedIncidentForAssign.disasterType}</span></div>
              <div><strong>Location:</strong> {selectedIncidentForAssign.location.area || selectedIncidentForAssign.location.address}</div>
              <div><strong>Required Help:</strong> {selectedIncidentForAssign.requiredHelp.join(', ')}</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Field Rescue Team:
              </label>
              <select
                value={selectedResponderId}
                onChange={e => setSelectedResponderId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose Available Team --</option>
                {responders.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.teamName} ({r.category.toUpperCase()}) - {r.status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedIncidentForAssign(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAssign}
                disabled={!selectedResponderId}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INCIDENT DETAIL DRAWER MODAL */}
      {viewDetailIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-xs text-red-600">{viewDetailIncident.id}</span>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  Incident Details & Rescue Timeline
                </h3>
              </div>
              <button onClick={() => setViewDetailIncident(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div><strong>Disaster Type:</strong> <span className="capitalize">{viewDetailIncident.disasterType}</span></div>
              <div><strong>Severity:</strong> <span className="uppercase font-bold text-red-600">{viewDetailIncident.severity}</span></div>
              <div><strong>People Affected:</strong> {viewDetailIncident.affectedPeopleCount} people</div>
              <div><strong>Location:</strong> {viewDetailIncident.location.address || viewDetailIncident.location.area || 'GPS Location'}</div>
              <div><strong>Description:</strong> {viewDetailIncident.description}</div>
              <div><strong>Assigned Team:</strong> {viewDetailIncident.assignedResponderName || 'Awaiting Assignment'}</div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Status History Timeline</h4>
              <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                {viewDetailIncident.timeline.map(evt => (
                  <div key={evt.id} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{evt.status}</span>
                      <span className="text-[10px] text-slate-400">{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px]">{evt.note} — <em>{evt.actor}</em></p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setViewDetailIncident(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* CREATE NEW ALERT MODAL */}
      {showNewAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Broadcast Disaster Alert Bulletin</h3>
              <button onClick={() => setShowNewAlertModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlertSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 mb-1">Alert Headline:</label>
                <input
                  type="text"
                  placeholder="E.g., Flash Flood Warning in Coastal Belt"
                  value={alertTitle}
                  onChange={e => setAlertTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold block mb-1">Disaster Type:</label>
                  <select
                    value={alertDisaster}
                    onChange={e => setAlertDisaster(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="flood">Flood</option>
                    <option value="cyclone">Cyclone</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="fire">Fire</option>
                    <option value="weather">Severe Weather</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Severity Level:</label>
                  <select
                    value={alertSeverity}
                    onChange={e => setAlertSeverity(e.target.value as SeverityLevel)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Affected Area:</label>
                <input
                  type="text"
                  placeholder="E.g., Krishna River Basin & Low-lying mandals"
                  value={alertArea}
                  onChange={e => setAlertArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Safety Instructions:</label>
                <textarea
                  rows={3}
                  placeholder="Specific safety instructions for citizens..."
                  value={alertInstructions}
                  onChange={e => setAlertInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                Broadcast Alert (Demo)
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
