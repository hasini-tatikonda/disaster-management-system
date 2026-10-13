import { Incident } from '../types';

export const INITIAL_DEMO_INCIDENTS: Incident[] = [
  {
    id: 'DS-1041',
    disasterType: 'flood',
    severity: 'critical',
    affectedPeopleCount: '6-10',
    specialAssistance: ['elderly', 'medical'],
    requiredHelp: ['evacuation', 'medical', 'food_water'],
    location: {
      type: 'manual',
      address: 'Near Prakasham Barrage, Downside Colony',
      state: 'Andhra Pradesh',
      district: 'Krishna',
      city: 'Vijayawada',
      area: 'Labbipet',
      lat: 16.5062,
      lng: 80.6480
    },
    description: 'Flash flood water level rose to 4 feet. Two elderly citizens trapped on 1st floor.',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: 'ACCEPTED',
    assignedResponderId: 'RESP-03',
    assignedResponderName: 'Medical Rescue Team C',
    assignedTeamCategory: 'medical',
    notes: ['Control center verified phone contact.', 'Boat rescue dispatched.'],
    timeline: [
      {
        id: 'evt-1',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        status: 'NEW',
        actor: 'Citizen',
        note: 'SOS triggered via ResQ citizen app.'
      },
      {
        id: 'evt-2',
        timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
        status: 'ACCEPTED',
        actor: 'Medical Rescue Team C',
        note: 'Assignment accepted by Captain Suresh.'
      }
    ]
  },
  {
    id: 'DS-1038',
    disasterType: 'fire',
    severity: 'high',
    affectedPeopleCount: '2-5',
    specialAssistance: ['child'],
    requiredHelp: ['fire_rescue', 'medical'],
    location: {
      type: 'manual',
      address: 'Plot 42, Industrial Area Phase 2',
      state: 'Telangana',
      district: 'Hyderabad',
      city: 'Hyderabad',
      area: 'Kukatpally',
      lat: 17.4849,
      lng: 78.4138
    },
    description: 'Electrical transformer fire spread to commercial godown. Thick smoke in premises.',
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    status: 'EN_ROUTE',
    assignedResponderId: 'RESP-02',
    assignedResponderName: 'Fire & Rescue Team B',
    assignedTeamCategory: 'fire_rescue',
    notes: ['Fire engines dispatched from Kukatpally Station.'],
    timeline: [
      {
        id: 'evt-3',
        timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
        status: 'NEW',
        actor: 'Citizen',
        note: 'Fire Emergency SOS confirmed.'
      },
      {
        id: 'evt-4',
        timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
        status: 'ACCEPTED',
        actor: 'Fire & Rescue Team B',
        note: 'Team assigned by Control Center.'
      },
      {
        id: 'evt-5',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        status: 'EN_ROUTE',
        actor: 'Fire & Rescue Team B',
        note: '2 Tender units en route.'
      }
    ]
  },
  {
    id: 'DS-1035',
    disasterType: 'earthquake',
    severity: 'moderate',
    affectedPeopleCount: '1',
    specialAssistance: ['none'],
    requiredHelp: ['shelter'],
    location: {
      type: 'manual',
      address: 'Block B, Green Valley Apartments',
      state: 'Uttarakhand',
      district: 'Dehradun',
      city: 'Dehradun',
      area: 'Rajpur Road',
      lat: 30.3165,
      lng: 78.0322
    },
    description: 'Minor wall cracks after tremor. Requesting structural evaluation and temporary shelter info.',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'RESOLVED',
    assignedResponderId: 'RESP-04',
    assignedResponderName: 'NDRF Disaster Response Team D',
    assignedTeamCategory: 'disaster_response',
    notes: ['Building inspected and marked safe for entry.', 'Temporary shelter guidelines provided.'],
    timeline: [
      {
        id: 'evt-6',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        status: 'NEW',
        actor: 'Citizen',
        note: 'Earthquake assistance report.'
      },
      {
        id: 'evt-7',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        status: 'RESOLVED',
        actor: 'NDRF Disaster Response Team D',
        note: 'Inspection complete and relief guidance provided.'
      }
    ]
  }
];
