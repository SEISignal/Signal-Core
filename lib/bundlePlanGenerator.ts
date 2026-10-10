import { ClimateType, ProfessionType, RiskLevel, CustomBundle, PlanPhase, PracticeDrill } from './bundleTypes';
import { Packet } from './data';

interface GenerateBundleParams {
  name: string;
  description?: string;
  climate: ClimateType;
  profession: ProfessionType;
  riskLevel: RiskLevel;
  selectedPacketIds: string[];
  selectedBranchIds?: string[];
  packets: Packet[];
}

// Environmental adaptations
const CLIMATE_MODIFIERS: Record<ClimateType, { label: string; drillFocus: string; note: string }> = {
  arid: {
    label: "Arid / Desert",
    drillFocus: "Solar UV water disinfection (SODIS), oral rehydration titration, and heat exhaustion mitigation",
    note: "High diurnal temperature swings and acute dehydration vectors prioritize extreme water economy and early-morning physical drills."
  },
  temperate: {
    label: "Temperate Zone",
    drillFocus: "Rapid shelter insulation, dual-layer thermal regulation, and wet-to-dry transition protocols",
    note: "Seasonal precipitation and fluctuating baseline temperatures require dual-condition gear readiness."
  },
  tropical: {
    label: "Tropical / Humid",
    drillFocus: "Waterborne microbial containment, aggressive surface sanitation, and rapid skin wound care",
    note: "Elevated humidity accelerates bacterial proliferation and reduces evaporative cooling efficiency."
  },
  subarctic: {
    label: "Cold / Subarctic",
    drillFocus: "Core hypothermia rewarming, conductive ground insulation, and high-calorie fuel metabolism",
    note: "Ground conduction drains core heat 25x faster than air. All mechanical repairs must be executable with cold hands."
  }
};

const PROFESSION_MODIFIERS: Record<ProfessionType, { label: string; roleEmphasis: string }> = {
  healthcare: {
    label: "Healthcare / Medical",
    roleEmphasis: "Triage prioritization, improvised vascular control, and secondary infection prevention under austere conditions."
  },
  trades: {
    label: "Trades / Mechanical",
    roleEmphasis: "Utility isolation (gas/water/electric), mechanical bypasses, load-bearing rigging, and generator isolation."
  },
  logistics: {
    label: "Logistics / Field Ops",
    roleEmphasis: "Route navigation with handrails, pace counting with cargo, and emergency convoy communications."
  },
  urban_resident: {
    label: "Urban Resident",
    roleEmphasis: "Vertical egress in blackout conditions, apartment-scale water purification, and civilian de-escalation."
  },
  security_field: {
    label: "Field Operator / Security",
    roleEmphasis: "S.T.O.P. situational threat auditing, high-stress tourniquet application, and rapid site evacuation."
  }
};

