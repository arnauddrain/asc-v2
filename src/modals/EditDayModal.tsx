import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCheckbox,
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonRange,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { frenchMonth } from "../libs/date";
import { useContext, useEffect, useState } from "react";
import { Addiction, addictions } from "../models/addictions";
import { Day, getDay, saveDay } from "../models/days";
import { PreferencesContext } from "../App";

const incrementValues = [
  0, 5, 10, 15, 20, 25, 30, 45, 60, 75, 90, 105, 120, 150, 180, 210, 240,
];

export function EditDayModal({
  isOpen,
  setIsOpen,
  currentDate,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  currentDate: string;
}) {
  const { preferences } = useContext(PreferencesContext);
  const [day, setDay] = useState<Day>();

  useEffect(() => {
    if (currentDate) {
      getDay(currentDate).then((day) => {
        setDay(day);
      });
    } else {
      setDay(undefined);
    }
  }, [currentDate]);

  function save() {
    if (day) {
      saveDay(day).then(() => {
        setIsOpen(false);
      });
    }
  }

  function addNightBreak(type: number) {
    if (day) {
      setDay({
        ...day,
        nightBreaks: [
          ...day.nightBreaks,
          {
            type: type,
            time: "00:00",
            duration: 0,
          },
        ],
      });
    }
  }

  function deleteNightBreak(index: number) {
    if (day) {
      setDay({
        ...day,
        nightBreaks: day.nightBreaks.filter((_, i) => i !== index),
      });
    }
  }

  return (
    <IonModal isOpen={isOpen} onWillDismiss={() => setIsOpen(false)}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => setIsOpen(false)}>Annuler</IonButton>
          </IonButtons>
          <IonTitle>
            {currentDate.split("-")[2]}{" "}
            {frenchMonth(parseInt(currentDate.split("-")[1]) - 1)}{" "}
            {currentDate.split("-")[0]}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={save}>Enregistrer</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {preferences && day && (
        <IonContent>
          {preferences["sleep"] && (
            <IonCard>
              <IonCardHeader>Sommeil</IonCardHeader>
              <IonCardContent>
                {!day.sleep_filled ? (
                  <IonButton
                    onClick={() => setDay({ ...day, sleep_filled: true })}
                  >
                    Editer le sommeil
                  </IonButton>
                ) : (
                  <>
                    <IonRow>
                      <IonCol>
                        <IonItem>
                          <IonCheckbox
                            checked={day.sleepless}
                            onIonChange={(e) =>
                              setDay({ ...day, sleepless: e.detail.checked })
                            }
                          >
                            Nuit blanche
                          </IonCheckbox>
                        </IonItem>
                      </IonCol>
                      <IonCol></IonCol>
                    </IonRow>
                    {!day.sleepless && (
                      <IonRow>
                        <IonCol>
                          <IonItem>
                            <IonLabel>Heure de mise au lit</IonLabel>
                            <IonDatetimeButton datetime="bedtime"></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                              <IonDatetime
                                id="bedtime"
                                presentation="time"
                                value={day.bedtime}
                                onIonChange={(e) =>
                                  setDay({
                                    ...day,
                                    bedtime: e.detail.value?.toString() ?? "",
                                  })
                                }
                              />
                            </IonModal>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonSelect
                              label="Durée d'endormissement"
                              value={day.bedtime_duration}
                              onIonChange={(e) =>
                                setDay({
                                  ...day,
                                  bedtime_duration: e.detail.value,
                                })
                              }
                            >
                              {incrementValues.map((number) => (
                                <IonSelectOption value={number} key={number}>
                                  {number >= 60
                                    ? Math.floor(number / 60) + " heures "
                                    : ""}
                                  {number >= 60 && number % 60 ? "et " : ""}
                                  {number === 0 || number % 60
                                    ? (number % 60) + " minutes"
                                    : ""}
                                </IonSelectOption>
                              ))}
                            </IonSelect>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    )}
                    {!day.sleepless && (
                      <IonRow>
                        <IonCol>
                          <IonItem>
                            <IonLabel>Heure de réveil</IonLabel>
                            <IonDatetimeButton datetime="waking"></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                              <IonDatetime
                                id="waking"
                                presentation="time"
                                value={day.waking}
                                onIonChange={(e) =>
                                  setDay({
                                    ...day,
                                    waking: e.detail.value?.toString() ?? "",
                                  })
                                }
                              />
                            </IonModal>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonSelect
                              label="Durée avant lever"
                              value={day.waking_duration}
                              onIonChange={(e) =>
                                setDay({
                                  ...day,
                                  waking_duration: e.detail.value,
                                })
                              }
                            >
                              {incrementValues.map((number) => (
                                <IonSelectOption value={number} key={number}>
                                  {number >= 60
                                    ? Math.floor(number / 60) + " heures "
                                    : ""}
                                  {number >= 60 && number % 60 ? "et " : ""}
                                  {number === 0 || number % 60
                                    ? (number % 60) + " minutes"
                                    : ""}
                                </IonSelectOption>
                              ))}
                            </IonSelect>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    )}
                    <IonRow>
                      <IonCol>
                        <IonItem>
                          <IonCheckbox
                            checked={day.with_hypnotic}
                            onIonChange={(e) =>
                              setDay({
                                ...day,
                                with_hypnotic: e.detail.checked,
                              })
                            }
                          >
                            Prise d'hypnotiques
                          </IonCheckbox>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                    {day.with_hypnotic && (
                      <IonRow>
                        <IonCol>Image</IonCol>
                        <IonCol>
                          <IonItem>
                            <IonLabel>Heure de prise d'hypnotiques</IonLabel>
                            <IonDatetimeButton datetime="hypnotic"></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                              <IonDatetime
                                id="hypnotic"
                                presentation="time"
                                value={day.hypnotic}
                                onIonChange={(e) =>
                                  setDay({
                                    ...day,
                                    hypnotic: e.detail.value?.toString() ?? "",
                                  })
                                }
                              />
                            </IonModal>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    )}
                    {day.nightBreaks.map((nightBreak, index) => (
                      <IonRow key={index}>
                        <IonCol>
                          <IonItem>
                            <IonLabel>
                              {nightBreak.type === 0
                                ? "Heure du réveil nocture"
                                : "Heure de la sieste"}
                            </IonLabel>
                            <IonDatetimeButton
                              datetime={`nightBreak${index}`}
                            ></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                              <IonDatetime
                                id={`nightBreak${index}`}
                                presentation="time"
                                value={nightBreak.time}
                                onIonChange={(e) =>
                                  setDay({
                                    ...day,
                                    nightBreaks: day.nightBreaks.map((nb, i) =>
                                      i === index
                                        ? {
                                            ...nb,
                                            time:
                                              e.detail.value?.toString() ?? "",
                                          }
                                        : nb
                                    ),
                                  })
                                }
                              />
                            </IonModal>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonSelect
                              label={
                                nightBreak.type === 0
                                  ? "Durée du réveil"
                                  : "Durée de la sieste"
                              }
                              value={nightBreak.duration}
                              onIonChange={(e) =>
                                setDay({
                                  ...day,
                                  nightBreaks: day.nightBreaks.map((nb, i) =>
                                    i === index
                                      ? {
                                          ...nb,
                                          duration: e.detail.value,
                                        }
                                      : nb
                                  ),
                                })
                              }
                            >
                              {incrementValues.map((number) => (
                                <IonSelectOption value={number} key={number}>
                                  {number >= 60
                                    ? Math.floor(number / 60) + " heures "
                                    : ""}
                                  {number >= 60 && number % 60 ? "et " : ""}
                                  {number === 0 || number % 60
                                    ? (number % 60) + " minutes"
                                    : ""}
                                </IonSelectOption>
                              ))}
                            </IonSelect>
                          </IonItem>
                        </IonCol>

                        <IonCol onClick={() => deleteNightBreak(index)}>
                          X
                        </IonCol>
                      </IonRow>
                    ))}
                    <IonRow>
                      <IonCol onClick={() => addNightBreak(0)}>
                        + Ajouter un réveil dans la nuit
                      </IonCol>
                      <IonCol onClick={() => addNightBreak(1)}>
                        + Ajouter une sieste
                      </IonCol>
                    </IonRow>
                  </>
                )}
              </IonCardContent>
            </IonCard>
          )}
          {addictions.map(
            (addiction) =>
              preferences[addiction.id] && (
                <AddictionCard
                  key={addiction.id}
                  addiction={addiction}
                  day={day}
                  setDay={setDay}
                />
              )
          )}
          <IonCard>
            <IonCardHeader>Note</IonCardHeader>
            <IonCardContent>
              <IonTextarea
                value={day.note}
                onIonInput={(e) => {
                  console.log("change");
                  setDay({ ...day, note: e.detail.value ?? "" });
                }}
                placeholder="Ecrivez une note..."
              ></IonTextarea>
            </IonCardContent>
          </IonCard>
        </IonContent>
      )}
    </IonModal>
  );
}

