// CLAVE DEL GUARDADO

const SAVE_KEY = "ecos-data";

const ACTIVE_SAVE_KEY = "ecos-active-save";

// MAXIMO DE PARTIDAS

const MAX_SAVES = 3;

// CREAR PARTIDA

export const createSave = () => {

  return {
    id: Date.now(),

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    scene: "CityScene",

    playerX: null,

    playerY: null,

    memories: [],

    forgottenMemories: [],

    characters: {},

    flags: {}

  };

};

// DATOS POR DEFECTO

const createDefaultData = () => {

  return {
    settings: {
      music: true,
      effects: true,
      fullscreen: false
    },

    saves: []

  };

};

// CARGAR DATOS

export const loadData = () => {

  try {

    const data =
      localStorage.getItem(
        SAVE_KEY
      );

    if (!data) {

      return createDefaultData();

    }

    const parsed =
      JSON.parse(data);

    return {
      ...createDefaultData(),
      ...parsed,
      settings: {
        ...createDefaultData().settings,
        ...(parsed.settings || {})
      },
      saves:
        Array.isArray(parsed.saves)
          ? parsed.saves
          : []
    };

  } catch {

    return createDefaultData();

  }

};

// GUARDAR DATOS

export const saveData = (
  data
) => {

  try {

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(data)
    );

  } catch {

    console.error(
      "No se pudieron guardar los datos."
    );

  }

};

// OBTENER PARTIDAS

export const getSaves = () => {

  const data =
    loadData();

  return data.saves;

};

// OBTENER UNA PARTIDA

export const getSave = (
  saveId
) => {

  const data =
    loadData();

  return (
    data.saves.find(
      save =>
        save.id === saveId
    ) || null
  );

};

// CREAR NUEVA PARTIDA

export const createNewSave = () => {

  const data =
    loadData();

  if (
    data.saves.length >=
    MAX_SAVES
  ) {

    return null;

  }

  const newSave =
    createSave();

  data.saves.push(
    newSave
  );

  saveData(
    data
  );

  return newSave;

};

// ACTUALIZAR PARTIDA

export const updateSave = (
  saveId,
  changes
) => {

  const data =
    loadData();

  const index =
    data.saves.findIndex(
      save =>
        save.id === saveId
    );

  if (
    index === -1
  ) {

    return false;

  }

  data.saves[index] = {

    ...data.saves[index],

    ...changes,

    updatedAt:
      new Date().toISOString()

  };

  saveData(
    data
  );

  return true;

};

// REINICIAR PARTIDA

export const resetSave = (
  saveId
) => {

  const data =
    loadData();

  const index =
    data.saves.findIndex(
      save =>
        save.id === saveId
    );

  if (
    index === -1
  ) {

    return false;

  }

  const oldSave =
    data.saves[index];

  const newSave =
    createSave();

  newSave.id =
    oldSave.id;

  newSave.createdAt =
    oldSave.createdAt;

  data.saves[index] =
    newSave;

  saveData(
    data
  );

  return true;

};

// BORRAR PARTIDA

export const deleteSave = (
  saveId
) => {

  const data =
    loadData();

  data.saves =
    data.saves.filter(
      save =>
        save.id !== saveId
    );

  saveData(
    data
  );

  const activeSaveId =
    getActiveSaveId();

  if (
    activeSaveId === saveId
  ) {

    clearActiveSave();

  }

};

// OBTENER AJUSTES

export const getSettings = () => {

  const data =
    loadData();

  return data.settings;

};

// ACTUALIZAR AJUSTES

export const updateSettings = (
  settings
) => {

  const data =
    loadData();

  data.settings = {

    ...data.settings,

    ...settings

  };

  saveData(
    data
  );

};

// GUARDAR PARTIDA ACTIVA

export const setActiveSave = (
  saveId
) => {

  try {

    localStorage.setItem(
      ACTIVE_SAVE_KEY,
      String(saveId)
    );

  } catch {

    console.error(
      "No se pudo guardar la partida activa."
    );

  }

};

// OBTENER PARTIDA ACTIVA

export const getActiveSaveId = () => {

  try {

    const value =
      localStorage.getItem(
        ACTIVE_SAVE_KEY
      );

    if (!value) {
      return null;
    }

    return Number(value);

  } catch {

    return null;

  }

};

// LIMPIAR PARTIDA ACTIVA

export const clearActiveSave = () => {

  try {

    localStorage.removeItem(
      ACTIVE_SAVE_KEY
    );

  } catch {

    console.error(
      "No se pudo limpiar la partida activa."
    );

  }

};

// MAXIMO DE PARTIDAS

export const getMaxSaves = () => {

  return MAX_SAVES;

};