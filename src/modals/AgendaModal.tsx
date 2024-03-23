import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRef } from "react";

export function AgendaModel() {
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal ref={modal} trigger="open-agenda-modal">
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
      <IonContent className="ion-padding">
        <h1>Agenda de sommeil</h1>

        <p>L'agenda de sommeil est en re-construction et revient très vite !</p>
      </IonContent>
    </IonModal>
  );
}
