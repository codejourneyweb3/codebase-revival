export type ScoreScale = {
  id: string;
  name: string;
  descriptions: [string, string, string, string];
};

export const SCORE_SCALES: ScoreScale[] = [
  {
    id: "heat",
    name: "Heat at bird height",
    descriptions: [
      "Comfortable",
      "Slightly warm or cool",
      "Clearly warm or cool",
      "Hot, or cold enough to chill",
    ],
  },
  {
    id: "temperature-behaviour",
    name: "Bird behaviour for temperature",
    descriptions: [
      "Evenly spread, active",
      "Some crowding or spreading",
      "Obvious huddling, or panting in places",
      "Panting, wings spread, or huddled and noisy throughout",
    ],
  },
  {
    id: "air",
    name: "Air and humidity",
    descriptions: ["Fresh", "Slightly stuffy", "Heavy and damp", "Stifling, condensation visible"],
  },
  {
    id: "ammonia",
    name: "Ammonia smell",
    descriptions: [
      "None",
      "Faint, noticed only on close sniffing",
      "Noticeable on entering",
      "Strong, eyes or nose sting",
    ],
  },
  {
    id: "litter",
    name: "Litter feel (squeeze test)",
    descriptions: [
      "Dry and crumbly",
      "Slightly damp, breaks apart",
      "Caked in patches",
      "Wet and compacted",
    ],
  },
  {
    id: "draughts",
    name: "Draughts",
    descriptions: ["None", "Slight", "Clear draught on birds", "Strong draught at bird level"],
  },
  { id: "dust", name: "Dust", descriptions: ["Clear air", "Some dust", "Dusty", "Thick dust"] },
  {
    id: "feed-intake",
    name: "Feed intake against usual",
    descriptions: ["Normal", "Slightly lower", "Clearly lower", "Much lower"],
  },
  {
    id: "water-intake",
    name: "Water intake against usual",
    descriptions: ["Normal", "Slightly lower", "Clearly lower", "Much lower"],
  },
  {
    id: "mood",
    name: "Flock mood",
    descriptions: [
      "Normal, contented",
      "Quiet or slightly restless",
      "Restless or dull",
      "Distress calls, or listless",
    ],
  },
  {
    id: "health-severity",
    name: "Overall health severity",
    descriptions: [
      "A few mildly affected birds",
      "Some birds clearly affected",
      "Many birds affected or worsening",
      "Many birds seriously affected",
    ],
  },
  {
    id: "footpads",
    name: "Footpad condition",
    descriptions: [
      "Clean and unmarked",
      "Mild marks or early change",
      "Clear lesions or damage",
      "Severe lesions or injury",
    ],
  },
  {
    id: "hocks",
    name: "Hock condition",
    descriptions: [
      "Clean and unmarked",
      "Mild marks or early change",
      "Clear lesions or damage",
      "Severe lesions or injury",
    ],
  },
  {
    id: "feathers",
    name: "Feather condition and cleanliness",
    descriptions: [
      "Clean and intact",
      "Slightly dirty or disturbed",
      "Clearly dirty or damaged",
      "Very dirty, wet or severely damaged",
    ],
  },
  {
    id: "gait",
    name: "Gait",
    descriptions: [
      "Walks normally",
      "Slight movement change",
      "Clear lameness or reluctance",
      "Severe lameness or unable to walk normally",
    ],
  },
];

export interface FieldGuide {
  id: string;
  title: string;
  category: string;
  summary: string;
  what: string;
  why: string;
  equipment: string;
  steps: string[];
  where: string;
  sample: string;
  frequency: string;
  record: string;
  calculates: string;
  abnormal: string;
  mistakes: string;
  next: string;
  veterinarian: string;
  scaleId?: string;
}

