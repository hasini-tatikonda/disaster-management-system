import { Responder } from '../types';

export const INITIAL_DEMO_RESPONDERS: Responder[] = [
  {
    id: 'RESP-01',
    teamName: 'Police Tactical Squad Alpha',
    leaderName: 'Inspector Rajesh Varma',
    category: 'police',
    phone: '+91 98765 10001 (Demo)',
    area: 'Central City Sector 1',
    status: 'available',
    lat: 16.5080,
    lng: 80.6400,
    vehicle: 'Police Patrol Unit 04'
  },
  {
    id: 'RESP-02',
    teamName: 'Fire & Rescue Team B',
    leaderName: 'Station Officer M. K. Rao',
    category: 'fire_rescue',
    phone: '+91 98765 10002 (Demo)',
    area: 'Kukatpally / Industrial Belt',
    status: 'en_route',
    currentIncidentId: 'DS-1038',
    lat: 17.4850,
    lng: 78.4140,
    vehicle: 'Water Tender Unit 02'
  },
  {
    id: 'RESP-03',
    teamName: 'Medical Rapid Response Team C',
    leaderName: 'Dr. Ananya Roy',
    category: 'medical',
    phone: '+91 98765 10003 (Demo)',
    area: 'Vijayawada Urban & Riverfront',
    status: 'assigned',
    currentIncidentId: 'DS-1041',
    lat: 16.5065,
    lng: 80.6485,
    vehicle: 'Advanced Life Support Ambulance 09'
  },
  {
    id: 'RESP-04',
    teamName: 'NDRF Disaster Response Battalion D',
    leaderName: 'Commander Vikram Singh',
    category: 'disaster_response',
    phone: '+91 98765 10004 (Demo)',
    area: 'Northern Hill Region & Dehradun',
    status: 'available',
    lat: 30.3170,
    lng: 78.0330,
    vehicle: 'NDRF All-Terrain Transport'
  },
  {
    id: 'RESP-05',
    teamName: 'Civil Defense Search & Rescue E',
    leaderName: 'K. Parthasarathy',
    category: 'search_rescue',
    phone: '+91 98765 10005 (Demo)',
    area: 'Coastal Emergency Zone',
    status: 'available',
    lat: 16.5020,
    lng: 80.6520,
    vehicle: 'Inflatable Rescue Boat & Van'
  }
];
