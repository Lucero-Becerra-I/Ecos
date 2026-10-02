// IMPORTACIONES

import {
  useState
} from "react";

import {
  createNewSave,
  deleteSave,
  resetSave,
  getMaxSaves,
  getSettings,
  updateSettings
} from "../../game/save/saveManager";

import "./Home.css";

// PANTALLA DE INICIO

function Home({
  saves,
  onStartGame,
  onRefreshSaves
}) {

  // PANTALLA ACTUAL

  const [
    screen,
    setScreen
  ] = useState("menu");

  // PARTIDA SELECCIONADA

  const [
    selectedSave,
    setSelectedSave
  ] = useState(null);

  // CONFIRMACION

  const [
    confirmation,
    setConfirmation
  ] = useState(null);

  // AJUSTES

  const [
    settings,
    setSettings
  ] = useState(
    () => getSettings()
  );

  // NUEVA PARTIDA

  const handleNewGame = () => {

    const newSave =
      createNewSave();

    if (!newSave) {

      return;

    }

    onRefreshSaves();

    onStartGame(
      newSave.id
    );

  };

  // CONTINUAR

  const handleContinue = () => {

    if (
      saves.length === 1
    ) {

      onStartGame(
        saves[0].id
      );

      return;

    }

    setScreen(
      "saves"
    );

  };

  // SELECCIONAR PARTIDA

  const selectSave = (
    save
  ) => {

    setSelectedSave(
      save
    );

    setScreen(
      "save"
    );

  };

  // REINICIAR

  const handleReset = () => {

    if (
      !selectedSave
    ) {

      return;

    }

    const resetSuccessful =
      resetSave(
        selectedSave.id
      );

    if (
      !resetSuccessful
    ) {

      return;

    }

    const resetSaveId =
      selectedSave.id;

    onRefreshSaves();

    setSelectedSave(null);

    setConfirmation(null);

    // ENTRAR DIRECTAMENTE
    // A LA PARTIDA REINICIADA

    onStartGame(
      resetSaveId
    );

  };

  // BORRAR

  const handleDelete = () => {

    if (
      !selectedSave
    ) {

      return;

    }

    deleteSave(
      selectedSave.id
    );

    onRefreshSaves();

    setSelectedSave(null);

    setConfirmation(null);

    setScreen(
      "menu"
    );

  };

  // CAMBIAR AJUSTE

  const changeSetting = (
    setting
  ) => {

    const updated = {

      ...settings,

      [setting]:
        !settings[setting]

    };

    setSettings(
      updated
    );

    updateSettings(
      updated
    );

  };

  // PANTALLA DE AJUSTES

  if (
    screen === "settings"
  ) {

    return (
      <main className="home">

        <div className="home-panel">

          <span className="home-panel-eyebrow">
            ECOS
          </span>

          <h2>
            AJUSTES
          </h2>

          <div className="home-menu">

            <button
              className="home-button"
              onClick={() =>
                changeSetting("music")
              }
            >
              MÚSICA —{" "}
              {settings.music
                ? "ON"
                : "OFF"}
            </button>

            <button
              className="home-button"
              onClick={() =>
                changeSetting("effects")
              }
            >
              EFECTOS —{" "}
              {settings.effects
                ? "ON"
                : "OFF"}
            </button>

            <button
              className="home-button"
              onClick={() =>
                changeSetting("fullscreen")
              }
            >
              PANTALLA COMPLETA —{" "}
              {settings.fullscreen
                ? "ON"
                : "OFF"}
            </button>

            <button
              className="home-button"
              onClick={() =>
                setScreen("menu")
              }
            >
              VOLVER
            </button>

          </div>

        </div>

      </main>
    );

  }

  // SELECCIONAR PARTIDA

  if (
    screen === "saves"
  ) {

    return (
      <main className="home">

        <div className="home-panel">

          <span className="home-panel-eyebrow">
            ECOS
          </span>

          <h2>
            PARTIDAS
          </h2>

          <div className="save-list">

            {saves.map(
              save => (

                <button
                  key={save.id}
                  className="save-slot"
                  onClick={() =>
                    selectSave(save)
                  }
                >

                  PARTIDA

                  <span>
                    {new Date(
                      save.updatedAt
                    ).toLocaleString()}
                  </span>

                </button>

              )
            )}

          </div>

          <button
            className="home-button"
            onClick={() =>
              setScreen("menu")
            }
          >
            VOLVER
          </button>

        </div>

      </main>
    );

  }

  // PARTIDA SELECCIONADA

  if (
    screen === "save" &&
    selectedSave
  ) {

    return (
      <main className="home">

        <div className="home-panel">

          <span className="home-panel-eyebrow">
            PARTIDA
          </span>

          <h2>
            PARTIDA
          </h2>

          <div className="home-menu">

            <button
              className="home-button"
              onClick={() =>
                onStartGame(
                  selectedSave.id
                )
              }
            >
              CONTINUAR
            </button>

            <button
              className="home-button"
              onClick={() =>
                setConfirmation(
                  "reset"
                )
              }
            >
              REINICIAR
            </button>

            <button
              className="home-button"
              onClick={() =>
                setConfirmation(
                  "delete"
                )
              }
            >
              BORRAR
            </button>

            <button
              className="home-button"
              onClick={() => {

                setSelectedSave(
                  null
                );

                setScreen(
                  "menu"
                );

              }}
            >
              VOLVER
            </button>

          </div>

        </div>

        {/* CONFIRMACION */}

        {confirmation && (

          <div className="home-confirm-overlay">

            <div className="home-confirm">

              <span>
                {confirmation === "reset"
                  ? "REINICIAR PARTIDA"
                  : "BORRAR PARTIDA"}
              </span>

              <h2>
                ¿ESTÁS SEGURO?
              </h2>

              <p>
                {confirmation === "reset"
                  ? "Se perderá todo el progreso de esta partida."
                  : "Esta partida será eliminada y no se podrá recuperar."}
              </p>

              <div className="home-confirm-options">

                <button
                  onClick={() =>
                    setConfirmation(null)
                  }
                >
                  CANCELAR
                </button>

                <button
                  onClick={
                    confirmation === "reset"
                      ? handleReset
                      : handleDelete
                  }
                >
                  {confirmation === "reset"
                    ? "REINICIAR"
                    : "BORRAR"}
                </button>

              </div>

            </div>

          </div>

        )}

      </main>
    );

  }

  // MENU PRINCIPAL

  return (
    <main className="home">

      <div className="home-content">

        <p className="home-eyebrow">
          UNA HISTORIA SOBRE LA MEMORIA
        </p>

        <h1>
          ECOS
        </h1>

        <p className="home-description">
          Algunas cosas desaparecen cuando dejamos de recordarlas.
        </p>

        <div className="home-menu">

          {/* CONTINUAR */}

          {saves.length > 0 && (

            <button
              className="home-button"
              onClick={
                handleContinue
              }
            >
              CONTINUAR
            </button>

          )}

          {/* NUEVA PARTIDA */}

          {saves.length <
            getMaxSaves() && (

            <button
              className="home-button"
              onClick={
                handleNewGame
              }
            >
              NUEVA PARTIDA
            </button>

          )}

          {/* AJUSTES */}

          <button
            className="home-button"
            onClick={() =>
              setScreen("settings")
            }
          >
            AJUSTES
          </button>

        </div>

      </div>

      <div className="home-version">
        Prototype 0.1
      </div>

    </main>
  );

}

export default Home;