export function generateCustomBundle(params: GenerateBundleParams): CustomBundle {
  const {
    name,
    description = "",
    climate,
    profession,
    riskLevel,
    selectedPacketIds,
    selectedBranchIds = [],
    packets
  } = params;

  const climateInfo = CLIMATE_MODIFIERS[climate];
  const professionInfo = PROFESSION_MODIFIERS[profession];

  // Filter selected packets
  const chosenPackets = packets.filter(p => selectedPacketIds.includes(p.id));

  // Determine drill frequency & intensity based on risk level
  const baseFrequency = riskLevel === 'high' ? 'daily' : riskLevel === 'moderate' ? 'biweekly' : 'weekly';
  const timeMultiplier = riskLevel === 'high' ? 1.5 : riskLevel === 'moderate' ? 1.2 : 1.0;

  // Build Phase 1: Immediate Triage & Foundation Drills (Days 1–7)
  const phase1Drills: PracticeDrill[] = [];
  const phase1Milestones: string[] = [
    `Establish baseline personal checklist for ${professionInfo.label} operational profile.`,
    `Audit essential tools against ${climateInfo.label} climate stressors.`
  ];

  // First Aid drills
  if (selectedPacketIds.includes('first-aid')) {
    phase1Drills.push({
      id: `drill-fa-1-${Date.now()}`,
      title: "Direct Pressure & Hemorrhage Control Drill",
      category: "First Aid",
      durationMinutes: Math.round(10 * timeMultiplier),
      frequency: baseFrequency,
      difficulty: "Foundation",
      description: "Blindfold or timed direct pressure application on arterial simulation points.",
      instructions: [
        "Position yourself over simulated limb within 5 seconds.",
        "Apply bodyweight-assisted direct two-handed palm compression.",
        "Maintain unbroken downward seal for 3 full minutes without shifting hands.",
        "Inspect wound site for bleed-through before securing pressure wrap."
      ],
      equipmentNeeded: ["Clean cloth or combat dressing", "Timer"],
      completed: false,
      environmentNote: climate === 'subarctic' ? "Practice through heavy insulated work gloves." : undefined
    });
  }

  // Water & Sanitation drills
  if (selectedPacketIds.includes('water-sanitation')) {
    phase1Drills.push({
      id: `drill-ws-1-${Date.now()}`,
      title: "Gravity Pre-Filter & Chemical Dosing Protocol",
      category: "Water & Sanitation",
      durationMinutes: Math.round(15 * timeMultiplier),
      frequency: baseFrequency,
      difficulty: "Foundation",
      description: "Assemble a multi-stage physical pre-filter and execute precise chemical purification math.",
      instructions: [
        "Layer sand, crushed charcoal, and clean cloth in improvised funnel.",
        "Pour 1 liter of turbid water and monitor flow rate.",
        "Calculate chemical dose: 8 drops standard unscented bleach per 1 gallon.",
        "Mark 30-minute contact time before safe distribution."
      ],
      equipmentNeeded: ["Clear container", "Filter substrate (sand/charcoal/cloth)", "Measuring dropper"],
      completed: false,
      environmentNote: climateInfo.drillFocus
    });
  }

  // Reasoning drills
  if (selectedPacketIds.includes('reasoning') || selectedPacketIds.length === 0) {
    phase1Drills.push({
      id: `drill-lr-1-${Date.now()}`,
      title: "Rapid S.T.O.P. Threat Assessment & Rations Math",
      category: "Logical Reasoning",
      durationMinutes: 10,
      frequency: "daily",
      difficulty: "Foundation",
      description: "Execute 90-second structured cognitive pause and compute survival ration consumption curves.",
      instructions: [
        "S (Stop): Freeze physical movement; take 3 slow diaphragmatic breaths.",
        "T (Think): Identify the primary existential hazard vs secondary inconveniences.",
        "O (Observe): Count headcount, ambient temperature, water reserve in liters.",
        "P (Plan): Formulate a single 30-minute immediate operational objective."
      ],
      equipmentNeeded: ["Notepad or Signal app", "Pen"],
      completed: false
    });
  }

  // Phase 2: Core Protocols & Mechanical Competency (Days 8–21)
  const phase2Drills: PracticeDrill[] = [];
  const phase2Milestones: string[] = [
    `Achieve 100% accuracy on operational failure isolation.`,
    `Complete simulated field navigation without cellular or GPS connectivity.`
  ];

  if (selectedPacketIds.includes('navigation')) {
    phase2Drills.push({
      id: `drill-nav-2-${Date.now()}`,
      title: "Handrail & Backstop Dead Reckoning Course",
      category: "Navigation",
      durationMinutes: Math.round(25 * timeMultiplier),
      frequency: 'weekly',
      difficulty: "Intermediate",
      description: "Plan and navigate a 1-kilometer terrain stretch using only physical linear features and landmark boundaries.",
      instructions: [
        "Identify primary linear handrail (drainage canal, rail line, highway).",
        "Set strict perpendicular backstop feature (power line corridor, ridgeline).",
        "Count double-paces (measure baseline 100m pace count beforehand).",
        "Record azimuth checkpoints at 200m intervals."
      ],
      equipmentNeeded: ["Analog paper map", "Magnetic baseplate compass", "Pace counter beads/tally"],
      completed: false
    });
  }

  if (selectedPacketIds.includes('repair')) {
    phase2Drills.push({
      id: `drill-mr-2-${Date.now()}`,
      title: "Utility Main Isolation & Improvised Clamping",
      category: "Mechanical Repair",
      durationMinutes: Math.round(20 * timeMultiplier),
      frequency: 'weekly',
      difficulty: "Intermediate",
      description: "Locate, cycle, and safely isolate primary service lines under blackout conditions.",
      instructions: [
        "Navigate in low light to primary water meter or shutoff valve.",
        "Test manual quarter-turn ball valve or street curb-key wrench engagement.",
        "Fabricate an improvised pipe sleeve clamp using rubber hose and hose clamps.",
        "Pressure test joint under static conditions."
      ],
      equipmentNeeded: ["Adjustable wrench or curb key", "Inner-tube rubber strip", "Hose clamp"],
      completed: false,
      environmentNote: profession === 'trades' ? "Perform complete zero-energy state lockout-tagout sequence." : undefined
    });
  }

  if (selectedPacketIds.includes('shelter')) {
    phase2Drills.push({
      id: `drill-sh-2-${Date.now()}`,
      title: "Ground Insulation & Microclimate Barrier Construction",
      category: "Shelter & Warmth",
      durationMinutes: Math.round(30 * timeMultiplier),
      frequency: 'weekly',
      difficulty: "Intermediate",
      description: "Build an impermeable 6-inch insulating mattress to eliminate conductive heat loss.",
      instructions: [
        "Clear level ground free of puncturing stones or sharp debris.",
        "Layer 6 to 8 inches of compressed dry vegetation, cardboard, or closed-cell foam.",
        "Deploy vapor barrier over insulation layer.",
        "Measure ground temperature deflection after 20 minutes of occupancy."
      ],
      equipmentNeeded: ["Ground sheet / tarp", "Insulative substrate", "Bivy or space blanket"],
      completed: false,
      environmentNote: climate === 'subarctic' ? "Double the insulation thickness to at least 12 inches off packed snow." : undefined
    });
  }

  if (selectedPacketIds.includes('power')) {
    phase2Drills.push({
      id: `drill-po-2-${Date.now()}`,
      title: "Thermal Seal Inspection & Load-Shedding Protocol",
      category: "Power Outage",
      durationMinutes: 15,
      frequency: 'biweekly',
      difficulty: "Intermediate",
      description: "Pre-freeze thermal mass and simulate critical refrigeration preservation during systemic grid collapse.",
      instructions: [
        "Audit cold storage seal integrity using flashlight test.",
        "Organize high-density frozen thermal ballast into top compartments.",
        "Label perishable timelines (4 hours refrigerated, 48 hours packed freezer).",
        "Establish circuit breaker isolation drill to avoid incoming grid restoration surges."
      ],
      equipmentNeeded: ["Thermometer", "Freezer containers", "Breaker panel access"],
      completed: false
    });
  }

  // Phase 3: High-Stress Scenarios & Physical Drills (Days 22–30)
  const phase3Drills: PracticeDrill[] = [];
  const phase3Milestones: string[] = [
    `Execute full unscripted 45-minute blackout scenario.`,
    `Pass simulated multi-casualty or structural failure test with zero procedural violations.`
  ];

  if (selectedPacketIds.includes('comms')) {
    phase3Drills.push({
      id: `drill-cm-3-${Date.now()}`,
      title: "High-Stress Read-Back & Radio Briefing Drill",
      category: "Clear Communication",
      durationMinutes: 15,
      frequency: 'biweekly',
      difficulty: "High-Stress",
      description: "Transmit critical emergency coordinates and medical triage metrics under ambient noise and time pressure.",
      instructions: [
        "Construct 30-word SITREP (Situation, Location, Casualties, Capabilities, Needs).",
        "Transmit message in under 20 seconds using plain vocabulary.",
        "Demand exact verbatim read-back from recipient.",
        "Confirm or correct read-back errors without emotional distortion."
      ],
      equipmentNeeded: ["Two-way radio or partner with timer"],
      completed: false,
      environmentNote: `${professionInfo.roleEmphasis}`
    });
  }

  if (selectedPacketIds.includes('weather')) {
    phase3Drills.push({
      id: `drill-wh-3-${Date.now()}`,
      title: "Rapid Safe-Room Hardening & Flood Egress Test",
      category: "Weather Hazards",
      durationMinutes: 20,
      frequency: 'weekly',
      difficulty: "High-Stress",
      description: "Simulate sudden 3-minute tornado or flash-flood alarm with rapid interior shelter staging.",
      instructions: [
        "Trigger randomized alarm timer without warning.",
        "Move all household or team members to lowest windowless interior sanctuary in < 60s.",
        "Secure emergency grab-bag, footwear, and battery lighting.",
        "Simulate vertical egress plan if ground level breaches water threshold."
      ],
      equipmentNeeded: ["Emergency kit", "Protective headgear / blankets", "Timer"],
      completed: false
    });
  }

  // Guarantee at least 2 drills per phase even if user picked few packets
  if (phase1Drills.length === 0) {
    phase1Drills.push({
      id: `drill-gen-1a-${Date.now()}`,
      title: `${professionInfo.label} Field Equipment Audit`,
      category: "General Readiness",
      durationMinutes: 15,
      frequency: 'daily',
      difficulty: "Foundation",
      description: "Inspect, test, and sanitize primary grab-and-go emergency loadout.",
      instructions: [
        "Inventory items against 72-hour operational profile.",
        "Inspect battery charge levels and water storage integrity.",
        "Confirm expiration dates on trauma consumables and rations."
      ],
      equipmentNeeded: ["Field bag", "Inventory checklist"],
      completed: false
    });
  }
  if (phase1Drills.length < 2) {
    phase1Drills.push({
      id: `drill-gen-1b-${Date.now()}`,
      title: "Mental Triage & Stress Heart-Rate Calldown",
      category: "Cognitive Drill",
      durationMinutes: 10,
      frequency: 'daily',
      difficulty: "Foundation",
      description: "Rapid 5-minute tactical breathing and situational focus reset under sudden alarm.",
      instructions: [
        "Trigger randomized phone timer.",
        "Execute 4x4 box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s).",
        "Verbally identify immediate surroundings and exit vectors."
      ],
      equipmentNeeded: ["Timer"],
      completed: false
    });
  }

  if (phase2Drills.length === 0) {
    phase2Drills.push({
      id: `drill-gen-2a-${Date.now()}`,
      title: `${climateInfo.label} Climate Stress Simulation`,
      category: "Environmental",
      durationMinutes: 20,
      frequency: 'biweekly',
      difficulty: "Intermediate",
      description: "Conduct outdoor operational drill verifying protective clothing and physical endurance.",
      instructions: [
        `Subject gear to active ${climateInfo.label} atmospheric conditions for 20 minutes.`,
        "Evaluate breathability, moisture management, and dexterous tool manipulation.",
        "Identify gear failure points and log adjustments."
      ],
      equipmentNeeded: ["Field wear", "Weather monitor"],
      completed: false,
      environmentNote: climateInfo.note
    });
  }
  if (phase2Drills.length < 2) {
    phase2Drills.push({
      id: `drill-gen-2b-${Date.now()}`,
      title: "Manual Tool & Mechanical Rigging Checkout",
      category: "Mechanical",
      durationMinutes: 20,
      frequency: 'weekly',
      difficulty: "Intermediate",
      description: "Practice tension knots, lever mechanics, and hand-tool servicing.",
      instructions: [
        "Tie 3 foundational field knots (bowline, clove hitch, trucker's hitch).",
        "Inspect mechanical cutting tools and lubricate pivot hinges.",
        "Fabricate emergency cordage from scavenged wire or straps."
      ],
      equipmentNeeded: ["Utility rope / paracord", "Multi-tool"],
      completed: false
    });
  }

  if (phase3Drills.length === 0) {
    phase3Drills.push({
      id: `drill-gen-3a-${Date.now()}`,
      title: "Comprehensive 30-Minute Grid Blackout Simulation",
      category: "Full Simulation",
      durationMinutes: 30,
      frequency: 'weekly',
      difficulty: "High-Stress",
      description: "Full-scale unscripted blackout drill across communications, medical response, and light discipline.",
      instructions: [
        "Cut all artificial room illumination and cellular data access.",
        "Locate emergency lighting and navigation references by tactile memory.",
        "Execute prioritized task card under strictly monitored time limits.",
        "Conduct post-drill debrief and document bottlenecks."
      ],
      equipmentNeeded: ["Analog timer", "Blackout covers", "Debrief log"],
      completed: false
    });
  }
  if (phase3Drills.length < 2) {
    phase3Drills.push({
      id: `drill-gen-3b-${Date.now()}`,
      title: "Rapid Egress & Accountability Time-Trial",
      category: "Evacuation",
      durationMinutes: 25,
      frequency: 'weekly',
      difficulty: "High-Stress",
      description: "Simulate zero-notice evacuation packing and primary safe-zone linkup.",
      instructions: [
        "Pack grab-bag and essential documents in under 180 seconds.",
        "Lace boots, don weather outer shell, and stage at primary exit.",
        "Verify analog communication card and rendezvous coordinates."
      ],
      equipmentNeeded: ["Go-bag", "Stopwatch"],
      completed: false
    });
  }

  const phases: PlanPhase[] = [
    {
      phaseNumber: 1,
      name: "Immediate Triage & Foundation Drills",
      timeframe: "Days 1–7 (Onboarding & Baseline Muscle Memory)",
      focus: `Rapid response protocols tailored for ${professionInfo.label} operating in ${climateInfo.label} terrain.`,
      drills: phase1Drills,
      milestones: phase1Milestones
    },
    {
      phaseNumber: 2,
      name: "Core Protocols & Mechanical Competency",
      timeframe: "Days 8–21 (Technical Fluency & Field Problem Solving)",
      focus: "Hands-on diagnostic drills, non-electric tool mastery, and sustainable infrastructure management.",
      drills: phase2Drills,
      milestones: phase2Milestones
    },
    {
      phaseNumber: 3,
      name: "Stress Drills & High-Fidelity Scenarios",
      timeframe: "Days 22–30 (Operational Validation & Multi-Threat Agility)",
      focus: `High-tempo, adverse-condition simulations testing endurance under ${riskLevel.toUpperCase()} systemic risk.`,
      drills: phase3Drills,
      milestones: phase3Milestones
    }
  ];

  // Calculate total estimated study and practice hours
  const allDrills = [...phase1Drills, ...phase2Drills, ...phase3Drills];
  const totalMinutes = allDrills.reduce((acc, d) => {
    const repeatsPerMonth = d.frequency === 'daily' ? 20 : d.frequency === 'biweekly' ? 8 : 4;
    return acc + (d.durationMinutes * repeatsPerMonth);
  }, 0);
  const totalHours = Math.max(6, Math.round(totalMinutes / 60));

  return {
    id: `bundle-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || "Custom Operator Bundle",
    description: description.trim() || `Tailored practice curriculum configured for ${professionInfo.label} in ${climateInfo.label} under ${riskLevel} hazard profile.`,
    createdAt: new Date().toISOString().split('T')[0],
    climate,
    profession,
    riskLevel,
    selectedPacketIds,
    selectedBranchIds,
    totalEstimatedHours: totalHours,
    phases,
    completedDrillIds: []
  };
}
