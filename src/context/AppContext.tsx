import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Incident,
  Responder,
  AlertItem,
  ThemeOption,
  LanguageCode,
  UserEnvironment,
  IncidentStatus,
  LocationInfo,
  DisasterType,
  SeverityLevel,
  SpecialAssistanceType,
  HelpCategory,
  DonationCause,
  DonationRecord,
  ReliefExpenditure,
  SupplyDonationPledge
} from '../types';
import { INITIAL_DEMO_INCIDENTS } from '../data/demoIncidents';
import { INITIAL_DEMO_RESPONDERS } from '../data/demoResponders';
import { INITIAL_DEMO_ALERTS } from '../data/demoAlerts';
import { INITIAL_KIT_ITEMS } from '../data/demoKit';
import { db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc
} from 'firebase/firestore';
import {
  INITIAL_DONATION_CAUSES,
  INITIAL_DONATION_RECORDS,
  INITIAL_RELIEF_EXPENDITURES,
  INITIAL_SUPPLY_PLEDGES
} from '../data/demoDonations';
const saveData = async (collection: string, data: any) => {
  try {
    console.log("saving...", collection);

    await setDoc(doc(db, "appData", collection), {
      data,
    });

    console.log("saved successfully");
  } catch (error) {
    console.error("firebase error:", error);
  }
};
interface DraftSOSInput {
  disasterType: DisasterType;
  customDisaster?: string;
  severity: SeverityLevel;
  affectedPeopleCount: string;
  specialAssistance: SpecialAssistanceType[];
  customSpecialAssistance?: string;
  requiredHelp: HelpCategory[];
  customRequiredHelp?: string;
  location: LocationInfo;
  description: string;
}

interface AppContextType {
  incidents: Incident[];
  responders: Responder[];
  alerts: AlertItem[];
  kitCompletedIds: string[];
  activeLanguage: LanguageCode;
  activeTheme: ThemeOption;
  emergencyMode: boolean;
  tutorialCompleted: boolean;
  currentIncidentId: string | null;
  userEnvironment: UserEnvironment;
  organizerLoggedIn: boolean;
  responderSessionId: string | null;
  ngoEmployeeSessionId: string | null;
  ngoOrgName: string | null;

  // Donation State
  donationCauses: DonationCause[];
  donationRecords: DonationRecord[];
  reliefExpenditures: ReliefExpenditure[];
  supplyPledges: SupplyDonationPledge[];

