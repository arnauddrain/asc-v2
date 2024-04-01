import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";

import { addictions } from "../models/addictions";
import { useContext } from "react";
import { storageGet, storageSet } from "../models/storage";
import { PreferencesContext } from "../App";
import { AboutModal } from "../modals/AboutModal";
import { NotificationsModal } from "../modals/NotificationsModal";
import { Day, NightBreaksType } from "../models/days";
import { EmailComposer } from "capacitor-email-composer";
import { AgendaModel } from "../modals/AgendaModal";
import { formatNightBreak } from "../libs/date";

const Menu: React.FC = () => {
  const { preferences, setPreferences } = useContext(PreferencesContext);

  function toggleAddiction(addictionId: string, value: boolean) {
    if (preferences) {
      const newPreferences = { ...preferences, [addictionId]: value };
      storageSet("preferences", newPreferences).then(() => {
        setPreferences(newPreferences);
      });
    }
  }

  async function exportCSV() {
    let days = await storageGet<Day[]>("days");
    if (!days) {
      days = [];
    }
    days.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let fields = [
      "date",
      "sommeil rempli",
      "nuit blanche",
      "heure de coucher",
      "durée d'endormissement",
      "heure de réveil",
      "durée avant lever",
      "hypnotique",
      "siestes",
      "réveils",
    ];
    addictions.forEach((addiction) => {
      if (preferences && preferences[addiction.id]) {
        fields.push(addiction.name);
        fields.push("matin");
        fields.push("après-midi");
        fields.push("soirée");
        fields.push("nuit");
      }
    });
    fields.push("note");

    let csv = fields.join(";") + "\n";

    days.forEach((day) => {
      csv += day.date + ";";
      if (day.sleep_filled) {
        csv += "oui;";
        if (day.sleepless) {
          csv += "oui;;;;;;";
        } else {
          csv += "non;";
          csv += day.bedtime + ";";
          csv += day.bedtime_duration + ";";
          csv += day.waking + ";";
          csv += day.waking_duration + ";";
          csv += day.with_hypnotic ? day.hypnotic + ";" : "non;";
        }
      } else {
        csv += "non;;;;;;;";
      }
      csv +=
        day.nightBreaks
          .filter((nb) => nb.type === NightBreaksType.NAP)
          .map((nb) => formatNightBreak(nb))
          .join(" - ") + ";";
      csv +=
        day.nightBreaks
          .filter((nb) => nb.type === NightBreaksType.WAKE_UP)
          .map((nb) => formatNightBreak(nb))
          .join(" - ") + ";";
      addictions.forEach((addiction) => {
        if (preferences && preferences[addiction.id]) {
          const dayAddiction = day.dayAddictions.find(
            (da) => da.addiction === addiction.id
          );
          if (!dayAddiction) {
            console.error(
              "Data not found for " +
                addiction.name +
                ", this should not happen"
            );
            csv += ";;;;;";
          } else {
            csv +=
              dayAddiction.value / 100 +
              ";" +
              (dayAddiction.morning ? "oui;" : "non;") +
              (dayAddiction.afternoon ? "oui;" : "non;") +
              (dayAddiction.evening ? "oui;" : "non;") +
              (dayAddiction.night ? "oui;" : "non;");
          }
        }
      });
      csv += day.note + ";";
      csv += "\n";
    });

    console.log(csv);
    const email = {
      attachments: [
        {
          // because this is an enum and typescript was converting to "string"
          type: "base64" as "base64",
          path: btoa(csv),
          name: "export.csv",
        },
      ],
      subject: "Export ASC",
      body: "Voici un export des données de l'application ASC.",
      isHtml: true,
    };

    // Send a text message using default options
    EmailComposer.open(email);
  }

  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="ion-margin-bottom">
          <IonItem>Activation des informations suivies</IonItem>
        </IonList>
        <IonList className="ion-margin-bottom">
          <IonItem>
            <IonToggle
              checked={preferences ? preferences["sleep"] : false}
              onIonChange={(e) => {
                toggleAddiction("sleep", e.detail.checked);
              }}
            >
              Sommeil
            </IonToggle>
          </IonItem>
          {addictions.map((addiction) => {
            return (
              <IonItem key={addiction.id}>
                <IonToggle
                  checked={preferences ? preferences[addiction.id] : false}
                  onIonChange={(e) => {
                    toggleAddiction(addiction.id, e.detail.checked);
                  }}
                >
                  {addiction.name}
                </IonToggle>
              </IonItem>
            );
          })}
        </IonList>
        <IonList>
          <IonItem id="open-agenda-modal">Agenda de sommeil</IonItem>
          <IonItem id="open-notifications-modal">Notifications</IonItem>
          <IonItem id="open-about-modal">À propos</IonItem>
          <IonItem onClick={exportCSV}>Exporter</IonItem>
        </IonList>
      </IonContent>
      {/* The modals should probably be pages but :shrug: */}
      <NotificationsModal />
      <AboutModal />
      <AgendaModel />
    </IonMenu>
  );
};

export default Menu;
