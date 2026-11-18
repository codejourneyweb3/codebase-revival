import { useState } from "react";
import { Building2, Home, MapPin, Plus, Ruler, Settings2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateDensity } from "./calculations";
import {
  EmptyState,
  Metric,
  ModuleHeader,
  Notice,
  Panel,
  PreviewFormDialog,
  StubButton,
} from "./ui";

export function FarmHousesScreen() {
  const { user } = useAuth();
  const [area, setArea] = useState("400");
  const [population, setPopulation] = useState("5500");
  const [weight, setWeight] = useState("1.6");
  const [target, setTarget] = useState("2");
  const density = calculateDensity({
    usableAreaM2: Number(area),
    livePopulation: Number(population),
    averageWeightKg: Number(weight),
    targetWeightKg: Number(target),
    houseLimitKgM2: 30,
  });
  return (
    <div>
      <ModuleHeader
        eyebrow="Farm & infrastructure"
        title="The house behind every record"
        description="Keep permanent farm and house configuration separate from each production cycle. Historical flocks remain attached to the house even after sale or cleanout."
        actions={
          <PreviewFormDialog
            feature="Poultry house"
            behavior="This will save the house configuration, calculate usable floor area, and make its measurement locations and equipment available to every flock and observation."
            trigger={
              <Button>
                <Plus />
                Add poultry house
              </Button>
            }
            title="Add a poultry house"
            description="Preview the core setup. Detailed equipment and measurement locations can follow."
            fields={[
              { name: "name", label: "House name", required: true },
              {
                name: "type",
                label: "Housing type",
                type: "select",
                options: ["Open sided", "Solid wall"],
                required: true,
              },
              { name: "length", label: "Length (m)", type: "number", required: true },
              { name: "width", label: "Width (m)", type: "number", required: true },
              { name: "obstructions", label: "Permanent obstructions (m²)", type: "number" },
              { name: "capacity", label: "Maximum approved birds", type: "number" },
              {
                name: "ventilation",
                label: "Ventilation",
                type: "select",
                options: [
                  "Natural",
                  "Positive pressure",
                  "Cross ventilation",
                  "Tunnel",
                  "Tunnel with evaporative cooling",
                ],
              },
              { name: "heating", label: "Heating and cooling" },
              { name: "floor", label: "Floor construction" },
              { name: "materials", label: "Roofing and wall materials" },
              { name: "feeders", label: "Feeder type and quantity" },
              { name: "drinkers", label: "Drinker type and quantity" },
              {
                name: "locations",
                label: "Measurement locations",
                type: "textarea",
                full: true,
                placeholder: "Brooder, mid-house, drinkers, fans…",
              },
            ]}
          />
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Metric
          label="Farms"
          value="1"
          note="Single-organisation deployment"
          icon={<Building2 />}
        />
        <Metric
          label="Configured houses"
          value="0"
          note="New house setup is a frontend preview"
          icon={<Home />}
        />
        <Metric
          label="Measurement locations"
          value="—"
          note="Add locations with each house"
          icon={<MapPin />}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel
          title="Farm profile"
          description="Permanent operational identity and infrastructure."
        >
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Farm name</dt>
              <dd className="mt-1 font-semibold">{user?.farmName ?? "Your farm"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Production focus
              </dt>
              <dd className="mt-1 font-semibold">Broiler poultry</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Location</dt>
              <dd className="mt-1 text-muted-foreground">Not configured</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Water, power and biosecurity
              </dt>
              <dd className="mt-1 text-muted-foreground">Setup information missing</dd>
            </div>
          </dl>
          <PreviewFormDialog
            feature="Farm profile"
            behavior="This will save farm contacts, GPS location, production system, water sources, electricity, backup power, biosecurity and operating capacity."
            trigger={
              <Button variant="outline" className="mt-5 w-full">
                <Settings2 />
                Edit farm profile
              </Button>
            }
            title="Farm information"
            description="Preview the permanent farm setup fields."
            fields={[
              {
                name: "name",
                label: "Farm name",
                defaultValue: user?.farmName ?? "",
                required: true,
              },
              { name: "location", label: "Location and GPS coordinates" },
              { name: "contact", label: "Owner or management contact" },
              { name: "system", label: "Production system", defaultValue: "Broiler" },
              { name: "water", label: "Water sources" },
              { name: "power", label: "Electricity and backup power" },
              {
                name: "biosecurity",
                label: "Biosecurity arrangements",
                type: "textarea",
                full: true,
              },
              {
                name: "capacity",
                label: "General operational capacity",
                type: "textarea",
                full: true,
              },
            ]}
          />
        </Panel>
        <Panel
          title="Poultry houses"
          description="Each house keeps its dimensions, equipment and measurement locations."
        >
          <EmptyState
            icon={<Home />}
            title="No KukuThrive house profiles yet"
            description="Your existing flock records are unchanged. Add a house preview to see how usable area, density limits and equipment capacity will come together."
          />
        </Panel>
      </div>

      <Panel
        className="mt-5"
        title="Worked density example"
        description="The exact worked example from your specification. Edit the values to explore the frontend formula."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField id="farm-area" label="Usable area (m²)" value={area} set={setArea} />
          <NumberField
            id="farm-population"
            label="Birds placed / live"
            value={population}
            set={setPopulation}
          />
          <NumberField
            id="farm-weight"
            label="Current average (kg)"
            value={weight}
            set={setWeight}
          />
          <NumberField
            id="farm-target"
            label="Target depletion (kg)"
            value={target}
            set={setTarget}
          />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Result
            label="Maximum placement"
            value={`${Math.floor(density.maximumPlacement).toLocaleString()} birds`}
          />
          <Result
            label="Projected final density"
            value={`${density.projectedKgM2.toFixed(1)} kg/m²`}
          />
          <Result label="Current biomass" value={`${density.currentKgM2.toFixed(1)} kg/m²`} />
          <Result label="Current utilisation" value={`${density.utilizationPercent.toFixed(1)}%`} />
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-lg bg-muted p-4 text-xs leading-5 text-muted-foreground">
          <Ruler className="mt-0.5 size-4 shrink-0 text-secondary" />
          Naturally ventilated open-sided example limit: 30 kg/m². Source: Cobb starting value,
          pending professional review. Current values use the measured-weight label only when an
          actual session supports them.
        </div>
      </Panel>
      <div className="mt-4">
        <Notice title="Placement planning is a ceiling, not a target">
          KukuThrive will warn before projected final density exceeds the configured house limit. Any
          stricter farm, veterinary or regulatory limit can override it; raising a seeded limit will
          require a logged reason.
        </Notice>
      </div>
      <div className="mt-4">
        <StubButton
          feature="House history"
          behavior="This will show every flock, cleanout, rest period, density history, equipment failure and environmental observation for the selected house."
          variant="outline"
        >
          Preview house history
        </StubButton>
      </div>
    </div>
  );
}
function NumberField({
  id,
  label,
  value,
  set,
}: {
  id: string;
  label: string;
  value: string;
  set: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(event) => set(event.target.value)}
      />
    </div>
  );
}
function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-accent p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="num mt-1 font-display text-xl font-semibold text-accent-foreground">
        {value}
      </div>
    </div>
  );
}
