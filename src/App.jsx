// IMPORTACIONES

import {
  useState
} from "react";

import Home from "./pages/Home/Home";
import Game from "./pages/Game/Game";

import {
  getSaves,
  getActiveSaveId,
  setActiveSave,
  clearActiveSave
} from "./game/save/saveManager";

import "./index.css";

// COMPONENTE PRINCIPAL

function App() {

  const [
    saves,
    setSaves
  ] = useState(() => {

    return getSaves();

  });

  const [
    currentSaveId,
    setCurrentSaveId
  ] = useState(() => {

    const activeSaveId =
      getActiveSaveId();

    const saveExists =
      getSaves().some(
        save =>
          save.id === activeSaveId
      );

    if (!saveExists) {

      clearActiveSave();

      return null;

    }

    return activeSaveId;

  });

  // ACTUALIZAR PARTIDAS

  const refreshSaves = () => {

    setSaves(
      getSaves()
    );

  };

  // ABRIR PARTIDA

  const startGame = (
    saveId
  ) => {

    setActiveSave(
      saveId
    );

    setCurrentSaveId(
      saveId
    );

  };

  // VOLVER AL MENU

  const returnHome = () => {

    clearActiveSave();

    setCurrentSaveId(
      null
    );

    refreshSaves();

  };

  // MENU PRINCIPAL

  if (
    currentSaveId === null
  ) {

    return (
      <Home
        saves={saves}
        onStartGame={startGame}
        onRefreshSaves={
          refreshSaves
        }
      />
    );

  }

  // JUEGO

  return (
    <Game
      saveId={
        currentSaveId
      }
      onReturnHome={
        returnHome
      }
    />
  );

}

export default App;