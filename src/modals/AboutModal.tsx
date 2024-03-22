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

export function AboutModal() {
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal ref={modal} trigger="open-about-modal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => modal.current?.dismiss()}>
              Retour
            </IonButton>
          </IonButtons>
          <IonTitle>À propos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>À propos</h1>

        <p>
          Cette application a été conçue et développée par Benjamin Pitrat
          (Psychiatre, addictologue, Paris) et Arnaud Drain (Développeur,
          Epitech).
        </p>
        <p>
          Conçue comme un carnet de suivi du sommeil et des comportements
          (consommation de tabac, alcool ou autres drogues mais aussi jeux,
          écrans ou comportements alimentaires) elle propose aux utilisateurs de
          mieux se connaître et de faciliter leur suivi avec les professionnels
          de la médecine du sommeil et de l’addictologie.
        </p>
        <p>
          Cette application ne fait en aucun cas l’apologie des consommations de
          produits stupéfiants et illicites. Elle a pour but de faciliter la
          prise en charge des addictions.
        </p>
        <p>
          Elle est actuellement en phase de test et nous sommes à l’écoute de
          vos remarques éventuelles sur retourappasc@gmail.com
        </p>

        <h2>Comment fonctionne l’application ?</h2>

        <p>
          Dans le menu vous pouvez choisir les domaines que vous voulez
          renseigner.
        </p>
        <p>
          Sur l’écran principal, en cliquent sur les vignettes correspondant aux
          jours d’utilisation, vous pouvez alors remplir vos informations.
        </p>
        <p>
          Cette saisie peut être reprise et corrigée autant de fois que vous le
          souhaitez.
        </p>
        <p>
          La fonction agenda de sommeil permet de générer un agenda de sommeil.
        </p>
        <p>
          Utilisé en médecine du sommeil, l’agenda permet de visualiser en un
          coup d’œil la structure de votre sommeil (vert foncé = sommeil, vert
          clair = temps passé au lit sans dormir).
        </p>
        <p>
          Nous recommandons d’utiliser l’application une fois par jour en début
          de journée pour renseigner le sommeil et les évènements de la veille
          ou en fin de journée si vous ne renseigner que vos comportements. Pour
          vous aider vous pouvez programmer une notification qui vous rappellera
          de saisir les informations relatives à la journée et à la nuit
          précédente.
        </p>
        <p>
          Les données de l’application sont localisées sur votre smartphone
          uniquement, elles ne sont disponibles à personne d’autre a moins que
          vous ne montriez l’écran à votre professionnel de soins.
        </p>

        <h2>Remerciements</h2>

        <ul>
          <li>Réseau Morphée (agenda de sommeil)</li>
          <li>Adrien Pitrat (ergonomie et design)</li>
        </ul>
      </IonContent>
    </IonModal>
  );
}
