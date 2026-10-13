import { Facility } from '../types';

export const DEMO_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Government General Hospital Emergency Center',
    type: 'hospital',
    area: 'Labbipet, Vijayawada',
    address: 'NH-16 Hospital Road, Vijayawada',
    distanceKm: 1.2,
    availability: '24/7 Trauma Care Open (42 ICUs available)',
    contact: '+91 866 2470001 (Demo)',
    lat: 16.5075,
    lng: 80.6470
  },
  {
    id: 'fac-2',
    name: 'Apollo Specialty Emergency Care',
    type: 'hospital',
    area: 'Kukatpally, Hyderabad',
    address: 'Main Road Phase 1, Kukatpally',
    distanceKm: 2.8,
    availability: '24/7 Emergency Ward Ready',
    contact: '+91 40 23800000 (Demo)',
    lat: 17.4860,
    lng: 78.4110
  },
  {
    id: 'fac-3',
    name: 'Central Police Station & Control Room',
    type: 'police',
    area: 'Governerpet, Vijayawada',
    address: 'Police Lines Road',
    distanceKm: 1.8,
    availability: '24/7 Active Control Center',
    contact: '+91 866 2570002 (Demo)',
    lat: 16.5110,
    lng: 80.6320
  },
  {
    id: 'fac-4',
    name: 'Regional Fire & Rescue Headquarters',
    type: 'fire_station',
    area: 'Autonagar, Vijayawada',
    address: 'Fire Station Road Sector 3',
    distanceKm: 2.1,
    availability: '6 Fire Tenders & 18 Rescue Personnel On Duty',
    contact: '+91 866 2540101 (Demo)',
    lat: 16.5020,
    lng: 80.6610
  },
  {
    id: 'fac-5',
    name: 'Municipal Indoor Stadium Cyclone Relief Shelter',
    type: 'shelter',
    area: 'Bander Road, Vijayawada',
    address: 'Opp. PB Siddhartha College',
    distanceKm: 0.8,
    capacity: 'Capacity: 1,200 people (450 occupied)',
    availability: 'Food, Water, Clean Beds & First Aid Available',
    contact: '+91 866 2489900 (Demo)',
    lat: 16.5040,
    lng: 80.6490
  },
  {
    id: 'fac-6',
    name: 'Red Cross Community Relief Center',
    type: 'relief_center',
    area: 'Gandhi Nagar',
    address: 'Red Cross Bhavan, Main Road',
    distanceKm: 1.5,
    capacity: 'Food Packets & Dry Rations distribution',
    availability: 'Open 6:00 AM - 10:00 PM',
    contact: '+91 866 2554321 (Demo)',
    lat: 16.5150,
    lng: 80.6380
  }
];