export const FIELD_GUIDES: FieldGuide[] = [
  {
    id: "ammonia",
    title: "Judge ammonia without a meter",
    category: "House environment",
    summary: "Use smell and eye comfort at bird height, before your nose adapts.",
    what: "A structured observation of ammonia smell and eye comfort, not a ppm measurement.",
    why: "Ammonia can irritate eyes and airways and is associated with poor litter and reduced growth.",
    equipment: "No instrument required. A handheld meter may add a separate ppm reading.",
    steps: [
      "Enter and stand at bird height, away from doors and fans.",
      "Pause briefly and breathe normally; do not sniff the litter hard.",
      "Choose the score within the first minute.",
      "Check litter, drinkers, ventilation and the birds' eyes and breathing.",
    ],
    where: "Bird breathing height in the middle and any problem areas of the house.",
    sample: "Assess several locations when conditions differ across the house.",
    frequency: "Every house visit and whenever litter or bird behaviour raises concern.",
    record: "Score, location, observer, time, and an optional separate ppm reading and method.",
    calculates:
      "Latest state, direction across visits, persistence at 3 or 4, and agreement with litter and humidity scores.",
    abnormal:
      "A 3 or 4 is a prompt to investigate; it is not a diagnosis or a converted ppm value.",
    mistakes:
      "Waiting until your nose has adapted, standing beside an open door, or reporting an instrument value from smell.",
    next: "Check for wet litter and leaking drinkers, review ventilation, and re-score after corrective action.",
    veterinarian:
      "Seek advice if birds have breathing signs, eye damage, rising deaths, or the problem persists after corrective action.",
    scaleId: "ammonia",
  },
  {
    id: "litter",
    title: "Do the litter squeeze test",
    category: "Litter",
    summary: "Compare three house locations and keep the worst score visible.",
    what: "The feel and moisture state of litter using a consistent four-point observation.",
    why: "Wet or caked litter affects comfort, footpads, cleanliness and ammonia.",
    equipment: "Clean hands or gloves; optional camera and separate moisture meter.",
    steps: [
      "Pick up a handful near drinkers and squeeze.",
      "Repeat near a wall or corner and in the middle.",
      "Choose the description that matches each spot.",
      "Record the worst spot as the house score and re-score after any action.",
    ],
    where: "Near drinkers, near a wall or corner, and in the middle of the house.",
    sample: "At least three spots; add any visibly abnormal areas.",
    frequency:
      "Visual check daily, squeeze test every few days and after deterioration or treatment.",
    record:
      "Spot scores, worst location, caking, mould, odour, contamination, photographs and actions.",
    calculates:
      "Worst house score, drinker-area comparison, persistence and before/after intervention change.",
    abnormal:
      "Scores 3 and 4 require investigation, especially when the drinker area is worse than elsewhere.",
    mistakes:
      "Checking only dry areas, averaging the three scores, or merging a visual score with metered moisture.",
    next: "Inspect drinkers for leaks, turn or remove wet litter, add dry material and improve ventilation as appropriate.",
    veterinarian:
      "Ask for help when footpad lesions, breast blisters, illness or persistent wet litter appear.",
    scaleId: "litter",
  },
  {
    id: "weighing",
    title: "Weigh a representative sample",
    category: "Growth",
    summary: "Sample across the house and keep every original bird weight.",
    what: "Average live weight, daily gain, spread and uniformity from a representative sample.",
    why: "An average alone can hide slow growth or a large underweight group.",
    equipment:
      "Any practical scale, a sling or container, and a recording method. Note whether calibration is known.",
    steps: [
      "Select birds from different areas, not only the easiest or largest.",
      "Weigh birds individually where possible.",
      "For bulk weighing, record the counted group size.",
      "Keep every measurement and note excluded or abnormal readings.",
    ],
    where: "Several representative locations throughout the house.",
    sample:
      "Breed guides recommend at least 1% or 100 birds, whichever is larger. Small flocks need a practical minimum and a low-confidence label.",
    frequency: "At least weekly, with key breed-guide checks at 7, 21 and 35 days.",
    record: "Date, location, scale, calibration status, sample size and original weights.",
    calculates:
      "Average weight, daily gain, standard deviation, CV and uniformity with sample-size confidence.",
    abnormal:
      "Compare with the selected breed reference and investigate worsening deviation, not one isolated average.",
    mistakes:
      "Selecting only large birds, hiding sample size, or converting a handling score into kilograms.",
    next: "Review feed, water, health and environmental evidence together when growth deviates.",
    veterinarian:
      "Seek advice for declining body condition, illness signs, rising deaths or persistent growth deviation.",
  },
  {
    id: "water",
    title: "Calculate water from drinker refills",
    category: "Feed & water",
    summary: "Record access and leftovers honestly; never call this a meter reading.",
    what: "An estimate of water placed and consumed using the farm's registered drinkers.",
    why: "A change in drinking can be an early sign of a flock or water-access problem.",
    equipment: "Registered drinker groups with count and capacity; optional measuring container.",
    steps: [
      "Choose the drinker group filled.",
      "Record the number of fills or each fill time.",
      "At the next visit record leftovers where practical.",
      "Record leaks, spillage, blockages and contamination.",
    ],
    where: "Every drinker group, with its house location.",
    sample: "Include all drinkers used by the flock during the period.",
    frequency: "At every refill and a consistent daily check time.",
    record: "Drinker count, capacity, fills, leftover, known spillage, problems and observer.",
    calculates:
      "Drinkers × capacity × fills − leftover − known spillage; intake per bird and water-to-feed ratio.",
    abnormal:
      "First confirm refills were recorded and drinkers worked. Interpret changes with heat, feed and health evidence.",
    mistakes:
      "Calling the result metered, treating missing leftover as zero, or ignoring a leaking drinker.",
    next: "Inspect empty, blocked or leaking drinkers and compare water and feed at the same time daily.",
    veterinarian:
      "Seek advice for a sudden intake drop with illness, deaths or persistent abnormal behaviour.",
  },
  {
    id: "health",
    title: "Complete the daily health check",
    category: "Health",
    summary: "Record ‘none seen’ explicitly so a quiet day differs from a missed check.",
    what: "A quick structured review of illness signs, affected numbers, location and severity.",
    why: "Health observations beside mortality help people review what happened before losses increased.",
    equipment: "No instrument required; optional photographs and veterinary findings.",
    steps: [
      "Observe the flock before disturbing it.",
      "Choose ‘none seen’ or select the visible signs.",
      "Estimate affected birds and note where they are.",
      "Score severity, record action and arrange follow-up.",
    ],
    where: "Whole-house observation plus the location of affected birds.",
    sample: "Observe the flock and handle a representative sample only when needed.",
    frequency: "Every visit, with a clear daily health-check result.",
    record: "Signs, affected count, severity, observer, time, photographs, action and outcome.",
    calculates: "Sign prevalence, unresolved events, time to action and trends beside mortality.",
    abnormal:
      "High severity, several signs together or sharply rising deaths should prompt veterinary contact.",
    mistakes:
      "Leaving a quiet day blank, recording culls as deaths, or treating an observation as a confirmed diagnosis.",
    next: "Start a health event, link treatments and mortality, and record whether signs resolve or worsen.",
    veterinarian:
      "Call a veterinarian for serious or widespread signs, rapid losses, nervous signs or uncertainty about treatment.",
  },
  {
    id: "physical-welfare",
    title: "Score physical welfare",
    category: "Bird welfare",
    summary: "Report the share of sampled birds at each score, not only an average.",
    what: "Footpad, hock, feather and gait condition from gentle hands-on sampling.",
    why: "Physical changes can reveal housing, litter and management problems.",
    equipment: "A practical sampling approach and a safe way to handle birds gently.",
    steps: [
      "Pick birds from different areas without selecting only calm or active birds.",
      "Check footpads, hocks, feathers and gait.",
      "Record the number at each score.",
      "Count blisters, wounds and lame birds separately.",
    ],
    where: "Representative locations across the whole house.",
    sample: "Use a practical recorded sample; every prevalence figure must show its sample size.",
    frequency: "Weekly and after abnormal environmental or behavioural observations.",
    record: "Sample size, score distribution, individual severe cases, counts and photographs.",
    calculates:
      "Share at each ordinal score, prevalence counts and change from the previous assessment.",
    abnormal:
      "Severe individual cases need their own health record even when most of the sample is unaffected.",
    mistakes:
      "Reporting only an average, hiding severe birds, or selecting an unrepresentative sample.",
    next: "Review litter, density, equipment and health events; link serious cases to a health event.",
    veterinarian:
      "Seek advice for severe lesions, many lame birds, wounds or worsening prevalence.",
  },
];

export const WELFARE_DIMENSIONS = [
  {
    id: "growth",
    name: "Growth & development",
    description: "Weight, daily gain, uniformity and expected development.",
    to: "/growth",
  },
  {
    id: "intake",
    name: "Feed & water",
    description: "Consumption, leftovers, ratios, stock losses and access.",
    to: "/water",
  },
  {
    id: "environment",
    name: "Environmental conditions",
    description: "Heat, air, ammonia, draughts, dust and lighting.",
    to: "/environment",
  },
  {
    id: "health",
    name: "Health & physical welfare",
    description: "Illness signs, mortality, behaviour and physical scores.",
    to: "/health",
  },
  {
    id: "housing",
    name: "Housing & management",
    description: "Litter, density, equipment, biosecurity and cleanout.",
    to: "/litter",
  },
] as const;