  // Actions
  createIncident: (draft: DraftSOSInput) => Incident;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, actor: string, note: string) => void;
  assignResponder: (incidentId: string, responderId: string) => void;
  createAlert: (alertData: Omit<AlertItem, 'id' | 'time' | 'status' | 'isDemo'>) => void;
  deleteAlert: (alertId: string) => void;
  toggleKitItem: (itemId: string) => void;
  resetKit: () => void;
  setLanguage: (lang: LanguageCode) => void;
  setTheme: (theme: ThemeOption) => void;
  toggleEmergencyMode: () => void;
  completeTutorial: () => void;
  setUserEnvironment: (env: UserEnvironment) => void;
  loginOrganizer: () => void;
  logoutOrganizer: () => void;
  loginResponder: (responderId: string) => void;
  logoutResponder: () => void;
  loginNgoEmployee: (employeeId: string, orgName?: string) => void;
  logoutNgoEmployee: () => void;
  clearCurrentCitizenIncident: () => void;

  // Donation Actions
  addDonation: (donationData: Omit<DonationRecord, 'id' | 'timestamp' | 'transactionId' | 'status'>) => DonationRecord;
  addSupplyPledge: (pledgeData: Omit<SupplyDonationPledge, 'id' | 'createdAt' | 'pickupStatus'>) => SupplyDonationPledge;
  addReliefExpenditure: (expData: Omit<ReliefExpenditure, 'id' | 'timestamp'>) => ReliefExpenditure;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INCIDENTS: 'disastersafe_incidents_v1',
  RESPONDERS: 'disastersafe_responders_v1',
  ALERTS: 'disastersafe_alerts_v1',
  KIT: 'disastersafe_kit_completed_v1',
  LANG: 'disastersafe_lang_v1',
  THEME: 'disastersafe_theme_v1',
  EMERGENCY: 'disastersafe_emergency_v1',
  TUTORIAL: 'disastersafe_tutorial_v1',
  CURRENT_INCIDENT: 'disastersafe_current_inc_v1',
  ENV: 'disastersafe_env_v1',
  ORG_LOGGED: 'disastersafe_org_logged_v1',
  RESP_SESSION: 'disastersafe_resp_session_v1',
  NGO_SESSION: 'disastersafe_ngo_session_v1',
  NGO_ORG: 'disastersafe_ngo_org_v1',
  DONATION_CAUSES: 'disastersafe_don_causes_v1',
  DONATION_RECORDS: 'disastersafe_don_records_v1',
  RELIEF_EXPENDITURES: 'disastersafe_relief_exp_v1',
  SUPPLY_PLEDGES: 'disastersafe_supply_pledges_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Incidents State
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_INCIDENTS;
    } catch {
      return INITIAL_DEMO_INCIDENTS;
    }
  });

  // 2. Responders State
  const [responders, setResponders] = useState<Responder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESPONDERS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_RESPONDERS;
    } catch {
      return INITIAL_DEMO_RESPONDERS;
    }
  });

  // 3. Alerts State
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ALERTS;
    } catch {
      return INITIAL_DEMO_ALERTS;
    }
  });

  // 4. Emergency Kit State
  const [kitCompletedIds, setKitCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KIT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. App Settings
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as LanguageCode) || 'en';
  });

  const [activeTheme, setActiveTheme] = useState<ThemeOption>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as ThemeOption) || 'light';
  });

  const [emergencyMode, setEmergencyMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.EMERGENCY) === 'true';
  });

  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.TUTORIAL) === 'true';
  });

  const [currentIncidentId, setCurrentIncidentId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_INCIDENT) || null;
  });

  const [userEnvironment, setUserEnvironmentState] = useState<UserEnvironment>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ENV) as UserEnvironment) || 'citizen';
  });

  const [organizerLoggedIn, setOrganizerLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ORG_LOGGED) === 'true';
  });

  const [responderSessionId, setResponderSessionId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.RESP_SESSION) || null;
  });

  const [ngoEmployeeSessionId, setNgoEmployeeSessionId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.NGO_SESSION) || null;
  });

  const [ngoOrgName, setNgoOrgName] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.NGO_ORG) || 'Annapurna Relief Foundation';
  });

  // 6. Donation Hub State
  const [donationCauses, setDonationCauses] = useState<DonationCause[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DONATION_CAUSES);
      return saved ? JSON.parse(saved) : INITIAL_DONATION_CAUSES;
    } catch {
      return INITIAL_DONATION_CAUSES;
    }
  });

  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DONATION_RECORDS);
      return saved ? JSON.parse(saved) : INITIAL_DONATION_RECORDS;
    } catch {
      return INITIAL_DONATION_RECORDS;
    }
  });

  const [reliefExpenditures, setReliefExpenditures] = useState<ReliefExpenditure[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RELIEF_EXPENDITURES);
      return saved ? JSON.parse(saved) : INITIAL_RELIEF_EXPENDITURES;
    } catch {
      return INITIAL_RELIEF_EXPENDITURES;
    }
  });

  const [supplyPledges, setSupplyPledges] = useState<SupplyDonationPledge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLY_PLEDGES);
      return saved ? JSON.parse(saved) : INITIAL_SUPPLY_PLEDGES;
    } catch {
      return INITIAL_SUPPLY_PLEDGES;
    }
  });

  // Save changes to LocalStorage
 useEffect(() => {
  saveData("incidents", incidents);
}, [incidents]);

useEffect(() => {
  saveData("responders", responders);
}, [responders]);

