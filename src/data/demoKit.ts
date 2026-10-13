import { EmergencyKitItem } from '../types';

export const INITIAL_KIT_ITEMS: EmergencyKitItem[] = [
  {
    id: 'kit-1',
    category: 'water_food',
    title: 'Clean Drinking Water (12 Liters)',
    description: 'Minimum 3 Liters per person per day for 4 days in sealed bottles.',
    completed: false
  },
  {
    id: 'kit-2',
    category: 'water_food',
    title: 'Non-Perishable Dry Food & Energy Bars',
    description: 'High-calorie dry snacks, biscuits, nuts, ORS packets, baby food if needed.',
    completed: false
  },
  {
    id: 'kit-3',
    category: 'medical',
    title: 'First Aid Kit & Antiseptic Supplies',
    description: 'Bandages, sterile gauze, burn ointment, iodine solution, scissors, tape.',
    completed: false
  },
  {
    id: 'kit-4',
    category: 'medical',
    title: 'Essential Prescription Medicines',
    description: 'Minimum 7-day supply of daily medications (blood pressure, diabetes, asthma, etc.).',
    completed: false
  },
  {
    id: 'kit-5',
    category: 'tools',
    title: 'Heavy-Duty Flashlight & Spare Batteries',
    description: 'Waterproof LED torchlight or headlamp with extra lithium batteries.',
    completed: false
  },
  {
    id: 'kit-6',
    category: 'tools',
    title: 'Loud Emergency Whistle',
    description: 'To signal search and rescue teams if trapped under debris or in floodwaters.',
    completed: false
  },
  {
    id: 'kit-7',
    category: 'supplies',
    title: 'Charged Power Bank (20,000 mAh)',
    description: 'Fully charged portable battery pack with multi-head USB cables.',
    completed: false
  },
  {
    id: 'kit-8',
    category: 'documents',
    title: 'Waterproof Document Pouch',
    description: 'Copies of Aadhaar cards, PAN, insurance papers, bank details, land deeds, and emergency contacts.',
    completed: false
  },
  {
    id: 'kit-9',
    category: 'supplies',
    title: 'Sanitary & Hygiene Supplies',
    description: 'Hand sanitizer, wet wipes, soap, sanitary napkins, garbage bags.',
    completed: false
  },
  {
    id: 'kit-10',
    category: 'tools',
    title: 'Multi-Tool Knife & Rope',
    description: 'Swiss knife/pliers, 10-meter sturdy nylon rope, duct tape.',
    completed: false
  }
];
