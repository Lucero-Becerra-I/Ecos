// IMPORTACIONES

import Phaser from "phaser";

// CONFIGURACION DEL MOTOR

const gameConfig = {

  type:
    Phaser.AUTO,

  // TAMAÑO

  width:
    "100%",

  height:
    "100%",

  // ESCALA

  scale: {

    mode:
      Phaser.Scale.RESIZE,

    autoCenter:
      Phaser.Scale.CENTER_BOTH

  },

  // FONDO

  backgroundColor:
    "#11161b",

  // FISICAS

  physics: {

    default:
      "arcade",

    arcade: {

      gravity: {
        y: 0
      },

      debug:
        false

    }

  },

  // RENDERIZADO

  render: {

    antialias:
      true,

    pixelArt:
      false

  }

};

export default gameConfig;