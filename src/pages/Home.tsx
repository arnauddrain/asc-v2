import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonGrid,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { storageGet, storageSet } from "../models/storage";
import { Day } from "../models/days";
import { frenchMonth, storageDate } from "../libs/date";
import { EditDayModal } from "../modals/EditDayModal";

export function Home() {
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
          >
            <IonCardHeader color={day.fake ? "light" : "primary"}>
              Journée et nuit du {day.date.split("-")[2]}{" "}
              {frenchMonth(parseInt(day.date.split("-")[1]) - 1)}
            </IonCardHeader>
            <IonCardContent class="ion-text-center">
              {day.fake ? (
                <IonButton>Remplir maintenant</IonButton>
              ) : (
                <IonGrid>
                  <IonRow>Ce jour existe</IonRow>
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
