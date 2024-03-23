import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import Menu from "./components/Menu";
import { Home } from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { createContext, useEffect, useState } from "react";
import { Preferences, getPreferences } from "./models/addictions";

import { ScreenOrientation } from "@capacitor/screen-orientation";

setupIonicReact();

export const PreferencesContext = createContext<{
  preferences: Preferences | undefined;
  setPreferences: (preferences: Preferences) => void;
}>({ preferences: undefined, setPreferences: () => {} });

const App: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences>();

  useEffect(() => {
    ScreenOrientation.lock({ orientation: "portrait" });
    getPreferences().then((preferences) => {
      setPreferences(preferences);
    });
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <PreferencesContext.Provider value={{ preferences, setPreferences }}>
            <Menu />
            {/* @ts-expect-error (https://github.com/ionic-team/ionic-framework/issues/29170) */}
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Home />
              </Route>
            </IonRouterOutlet>
          </PreferencesContext.Provider>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
