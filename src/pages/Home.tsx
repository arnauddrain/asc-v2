import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { storageGet, storageSet } from "../models/storage";
import {
  Day,
  formatSleepDuration,
  periods,
  sleepDuration,
} from "../models/days";
import { frenchMonth, storageDate } from "../libs/date";
import { EditDayModal } from "../modals/EditDayModal";
import { PreferencesContext } from "../App";
import { Addiction, addictions } from "../models/addictions";

export function Home() {
  const { preferences } = useContext(PreferencesContext);
  const [days, setDays] = useState<Day[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    storageGet<Day[]>("days").then((result) => {
      if (!result) {
        result = [];
        storageSet("days", []);
      }
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const day = result.length ? new Date(result[0].date) : new Date();
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const days: Day[] = [];
      while (!days.length || tomorrow.getTime() > day.getTime()) {
        if (
          result.length > 0 &&
          Math.ceil(new Date(result[0].date).getTime() / 86400000) ===
            Math.ceil(day.getTime() / 86400000)
        ) {
          days.push(result.shift() as Day);
        } else {
          days.push({
            fake: true,
            bedtime: "",
            bedtime_duration: 0,
            date: storageDate(day),
            dayAddictions: [],
            nightBreaks: [],
            hypnotic: "",
            note: "",
            sleep_filled: false,
            sleepless: false,
            waking: "",
            waking_duration: 0,
            with_hypnotic: false,
          });
        }
        day.setDate(day.getDate() + 1);
      }
      days.reverse();
      setDays(days);
    });
  }, [isOpen]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Asc - Agenda</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {days.map((day) => (
          <IonCard
            key={day.date}
            onClick={() => {
              setCurrentDate(day.date);
              setIsOpen(true);
            }}
            className="day-card"
          >
            <IonCardHeader color={day.fake ? "light" : "primary"}>
              <IonCardTitle>
                Journée et nuit du {day.date.split("-")[2]}{" "}
                {frenchMonth(parseInt(day.date.split("-")[1]) - 1)}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent class={`${day.fake ? "ion-text-center" : ""}`}>
              {day.fake ? (
                <IonButton className="ion-margin">Remplir maintenant</IonButton>
              ) : (
                <IonGrid>
                  {preferences?.sleep && (
                    <IonRow className="sleep">
                      <IonCol size="3" className="addiction-name">
                        <IonImg src="/sleep.png" />
                        Sommeil
                      </IonCol>
                      <IonCol size="9">
                        <IonRow>
                          <IonCol>
                            {!day.sleep_filled ? (
                              <i>Non rempli</i>
                            ) : day.sleepless ? (
                              <i>Nuit Blanche</i>
                            ) : (
                              <>
                                <h3>{formatSleepDuration(day)} de sommeil</h3>
                                <div
                                  className="progress addiction-background"
                                  style={{
                                    width:
                                      (sleepDuration(day) / (24 * 60)) * 100 +
                                      "%",
                                  }}
                                ></div>
                              </>
                            )}
                          </IonCol>
                        </IonRow>
                        {day.with_hypnotic && (
                          <IonRow className="hypnotic">
                            <IonCol>
                              <IonImg src="/hypnotics.png" />
                            </IonCol>
                            <IonCol size="10">
                              Hypnotique à {day.hypnotic.replace(":", "h")}
                            </IonCol>
                          </IonRow>
                        )}
                      </IonCol>
                    </IonRow>
                  )}
                  {addictions.map(
                    (addiction) =>
                      preferences?.[addiction.id] && (
                        <AddictionRow
                          day={day}
                          addiction={addiction}
                          key={addiction.id}
                        />
                      )
                  )}
                  {day.note && (
                    <IonRow>
                      <IonCol size="3" className="note addiction-name">
                        <IonImg src="/note.png" /> Note
                      </IonCol>
                      <IonCol size="9">{day.note}</IonCol>
                    </IonRow>
                  )}
                </IonGrid>
              )}
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
      <EditDayModal
        isOpen={isOpen}
        setIsOpen={(value) => {
          setIsOpen(value);
          setCurrentDate("");
        }}
        currentDate={currentDate}
      />
    </IonPage>
  );
}

function AddictionRow({ addiction, day }: { addiction: Addiction; day: Day }) {
  const dayAddiction = day.dayAddictions.find(
    (da) => da.addiction === addiction.id
  );
  if (!dayAddiction) {
    console.error(
      `Data not found for ${addiction.name}, this should not happen`
    );
    return null;
  }

  return (
    <IonRow key={addiction.id} className={addiction.id}>
      <IonCol size="3" className="addiction-name">
        <IonImg src={`/${addiction.id}.png`} />
        {addiction.name}
      </IonCol>
      <IonCol size="9">
        <IonRow>
          <IonCol>
            <h3>
              {dayAddiction.value / 100} {addiction.unit}
            </h3>
            <div
              className="progress addiction-background"
              style={{
                width: dayAddiction.value / addiction.max + "%",
              }}
            ></div>
          </IonCol>
        </IonRow>
        <IonRow>
          {periods.map((period) => (
            <IonCol key={period.id}>
              <IonImg
                src={`/${period.id}-${
                  dayAddiction[period.id] ? "on" : "off"
                }.png`}
              />
            </IonCol>
          ))}
          <IonCol size="3"></IonCol>
        </IonRow>
      </IonCol>
    </IonRow>
  );
}
