import { DonationCause, DonationRecord, ReliefExpenditure, SupplyDonationPledge } from '../types';

export const INITIAL_DONATION_CAUSES: DonationCause[] = [
  {
    id: 'CAUSE-FOOD-01',
    title: 'Emergency Food Packets & Clean Drinking Water',
    description: 'Providing cooked meals, high-protein dry rations, milk powder for infants, and 20L purified water cans to flood-hit relief camps.',
    targetAmount: 1500000,
    raisedAmount: 1120000,
    category: 'food_water',
    icon: 'Utensils',
    urgencyLevel: 'critical',
    impactMultiplier: '₹250 provides 5 Hot Meal Kits & 10L Clean Water',
    activeIncidentsCount: 8
  },
  {
    id: 'CAUSE-MED-02',
    title: 'Trauma First Aid & Emergency Medical Kits',
    description: 'Supplying bandages, antiseptics, tetanus toxoids, ORS packets, insulin, and portable oxygen cylinders to disaster field clinics.',
    targetAmount: 800000,
    raisedAmount: 580000,
    category: 'medical_supplies',
    icon: 'HeartPulse',
    urgencyLevel: 'critical',
    impactMultiplier: '₹1,000 equips 1 Field Doctor First-Aid Emergency Bag',
    activeIncidentsCount: 5
  },
  {
    id: 'CAUSE-SHELTER-03',
    title: 'Warm Blankets & Temporary Shelter Kits',
    description: 'Distributing water-resistant tarpaulins, sleeping mats, thermal blankets, and folding cots for families displaced by storm surges.',
    targetAmount: 1000000,
    raisedAmount: 640000,
    category: 'shelter_blankets',
    icon: 'Home',
    urgencyLevel: 'high',
    impactMultiplier: '₹500 provides 2 Heavy-Duty Blankets & Tarpaulin Sheet',
    activeIncidentsCount: 6
  },
  {
    id: 'CAUSE-RESCUE-04',
    title: 'Inflatable Life Rafts & Search Gear Fund',
    description: 'Funding motorized rubber boats, life jackets, high-intensity floodlights, and rope ladders for NDRF & local rescue divers.',
    targetAmount: 1200000,
    raisedAmount: 920000,
    category: 'rescue_gear',
    icon: 'LifeBuoy',
    urgencyLevel: 'critical',
    impactMultiplier: '₹2,500 funds 5 Life Jackets & Search Flashlight',
    activeIncidentsCount: 4
  },
  {
    id: 'CAUSE-HYGIENE-05',
    title: 'Sanitation, Dignity & Hygiene Kits',
    description: 'Distributing soap, sanitary napkins, chlorine water purification tablets, toothbrushes, and mosquito nets to prevent waterborne disease outbreaks.',
    targetAmount: 500000,
    raisedAmount: 390000,
    category: 'hygiene_kits',
    icon: 'Sparkles',
    urgencyLevel: 'moderate',
    impactMultiplier: '₹350 supplies 1 Family Monthly Hygiene Box',
    activeIncidentsCount: 3
  }
];

