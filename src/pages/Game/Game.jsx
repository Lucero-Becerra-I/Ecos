// IMPORTACIONES

import {
  useEffect,
  useRef,
  useState
} from "react";

import GameCanvas from "../../components/Game/GameCanvas";
import Dialogue from "../../components/Dialogue/Dialogue";

import {
  getSave,
  updateSave,
  getSettings,
  updateSettings
} from "../../game/save/saveManager";

import "./Game.css";


// COMPONENTE PRINCIPAL

function Game({
  saveId,
  onReturnHome
}) {

  // ESTADO DEL JUEGO

  const [dialogue, setDialogue] =
    useState(null);

  const [canInteract, setCanInteract] =
    useState(false);

  const [paused, setPaused] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [settings, setSettings] =
    useState(() => getSettings());

  const [saveFeedback, setSaveFeedback] =
    useState("");

  const dialogueRef =
    useRef(null);

  const saveRef =
    useRef(null);


  // CARGAR PARTIDA

  useEffect(() => {

    const currentSave =
      getSave(saveId);

    saveRef.current =
      currentSave;

  }, [saveId]);


  // INICIAR DIALOGO

  const startDialogue = (
    dialogueData
  ) => {

    if (!dialogueData) {
      return;
    }

    if (
      !dialogueData.lines ||
      dialogueData.lines.length === 0
    ) {
      return;
    }

    const firstDialogue = {
      name:
        dialogueData.name,

      text:
        dialogueData.lines[0],

      lines:
        dialogueData.lines,

      index: 0,

      character:
        dialogueData.character || null,

      stage:
        dialogueData.stage || null
    };

    dialogueRef.current =
      firstDialogue;

    setDialogue(
      firstDialogue
    );

    setCanInteract(false);

  };


  // AVANZAR DIALOGO

  const advanceDialogue = () => {

    const current =
      dialogueRef.current;

    if (!current) {
      return;
    }

    const nextIndex =
      current.index + 1;

    if (
      nextIndex <
      current.lines.length
    ) {

      const nextDialogue = {

        ...current,

        index:
          nextIndex,

        text:
          current.lines[nextIndex]

      };

      dialogueRef.current =
        nextDialogue;

      setDialogue(
        nextDialogue
      );

      return;
    }

    const character =
      current.character;

    const stage =
      current.stage;

    if (
      character &&
      stage
    ) {

      const currentSave =
        saveRef.current ||
        getSave(saveId);

      if (currentSave) {

        const characterData =
          currentSave.characters?.[character] ||
          {};

        const completedStages =
          Array.isArray(
            characterData.completedStages
          )
            ? characterData.completedStages
            : [];

        if (
          !completedStages.includes(stage)
        ) {

          const updatedCharacter = {

            ...characterData,

            completedStages: [
              ...completedStages,
              stage
            ]

          };

          updateSave(
            saveId,
            {
              characters: {
                ...(currentSave.characters || {}),

                [character]:
                  updatedCharacter
              }
            }
          );

          saveRef.current =
            getSave(saveId);

        }

      }

    }

    dialogueRef.current =
      null;

    setDialogue(null);

    setCanInteract(false);

    window.dispatchEvent(
      new CustomEvent(
        "ecos-dialogue-end"
      )
    );

  };


  // TECLAS DEL DIALOGO

  useEffect(() => {

    const handleKeyDown = (
      event
    ) => {

      if (
        !dialogueRef.current
      ) {
        return;
      }

      if (
        event.code !== "Space" &&
        event.code !== "Enter"
      ) {
        return;
      }

      event.preventDefault();

      advanceDialogue();

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [saveId]);


  // CAMBIAR INTERACCION

  const handleInteraction = (
    value
  ) => {

    setCanInteract(value);

  };


  // GUARDAR PARTIDA

  const handleSave = () => {

    const currentSave =
      getSave(saveId);

    if (!currentSave) {
      return;
    }

    updateSave(
      saveId,
      {
        playerX:
          currentSave.playerX,

        playerY:
          currentSave.playerY,

        scene:
          currentSave.scene,

        memories:
          currentSave.memories,

        forgottenMemories:
          currentSave.forgottenMemories,

        characters:
          currentSave.characters,

        flags:
          currentSave.flags
      }
    );

    setSaveFeedback(
      "PARTIDA GUARDADA"
    );

    setTimeout(() => {

      setSaveFeedback("");

    }, 1800);

  };


  // PAUSA

  const togglePause = () => {

    if (settingsOpen) {

      setSettingsOpen(false);

      return;

    }

    setPaused(
      value => !value
    );

  };


  // ABRIR AJUSTES

  const openSettings = () => {

    setSettings(
      getSettings()
    );

    setSettingsOpen(true);

  };


  // CERRAR AJUSTES

  const closeSettings = () => {

    setSettingsOpen(false);

  };


  // CAMBIAR AJUSTE

  const handleSettingChange = (
    key
  ) => {

    const newValue =
      !settings[key];

    const newSettings = {

      ...settings,

      [key]:
        newValue

    };

    setSettings(
      newSettings
    );

    updateSettings(
      newSettings
    );

  };


  // PANTALLA COMPLETA

  const handleFullscreen = async () => {

    try {

      if (
        !document.fullscreenElement
      ) {

        await document.documentElement.requestFullscreen();

        const newSettings = {

          ...settings,

          fullscreen:
            true

        };

        setSettings(
          newSettings
        );

        updateSettings(
          newSettings
        );

      } else {

        await document.exitFullscreen();

        const newSettings = {

          ...settings,

          fullscreen:
            false

        };

        setSettings(
          newSettings
        );

        updateSettings(
          newSettings
        );

      }

    } catch {

      const newSettings = {

        ...settings,

        fullscreen:
          !settings.fullscreen

      };

      setSettings(
        newSettings
      );

      updateSettings(
        newSettings
      );

    }

  };


  // SINCRONIZAR PANTALLA COMPLETA

  useEffect(() => {

    const handleFullscreenChange = () => {

      const fullscreen =
        Boolean(
          document.fullscreenElement
        );

      setSettings(
        current => ({
          ...current,
          fullscreen
        })
      );

      updateSettings({
        fullscreen
      });

    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );

    };

  }, []);


  // TECLAS GENERALES

  useEffect(() => {

    const handleKeyDown = (
      event
    ) => {

      if (
        event.code !== "Escape"
      ) {
        return;
      }

      if (
        dialogueRef.current
      ) {
        return;
      }

      if (settingsOpen) {

        closeSettings();

        return;

      }

      togglePause();

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [settingsOpen]);


  return (
    <div className="game-page">

      <GameCanvas
        saveId={saveId}
        onDialogue={startDialogue}
        onInteraction={handleInteraction}
      />

      <Dialogue
        dialogue={dialogue}
      />


      {/* INDICADORES DEL JUEGO */}

      {!dialogue && !paused && (

        <>

          {canInteract && (

            <div className="context-hint">

              <div className="context-key">
                E
              </div>

              <span className="context-text">
                HABLAR
              </span>

            </div>

          )}

          <div className="game-hints">

            <div className="game-hint">

              <span className="game-hint-key">
                WASD
              </span>

              <span>
                MOVER
              </span>

            </div>

          </div>

          <div className="game-hint game-hint-pause">

            <span className="game-hint-key">
              ESC
            </span>

            <span>
              PAUSA
            </span>

          </div>

        </>

      )}


      {/* MENU DE PAUSA */}

      {paused && !settingsOpen && (

        <div className="pause-overlay">

          <div className="pause-menu">

            <span className="pause-eyebrow">
              ECOS
            </span>

            <h1>
              PAUSA
            </h1>

            <div className="pause-options">

              <button
                onClick={
                  togglePause
                }
              >
                CONTINUAR
              </button>

              <button
                onClick={
                  handleSave
                }
              >
                GUARDAR PARTIDA
              </button>

              <button
                onClick={
                  openSettings
                }
              >
                AJUSTES
              </button>

              <button
                onClick={
                  onReturnHome
                }
              >
                VOLVER AL MENÚ
              </button>

            </div>

            <span className="pause-footer">
              ESC PARA VOLVER
            </span>

          </div>

        </div>

      )}


      {/* AJUSTES */}

      {paused && settingsOpen && (

        <div className="pause-overlay">

          <div className="pause-menu settings-menu">

            <span className="pause-eyebrow">
              ECOS
            </span>

            <h1>
              AJUSTES
            </h1>

            <div className="settings-options">

              <button
                className="setting-option"
                onClick={() =>
                  handleSettingChange("music")
                }
              >

                <span>
                  MÚSICA
                </span>

                <strong>
                  {settings.music
                    ? "ON"
                    : "OFF"}
                </strong>

              </button>

              <button
                className="setting-option"
                onClick={() =>
                  handleSettingChange("effects")
                }
              >

                <span>
                  EFECTOS
                </span>

                <strong>
                  {settings.effects
                    ? "ON"
                    : "OFF"}
                </strong>

              </button>

              <button
                className="setting-option"
                onClick={
                  handleFullscreen
                }
              >

                <span>
                  PANTALLA COMPLETA
                </span>

                <strong>
                  {settings.fullscreen
                    ? "ON"
                    : "OFF"}
                </strong>

              </button>

            </div>

            <button
              className="settings-back"
              onClick={
                closeSettings
              }
            >
              VOLVER
            </button>

          </div>

        </div>

      )}


      {/* MENSAJE DE GUARDADO */}

      {saveFeedback && (

        <div className="save-feedback">
          {saveFeedback}
        </div>

      )}

    </div>
  );

}

export default Game;