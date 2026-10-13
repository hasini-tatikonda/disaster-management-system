export interface DisasterGuide {
  id: string;
  disasterType: string;
  title: string;
  iconName: string;
  summary: string;
  before: string[];
  during: string[];
  after: string[];
  precautions: string[];
}

export const DISASTER_GUIDES: DisasterGuide[] = [
  {
    id: 'guide-flood',
    disasterType: 'flood',
    title: 'Flood Safety Guide',
    iconName: 'Waves',
    summary: 'Essential procedures for sudden inundation, rising water levels, and flash flood scenarios.',
    before: [
      'Know your area’s flood vulnerability and nearest official relief shelters.',
      'Prepare an Emergency Kit with 3 days of clean drinking water, non-perishable food, flashlight, and medicines.',
      'Keep important family documents in waterproof sealed bags.',
      'Install check-valves in building sewer traps to prevent flood backup.'
    ],
    during: [
      'Move immediately to higher ground or upper floors if water enters your house.',
      'Turn off main electricity, gas valves, and water supplies before evacuating.',
      'Do NOT walk or drive through flowing water. Just 6 inches of moving water can knock you down.',
      'Keep listening to official weather broadcasts via battery radio or ResQ app alerts.'
    ],
    after: [
      'Avoid standing floodwater; it may be contaminated with sewage or carry live electrical wires.',
      'Boil drinking water thoroughly before consuming to prevent waterborne diseases.',
      'Inspect house walls, electrical wiring, and gas fittings for damage before re-entering.',
      'Document damaged property with photos for relief claims.'
    ],
    precautions: [
      'Never touch fallen power lines or electrical equipment sitting in water.',
      'Do not eat food that has come in contact with floodwaters.',
      'Avoid bridges over fast-rising rivers.'
    ]
  },
  {
    id: 'guide-earthquake',
    disasterType: 'earthquake',
    title: 'Earthquake Safety Guide',
    iconName: 'Activity',
    summary: 'Immediate drop-cover-hold actions and post-tremor building inspection guidelines.',
    before: [
      'Fasten heavy furniture, tall bookcases, and water heaters securely to walls.',
      'Identify safe spots in every room: under sturdy tables, desks, or against interior walls.',
      'Conduct regular Drop, Cover, and Hold On family drills.',
      'Keep emergency flashlights and sturdy shoes beside your bed.'
    ],
    during: [
      'DROP to your hands and knees immediately.',
      'COVER your head and neck under a sturdy table or desk.',
      'HOLD ON to your shelter until shaking stops completely.',
      'If outdoors, move to an open area away from buildings, power lines, streetlights, and trees.',
      'If in a vehicle, pull over safely in an open space and stay inside.'
    ],
    after: [
      'Expect aftershocks. Be prepared to Drop, Cover, and Hold On again.',
      'Check yourself and family members for injuries and apply first aid.',
      'Check for gas leaks. If you smell gas or hear hissing, open windows and leave immediately.',
      'Do NOT use elevators. Use stairs carefully.'
    ],
    precautions: [
      'Do not run outside while shaking is occurring; falling debris is the leading cause of injury.',
      'Do not light matches or use flame lighters due to potential gas leaks.',
      'Do not re-enter cracked or structurally compromised buildings.'
    ]
  },
  {
    id: 'guide-cyclone',
    disasterType: 'cyclone',
    title: 'Cyclone & Windstorm Guide',
    iconName: 'Wind',
    summary: 'Structural protection, storm surge evacuation, and windstorm survival steps.',
    before: [
      'Trim dead trees, branches, and secure loose outdoor objects or roof sheets.',
      'Board up or tape glass windows securely to withstand gale-force winds.',
      'Stock adequate dry food, drinking water, power banks, and essential medications.',
      'Know your local evacuation route to the nearest cyclone shelter.'
    ],
    during: [
      'Stay indoors in the strongest central room, away from windows and glass doors.',
      'Keep doors and windows firmly shut on the side facing the wind.',
      'Do NOT be fooled if wind suddenly drops; it may be the eye of the storm. High winds will resume quickly from the opposite direction.',
      'Disconnect electrical appliances to protect against high-voltage power surges.'
    ],
    after: [
      'Remain inside until official announcements confirm the cyclone has passed completely.',
      'Watch out for fallen trees, electrical poles, and exposed live wires.',
      'Report damaged water or power lines to emergency authorities.'
    ],
    precautions: [
      'Never go outside during the storm eye period.',
      'Avoid coastal areas or beaches due to dangerous storm surges.',
      'Do not consume exposed or unboiled water.'
    ]
  },
  {
    id: 'guide-fire',
    disasterType: 'fire',
    title: 'Fire & Building Safety Guide',
    iconName: 'Flame',
    summary: 'Evacuation techniques, smoke inhalation prevention, and fire extinguisher usage.',
    before: [
      'Install smoke detectors and keep an ABC-rated fire extinguisher in the kitchen.',
      'Plan two emergency exit routes from every room in your residence.',
      'Keep stairways and exit corridors free from clutter or stored items.'
    ],
    during: [
      'CRAWL LOW under smoke to reach the nearest exit. Clean air is near the floor.',
      'Feel door handles with the back of your hand before opening. If hot, do NOT open.',
      'If your clothes catch fire: STOP, DROP, and ROLL until flames are out.',
      'If trapped, close doors, seal gaps under doors with wet towels, and signal at a window.'
    ],
    after: [
      'Seek immediate medical care for burns or smoke inhalation.',
      'Do NOT enter a fire-damaged building until cleared by fire department personnel.'
    ],
    precautions: [
      'Never use elevators during a fire evacuation.',
      'Never re-enter a burning building to retrieve belongings.'
    ]
  },
  {
    id: 'guide-landslide',
    disasterType: 'landslide',
    title: 'Landslide & Mudflow Guide',
    iconName: 'Mountain',
    summary: 'Slope monitoring, warning signs, and evacuation procedures in hilly areas.',
    before: [
      'Learn about past landslide hazards in your hilly or mountain region.',
      'Watch for warning signs: leaning trees, new cracks in soil, or sudden muddy stream flow.',
      'Plant deep-rooted native vegetation on slopes near your property.'
    ],
    during: [
      'Evacuate immediately if you hear unusual rumbling sounds or cracking trees.',
      'If escape is impossible, curl into a tight ball and cover your head securely.'
    ],
    after: [
      'Stay away from the slide area. Secondary slides can occur without warning.',
      'Check for trapped or injured persons near the slide margins without entering unstable soil.'
    ],
    precautions: [
      'Never build near steep slopes or drainage channels without geotechnical advice.',
      'Do not sleep in lower ground rooms facing steep slopes during heavy rain.'
    ]
  },
  {
    id: 'guide-lightning',
    disasterType: 'lightning',
    title: 'Lightning & Thunderstorm Guide',
    iconName: 'Zap',
    summary: 'The 30-30 safety rule, lightning squat posture, and electrical precautions.',
    before: [
      'Check weather forecasts before outdoor farm work or travel.',
      'Apply the 30-30 Rule: If thunder follows lightning within 30 seconds, go indoors immediately.'
    ],
    during: [
      'Seek shelter in a fully enclosed building or hard-topped metal vehicle.',
      'If caught in an open field: Crouch down in a low spot, feet together, hands over ears (Lightning Squat).',
      'Unplug sensitive electronics and avoid using corded telephones.'
    ],
    after: [
      'Wait 30 minutes after the last thunder clap before resuming outdoor activities.',
      'Give immediate CPR/first aid to lightning victims; they do NOT hold an electrical charge.'
    ],
    precautions: [
      'Do NOT shelter under tall isolated trees or metal towers.',
      'Do NOT touch metal fences, farm machinery, or water pipes during a thunderstorm.'
    ]
  },
  {
    id: 'guide-heatwave',
    disasterType: 'heatwave',
    title: 'Heatwave & Sunstroke Guide',
    iconName: 'Sun',
    summary: 'Hydration protocols, heat stroke recognition, and cooling measures.',
    before: [
      'Stock ORS packets, glucose, lemon, and clean drinking water.',
      'Install shade curtains or green mesh on outdoor balconies and sun-facing windows.'
    ],
    during: [
      'Drink water frequently every 20 minutes, even if you do not feel thirsty.',
      'Wear lightweight, light-colored, loose cotton clothes and a wide hat or umbrella outdoors.',
      'Avoid strenuous physical activity between 11:00 AM and 4:00 PM.'
    ],
    after: [
      'If someone suffers heatstroke (high temp, confusion, hot dry skin): Move them to shade immediately.',
      'Apply cold wet cloths to neck, armpits, and groin while waiting for ambulance.'
    ],
    precautions: [
      'Never leave children or pets inside parked vehicles.',
      'Avoid high-protein food and alcohol during extreme heat.'
    ]
  }
];
