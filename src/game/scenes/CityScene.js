// IMPORTACIONES

import Phaser from "phaser";

import {
  getSave,
  updateSave
} from "../save/saveManager";

import mailman from "../data/npcs/mailman";


// ESCENA DE LA CIUDAD

class CityScene extends Phaser.Scene {

  constructor() {

    super({
      key: "CityScene"
    });

  }


  // INICIALIZAR ESCENA

  init(data) {

    this.saveId =
      data?.saveId ||
      this.registry.get("saveId") ||
      null;

    this.dialogueOpen =
      false;

    this.nearMailman =
      false;

  }


  // CREAR ESCENA

  create() {

    // OBTENER PARTIDA ACTIVA

    if (
      !this.saveId
    ) {

      this.saveId =
        this.registry.get("saveId") ||
        null;

    }


    // FONDO

    this.background =
      this.add.rectangle(
        1500,
        1000,
        3000,
        2000,
        0x182027
      );

    this.background.setOrigin(
      0.5
    );


    // TITULO

    this.add.text(
      1500,
      80,
      "CIUDAD",
      {
        fontFamily:
          "Arial",

        fontSize:
          "32px",

        color:
          "#e8e4dc",

        letterSpacing:
          8
      }
    ).setOrigin(
      0.5
    );


    // CARGAR PARTIDA

    const save =
      this.loadSave();


    // POSICION DEL JUGADOR

    const playerX =
      save?.playerX ??
      600;

    const playerY =
      save?.playerY ??
      400;


    // JUGADOR

    this.player =
      this.add.rectangle(
        playerX,
        playerY,
        32,
        48,
        0xe8e4dc
      );


    // FISICAS

    this.physics.add.existing(
      this.player
    );


    this.player.body.setCollideWorldBounds(
      true
    );


    // VELOCIDAD

    this.playerSpeed =
      180;


    // CARTERO

    this.mailman =
      this.add.rectangle(
        mailman.position.x,
        mailman.position.y,
        40,
        60,
        0xb8a58a
      );


    // NOMBRE DEL CARTERO

    this.mailmanLabel =
      this.add.text(
        mailman.position.x,
        mailman.position.y - 50,
        mailman.name,
        {
          fontFamily:
            "Arial",

          fontSize:
            "12px",

          color:
            "#e8e4dc",

          letterSpacing:
            2
        }
      ).setOrigin(
        0.5
      );


    // CAMARA

    this.cameras.main.startFollow(
      this.player,
      true,
      0.08,
      0.08
    );


    this.cameras.main.setBounds(
      0,
      0,
      3000,
      2000
    );


    // LIMITES DEL MUNDO

    this.physics.world.setBounds(
      0,
      0,
      3000,
      2000
    );


    // CONTROLES

    this.keys =
      this.input.keyboard.addKeys(
        "W,A,S,D,E"
      );


    // ESCUCHAR FIN DEL DIALOGO

    this.dialogueEndHandler =
      () => {

        this.closeDialogue();

      };


    this.game.events.on(
      "ecos-dialogue-end",
      this.dialogueEndHandler
    );


    // AUTOSAVE

    this.autosaveTimer =
      this.time.addEvent({

        delay:
          1000,

        loop:
          true,

        callback:
          () => {

            this.autosave();

          }

      });


    // GUARDAR AL RECARGAR

    this.beforeUnloadHandler =
      () => {

        this.autosave();

      };


    window.addEventListener(
      "beforeunload",
      this.beforeUnloadHandler
    );

  }


  // ACTUALIZAR ESCENA

  update() {

    if (
      !this.player ||
      !this.player.body
    ) {

      return;

    }


    // DETENER MOVIMIENTO DURANTE DIALOGO

    if (
      this.dialogueOpen
    ) {

      this.player.body.setVelocity(
        0
      );

      return;

    }


    // MOVIMIENTO

    let velocityX =
      0;

    let velocityY =
      0;


    if (
      this.keys.A.isDown
    ) {

      velocityX =
        -this.playerSpeed;

    }

    else if (
      this.keys.D.isDown
    ) {

      velocityX =
        this.playerSpeed;

    }


    if (
      this.keys.W.isDown
    ) {

      velocityY =
        -this.playerSpeed;

    }

    else if (
      this.keys.S.isDown
    ) {

      velocityY =
        this.playerSpeed;

    }


    // VELOCIDAD DIAGONAL

    if (
      velocityX !== 0 &&
      velocityY !== 0
    ) {

      const diagonal =
        this.playerSpeed /
        Math.sqrt(2);

      velocityX =
        velocityX > 0
          ? diagonal
          : -diagonal;

      velocityY =
        velocityY > 0
          ? diagonal
          : -diagonal;

    }


    this.player.body.setVelocity(
      velocityX,
      velocityY
    );


    // LABEL DEL CARTERO

    if (
      this.mailmanLabel
    ) {

      this.mailmanLabel.setPosition(
        mailman.position.x,
        mailman.position.y - 50
      );

    }


    // DISTANCIA AL CARTERO

    const distance =
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        mailman.position.x,
        mailman.position.y
      );


