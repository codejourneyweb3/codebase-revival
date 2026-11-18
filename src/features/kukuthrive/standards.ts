/** Seed reference values from the breeder management guides (plan Appendix B). All pending professional review. */
export interface NumericStandard {
  group: string;
  parameter: string;
  reference: string;
  stage: string;
  source: "Ross 2025" | "Cobb 2012";
}

export const NUMERIC_STANDARDS: NumericStandard[] = [
  {
    group: "Stocking density",
    parameter: "Open sided, natural ventilation",
    reference: "Max 30 kg/m² (KukuThrive default for Uganda)",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Stocking density",
    parameter: "Open sided, positive pressure",
    reference: "Max 35 kg/m²",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Stocking density",
    parameter: "Solid wall, cross ventilation",
    reference: "Max 35 kg/m²",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Stocking density",
    parameter: "Solid wall, tunnel ventilation",
    reference: "Max 39 kg/m²",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Stocking density",
    parameter: "Tunnel with evaporative cooling",
    reference: "Max 42 kg/m²",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Brooding",
    parameter: "Placement density (warm season)",
    reference: "40–50 birds/m² of open brooding area",
    stage: "Days 0–14",
    source: "Cobb 2012",
  },
  {
    group: "Brooding",
    parameter: "Air temperature",
    reference: "30 °C whole-house; 32 °C at brooder edge",
    stage: "Placement",
    source: "Ross 2025",
  },
  {
    group: "Brooding",
    parameter: "Relative humidity",
    reference: "60–70%",
    stage: "Placement",
    source: "Ross 2025",
  },
  {
    group: "Brooding",
    parameter: "Litter temperature",
    reference: "28–32 °C",
    stage: "Placement",
    source: "Ross 2025",
  },
  {
    group: "Brooding",
    parameter: "Chick vent temperature",
    reference: "39.4–40.5 °C",
    stage: "Days 0–3",
    source: "Ross 2025",
  },
  {
    group: "Brooding",
    parameter: "Light after day 7",
    reference: "≥4 h continuous dark; 5–10 lux in light period",
    stage: "Day 7+",
    source: "Ross 2025",
  },
  {
    group: "Air quality",
    parameter: "Ammonia at bird height",
    reference: "Below 10 ppm",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Air quality",
    parameter: "Carbon dioxide",
    reference: "Below 3,000 ppm",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Air quality",
    parameter: "Carbon monoxide",
    reference: "Below 10 ppm",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Air quality",
    parameter: "Relative humidity",
    reference: "45–65%",
    stage: "After brooding",
    source: "Cobb 2012",
  },
  {
    group: "Air quality",
    parameter: "Max air speed across birds",
    reference: "0.3 m/s (0–14 d) · 0.5 (15–21 d) · 0.875 (22–28 d)",
    stage: "By age",
    source: "Cobb 2012",
  },
  {
    group: "Litter",
    parameter: "Moisture ceiling",
    reference: "Below 35%",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Litter",
    parameter: "Minimum depth, wood shavings",
    reference: "2.5 cm",
    stage: "Placement",
    source: "Cobb 2012",
  },
  {
    group: "Water",
    parameter: "Water-to-feed ratio",
    reference: "≈2:1 at 20 °C · 2.5:1 at 26 °C (indicative)",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Equipment",
    parameter: "Feeder pan (33 cm)",
    reference: "50–70 birds per pan",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Equipment",
    parameter: "Low-flow nipple",
    reference: "≈10 birds per nipple",
    stage: "All ages",
    source: "Cobb 2012",
  },
  {
    group: "Growth",
    parameter: "Seven-day body weight",
    reference: "≥4.5 × day-old weight",
    stage: "Day 7",
    source: "Ross 2025",
  },
  {
    group: "Growth",
    parameter: "Weighing sample size",
    reference: "At least 1% or 100 birds, whichever is greater",
    stage: "Day 7+",
    source: "Ross 2025",
  },
];

export const THRESHOLD_KINDS = [
  { name: "Target", text: "The value the farm is aiming for." },
  { name: "Acceptable range", text: "Normal operating band; no prompt." },
  { name: "Investigation", text: "Prompts a check. Not a diagnosis or a legal limit." },
  { name: "Emergency", text: "Act now. Only where professionally justified." },
];
