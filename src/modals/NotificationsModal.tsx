import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { storageGet, storageSet } from "../models/storage";

import { LocalNotifications } from "@capacitor/local-notifications";

export function NotificationsModal() {
  const modal = useRef<HTMLIonModalElement>(null);
  const [notifications, setNotifications] = useState(false);
  const [notificationTime, setNotificationTime] = useState("10:00");

  useEffect(() => {
    storageGet<boolean>("notifications").then((result) => {
      setNotifications(result || false);
    });
  }, []);

  useEffect(() => {
    storageGet<string>("notificationTime").then((result) => {
      setNotificationTime(result || "10:00");
    });
  }, []);

  function disableNotifications() {
    setNotifications(false);
    storageSet("notifications", false);
  }

  async function triggerNotification(notificationTime: string) {
    await LocalNotifications.cancel({ notifications: [{ id: 42 }, { id: 0 }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 42,
          title: "ASC",
          body: "Pensez à remplir votre carnet.",
          schedule: {
            on: {
              hour: parseInt(notificationTime.split(":")[0]),
              minute: parseInt(notificationTime.split(":")[1]),
            },
          },
        },
      ],
    });
  }

  async function saveNotifications(value: boolean) {
    LocalNotifications.cancel({ notifications: [{ id: 42 }, { id: 0 }] });
    if (!value) {
      return disableNotifications();
    }
    const permissions = await LocalNotifications.checkPermissions();
    if (permissions.display === "denied") {
      alert(
        "Merci de ré-activer les permissions de notifications dans les paramètres de votre téléphone"
      );
      return disableNotifications();
    }
    if (permissions.display !== "granted") {
      const result = await LocalNotifications.requestPermissions();
      if (result.display !== "granted") {
        return disableNotifications();
      }
    }
    setNotifications(value);
    storageSet("notifications", value);
    triggerNotification(notificationTime);
  }

  async function saveTime(value: string) {
    setNotificationTime(value);
    storageSet("notificationTime", value);
    triggerNotification(value);
  }

  return (
    <IonModal ref={modal} trigger="open-notifications-modal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => modal.current?.dismiss()}>
              Retour
            </IonButton>
          </IonButtons>
          <IonTitle>Réglages</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonToggle
              checked={notifications}
              onIonChange={(e) => saveNotifications(e.detail.checked)}
            >
              Activer les notifications
            </IonToggle>
          </IonItem>
          {notifications && (
            <IonItem>
              <IonLabel>à</IonLabel>
              <IonDatetimeButton datetime="notifications"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id="notifications"
                  presentation="time"
                  value={notificationTime}
                  onIonChange={(e) =>
                    saveTime(e.detail.value?.toString() ?? "")
                  }
                />
              </IonModal>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonModal>
  );
}
