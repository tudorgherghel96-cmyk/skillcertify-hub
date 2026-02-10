import {
  ShieldCheck,
  Package,
  Construction,
  AlertTriangle,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Lesson {
  id: number;
  title: string;
}

export interface Module {
  id: number;
  title: string;
  icon: LucideIcon;
  lessons: Lesson[];
  topics: string[];
}

export const MODULES: Module[] = [
  {
    id: 1,
    title: "Health & Safe Working Environment",
    icon: ShieldCheck,
    lessons: [
      { id: 1, title: "Why Health & Safety Matters" },
      { id: 2, title: "The Health & Safety at Work Act" },
      { id: 3, title: "Risk Assessments" },
      { id: 4, title: "Method Statements" },
      { id: 5, title: "Hazards, Risks & Accident Reporting" },
      { id: 6, title: "Safety Signs & Signals" },
      { id: 7, title: "Fire Safety & Prevention" },
      { id: 8, title: "Personal Protective Equipment (PPE)" },
    ],
    topics: [
      "Risk assessments",
      "Method statements",
      "Hazards & risks",
      "Accident reporting",
      "Safety signs",
      "Fire safety",
      "PPE",
    ],
  },
  {
    id: 2,
    title: "Safe Manual Handling",
    icon: Package,
    lessons: [
      { id: 1, title: "Correct Lifting Technique" },
      { id: 2, title: "TILEO Risk Factors" },
      { id: 3, title: "Manual Handling Injuries" },
      { id: 4, title: "Lifting Aids & Storage Safety" },
    ],
    topics: [
      "Lifting technique",
      "TILEO",
      "Injuries",
      "Lifting aids",
      "Storage safety",
    ],
  },
  {
    id: 3,
    title: "Working at Height",
    icon: Construction,
    lessons: [
      { id: 1, title: "Working at Height Regulations" },
      { id: 2, title: "Ladders & Step Ladders" },
      { id: 3, title: "Scaffolding Safety" },
      { id: 4, title: "Fragile Roofs, Voids & MEWPs" },
    ],
    topics: [
      "Regulations",
      "Ladders",
      "Scaffolding",
      "Fragile roofs",
      "Voids",
      "MEWPs",
      "Fall arrest",
    ],
  },
  {
    id: 4,
    title: "Health Risks",
    icon: AlertTriangle,
    lessons: [
      { id: 1, title: "COSHH & Hazardous Substances" },
      { id: 2, title: "Asbestos Awareness" },
      { id: 3, title: "Noise, Vibration, Dust & PPE Matching" },
    ],
    topics: [
      "COSHH",
      "Asbestos",
      "Drugs & alcohol",
      "Noise",
      "Vibration",
      "Dust",
      "PPE matching",
    ],
  },
  {
    id: 5,
    title: "Plant, Equipment & Machinery",
    icon: Truck,
    lessons: [
      { id: 1, title: "Exclusion Zones & Signallers" },
      { id: 2, title: "Vehicles, Emergency Stops & Safeguards" },
    ],
    topics: [
      "Exclusion zones",
      "Signallers",
      "Vehicles",
      "Emergency stops",
      "Safeguards",
    ],
  },
];
