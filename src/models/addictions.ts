import { storageGet, storageSet } from "./storage";

export interface Addiction {
  id: keyof Preferences;
  name: string;
  question: string;
  unit: string;
  max: number;
  step: number;
}

export const addictions: Addiction[] = [
  {
    id: "screen",
    name: "Écrans",
    question: "Temps total d'écrans",
    unit: "heures",
    max: 24,
    step: 1,
  },
  {
    id: "games",
    name: "Jeux",
    question: "Temps total de jeux",
    unit: "heures",
    max: 20,
    step: 1,
  },
  {
    id: "food",
    name: "Nourriture",
    question: "Nombre de crises",
    unit: "crises",
    max: 15,
    step: 1,
  },
  {
    id: "expenses",
    name: "Dépenses",
    question: "Dépenses totales",
    unit: "€",
    max: 500,
    step: 10,
  },
  {
    id: "tobacco",
    name: "Tabac",
    question: "Nombre de cigarettes dans la journée",
    unit: "cigarettes",
    max: 40,
    step: 1,
  },
  {
    id: "alcohol",
    name: "Alcool",
    question: "Nombre de verres dans la journée",
    unit: "verres",
    max: 40,
    step: 1,
  },
  {
    id: "cannabis",
    name: "Cannabis",
    question: "Nombre de joints dans la journée",
    unit: "joints",
    max: 20,
    step: 1,
  },
  {
    id: "cocaine",
    name: "Cocaïne",
    question: "Nombre de grammes dans la journée",
    unit: "grammes",
    max: 5,
    step: 0.25,
  },
  {
    id: "other",
    name: "Hors Prescription",
    question: "Nombre de doses dans la journée",
    unit: "comprimés",
    max: 10,
    step: 0.5,
  },
];

export interface Preferences {
  sleep: boolean;
  screen: boolean;
  games: boolean;
  food: boolean;
  expenses: boolean;
  tobacco: boolean;
  alcohol: boolean;
  cannabis: boolean;
  cocaine: boolean;
  other: boolean;
}

export async function getPreferences(): Promise<Preferences> {
  let result = await storageGet<Preferences>("preferences");
  if (!result) {
    result = {
      sleep: true,
      screen: true,
      games: false,
      food: false,
      expenses: false,
      tobacco: false,
      alcohol: false,
      cannabis: false,
      cocaine: false,
      other: false,
    };
    await storageSet("preferences", result);
  }
  return result;
}
