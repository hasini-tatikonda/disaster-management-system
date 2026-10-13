import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, Filter, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoModeBadge } from '../../components/DemoModeBadge';

export const AlertsPage: React.FC = () => {
  const { alerts } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Active Disaster Alerts</h1>
            <DemoModeBadge compact />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time simulated warning bulletins issued by National & State Disaster Authorities.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by area or keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {['all', 'critical', 'high', 'moderate', 'low'].map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                severityFilter === s
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching alerts found</h3>
            <p className="text-xs text-slate-500">Try adjusting your filter parameters or search terms.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isCritical
                    ? 'bg-red-50/80 dark:bg-red-950/40 border-red-300 dark:border-red-900/80 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800/60 pb-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldAlert
                        className={`w-4 h-4 ${
                          isCritical ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-amber-500'
                        }`}
                      />
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{alert.title}</h3>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Affected Area: <strong>{alert.area}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCritical
                          ? 'bg-red-600 text-white'
                          : alert.severity === 'high'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono">
                      DEMO ALERT
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-3">
                  <strong>Safety Instructions:</strong> {alert.instructions}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3">
                  <span>Issued: {alert.time}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Status: {alert.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