    const isNearMailman =
      distance < 100;


    // ENTRAR EN RANGO

    if (
      isNearMailman &&
      !this.nearMailman
    ) {

      this.nearMailman =
        true;


      this.game.events.emit(
        "ecos-interaction",
        true
      );

    }


    // SALIR DEL RANGO

    else if (
      !isNearMailman &&
      this.nearMailman
    ) {

      this.nearMailman =
        false;


      this.game.events.emit(
        "ecos-interaction",
        false
      );

    }


    // HABLAR

    if (
      isNearMailman &&
      Phaser.Input.Keyboard.JustDown(
        this.keys.E
      )
    ) {

      this.openMailmanDialogue();

    }

  }


  // CARGAR PARTIDA

  loadSave() {

    if (
      !this.saveId
    ) {

      return null;

    }


    return getSave(
      this.saveId
    );

  }


  // DATOS DEL CARTERO

  getMailmanData() {

    const save =
      this.loadSave();


    if (
      !save
    ) {

      return {
        completedStages: []
      };

    }


    const characterData =
      save.characters?.[
        mailman.id
      ] || {};


    const completedStages =
      Array.isArray(
        characterData.completedStages
      )
        ? characterData.completedStages
        : [];


    return {

      ...characterData,

      completedStages

    };

  }


  // OBTENER DIALOGO DEL CARTERO

  getMailmanDialogue() {

    const data =
      this.getMailmanData();


    // PRIMER DIALOGO

    if (
      !data.completedStages.includes(
        "first"
      )
    ) {

      return {

        name:
          mailman.name,

        character:
          mailman.id,

        stage:
          "first",

        lines:
          mailman.dialogues.first

      };

    }


    // SEGUNDO DIALOGO

    if (
      !data.completedStages.includes(
        "second"
      )
    ) {

      return {

        name:
          mailman.name,

        character:
          mailman.id,

        stage:
          "second",

        lines:
          mailman.dialogues.second

      };

    }


    // TERCER DIALOGO

    if (
      !data.completedStages.includes(
        "third"
      )
    ) {

      return {

        name:
          mailman.name,

        character:
          mailman.id,

        stage:
          "third",

        lines:
          mailman.dialogues.third

      };

    }


    // DIALOGO POSTERIOR

    return {

      name:
        mailman.name,

      character:
        mailman.id,

      stage:
        "postStory",

      lines:
        mailman.dialogues.postStory

    };

  }


  // ABRIR DIALOGO

  openMailmanDialogue() {

    if (
      this.dialogueOpen
    ) {

      return;

    }


    const dialogue =
      this.getMailmanDialogue();


    if (
      !dialogue ||
      !dialogue.lines ||
      dialogue.lines.length === 0
    ) {

      return;

    }


    this.dialogueOpen =
      true;


    this.player.body.setVelocity(
      0
    );


    this.game.events.emit(
      "ecos-dialogue",
      dialogue
    );

  }


  // CERRAR DIALOGO

  closeDialogue() {

    this.dialogueOpen =
      false;


    this.game.events.emit(
      "ecos-interaction",
      false
    );


    this.nearMailman =
      false;

  }


  // AUTOGUARDADO

  autosave() {

    if (
      !this.saveId ||
      !this.player
    ) {

      return;

    }


    updateSave(
      this.saveId,
      {

        playerX:
          this.player.x,

        playerY:
          this.player.y

      }
    );

  }


  // DESTRUIR ESCENA

  shutdown() {

    this.autosave();


    if (
      this.autosaveTimer
    ) {

      this.autosaveTimer.remove();

      this.autosaveTimer =
        null;

    }


    if (
      this.dialogueEndHandler
    ) {

      this.game.events.off(
        "ecos-dialogue-end",
        this.dialogueEndHandler
      );

      this.dialogueEndHandler =
        null;

    }


    if (
      this.beforeUnloadHandler
    ) {

      window.removeEventListener(
        "beforeunload",
        this.beforeUnloadHandler
      );

      this.beforeUnloadHandler =
        null;

    }

  }

}


export default CityScene;