useEffect(() => {
  saveData("alerts", alerts);
}, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KIT, JSON.stringify(kitCompletedIds));
  }, [kitCompletedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, activeLanguage);
  }, [activeLanguage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, activeTheme);
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${activeTheme}`);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMERGENCY, String(emergencyMode));
  }, [emergencyMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TUTORIAL, String(tutorialCompleted));
  }, [tutorialCompleted]);

  useEffect(() => {
    if (currentIncidentId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_INCIDENT, currentIncidentId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_INCIDENT);
    }
  }, [currentIncidentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENV, userEnvironment);
  }, [userEnvironment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORG_LOGGED, String(organizerLoggedIn));
  }, [organizerLoggedIn]);

  useEffect(() => {
    if (responderSessionId) {
      localStorage.setItem(STORAGE_KEYS.RESP_SESSION, responderSessionId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.RESP_SESSION);
    }
  }, [responderSessionId]);

  useEffect(() => {
    if (ngoEmployeeSessionId) {
      localStorage.setItem(STORAGE_KEYS.NGO_SESSION, ngoEmployeeSessionId);
      if (ngoOrgName) localStorage.setItem(STORAGE_KEYS.NGO_ORG, ngoOrgName);
    } else {
      localStorage.removeItem(STORAGE_KEYS.NGO_SESSION);
      localStorage.removeItem(STORAGE_KEYS.NGO_ORG);
    }
  }, [ngoEmployeeSessionId, ngoOrgName]);

 useEffect(() => {
  saveData("donationCauses", donationCauses);
}, [donationCauses]);

useEffect(() => {
  saveData("donationRecords", donationRecords);
}, [donationRecords]);

useEffect(() => {
  saveData("reliefExpenditures", reliefExpenditures);
}, [reliefExpenditures]);

useEffect(() => {
  saveData("supplyPledges", supplyPledges);
}, [supplyPledges]);

  // Handler implementations
  const createIncident = (draft: DraftSOSInput): Incident => {
    const nextNum = 1042 + incidents.length;
    const newId = `DS-${nextNum}`;
    const now = new Date().toISOString();

    const newIncident: Incident = {
      id: newId,
      disasterType: draft.disasterType,
      customDisaster: draft.customDisaster,
      severity: draft.severity,
      affectedPeopleCount: draft.affectedPeopleCount,
      specialAssistance: draft.specialAssistance,
      customSpecialAssistance: draft.customSpecialAssistance,
      requiredHelp: draft.requiredHelp,
      customRequiredHelp: draft.customRequiredHelp,
      location: draft.location,
      description: draft.description || 'Citizen requested emergency rescue assistance via ResQ SOS.',
      createdAt: now,
      status: 'NEW',
      notes: ['Incident submitted via ResQ Citizen SOS flow.'],
      timeline: [
        {
          id: `evt-${Date.now()}`,
          timestamp: now,
          status: 'NEW',
          actor: 'Citizen',
          note: 'Emergency request confirmed by citizen.'
        }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);
    setCurrentIncidentId(newId);

    // Auto-create notification alert if critical
    if (draft.severity === 'critical') {
      const newAlert: AlertItem = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        title: `CRITICAL SOS: ${draft.disasterType.toUpperCase()} in ${draft.location.area || draft.location.city || 'Citizen Area'}`,
        disasterType: draft.disasterType,
        severity: 'critical',
        area: draft.location.area || draft.location.city || draft.location.state || 'Local Area',
        time: 'Just now',
        instructions: `Emergency reported for ${draft.affectedPeopleCount} people. Required assistance: ${draft.requiredHelp.join(', ')}.`,
        status: 'active',
        isDemo: true
      };
      setAlerts(prev => [newAlert, ...prev]);
    }

    return newIncident;
  };

  const updateIncidentStatus = (incidentId: string, status: IncidentStatus, actor: string, note: string) => {
    const now = new Date().toISOString();

    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          const updatedTimeline = [
            ...inc.timeline,
            {
              id: `evt-${Date.now()}`,
              timestamp: now,
              status,
              actor,
              note
            }
          ];
          return {
            ...inc,
            status,
            timeline: updatedTimeline
          };
        }
        return inc;
      })
    );

    // If status is updated by responder, sync responder status
    setResponders(prev =>
      prev.map(resp => {
        if (resp.currentIncidentId === incidentId) {
          let newRespStatus = resp.status;
          if (status === 'EN_ROUTE') newRespStatus = 'en_route';
          if (status === 'ARRIVED' || status === 'ASSISTANCE_STARTED') newRespStatus = 'on_scene';
          if (status === 'RESOLVED') newRespStatus = 'available';

          return {
            ...resp,
            status: newRespStatus,
            currentIncidentId: status === 'RESOLVED' ? undefined : resp.currentIncidentId
          };
        }
        return resp;
      })
    );
  };

  const assignResponder = (incidentId: string, responderId: string) => {
    const responder = responders.find(r => r.id === responderId);
    if (!responder) return;

    const now = new Date().toISOString();

    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'ACCEPTED',
            assignedResponderId: responder.id,
            assignedResponderName: responder.teamName,
            assignedTeamCategory: responder.category,
            timeline: [
              ...inc.timeline,
              {
                id: `evt-${Date.now()}`,
                timestamp: now,
                status: 'ACCEPTED',
                actor: 'Control Center',
                note: `Assigned to ${responder.teamName} (${responder.leaderName}).`
              }
            ]
          };
        }
        return inc;
      })
    );

    setResponders(prev =>
      prev.map(r => {
        if (r.id === responderId) {
          return {
            ...r,
            status: 'assigned',
            currentIncidentId: incidentId
          };
        }
        return r;
      })
    );
  };

  const createAlert = (alertData: Omit<AlertItem, 'id' | 'time' | 'status' | 'isDemo'>) => {
    const newAlert: AlertItem = {
      ...alertData,
      id: `ALT-${Date.now().toString().slice(-4)}`,
      time: 'Just now',
      status: 'active',
      isDemo: true
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const toggleKitItem = (itemId: string) => {
    setKitCompletedIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const resetKit = () => {
    setKitCompletedIds([]);
  };

  const toggleEmergencyMode = () => {
    setEmergencyMode(prev => !prev);
  };

  const completeTutorial = () => {
    setTutorialCompleted(true);
  };

  const setUserEnvironment = (env: UserEnvironment) => {
    setUserEnvironmentState(env);
  };

  const loginOrganizer = () => setOrganizerLoggedIn(true);
  const logoutOrganizer = () => setOrganizerLoggedIn(false);

  const loginResponder = (id: string) => setResponderSessionId(id);
  const logoutResponder = () => setResponderSessionId(null);

  const loginNgoEmployee = (employeeId: string, orgName?: string) => {
    setNgoEmployeeSessionId(employeeId);
    if (orgName) setNgoOrgName(orgName);
  };
  const logoutNgoEmployee = () => setNgoEmployeeSessionId(null);

  const clearCurrentCitizenIncident = () => setCurrentIncidentId(null);

  const addDonation = (donationData: Omit<DonationRecord, 'id' | 'timestamp' | 'transactionId' | 'status'>): DonationRecord => {
    const now = new Date().toISOString();
    const newId = `DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const txnId = `TXN-${donationData.paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newRecord: DonationRecord = {
      ...donationData,
      id: newId,
      timestamp: now,
      transactionId: txnId,
      status: 'completed'
    };

    setDonationRecords(prev => [newRecord, ...prev]);

    // Increase raised amount for cause
    if (donationData.causeId) {
      setDonationCauses(prev =>
        prev.map(c => {
          if (c.id === donationData.causeId) {
            return {
              ...c,
              raisedAmount: c.raisedAmount + donationData.amount
            };
          }
          return c;
        })
      );
    }

    return newRecord;
  };

  const addSupplyPledge = (pledgeData: Omit<SupplyDonationPledge, 'id' | 'createdAt' | 'pickupStatus'>): SupplyDonationPledge => {
    const now = new Date().toISOString();
    const newId = `SUP-${Math.floor(500 + Math.random() * 500)}`;

    const newPledge: SupplyDonationPledge = {
      ...pledgeData,
      id: newId,
      pickupStatus: 'pledged',
      createdAt: now
    };

    setSupplyPledges(prev => [newPledge, ...prev]);
    return newPledge;
  };

  const addReliefExpenditure = (expData: Omit<ReliefExpenditure, 'id' | 'timestamp'>): ReliefExpenditure => {
    const now = new Date().toISOString();
    const newId = `EXP-${Math.floor(200 + Math.random() * 800)}`;

    const newExp: ReliefExpenditure = {
      ...expData,
      id: newId,
      timestamp: now
    };

    setReliefExpenditures(prev => [newExp, ...prev]);
    return newExp;
  };

  return (
    <AppContext.Provider
      value={{
        incidents,
        responders,
        alerts,
        kitCompletedIds,
        activeLanguage,
        activeTheme,
        emergencyMode,
        tutorialCompleted,
        currentIncidentId,
        userEnvironment,
        organizerLoggedIn,
        responderSessionId,
        ngoEmployeeSessionId,
        ngoOrgName,

        donationCauses,
        donationRecords,
        reliefExpenditures,
        supplyPledges,

        createIncident,
        updateIncidentStatus,
        assignResponder,
        createAlert,
        deleteAlert,
        toggleKitItem,
        resetKit,
        setLanguage: setActiveLanguage,
        setTheme: setActiveTheme,
        toggleEmergencyMode,
        completeTutorial,
        setUserEnvironment,
        loginOrganizer,
        logoutOrganizer,
        loginResponder,
        logoutResponder,
        loginNgoEmployee,
        logoutNgoEmployee,
        clearCurrentCitizenIncident,

        addDonation,
        addSupplyPledge,
        addReliefExpenditure
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
