import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  MapPin,
  Users,
  AlertOctagon,
  HeartHandshake,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { requestGPSLocation } from '../services/locationService';
import {
  DisasterType,
  SeverityLevel,
  SpecialAssistanceType,
  HelpCategory,
  LocationInfo,
  Incident
} from '../types';

interface SOSWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentCreated?: (incident: Incident) => void;
}

export const SOSWizardModal: React.FC<SOSWizardModalProps> = ({ isOpen, onClose, onIncidentCreated }) => {
  const { createIncident } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form Draft State
  const [disasterType, setDisasterType] = useState<DisasterType>('flood');
  const [customDisaster, setCustomDisaster] = useState('');

  const [severity, setSeverity] = useState<SeverityLevel>('high');

  const [affectedPeopleCount, setAffectedPeopleCount] = useState<string>('2-5');

  const [specialAssistance, setSpecialAssistance] = useState<SpecialAssistanceType[]>(['none']);
  const [customSpecialAssistance, setCustomSpecialAssistance] = useState('');

  const [requiredHelp, setRequiredHelp] = useState<HelpCategory[]>(['evacuation']);
  const [customRequiredHelp, setCustomRequiredHelp] = useState('');

  const [locationInfo, setLocationInfo] = useState<LocationInfo>({ type: 'skipped' });
  const [manualState, setManualState] = useState('');
  const [manualDistrict, setManualDistrict] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualArea, setManualArea] = useState('');

  const [description, setDescription] = useState('');

  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);

  if (!isOpen) return null;

  const handleDisasterSelect = (dt: DisasterType) => {
    setDisasterType(dt);
  };

  const handleSpecialToggle = (sat: SpecialAssistanceType) => {
    if (sat === 'none') {
      setSpecialAssistance(['none']);
      return;
    }
    const filtered = specialAssistance.filter(s => s !== 'none');
    if (filtered.includes(sat)) {
      const remaining = filtered.filter(s => s !== sat);
      setSpecialAssistance(remaining.length === 0 ? ['none'] : remaining);
    } else {
      setSpecialAssistance([...filtered, sat]);
    }
  };

  const handleHelpToggle = (hc: HelpCategory) => {
    if (requiredHelp.includes(hc)) {
      setRequiredHelp(requiredHelp.filter(h => h !== hc));
    } else {
      setRequiredHelp([...requiredHelp, hc]);
    }
  };

  const handleFetchLocation = async () => {
    setLocLoading(true);
    setLocError('');
    const res = await requestGPSLocation();
    setLocLoading(false);
    if (res.success && res.location) {
      setLocationInfo(res.location);
    } else {
      setLocError(res.error || 'Could not fetch GPS location.');
      setLocationInfo({ type: 'skipped', rawError: res.error });
    }
  };

  const handleManualLocationSave = () => {
    setLocationInfo({
      type: 'manual',
      state: manualState,
      district: manualDistrict,
      city: manualCity,
      area: manualArea,
      address: [manualArea, manualCity, manualDistrict, manualState].filter(Boolean).join(', ') || 'Manual Location'
    });
  };

  const handleConfirmSOS = () => {
    // If manual inputs entered but not clicked save, compile location
    let finalLoc = locationInfo;
    if (locationInfo.type !== 'gps' && (manualState || manualCity || manualArea)) {
      finalLoc = {
        type: 'manual',
        state: manualState,
        district: manualDistrict,
        city: manualCity,
        area: manualArea,
        address: [manualArea, manualCity, manualDistrict, manualState].filter(Boolean).join(', ')
      };
    }

    const newInc = createIncident({
      disasterType,
      customDisaster,
      severity,
      affectedPeopleCount,
      specialAssistance,
      customSpecialAssistance,
      requiredHelp,
      customRequiredHelp,
      location: finalLoc,
      description
    });

    setCreatedIncident(newInc);
    setStep(8); // Created screen
    if (onIncidentCreated) {
      onIncidentCreated(newInc);
    }
  };

  const resetFormAndClose = () => {
    setStep(1);
    setCreatedIncident(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Emergency Rescue SOS
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Input-driven rescue request • Step {step > 7 ? 'Done' : `${step} of 7`}
              </p>
            </div>
          </div>
          <button
            onClick={resetFormAndClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Step 1: What happened?</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'flood', label: '🌊 Flood', desc: 'Rising water level' },
                { id: 'earthquake', label: '🫨 Earthquake', desc: 'Building tremors' },
                { id: 'cyclone', label: '🌀 Cyclone', desc: 'Gale windstorm' },
                { id: 'fire', label: '🔥 Fire', desc: 'Flame / Smoke' },
                { id: 'landslide', label: '⛰️ Landslide', desc: 'Mudslide / Slope' },
                { id: 'lightning', label: '⚡ Lightning', desc: 'Thunderstrike' },
                { id: 'medical', label: '🚑 Medical', desc: 'Trauma / Injury' },
                { id: 'accident', label: '🚗 Accident', desc: 'Vehicle collision' },
                { id: 'other', label: '❓ Other', desc: 'Custom emergency' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleDisasterSelect(item.id as DisasterType)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    disasterType === item.id
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold ring-2 ring-red-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="text-sm font-extrabold">{item.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</span>
                </button>
              ))}
            </div>

            {disasterType === 'other' && (
              <input
                type="text"
                placeholder="Specify emergency type..."
                value={customDisaster}
                onChange={e => setCustomDisaster(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step 2: How serious is the situation?
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  id: 'critical',
                  title: '🚨 Immediate Danger',
                  desc: 'Trapped in water, fire, or collapse. Life threat within minutes.'
                },
                {
                  id: 'high',
                  title: '⚠️ Urgent Assistance Required',
                  desc: 'In distress without immediate shelter, medical condition, or rising hazard.'
                },
                {
                  id: 'moderate',
                  title: 'ℹ️ Assistance Required',
                  desc: 'Safe for now but requiring evacuation, food, water, or medicine.'
                },
                {
                  id: 'low',
                  title: '📝 Information / Report Only',
                  desc: 'Reporting local disaster conditions without immediate rescue needs.'
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSeverity(item.id as SeverityLevel)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                    severity === item.id
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold ring-2 ring-red-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="text-sm font-bold">{item.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Step 3: How many people need help?</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '1', title: '1 Person', desc: 'Single individual' },
                { id: '2-5', title: '2 to 5 People', desc: 'Family / Small group' },
                { id: '6-10', title: '6 to 10 People', desc: 'Multiple families' },
                { id: '10+', title: '10+ People', desc: 'Community / Neighborhood' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setAffectedPeopleCount(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    affectedPeopleCount === item.id
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold ring-2 ring-red-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="text-lg font-black block">{item.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-purple-600" />
              <span>Step 4: Does anyone need special assistance?</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select all that apply:</p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'none', label: 'No special assistance' },
                { id: 'elderly', label: '👵 Elderly Person' },
                { id: 'child', label: '👶 Infant / Child' },
                { id: 'medical', label: '🩺 Medical Condition' },
                { id: 'disability', label: '♿ Person with Disability' },
                { id: 'pregnant', label: '🤰 Pregnant Person' }
              ].map(item => {
                const isSelected = specialAssistance.includes(item.id as SpecialAssistanceType);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSpecialToggle(item.id as SpecialAssistanceType)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold ring-2 ring-purple-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-600" />
              <span>Step 5: What help is needed?</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select required rescue services:</p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'evacuation', label: '🚤 Boat / Evacuation' },
                { id: 'medical', label: '🚑 Medical / Ambulance' },
                { id: 'fire_rescue', label: '🚒 Fire & Rescue' },
                { id: 'police', label: '👮 Police / Security' },
                { id: 'shelter', label: '🏠 Emergency Shelter' },
                { id: 'food_water', label: '🍲 Food & Drinking Water' },
                { id: 'search_rescue', label: '🐕 Search & Rescue' }
              ].map(item => {
                const isSelected = requiredHelp.includes(item.id as HelpCategory);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleHelpToggle(item.id as HelpCategory)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold ring-2 ring-amber-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Step 6: Location Information</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Would you like to share your approximate location? Location permission is requested ONLY when you click &quot;Use My Location&quot;.
            </p>

            {/* Use GPS Button */}
            <button
              onClick={handleFetchLocation}
              disabled={locLoading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {locLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching GPS Coordinates...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Use My Location (GPS)</span>
                </>
              )}
            </button>

            {locationInfo.type === 'gps' && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold block">GPS Acquired:</span>
                  <span>{locationInfo.address}</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            )}

            {locError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl text-xs text-red-700 dark:text-red-300">
                {locError}
              </div>
            )}

            {/* Manual Location Input Form */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Or Enter Location Manually:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="State (e.g. Andhra Pradesh)"
                  value={manualState}
                  onChange={e => {
                    setManualState(e.target.value);
                    handleManualLocationSave();
                  }}
                  className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="District (e.g. Krishna)"
                  value={manualDistrict}
                  onChange={e => {
                    setManualDistrict(e.target.value);
                    handleManualLocationSave();
                  }}
                  className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City / Town (e.g. Vijayawada)"
                  value={manualCity}
                  onChange={e => {
                    setManualCity(e.target.value);
                    handleManualLocationSave();
                  }}
                  className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Local Area / Landmark"
                  value={manualArea}
                  onChange={e => {
                    setManualArea(e.target.value);
                    handleManualLocationSave();
                  }}
                  className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Step 7: Additional Situation Information</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Briefly describe what is happening (e.g. water height, smoke severity, landmark near you):
            </p>

            <textarea
              rows={3}
              placeholder="E.g., Water level rising up to 3 feet in street. 2 children and 1 elderly person waiting on terrace near electric pole..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />

            {/* REVIEW SUMMARY CARD */}
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl space-y-2">
              <h4 className="text-xs font-black uppercase text-red-700 dark:text-red-300 tracking-wider">
                Review Emergency Summary
              </h4>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Disaster:</strong> <span className="capitalize">{disasterType}</span></div>
                <div><strong>Severity:</strong> <span className="capitalize">{severity}</span></div>
                <div><strong>People Affected:</strong> {affectedPeopleCount}</div>
                <div><strong>Special Needs:</strong> {specialAssistance.join(', ')}</div>
                <div><strong>Required Help:</strong> {requiredHelp.join(', ')}</div>
                <div>
                  <strong>Location:</strong>{' '}
                  {locationInfo.address ||
                    [manualArea, manualCity, manualDistrict, manualState].filter(Boolean).join(', ') ||
                    'Location skipped'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Created Confirmation Screen */}
        {step === 8 && createdIncident && (
          <div className="space-y-5 text-center py-2">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Emergency Request Received!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your request has been submitted to the DisasterSafe Control Center.
              </p>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-left border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Incident Tracking ID:</span>
                <span className="font-mono font-black text-sm text-red-600 dark:text-red-400">
                  {createdIncident.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                  NEW / AWAITING ASSIGNMENT
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Disaster:</span>
                <span className="font-semibold capitalize">{createdIncident.disasterType}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300">
              🚨 DEMO WORKFLOW — NO REAL EMERGENCY MESSAGE WAS SENT.
              <br />
              <span className="text-[10px] opacity-80">
                Switch to the <strong>Control Center</strong> or <strong>Responder Portal</strong> tabs to complete the rescue simulation!
              </span>
            </div>

            <button
              onClick={resetFormAndClose}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-sm transition-colors shadow-md"
            >
              Close & View Live Status
            </button>
          </div>
        )}

        {/* Wizard Footer Nav Buttons */}
        {step <= 7 && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-3">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${
                step === 1
                  ? 'opacity-30 cursor-not-allowed border-slate-200'
                  : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < 7 ? (
              <button
                onClick={() => setStep(prev => Math.min(7, prev + 1))}
                className="py-2.5 px-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmSOS}
                className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 animate-pulse flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>CONFIRM SOS</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
