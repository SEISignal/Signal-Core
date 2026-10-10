import { BookOpen, Stethoscope, Droplets, Flame, Navigation, Wrench, Brain, Users, CloudRain, BatteryWarning } from "lucide-react";

export type PacketMode = "learning" | "emergency";

export interface BranchItem {
  id: string;
  title: string;
  description?: string;
  status?: "critical" | "warning" | "standard";
}

export interface PacketBranch {
  id: string;
  emoji: string;
  title: string;
  subtitle?: string;
  items: BranchItem[];
}

export interface Scenario {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Packet {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: "downloaded" | "available" | "update_needed";
  lastVerified: string;
  branches?: PacketBranch[];
  emergencyInstructions: string[];
  learningContent: string;
  scenarios: Scenario[];
}

export const capabilityProfile = [
  { skill: "First aid", status: "Functional", color: "text-green-600", dot: "bg-green-500" },
  { skill: "Mental estimation", status: "Strong", color: "text-green-600", dot: "bg-green-500" },
  { skill: "Offline navigation", status: "Needs practice", color: "text-amber-600", dot: "bg-amber-500" },
  { skill: "Water & sanitation", status: "Functional", color: "text-green-600", dot: "bg-green-500" },
  { skill: "Stress communication", status: "Developing", color: "text-blue-600", dot: "bg-blue-500" },
  { skill: "Food preservation", status: "Not assessed", color: "text-stone-400", dot: "bg-stone-300" },
];

export const packets: Packet[] = [
  {
    id: "first-aid",
    title: "First Aid Fundamentals",
    description: "CPR, wound management, splinting, and recognizing shock.",
    icon: Stethoscope,
    status: "downloaded",
    lastVerified: "2024-03-12",
    branches: [
      {
        id: "med-emergencies",
        emoji: "🩺",
        title: "Medical Emergencies",
        subtitle: "Life-threatening acute events and primary life support",
        items: [
          { id: "m1", title: "Cardiac Arrest & High-Quality CPR Protocols", description: "30 compressions : 2 breaths, depth 2 inches, 100-120 bpm" },
          { id: "m2", title: "Severe Hemorrhage & Arterial Bleeding", description: "Direct pressure, pressure dressing, high-and-tight tourniquet" },
          { id: "m3", title: "Traumatic Shock Recognition & Elevation", description: "Cool clammy skin, rapid weak pulse, leg elevation, warmth retention" }
        ]
      },
      {
        id: "env-emergencies",
        emoji: "🌎",
        title: "Environmental Emergencies",
        subtitle: "Thermal, weather, and chemical exposure risks",
        items: [
          { id: "e1", title: "Hypothermia & Frostbite Response", description: "Remove wet gear, gradual core rewarming, clear airways" },
          { id: "e2", title: "Heatstroke & Severe Dehydration", description: "Active evaporative cooling, shade, oral rehydration solution" },
          { id: "e3", title: "Venomous Stings & Animal Bites", description: "Wound irrigation, limb stabilization, monitor for anaphylaxis" }
        ]
      },
      {
        id: "special-populations",
        emoji: "👶",
        title: "Special Populations",
        subtitle: "Pediatric, geriatric, and obstetric triage adaptations",
        items: [
          { id: "s1", title: "Pediatric Airway Obstruction & Modified CPR", description: "5 back blows + 5 chest thrusts for infants, modified compression depth" },
          { id: "s2", title: "Geriatric Trauma & Fragile Bone Fractures", description: "Gentle axial stabilization, hypothermia prevention" },
          { id: "s3", title: "Obstetric Emergencies & Choking Relief", description: "Chest thrusts for late-term pregnancy, left-lateral tilt position" }
        ]
      }
    ],
    emergencyInstructions: [
      "Assess the scene for safety before approaching.",
      "Check responsiveness (tap and shout).",
      "If unresponsive and not breathing normally, begin CPR (30 compressions : 2 breaths).",
      "For severe bleeding, apply firm, direct pressure with a clean cloth.",
      "Do not remove an impaled object; stabilize it.",
      "Treat for shock: lay the person down, elevate legs if possible, keep warm."
    ],
    learningContent: "First aid is about preserving life, preventing worsening, and promoting recovery. Knowing how to prioritize actions (Airway, Breathing, Circulation) is critical when professional help is delayed.",
    scenarios: [
      {
        id: "fa-1",
        question: "Someone has a deep cut on their arm. Place these actions in the correct order.",
        options: [
          "Wash the wound, elevate arm, apply loose bandage",
          "Apply direct pressure, maintain pressure, apply pressure bandage",
          "Apply tourniquet immediately, wait for help",
          "Raise arm above head, wait for blood to clot"
        ],
        correctIndex: 1,
        explanation: "Direct, maintained pressure is the primary and most effective method for controlling severe bleeding."
      }
    ]
  },
  {
    id: "water-sanitation",
    title: "Water & Sanitation",
    description: "Sourcing, purifying, and safe waste management.",
    icon: Droplets,
    status: "downloaded",
    lastVerified: "2024-02-28",
    branches: [
      {
        id: "sourcing",
        emoji: "💧",
        title: "Water Sourcing & Collection",
        subtitle: "Identifying raw water sources and rainwater harvesting",
        items: [
          { id: "w1", title: "Surface Water Assessment", description: "Avoiding standing water, industrial runoff, and agricultural zones" },
          { id: "w2", title: "Solar Dew Traps & Condensation Collection", description: "Emergency transpiration bags on foliage" },
          { id: "w3", title: "Pre-Filtration Techniques", description: "Cloth, sand, and charcoal sediment separation" }
        ]
      },
      {
        id: "purification",
        emoji: "🧪",
        title: "Purification & Disinfection",
        subtitle: "Biological pathogen elimination methods",
        items: [
          { id: "p1", title: "Thermal Boiling Protocols", description: "1 full minute rolling boil at sea level, 3 mins at elevation" },
          { id: "p2", title: "Chemical Treatment (Chlorine & Iodine)", description: "8 drops unscented bleach per gallon, 30 min contact time" },
          { id: "p3", title: "SODIS (Solar Disinfection)", description: "6 hours direct UV exposure in clear PET bottles" }
        ]
      },
      {
        id: "sanitation",
        emoji: "🚽",
        title: "Field Sanitation & Waste Management",
        subtitle: "Preventing cross-contamination and cholera vectors",
        items: [
          { id: "f1", title: "Cat-Holes & Latrine Trenches", description: "200ft minimum distance from water bodies, 6-8 inch depth" },
          { id: "f2", title: "Handwashing & Hygiene Systems", description: "Tippy-tap construction with greywater drainage" }
        ]
      }
    ],
    emergencyInstructions: [
      "Boil water at a rolling boil for 1 minute (3 minutes at high altitudes).",
      "If boiling is impossible, use unscented household bleach (8 drops per gallon).",
      "Filter cloudy water through clean cloth before purifying.",
      "Dig a trench or pit for human waste at least 200 feet from water sources.",
      "Separate waste areas from food preparation areas."
    ],
    learningContent: "Waterborne illness is the greatest threat in infrastructure failure. Clear water is not safe water. Always assume untreated water contains biological hazards.",
    scenarios: [
      {
        id: "ws-1",
        question: "Your neighbor claims tap water is safe because it looks clear. What information is missing?",
        options: [
          "Whether it smells like chlorine.",
          "Biological contaminants (bacteria, viruses, protozoa) are invisible.",
          "The temperature of the water.",
          "If the water has been sitting for over 24 hours."
        ],
        correctIndex: 1,
        explanation: "Microscopic pathogens cannot be seen with the naked eye. Clarity does not guarantee safety."
      }
    ]
  },
  {
    id: "reasoning",
    title: "Logical Reasoning",
    description: "Decision making under stress and resource estimation.",
    icon: Brain,
    status: "downloaded",
    lastVerified: "2024-01-15",
    emergencyInstructions: [
      "Stop. Breathe. Observe. Plan. (S.T.O.P. principle).",
      "Identify the most immediate threat to life and address it first.",
      "Inventory your physical resources (water, food, fuel).",
      "Do not act on assumptions; verify information.",
      "Make decisions based on worst-case realistic scenarios, not hope."
    ],
    learningContent: "Under extreme stress, the human brain relies on heuristics (shortcuts) that can lead to fatal errors. Training logical reasoning ensures you can accurately estimate resources and parse truth from panic.",
    scenarios: [
      {
        id: "lr-1",
        question: "Your electricity has been off for 36 hours. You have eight gallons of water and four people. Estimate how long it will last.",
        options: [
          "8 days (1 gallon per person per day)",
          "2 days (1 gallon per person per day minimum for hydration and basic hygiene)",
          "4 days (half a gallon per person per day)",
          "1 day (everyone needs 2 gallons minimum)"
        ],
        correctIndex: 1,
        explanation: "The minimum baseline for survival and basic hygiene is 1 gallon per person, per day. 8 gallons / 4 people = 2 days."
      }
    ]
  },
  {
    id: "navigation",
    title: "Offline Navigation",
    description: "Spatial reasoning, map reading, and terrain association.",
    icon: Navigation,
    status: "downloaded",
    lastVerified: "2024-04-02",
    emergencyInstructions: [
      "Determine your current location before moving.",
      "Orient your map to the terrain (match landmarks).",
      "Identify a 'handrail' (a linear feature like a river or road to follow).",
      "Identify a 'backstop' (a massive feature you will hit if you go too far).",
      "Keep track of your pace and time traveled."
    ],
    learningContent: "Without GPS, navigation relies on relating an abstraction (the map) to the physical world. This requires understanding scale, topography, and maintaining directional awareness.",
    scenarios: [
      {
        id: "nav-1",
        question: "Navigate from this point to the nearest water source without GPS. What is your most reliable method of not getting lost?",
        options: [
          "Walking in a perfectly straight line.",
          "Using a linear feature (like a road or ridge) as a handrail and setting a backstop limit.",
          "Following animal tracks.",
          "Walking downhill until you hit water."
        ],
        correctIndex: 1,
        explanation: "A handrail guides your path, and a backstop ensures you know when you've gone too far, minimizing the risk of wandering aimlessly."
      }
    ]
  },
  {
    id: "shelter",
    title: "Shelter & Warmth",
    description: "Thermoregulation, fire building, and element protection.",
    icon: Flame,
    status: "downloaded",
    lastVerified: "2024-02-11",
    emergencyInstructions: [
      "Insulate yourself from the ground (the ground steals heat faster than air).",
      "Block wind and rain before trying to build a fire.",
      "Wear layers: base (wicking), middle (insulating), outer (shell).",
      "Gather 3x more firewood than you think you need before dark.",
      "Do not sweat; remove layers during exertion."
    ],
    learningContent: "Exposure kills faster than starvation or dehydration. Maintaining your core body temperature is your immediate priority in a wilderness or structural failure scenario.",
    scenarios: [
      {
        id: "sw-1",
        question: "You are stuck in extreme cold. What is the most critical immediate action to prevent hypothermia?",
        options: [
          "Building a massive fire.",
          "Insulating yourself from the freezing ground and blocking the wind.",
          "Eating high-calorie food.",
          "Drinking warm water."
        ],
        correctIndex: 1,
        explanation: "Conduction (heat loss to the ground) and convection (wind chill) will drain your core temperature faster than anything else. Stop the heat loss first."
      }
    ]
  },
  {
    id: "repair",
    title: "Mechanical Repair",
    description: "Improvising fixes, tool usage, and structural basics.",
    icon: Wrench,
    status: "downloaded",
    lastVerified: "2024-03-22",
    emergencyInstructions: [
      "Turn off power or water at the main before attempting structural repair.",
      "Clean surfaces before applying adhesives or tape.",
      "Use mechanical fasteners (screws, nails, zip ties) over tape when under tension.",
      "Understand the flow of force: identify load-bearing elements.",
      "Do not force seized bolts; use penetrating oil and heat."
    ],
    learningContent: "Mechanical repair is applied physics. Understanding how things break allows you to improvise solutions when specialized replacement parts are unavailable.",
    scenarios: [
      {
        id: "mr-1",
        question: "A pipe has burst and is spraying water. What is the very first step?",
        options: [
          "Wrap it tightly with duct tape.",
          "Find the main water shut-off valve and turn it off.",
          "Call a plumber.",
          "Put a bucket under the leak."
        ],
        correctIndex: 1,
        explanation: "You cannot effectively repair a pressurized system. Always isolate and depressurize (turn off the main valve) before attempting a fix."
      }
    ]
  },
  {
    id: "comms",
    title: "Clear Communication",
    description: "Information transfer, de-escalation, and radio basics.",
    icon: Users,
    status: "available",
    lastVerified: "2024-01-05",
    emergencyInstructions: [
      "Use plain language; avoid codes or jargon.",
      "Speak slowly and clearly.",
      "State the most critical information first (Who, What, Where).",
      "Require read-backs to confirm the receiver understood the message.",
      "When de-escalating, keep hands visible and use a low, calm tone."
    ],
    learningContent: "In a crisis, poor communication compounds emergencies. Whether using a radio or speaking to a panicked neighbor, clarity and brevity are paramount.",
    scenarios: [
      {
        id: "cc-1",
        question: "Explain this emergency instruction in your own words: 'Evacuate zone alpha immediately via route south. Do not return for belongings.'",
        options: [
          "Leave the area right now using the southern road. Leave your stuff behind.",
          "Pack your bags quickly and head south out of the alpha zone.",
          "Zone alpha is dangerous, we should consider leaving south.",
          "Wait for further instructions before going south."
        ],
        correctIndex: 0,
        explanation: "The core message is immediate action (leave now), specific direction (south), and specific constraint (leave belongings)."
      }
    ]
  },
  {
    id: "weather",
    title: "Weather Hazards",
    description: "Tornadoes, floods, and extreme temperature response.",
    icon: CloudRain,
    status: "available",
    lastVerified: "2024-03-01",
    emergencyInstructions: [
      "Flood: Move to higher ground immediately. Do not walk or drive through moving water.",
      "Tornado: Seek lowest interior room, away from windows. Cover your head.",
      "Lightning: Avoid open fields, tall trees, and bodies of water. Get inside a structure or hard-topped vehicle.",
      "Extreme Heat: Stay hydrated, rest in shade, recognize signs of heat stroke (no sweating, confusion)."
    ],
    learningContent: "Weather patterns dictate environmental safety. Recognizing the precursor signs of severe weather allows for proactive, rather than reactive, movement.",
    scenarios: [
      {
        id: "wh-1",
        question: "You see water moving swiftly across a road. It looks about 6 inches deep. What should you do?",
        options: [
          "Drive through it slowly.",
          "Walk through it carefully.",
          "Turn around and find another route.",
          "Wait for it to drop to 3 inches."
        ],
        correctIndex: 2,
        explanation: "Six inches of moving water can knock a person down, and one foot can sweep a vehicle away. Never cross moving floodwaters."
      }
    ]
  },
  {
    id: "power",
    title: "Power Outage",
    description: "Food preservation, generator safety, and lighting.",
    icon: BatteryWarning,
    status: "update_needed",
    lastVerified: "2023-11-12",
    emergencyInstructions: [
      "Keep refrigerator and freezer doors closed. (A full freezer holds temperature for ~48 hrs).",
      "Never run a generator indoors, in a garage, or near open windows.",
      "Disconnect major appliances to prevent damage from power surges when power returns.",
      "Use flashlights or battery lanterns instead of candles to minimize fire risk."
    ],
    learningContent: "Modern life is entirely dependent on the electrical grid. Extended outages require pivoting from automated convenience to manual resource management.",
    scenarios: [
      {
        id: "po-1",
        question: "The power goes out during a storm. Your generator is in the attached garage. How do you set it up?",
        options: [
          "Run it in the garage with the garage door open.",
          "Move it outside, at least 20 feet away from the house, exhaust pointing away from windows.",
          "Run it just inside the house by the back door.",
          "Run it in the garage with a fan blowing out."
        ],
        correctIndex: 1,
        explanation: "Carbon monoxide is odorless and deadly. Generators must always be operated outside, far from the house, regardless of open doors or fans."
      }
    ]
  },
  {
    id: "learning",
    title: "Learning to Learn",
    description: "Rapid skill acquisition and unlearning panic responses.",
    icon: BookOpen,
    status: "downloaded",
    lastVerified: "2024-04-10",
    emergencyInstructions: [
      "Break complex tasks into small, manageable steps.",
      "Accept failure as a diagnostic tool, not a final state.",
      "Teach the concept to someone else to solidify your own understanding.",
      "Focus on the underlying principle, not just rote memorization."
    ],
    learningContent: "The ultimate survival tool is adaptability. The ability to rapidly acquire a new skill and apply it effectively under pressure dictates long-term continuity.",
    scenarios: [
      {
        id: "ll-1",
        question: "You need to learn how to operate an unfamiliar hand-crank radio. What is the most effective approach?",
        options: [
          "Read the entire manual from cover to cover.",
          "Crank it randomly and press buttons until it works.",
          "Identify the power generation (crank), the tuning mechanism, and the volume, testing one function at a time.",
          "Wait for someone else who knows how to use it."
        ],
        correctIndex: 2,
        explanation: "Breaking an unfamiliar tool down into its core functional components allows for systematic, rapid learning without overwhelming cognitive load."
      }
    ]
  }
];
