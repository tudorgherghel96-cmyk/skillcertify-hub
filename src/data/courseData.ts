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
      { id: 1, title: "Hazards and Risks: What is the Difference?" },
      { id: 2, title: "Risk Assessments: Keeping Everyone Safe" },
      { id: 3, title: "Method Statements: The Safe Way to Work" },
      { id: 4, title: "Dynamic Risk Assessments" },
      { id: 5, title: "Reporting Accidents and Near Misses" },
      { id: 6, title: "Safety Signs and Symbols" },
      { id: 7, title: "Electrical Safety, Fire Safety, and PPE" },
      { id: 8, title: "Personal Hygiene on Site" },
      { id: 9, title: "CDM 2015: Who Does What" },
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
      { id: 1, title: "What is Manual Handling and Why Does it Matter?" },
      { id: 2, title: "Safe Lifting Technique: Step by Step" },
      { id: 3, title: "TILE Assessment" },
      { id: 4, title: "Team Lifting & Mechanical Aids" },
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
      { id: 1, title: "What Counts as Working at Height?" },
      { id: 2, title: "Ladder Safety" },
      { id: 3, title: "Scaffold Safety" },
      { id: 4, title: "Fragile Roofs, Internal Voids, and Fall Protection" },
      { id: 5, title: "Fall Protection" },
    ],
    topics: [
      "Regulations",
      "Ladders",
      "Scaffolding",
      "Fragile roofs",
      "Voids",
      "MEWPs",
      "Fall arrest",
      "Fall protection",
    ],
  },
  {
    id: 4,
    title: "Health Risks",
    icon: AlertTriangle,
    lessons: [
      { id: 1, title: "COSHH: Substances Hazardous to Health" },
      { id: 2, title: "Asbestos: The Silent Killer" },
      { id: 3, title: "Noise and Vibration" },
      { id: 4, title: "Dust and Chemicals" },
      { id: 5, title: "Drugs, Alcohol & Substance Misuse" },
    ],
    topics: [
      "COSHH",
      "Asbestos",
      "Drugs & alcohol",
      "Noise",
      "Vibration",
      "Dust",
      "Chemicals",
      "PPE matching",
      "Substance misuse",
    ],
  },
  {
    id: 5,
    title: "Plant, Equipment & Machinery",
    icon: Truck,
    lessons: [
      { id: 1, title: "Banksman and Exclusion Zones" },
      { id: 2, title: "Machine Guarding & Isolation" },
      { id: 3, title: "Traffic Management" },
      { id: 4, title: "Overhead Services & Buried Utilities" },
      { id: 5, title: "Confined Spaces" },
    ],
    topics: [
      "Exclusion zones",
      "Signallers",
      "Vehicles",
      "Emergency stops",
      "Safeguards",
      "Traffic management",
      "Overhead services",
      "Buried utilities",
    ],
  },
];
