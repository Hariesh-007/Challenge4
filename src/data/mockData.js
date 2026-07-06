// FIFA World Cup 2026 Stadiums and Live Mock Data

export const STADIUMS = {
  metlife: {
    id: "metlife",
    name: "MetLife Stadium",
    city: "New York / New Jersey",
    country: "USA",
    capacity: 82500,
    gates: [
      { id: "gate-a", name: "Gate A (Main Plaza)", status: "normal", queueTime: 8, load: 35, accessible: true },
      { id: "gate-b", name: "Gate B (Verizon)", status: "congested", queueTime: 18, load: 70, accessible: true },
      { id: "gate-c", name: "Gate C (Pepsi)", status: "overcrowded", queueTime: 32, load: 95, accessible: false },
      { id: "gate-d", name: "Gate D (Hana)", status: "normal", queueTime: 5, load: 20, accessible: true }
    ],
    zones: [
      { id: "zone-north", name: "North Stand", level: "green", density: "Low" },
      { id: "zone-east", name: "East Stand", level: "yellow", density: "Medium" },
      { id: "zone-south", name: "South Stand (Fan Zone)", level: "red", density: "High" },
      { id: "zone-west", name: "West Stand", level: "green", density: "Low" }
    ],
    amenities: [
      { id: "hyd-1", name: "Hydration Station North", type: "water", zone: "North Stand", x: 140, y: 80 },
      { id: "hyd-2", name: "Hydration Station South", type: "water", zone: "South Stand", x: 160, y: 220 },
      { id: "med-1", name: "Medical Tent East", type: "medical", zone: "East Stand", x: 260, y: 150 },
      { id: "sens-1", name: "Sensory Quiet Room 102", type: "sensory", zone: "West Stand", x: 40, y: 150 },
      { id: "acc-1", name: "Accessibility Assist Desk", type: "accessibility", zone: "Gate A", x: 80, y: 90 }
    ],
    sustainability: {
      solarGeneration: "450 kWh",
      recyclingRate: "82%",
      waterSaved: "12,400 L",
      tips: [
        "Use the Meadowlands Rail Line to reduce transport emissions by 85%.",
        "Bring an empty reusable water bottle (max 500ml) to fill at our 24 hydration stations.",
        "MetLife operates a zero-waste-to-landfill system. Use compost bins for all food waste."
      ]
    }
  },
  azteca: {
    id: "azteca",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    capacity: 87523,
    gates: [
      { id: "gate-a", name: "Acceso Principal A", status: "normal", queueTime: 10, load: 45, accessible: true },
      { id: "gate-b", name: "Acceso Lateral B", status: "normal", queueTime: 12, load: 50, accessible: false },
      { id: "gate-c", name: "Acceso Sur C", status: "congested", queueTime: 25, load: 80, accessible: true },
      { id: "gate-d", name: "Acceso Norte D", status: "normal", queueTime: 7, load: 25, accessible: true }
    ],
    zones: [
      { id: "zone-north", name: "Cabecera Norte", level: "green", density: "Low" },
      { id: "zone-east", name: "Lateral Oriente", level: "red", density: "High" },
      { id: "zone-south", name: "Cabecera Sur", level: "yellow", density: "Medium" },
      { id: "zone-west", name: "Lateral Poniente", level: "green", density: "Low" }
    ],
    amenities: [
      { id: "hyd-1", name: "Estación de Hidratación Norte", type: "water", zone: "Cabecera Norte", x: 150, y: 70 },
      { id: "hyd-2", name: "Estación de Hidratación Poniente", type: "water", zone: "Lateral Poniente", x: 50, y: 150 },
      { id: "med-1", name: "Servicios Médicos Poniente", type: "medical", zone: "Lateral Poniente", x: 60, y: 130 },
      { id: "sens-1", name: "Sala de Estimulación Sensorial", type: "sensory", zone: "Cabecera Sur", x: 150, y: 230 },
      { id: "acc-1", name: "Módulo de Asistencia de Accesibilidad", type: "accessibility", zone: "Acceso Principal A", x: 90, y: 90 }
    ],
    sustainability: {
      solarGeneration: "380 kWh",
      recyclingRate: "79%",
      waterSaved: "15,800 L",
      tips: [
        "Take the Tren Ligero (Light Rail) to Estadio Azteca. It is 100% electric.",
        "Refill your cup at hydration hubs. Avoid buying single-use plastic bottles.",
        "Place organic materials in the brown composting containers distributed in the concourses."
      ]
    }
  },
  bcplace: {
    id: "bcplace",
    name: "BC Place",
    city: "Vancouver",
    country: "Canada",
    capacity: 54500,
    gates: [
      { id: "gate-a", name: "Gate A (Terry Fox Plaza)", status: "normal", queueTime: 5, load: 22, accessible: true },
      { id: "gate-b", name: "Gate B (Pacific Blvd)", status: "normal", queueTime: 7, load: 30, accessible: true },
      { id: "gate-c", name: "Gate C (Griffiths Way)", status: "congested", queueTime: 20, load: 75, accessible: true },
      { id: "gate-d", name: "Gate D (Beatty St)", status: "overcrowded", queueTime: 35, load: 92, accessible: false }
    ],
    zones: [
      { id: "zone-north", name: "North Concourses", level: "yellow", density: "Medium" },
      { id: "zone-east", name: "East Concourses", level: "green", density: "Low" },
      { id: "zone-south", name: "South Concourses", level: "green", density: "Low" },
      { id: "zone-west", name: "West Concourses (Fan Hub)", level: "red", density: "High" }
    ],
    amenities: [
      { id: "hyd-1", name: "Water Station Gate A", type: "water", zone: "North Concourses", x: 140, y: 80 },
      { id: "hyd-2", name: "Water Station Gate C", type: "water", zone: "South Concourses", x: 160, y: 220 },
      { id: "med-1", name: "First Aid Station West", type: "medical", zone: "West Concourses", x: 45, y: 150 },
      { id: "sens-1", name: "Sensory Friendly Suite 210", type: "sensory", zone: "East Concourses", x: 255, y: 150 },
      { id: "acc-1", name: "Universal Access Desk", type: "accessibility", zone: "Gate A", x: 80, y: 100 }
    ],
    sustainability: {
      solarGeneration: "210 kWh",
      recyclingRate: "91%",
      waterSaved: "8,900 L",
      tips: [
        "SkyTrain (Expo Line) drops you directly at Stadium-Chinatown station. 0g carbon footprint!",
        "BC Place operates a cup-return deposit scheme. Return your beverage cups to get $1 back or donate to charity.",
        "BC Place runs on 100% clean, renewable hydroelectric power from BC Hydro."
      ]
    }
  }
};

