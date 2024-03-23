import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRef, useState } from "react";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { storageGet } from "../models/storage";
import { Day, sleepDuration } from "../models/days";
import { frenchMonths } from "../libs/date";

/*
 ** All of the code below was written by me 7 years ago as a student, it should probably be rewritten
 */
export function AgendaModel() {
  const modal = useRef<HTMLIonModalElement>(null);
  const [days, setDays] = useState<Day[]>([]);

  async function onWillPresent() {
    ScreenOrientation.lock({ orientation: "landscape" });
    let days = await storageGet<Day[]>("days");
    if (!days) {
      days = [];
    }
    days.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setDays(days);
  }

  function onWillDismiss() {
    ScreenOrientation.lock({ orientation: "portrait" });
    ScreenOrientation.unlock();
  }

  function formatDate(date: string) {
    const today = new Date(date);
    const tomorrow = new Date(date);
    tomorrow.setDate(Number(tomorrow.getDate()) + 1);
    return (
      today.getDate() +
      " / " +
      tomorrow.getDate() +
      " " +
      frenchMonths(today.getMonth()) +
      "."
    );
  }

  function computeWidth(duration: number) {
    return (duration / (24 * 60)) * 100 + "%";
  }

  function computeLeft(timeStart: string) {
    if (timeStart === "") {
      return 0;
    }
    const startTime = timeStart.split(":");
    let time = parseInt(startTime[0], 10) * 60 + parseInt(startTime[1], 10);
    if (parseInt(startTime[0], 10) < 20) {
      time += 60 * 24;
    }
    time -= 60 * 20;
    return (time / (24 * 60)) * 100 + "%";
  }

  function computeSleepWidth(day: Day) {
    if (day.sleepless || !day.sleep_filled) {
      return 0;
    }
    return (sleepDuration(day, false) / (24 * 60)) * 100 + "%";
  }

  function computeSleepLeft(day: Day) {
    if (day.bedtime === "") {
      return 0;
    }
    const startTime = day.bedtime.split(":");
    const endTime = day.waking.split(":");
    let time = parseInt(startTime[0], 10) * 60 + parseInt(startTime[1], 10);
    if (
      startTime[0] < endTime[0] ||
      (startTime[0] === endTime[0] && startTime[1] < endTime[1])
    ) {
      time += 60 * 24;
    }
    time -= 60 * 20;
    if (day.bedtime_duration > 0) {
      time += day.bedtime_duration;
    }
    return (time / (24 * 60)) * 100 + "%";
  }

  return (
    <IonModal
      ref={modal}
      trigger="open-agenda-modal"
      onWillPresent={onWillPresent}
      onWillDismiss={onWillDismiss}
    >
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => modal.current?.dismiss()}>
              Retour
            </IonButton>
          </IonButtons>
          <IonTitle>Agenda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="scroll-content">
          <div className="agenda">
            <div className="agenda-row header">
              <div className="agenda-cell agenda-label"></div>
              <div className="agenda-cell agenda-times">
                <span>20h</span>
                <span>22h</span>
                <span>00h</span>
                <span>02h</span>
                <span>04h</span>
                <span>06h</span>
                <span>08h</span>
                <span>10h</span>
                <span>12h</span>
                <span>14h</span>
                <span>16h</span>
                <span>18h</span>
                <span>20h</span>
              </div>
            </div>
            {days.map((day) => (
              <div className="agenda-row" key={day.date}>
                <div className="agenda-cell agenda-label">
                  <span>{formatDate(day.date)}</span>
                </div>
                <div className="agenda-cell agenda-times">
                  {day.bedtime_duration > 0 && (
                    <div
                      className="sommeil awake"
                      style={{
                        width: computeWidth(day.bedtime_duration),
                        left: computeLeft(day.bedtime),
                      }}
                    ></div>
                  )}
                  <div
                    className="sommeil"
                    style={{
                      width: computeSleepWidth(day),
                      left: computeSleepLeft(day),
                    }}
                  ></div>
                  {day.waking_duration > 0 && (
                    <div
                      className="sommeil awake"
                      style={{
                        width: computeWidth(day.waking_duration),
                        left: computeLeft(day.waking),
                      }}
                    ></div>
                  )}
                  {day.nightBreaks
                    .filter((nb) => nb.type === 0)
                    .map((nb) => (
                      <span
                        className="break wakeup"
                        style={{
                          width: computeWidth(nb.duration),
                          left: computeLeft(nb.time),
                        }}
                      />
                    ))}
                  {day.nightBreaks
                    .filter((nb) => nb.type === 1)
                    .map((nb) => (
                      <span
                        className="break nape"
                        style={{
                          width: computeWidth(nb.duration),
                          left: computeLeft(nb.time),
                        }}
                      />
                    ))}
                  {day.with_hypnotic && (
                    <img
                      className="hypnotic-agenda"
                      src="/hypnotic.png"
                      style={{ left: computeLeft(day.hypnotic) }}
                    />
                  )}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(() => (
                    <span />
                  ))}
                </div>
                <span className="border" />
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
