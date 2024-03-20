import { Preferences, addictions } from "./addictions";
import { storageGet, storageSet } from "./storage";

export interface Day {
  bedtime: string;
  bedtime_duration: number;
  date: string;
  dayAddictions: {
    morning: boolean;
    night: boolean;
    evening: boolean;
    afternoon: boolean;
    value: number;
    addiction: keyof Preferences;
  }[];
  nightBreaks: {
    duration: number;
    type: string;
    time: string;
  }[];
  hypnotic: string;
  note: string;
  sleep_filled: boolean;
  sleepless: boolean;
  waking: string;
  waking_duration: number;
  with_hypnotic: boolean;
  fake?: boolean;
}

function createDay(date: string): Day {
  return {
    bedtime: "21:00",
    bedtime_duration: 0,
    date: date,
    dayAddictions: addictions.map((a) => ({
      morning: false,
      night: false,
      evening: false,
      afternoon: false,
      value: 0,
      addiction: a.id,
    })),
    nightBreaks: [],
    hypnotic: "20:00",
    note: "",
    sleep_filled: false,
    sleepless: false,
    waking: "07:00",
    waking_duration: 0,
    with_hypnotic: false,
  };
}

export async function saveDay(day: Day) {
  let days = await storageGet<Day[]>("days");
  if (!days) {
    days = [];
  }
  const index = days.findIndex((d) => d.date === day.date);
  if (index === -1) {
    days.push(day);
  } else {
    days[index] = day;
  }
  await storageSet("days", days);
}

export async function getDay(date: string) {
  const days = await storageGet<Day[]>("days");
  if (!days) {
    return createDay(date);
  }
  const day = days.find((day) => day.date === date);
  return day ? day : createDay(date);
}
