import { AlertItem } from '../types';

export const INITIAL_DEMO_ALERTS: AlertItem[] = [
  {
    id: 'ALT-101',
    title: 'Severe Flood Warning & Flash Flood Alert',
    disasterType: 'flood',
    severity: 'critical',
    area: 'Krishna River Basin, Vijayawada & Low-lying coastal mandals',
    time: 'Today 09:30 AM',
    instructions: 'Inflow at Prakasam Barrage exceeding 4.5 lakh cusecs. Move to elevated shelter centers immediately. Avoid riverbanks and flooded underpasses.',
    status: 'active',
    isDemo: true
  },
  {
    id: 'ALT-102',
    title: 'High Wind & Heavy Rainfall Warning (Cyclone Alert)',
    disasterType: 'cyclone',
    severity: 'high',
    area: 'Coastal Odisha & Northern Andhra Pradesh Coast',
    time: 'Today 08:00 AM',
    instructions: 'Wind speeds expected 75-90 kmph. Secure outdoor objects, charge power banks, store drinking water, and stay indoors away from windows.',
    status: 'active',
    isDemo: true
  },
  {
    id: 'ALT-103',
    title: 'Severe Heatwave Alert & Health Advisory',
    disasterType: 'weather',
    severity: 'moderate',
    area: 'Telangana & North Interior Karnataka',
    time: 'Yesterday 04:00 PM',
    instructions: 'Temperatures above 42°C expected between 11 AM and 4 PM. Drink plenty of ORS/water, stay in shade, and do not leave children or pets in parked vehicles.',
    status: 'active',
    isDemo: true
  }
];
