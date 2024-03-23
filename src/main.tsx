import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { storageGet, storageSet } from "./models/storage";
import { Day } from "./models/days";
import { Preferences } from "./models/addictions";

const container = document.getElementById("root");
const root = createRoot(container!);

function startApp() {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

/*
 ** Should be deleted later, only here to handle previous versions of the app
 ** This is messy and full of type errors because its using an old cordova plugin, its kind of intended since it should be remove asap
 */

function addictionActivated(addictions: any[], name: string) {
  console.log("looking for", name);
  return addictions.find((a) => a.name === name).activated === "true";
}

function find(data: any[], field: string, value: string) {
  const res = [];
  for (let i = 0; i < data.length; i++) {
    // @ts-ignore
    if (data.item(i)[field] === value) {
      // @ts-ignore
      res.push(data.item(i));
    }
  }
  return res;
}

const addictionNameToId = {
  Ecrans: "screen",
  Jeux: "games",
  Nourriture: "food",
  Depenses: "expenses",
  Tabac: "tobacco",
  Alcool: "alcohol",
  Cannabis: "cannabis",
  Cocaine: "cocaine",
  "Hors Prescription": "other",
};

// @ts-ignore
if (window.sqlitePlugin) {
  storageGet("preferences").then((preferences) => {
    //if (false) {
    if (preferences) {
      console.log("We already got the old data");
      startApp();
    } else {
      // @ts-ignore
      const db = window.sqlitePlugin.openDatabase({
        name: "mylan.db",
        location: "default",
      });
      db.executeSql(
        "SELECT * FROM addictions",
        [],
        function (addictionsRes: any) {
          const addictions = [];
          for (let i = 0; i < addictionsRes.rows.length; i++) {
            addictions.push(addictionsRes.rows.item(i));
          }
          const preferences = {
            sleep: true,
            screen: addictionActivated(addictions, "Ecrans"),
            games: addictionActivated(addictions, "Jeux"),
            food: addictionActivated(addictions, "Nourriture"),
            expenses: addictionActivated(addictions, "Depenses"),
            tobacco: addictionActivated(addictions, "Tabac"),
            alcohol: addictionActivated(addictions, "Alcool"),
            cannabis: addictionActivated(addictions, "Cannabis"),
            cocaine: addictionActivated(addictions, "Cocaine"),
            other: addictionActivated(addictions, "Hors Prescription"),
          };
          storageSet("preferences", preferences).then(() => {
            db.executeSql("SELECT * FROM days", [], function (daysRes: any) {
              db.executeSql(
                "SELECT * FROM dayAddictions LEFT JOIN addictions ON addictions.id = id_addiction",
                [],
                function (daysAddictionsRes: any) {
                  console.log(
                    "DATA daysAddictions",
                    daysAddictionsRes.rows.length
                  );
                  db.executeSql(
                    "SELECT * FROM nightBreaks",
                    [],
                    function (nightBreaksRes: any) {
                      console.log(
                        "DATA nightBreaks",
                        nightBreaksRes.rows.length
                      );
                      const days = [];
                      for (
                        let dayIndex = 0;
                        dayIndex < daysRes.rows.length;
                        dayIndex++
                      ) {
                        const dayRow = daysRes.rows.item(dayIndex);
                        const nightBreaks = find(
                          nightBreaksRes.rows,
                          "id_day",
                          dayRow.id
                        );
                        const dayAddictions = find(
                          daysAddictionsRes.rows,
                          "id_day",
                          dayRow.id
                        );

                        console.log("dayRow", dayRow);

                        const day: Day = {
                          bedtime: dayRow.bedtime,
                          bedtime_duration: dayRow.bedtime_duration,
                          date: dayRow.date,
                          dayAddictions: dayAddictions.map((da: any) => ({
                            morning: da.morning === "true",
                            night: da.night === "true",
                            evening: da.evening === "true",
                            afternoon: da.afternoon === "true",
                            value: da.value,
                            // @ts-ignore
                            addiction: addictionNameToId[da.name],
                          })),
                          nightBreaks: nightBreaks.map((nb: any) => ({
                            duration: nb.duration,
                            type: Number(nb.type),
                            time: nb.time,
                          })),
                          hypnotic: dayRow.hypnotic,
                          note: dayRow.note,
                          sleep_filled: dayRow.sleep_filled2 === "true",
                          sleepless: dayRow.sleepless === "true",
                          waking: dayRow.waking,
                          waking_duration: dayRow.waking_duration,
                          with_hypnotic: dayRow.with_hypnotic === "true",
                        };
                        console.log("day", day);
                        days.push(day);
                      }
                      storageSet("days", days).then(() => {
                        startApp();
                      });
                    }
                  );
                }
              );
            });
          });
        },
        function (error: any) {
          console.log("error, we are probably in a fresh new app");
          startApp();
        }
      );
    }
  });
} else {
  console.log("no sqlite plugin, we are probably in a web context");
  startApp();
}