const periods: {
  id: "morning" | "afternoon" | "evening" | "night";
  name: string;
}[] = [
  { id: "morning", name: "Matin" },
  { id: "afternoon", name: "Après-midi" },
  { id: "evening", name: "Soirée" },
  { id: "night", name: "Nuit" },
];

function AddictionCard({
  addiction,
  day,
  setDay,
}: {
  addiction: Addiction;
  day: Day;
  setDay: (day: Day) => void;
}) {
  const dayAddiction = day.dayAddictions.find(
    (da) => da.addiction === addiction.id
  );
  if (!dayAddiction) {
    console.error("Data not found, this should not happen");
    return null;
  }

  function update(dayAddiction: Day["dayAddictions"][number]) {
    setDay({
      ...day,
      dayAddictions: day.dayAddictions.map((da) =>
        da.addiction === addiction.id ? dayAddiction : da
      ),
    });
  }

  return (
    <IonCard key={addiction.id}>
      <IonCardHeader>{addiction.name}</IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            {periods.map((period) => (
              <IonCol key={period.id}>
                <IonItem>
                  <IonCheckbox
                    checked={dayAddiction[period.id]}
                    onIonChange={(e) =>
                      update({ ...dayAddiction, [period.id]: e.detail.checked })
                    }
                  >
                    {dayAddiction[period.id] ? "On" : "Off"}
                  </IonCheckbox>
                </IonItem>
                {period.name}
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            <IonCol>{addiction.question}</IonCol>
            <IonCol>
              {dayAddiction.value / 100} {addiction.unit}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonRange
          max={addiction.max * 100}
          step={addiction.step * 100}
          value={dayAddiction.value}
          onIonInput={(e) =>
            update({ ...dayAddiction, value: Number(e.detail.value) })
          }
        />
      </IonCardContent>
    </IonCard>
  );
}
