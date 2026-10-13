export type DisasterType = 
  | 'flood'
  | 'earthquake'
  | 'cyclone'
  | 'fire'
  | 'landslide'
  | 'lightning'
  | 'weather'
  | 'medical'
  | 'accident'
  | 'other';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export type SpecialAssistanceType = 
  | 'child'
  | 'elderly'
  | 'medical'
  | 'disability'
  | 'pregnant'
  | 'none'
  | 'other';

export type HelpCategory = 
  | 'medical'
  | 'fire_rescue'
  | 'police'
  | 'evacuation'
  | 'shelter'
  | 'food_water'
  | 'search_rescue'
  | 'other';

export interface LocationInfo {
  type: 'gps' | 'manual' | 'skipped';
  lat?: number;
  lng?: number;
  address?: string;
  state?: string;
  district?: string;
  city?: string;
  area?: string;
  rawError?: string;
}

export type IncidentStatus = 
  | 'NEW'
  | 'ACCEPTED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'ASSISTANCE_STARTED'
  | 'ADDITIONAL_SUPPORT'
  | 'RESOLVED';

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  status: IncidentStatus;
  actor: string;
  note: string;
}

export interface Incident {
  id: string; // e.g. "DS-1042"
  disasterType: DisasterType;
  customDisaster?: string;
  severity: SeverityLevel;
  affectedPeopleCount: string; // "1", "2-5", "6-10", "10+"
  specialAssistance: SpecialAssistanceType[];
  customSpecialAssistance?: string;
  requiredHelp: HelpCategory[];
  customRequiredHelp?: string;
  location: LocationInfo;
  description: string;
  createdAt: string;
  status: IncidentStatus;
  assignedResponderId?: string;
  assignedResponderName?: string;
  assignedTeamCategory?: string;
  notes: string[];
  timeline: IncidentTimelineEvent[];
}

export type ResponderCategory = 'police' | 'fire_rescue' | 'medical' | 'disaster_response' | 'search_rescue';

export interface Responder {
  id: string;
  teamName: string;
  leaderName: string;
  category: ResponderCategory;
  phone: string;
  area: string;
  status: 'available' | 'assigned' | 'en_route' | 'on_scene' | 'busy';
  currentIncidentId?: string;
  lat: number;
  lng: number;
  vehicle: string;
}

export interface AlertItem {
  id: string;
  title: string;
  disasterType: DisasterType;
  severity: SeverityLevel;
  area: string;
  time: string;
  instructions: string;
  status: 'active' | 'resolved';
  isDemo: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire_station' | 'shelter' | 'relief_center';
  area: string;
  address: string;
  distanceKm: number;
  availability: string;
  capacity?: string;
  contact: string;
  lat: number;
  lng: number;
}

export type ThemeOption = 'light' | 'dark';

export type LanguageCode = 
  | 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' 
  | 'bn' | 'mr' | 'gu' | 'pa' | 'or' | 'as' 
  | 'ur' | 'ne';

export type UserEnvironment = 'citizen' | 'control-center' | 'responder' | 'donation-center';

export interface DonationCause {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  category: 'food_water' | 'medical_supplies' | 'shelter_blankets' | 'rescue_gear' | 'hygiene_kits' | 'general_relief';
  icon: string;
  urgencyLevel: 'high' | 'critical' | 'moderate';
  impactMultiplier: string; // e.g. "1 Food Packet = 4 Meals"
  activeIncidentsCount: number;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  causeId: string;
  causeTitle: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cash_pledge';
  timestamp: string;
  transactionId: string;
  status: 'completed' | 'processing';
  impactSummary: string;
  anonymous: boolean;
  panNumber?: string;
}

export interface ReliefExpenditure {
  id: string;
  causeCategory: string;
  allocatedAmount: number;
  itemDispatched: string;
  quantity: string;
  destination: string;
  timestamp: string;
  vendorOrOrg: string;
  verifiedBy: string;
}

export interface SupplyDonationPledge {
  id: string;
  donorName: string;
  phone: string;
  itemType: string;
  quantity: string;
  unit: string;
  location: string;
  pickupStatus: 'pledged' | 'scheduled' | 'received';
  notes?: string;
  createdAt: string;
}

export interface EmergencyKitItem {
  id: string;
  category: 'water_food' | 'medical' | 'tools' | 'documents' | 'supplies';
  title: string;
  description: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}