export const TRANSIT_OPTIONS = [
  {
    id: "metro",
    name: "Rapid Transit / SkyTrain / Metro",
    carbon: 12, // g CO2 per km
    cost: "Low ($2 - $4)",
    etaOffset: 0,
    accessibility: "Fully accessible. Elevators and tactile paving at all stadium stops.",
    icon: "train"
  },
  {
    id: "shuttle",
    name: "Tournament Express Shuttle",
    carbon: 28,
    cost: "Free (with Match Ticket)",
    etaOffset: 5,
    accessibility: "Wheelchair ramp equipped buses, priority seating.",
    icon: "bus"
  },
  {
    id: "rideshare",
    name: "Uber / Lyft / Taxi",
    carbon: 154,
    cost: "High ($25 - $50)",
    etaOffset: 15,
    accessibility: "Must request WAV (Wheelchair Accessible Vehicle) in-app. Drop-off is 400m from stadium entrance.",
    icon: "car"
  },
  {
    id: "walking",
    name: "Walking & Pedestrian Path",
    carbon: 0,
    cost: "Free",
    etaOffset: -5, // Walking cuts through gridlock
    accessibility: "Step-free wide pavements. High pedestrian volume during egress.",
    icon: "walking"
  }
];

export const INITIAL_INCIDENTS = [
  {
    id: "inc-101",
    type: "crowd",
    status: "open",
    severity: "high",
    title: "Gate C Overcrowding",
    stadium: "metlife",
    zone: "South Stand",
    description: "Ticket scanners at Gate C running slowly. Queues extending into outer plaza. Fans getting restless.",
    time: "18:15",
    assignedTo: "Staff Team Alpha"
  },
  {
    id: "inc-102",
    type: "accessibility",
    status: "in-progress",
    severity: "medium",
    title: "Elevator 4 Malfunction",
    stadium: "metlife",
    zone: "East Stand",
    description: "Elevator 4 connecting Concourse Level 1 to Upper Bowl is stuck. Technicians en route. Wheelchair users redirected to Elevator 5.",
    time: "18:22",
    assignedTo: "Facilities Maintenance"
  },
  {
    id: "inc-103",
    type: "medical",
    status: "resolved",
    severity: "low",
    title: "Heat Exhaustion at Fan Zone",
    stadium: "metlife",
    zone: "South Stand",
    description: "Fan experiencing dizziness at South Stand Hydration line. Treated on-site by medics, given fluids, fully recovered.",
    time: "17:45",
    assignedTo: "Medical Unit 2"
  },
  {
    id: "inc-104",
    type: "crowd",
    status: "open",
    severity: "medium",
    title: "Gate D Ticket Scanner Failure",
    stadium: "bcplace",
    zone: "North Concourses",
    description: "Scan Lane 3 is failing to read mobile digital tickets, causing a localized bottleneck.",
    time: "18:30",
    assignedTo: "IT Support"
  }
];

export const SUSTAINABILITY_GAME = [
  { item: "Aluminum Soda Can", category: "recycle", points: 10, tip: "Aluminum is infinitely recyclable. Empty it before throwing!" },
  { item: "Half-Eaten Hot Dog", category: "compost", points: 15, tip: "Food scraps are processed into organic compost for local parks." },
  { item: "Cardboard Nacho Tray (Clean)", category: "recycle", points: 10, tip: "Clean cardboard can be recycled into new packaging." },
  { item: "Plastic Water Bottle", category: "recycle", points: 10, tip: "Help us keep plastics in the circular economy by recycling." },
  { item: "Biodegradable Food Box", category: "compost", points: 15, tip: "This packaging is compostable and will break down naturally." },
  { item: "Single-Use Plastic Straw", category: "landfill", points: 5, tip: "Try to avoid straws! They cannot be sorted easily and go to landfill." },
  { item: "Soiled Paper Napkin", category: "compost", points: 15, tip: "Greasy paper items can't be recycled but they make excellent compost!" }
];
