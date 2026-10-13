import React, { useState } from 'react';
import { Hospital, Shield, Flame, Home, Phone, MapPin, Search, Navigation, Layers } from 'lucide-react';
import { DEMO_FACILITIES } from '../../data/demoFacilities';
import { InteractiveMapView } from '../../components/InteractiveMapView';
import { DemoModeBadge } from '../../components/DemoModeBadge';

export const NearbyHelpPage: React.FC = () => {
  const [activeType, setActiveType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);

  const filteredFacilities = DEMO_FACILITIES.filter(fac => {
    const matchesType = activeType === 'all' || fac.type === activeType;
    const matchesSearch =
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Hospital className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'police': return <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'fire_station': return <Flame className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'shelter': return <Home className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default: return <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Hospital className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Nearby Emergency Facilities</h1>
            <DemoModeBadge compact />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Locate trauma centers, police stations, fire brigades, and designated cyclone shelters.
          </p>
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
        >
          <Layers className="w-4 h-4" />
          <span>{showMap ? 'Hide Radar Map' : 'Show Interactive Map'}</span>
        </button>
      </div>

      {showMap && <InteractiveMapView />}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Facilities' },
            { id: 'hospital', label: '🏥 Hospitals' },
            { id: 'police', label: '👮 Police' },
            { id: 'fire_station', label: '🚒 Fire Brigade' },
            { id: 'shelter', label: '🏠 Shelters' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeType === t.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search facility name or area..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Facility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFacilities.map(fac => (
          <div
            key={fac.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getIcon(fac.type)}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {fac.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">{fac.area}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full shrink-0">
                {fac.distanceKm} km away
              </span>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div><strong>Address:</strong> {fac.address}</div>
              {fac.capacity && <div><strong>Capacity:</strong> {fac.capacity}</div>}
              <div><strong>Availability:</strong> {fac.availability}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <a
                href={`tel:${fac.contact.replace(/[^0-9]/g, '')}`}
                onClick={e => {
                  e.preventDefault();
                  alert(`[DEMO SIMULATION] Simulating call to ${fac.name}: ${fac.contact}`);
                }}
                className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {fac.contact}</span>
              </a>

              <button
                onClick={() =>
                  alert(`[DEMO DIRECTIONS] Route to ${fac.name} calculated: Approx ${fac.distanceKm} km via NH-16.`)
                }
                className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
