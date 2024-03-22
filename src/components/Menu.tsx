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
import { storageSet } from "../models/storage";
import { PreferencesContext } from "../App";

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
        <IonList>
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
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
