export interface EmergencyContact {
  id: string;
  category: 'National / Universal' | 'Disaster Response' | 'Medical' | 'Police & Safety' | 'Helplines';
  serviceName: string;
  numberDisplay: string;
  dialableNumber: string;
  description: string;
  isOfficialVerified: boolean;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'cnt-1',
    category: 'National / Universal',
    serviceName: 'National Emergency Number (Single Line)',
    numberDisplay: '112',
    dialableNumber: '112',
    description: 'Unified emergency response support system for Police, Fire, Ambulance & Women Safety.',
    isOfficialVerified: true
  },
  {
    id: 'cnt-2',
    category: 'Disaster Response',
    serviceName: 'National Disaster Response Force (NDRF) Control Room',
    numberDisplay: '011-24363260 / 9711077372',
    dialableNumber: '01124363260',
    description: 'Central NDRF Emergency Operations Center for specialized rescue response.',
    isOfficialVerified: true
  },
  {
    id: 'cnt-3',
    category: 'Disaster Response',
    serviceName: 'National Disaster Management Authority (NDMA)',
    numberDisplay: '1078',
    dialableNumber: '1078',
    description: 'Toll-free NDMA helpline for disaster alerts and emergency guidance.',
    isOfficialVerified: true
  },
  {
    id: 'cnt-4',
    category: 'Police & Safety',
    serviceName: 'Police Helpline',
    numberDisplay: '100',
    dialableNumber: '100',
    description: 'Immediate police emergency assistance.',
    isOfficialVerified: true
  },
  {
    id: 'cnt-5',
    category: 'Police & Safety',
    serviceName: 'Fire & Rescue Services',
    numberDisplay: '101',
    dialableNumber: '101',
    description: 'Fire brigade emergency dispatch.',
    isOfficialVerified: true
  },
  {
    id: 'cnt-6',
    category: 'Medical',
    serviceName: 'Ambulance & Medical Emergency',
    numberDisplay: '108',
    dialableNumber: '108',
    description: 'Free emergency ambulance & medical transport service.',
    isOfficialVerified: true
  },
  {
    id: 'cnt-7',
    category: 'Helplines',
    serviceName: 'Women Helpline',
    numberDisplay: '1091',
    dialableNumber: '1091',
    description: '24/7 emergency response for women safety and distress.',
    isOfficialVerified: true
  },
  {
    id: 'cnt-8',
    category: 'Helplines',
    serviceName: 'Childline Helpline',
    numberDisplay: '1098',
    dialableNumber: '1098',
    description: 'Free 24-hour emergency phone service for children in need of care and protection.',
    isOfficialVerified: true
  },
  {
    id: 'cnt-9',
    category: 'Helplines',
    serviceName: 'Senior Citizen Distress Helpline',
    numberDisplay: '14567',
    dialableNumber: '14567',
    description: 'Elderline for elder care, rescue, and support.',
    isOfficialVerified: true
  }
];
