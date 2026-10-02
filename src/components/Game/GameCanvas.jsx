// IMPORTACIONES

import {
  useEffect,
  useRef
} from "react";

import Phaser from "phaser";

import gameConfig from "../../game/config/gameConfig";
import CityScene from "../../game/scenes/CityScene";

import "./GameCanvas.css";


// COMPONENTE PRINCIPAL

function GameCanvas({
  saveId,
  onDialogue,
  onInteraction
}) {

  const gameContainerRef =
    useRef(null);

  const gameRef =
    useRef(null);

  const onDialogueRef =
    useRef(onDialogue);

  const onInteractionRef =
    useRef(onInteraction);


  // ACTUALIZAR CALLBACK DE DIALOGO

  useEffect(() => {

    onDialogueRef.current =
      onDialogue;

  }, [onDialogue]);


  // ACTUALIZAR CALLBACK DE INTERACCION

  useEffect(() => {

    onInteractionRef.current =
      onInteraction;

  }, [onInteraction]);


  // CREAR PHASER

  useEffect(() => {

    if (
      !gameContainerRef.current
    ) {

      return;

    }


    if (
      gameRef.current
    ) {

      return;

    }


    // CONFIGURACION

    const config = {

      ...gameConfig,

      parent:
        gameContainerRef.current,

      scene: [
        CityScene
      ]

    };


    // CREAR JUEGO

    const game =
      new Phaser.Game(
        config
      );


    gameRef.current =
      game;


    // PARTIDA ACTIVA

    game.registry.set(
      "saveId",
      saveId
    );


    // EVENTO DE DIALOGO

    const handleDialogue =
      (
        dialogueData
      ) => {

        if (
          onDialogueRef.current
        ) {

          onDialogueRef.current(
            dialogueData
          );

        }

      };


    // EVENTO DE INTERACCION

    const handleInteraction =
      (
        value
      ) => {

        if (
          onInteractionRef.current
        ) {

          onInteractionRef.current(
            value
          );

        }

      };


    // ESCUCHAR EVENTOS DE PHASER

    game.events.on(
      "ecos-dialogue",
      handleDialogue
    );

    game.events.on(
      "ecos-interaction",
      handleInteraction
    );


    // LIMPIAR PHASER

    return () => {

      game.events.off(
        "ecos-dialogue",
        handleDialogue
      );

      game.events.off(
        "ecos-interaction",
        handleInteraction
      );


      game.destroy(
        true
      );


      gameRef.current =
        null;

    };

  }, [saveId]);


  // INFORMAR A PHASER QUE EL DIALOGO TERMINO

  useEffect(() => {

    const handleDialogueEnd = () => {

      if (
        !gameRef.current
      ) {

        return;

      }


      gameRef.current.events.emit(
        "ecos-dialogue-end"
      );

    };


    window.addEventListener(
      "ecos-dialogue-end",
      handleDialogueEnd
    );


    return () => {

      window.removeEventListener(
        "ecos-dialogue-end",
        handleDialogueEnd
      );

    };

  }, []);


  // CONTENEDOR

  return (

    <div
      ref={gameContainerRef}
      className="game-canvas"
    />

  );

}


export default GameCanvas;