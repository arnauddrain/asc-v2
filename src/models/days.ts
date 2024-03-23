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
    type: number;
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

export const periods: {
  id: "morning" | "afternoon" | "evening" | "night";
  name: string;
}[] = [
  { id: "morning", name: "Matin" },
  { id: "afternoon", name: "Après-midi" },
  { id: "evening", name: "Soirée" },
  { id: "night", name: "Nuit" },
];

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

export function sleepDuration(day: Day, withBreaks = true) {
  if (!day.sleep_filled || day.sleepless) {
    return 0;
  }
  const startTime = day.bedtime.split(":").map(Number);
  const endTime = day.waking.split(":").map(Number);
  let time = endTime[1] - startTime[1];
  time += endTime[0] * 60 - startTime[0] * 60;
  if (
    endTime[0] < startTime[0] ||
    (endTime[0] === startTime[0] && endTime[1] < startTime[1])
  ) {
    time += 24 * 60;
  }
  if (withBreaks) {
    day.nightBreaks.forEach((nightBreak) => {
      if (nightBreak.type === 0) {
        time -= nightBreak.duration;
      } else {
        time += nightBreak.duration;
      }
    });
  }
  time -= day.bedtime_duration;
  return time;
}

export function formatSleepDuration(day: Day) {
  const sleep = sleepDuration(day);
  const hour = Math.floor(sleep / 60);
  const minutes = sleep % 60;
  let time = hour + "h";
  if (minutes > 0) {
    if (minutes < 10) {
      time += "0";
    }
    time += minutes;
  }
  return time;
}