export const INITIAL_DONATION_RECORDS: DonationRecord[] = [
  {
    id: 'DON-9821',
    donorName: 'Ananya Sharma',
    donorEmail: 'ananya.s@example.com',
    amount: 5000,
    causeId: 'CAUSE-FOOD-01',
    causeTitle: 'Emergency Food Packets & Clean Drinking Water',
    paymentMethod: 'upi',
    timestamp: '2026-08-13T07:30:00Z',
    transactionId: 'UPI-98421039811',
    status: 'completed',
    impactSummary: 'Funded 100 emergency hot meals & 20L clean water for flood victims in Vijayawada.',
    anonymous: false
  },
  {
    id: 'DON-9820',
    donorName: 'Rajesh Kumar Mehta',
    donorEmail: 'rk.mehta@example.com',
    amount: 10000,
    causeId: 'CAUSE-MED-02',
    causeTitle: 'Trauma First Aid & Emergency Medical Kits',
    paymentMethod: 'card',
    timestamp: '2026-08-13T06:15:00Z',
    transactionId: 'TXN-CARD-881920',
    status: 'completed',
    impactSummary: 'Equipped 10 emergency paramedic field response kits with ORS and trauma dressings.',
    anonymous: false,
    panNumber: 'ABCDE1234F'
  },
  {
    id: 'DON-9819',
    donorName: 'Anonymous Supporter',
    donorEmail: 'donor@privacy.org',
    amount: 2500,
    causeId: 'CAUSE-RESCUE-04',
    causeTitle: 'Inflatable Life Rafts & Search Gear Fund',
    paymentMethod: 'upi',
    timestamp: '2026-08-13T05:40:00Z',
    transactionId: 'UPI-88210394812',
    status: 'completed',
    impactSummary: 'Funded 5 heavy-duty life jackets for flood rescue operations.',
    anonymous: true
  },
  {
    id: 'DON-9818',
    donorName: 'Care Together Foundation',
    donorEmail: 'contact@caretogether.org',
    amount: 50000,
    causeId: 'CAUSE-SHELTER-03',
    causeTitle: 'Warm Blankets & Temporary Shelter Kits',
    paymentMethod: 'netbanking',
    timestamp: '2026-08-12T18:20:00Z',
    transactionId: 'NEFT-3392104921',
    status: 'completed',
    impactSummary: 'Sponsored 200 thermal blankets and 50 tarpaulin emergency shelter roofs.',
    anonymous: false
  }
];

export const INITIAL_RELIEF_EXPENDITURES: ReliefExpenditure[] = [
  {
    id: 'EXP-101',
    causeCategory: 'Food & Clean Water',
    allocatedAmount: 250000,
    itemDispatched: 'Ready-to-Eat Food Packets (Chapati, Rice, Dal) & Water Bottles',
    quantity: '5,000 Packets',
    destination: 'Vijayawada Central Relief Shelter #2',
    timestamp: '2026-08-13T04:00:00Z',
    vendorOrOrg: 'Annapurna Community Kitchens',
    verifiedBy: 'ResQ Control Center Officer S. Verma'
  },
  {
    id: 'EXP-102',
    causeCategory: 'Medical Aid',
    allocatedAmount: 180000,
    itemDispatched: 'Emergency First Aid Pouches, ORS & Anti-Infection Ointments',
    quantity: '1,200 Kits',
    destination: 'Guntur District Trauma Field Station',
    timestamp: '2026-08-12T22:30:00Z',
    vendorOrOrg: 'MedAssist Supplies Pvt Ltd',
    verifiedBy: 'Dr. K. Rao (Medical Officer)'
  },
  {
    id: 'EXP-103',
    causeCategory: 'Rescue Gear',
    allocatedAmount: 320000,
    itemDispatched: 'Inflatable Rubber Rescue Rafts with Outboard Motors & Search Lights',
    quantity: '4 Raft Units & 40 Life Jackets',
    destination: 'NDRF Battalion 10 Fleet Hub',
    timestamp: '2026-08-12T14:15:00Z',
    vendorOrOrg: 'AquaSafety Marine Equipment',
    verifiedBy: 'Commander M. Singh'
  }
];

export const INITIAL_SUPPLY_PLEDGES: SupplyDonationPledge[] = [
  {
    id: 'SUP-501',
    donorName: 'Srinivas Rao',
    phone: '+91 98490 12345',
    itemType: 'Drinking Water Cans (20L)',
    quantity: '50',
    unit: 'Cans',
    location: 'Benz Circle, Vijayawada',
    pickupStatus: 'scheduled',
    notes: 'Can be picked up from warehouse between 9 AM - 5 PM.',
    createdAt: '2026-08-13T06:00:00Z'
  },
  {
    id: 'SUP-502',
    donorName: 'Priya Verma',
    phone: '+91 97110 54321',
    itemType: 'Woolen Blankets',
    quantity: '100',
    unit: 'Pieces',
    location: 'Sector 4, Visakhapatnam',
    pickupStatus: 'received',
    notes: 'Brand new packaged blankets ready for shelter camps.',
    createdAt: '2026-08-12T16:30:00Z'
  }
];
