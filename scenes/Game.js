// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    this.gameOver = false;
    this.timer = 30;
    this.score = 0;
    this.shapes = {
      triangulo: { puntos: 10, contar: 0},
      cuadrado: { puntos: 20, contar: 0},
      rombo: { puntos: 30, contar: 0 },
      bomba: {puntos: -10, contar: 0},
    }
  }

  preload() {
    //cargar assets

    //import Cielo
    this.load.image("cielo", "./Cielo.webp");

    //Import Plataforma
    this.load.image("plataforma", "./plataforma.png");

    //Importar Personaje
    this.load.image("personaje", "./Ninja.png");

    //recolectables
    this.load.image("rombo", "./diamond.png");
    this.load.image("cuadrado", "./square.png");
    this.load.image("triangulo", "./triangle.png");
    this.load.image("bomba", "./bomba.png");
  }

  create() {
    //crear elementos
    this.cielo = this.add.image(400, 300, "cielo");
    this.cielo.setScale(2);

    //Crear Grupo Plataforma
    this.plataformas = this.physics.add.staticGroup();
    //al grupo de plataformas agregar plataformas
    this.plataformas.create(400, 568, "plataforma").setScale(2).refreshBody();
    //agregamos otra plataforma
    this.plataformas.create(252, 350, "plataforma");

    //Colocar Personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.1);
    this.personaje.setCollideWorldBounds(true);

    //Agregar Colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);
    //una tecla a la vez
    //this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    //this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    //this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    //this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    // Crear Grupo Recolectables
    this.recolectables = this.physics.add.group();
    
    //evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    //tecla r
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    //Evento de 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.handlerTaimer,
      callbackScope: this,
      loop: true,
    });

    //agregar texto de tiempo
    this.timerText = this.add.text(10, 10, `tiempo restante: ${this.timer}`, {
      fontSize: "32px",
      fill: "#fff",
    });

    this.scoreText = this.add.text(
      10,
      50,
      `Puntaje: ${this.score}
      T: ${this.shapes["triangulo"].contar}
      C: ${this.shapes["cuadrado"].contar}
      R: ${this.shapes["rombo"].contar}`
    );

    //Agregar colision entre personaje y recolectables
    this.physics.add.collider(
      this.personaje,
      this.recolectables,
      this.onShapeCollect,
      null,
      this
    );

    //Agregar colision entre recolectables y plataformas
    this.physics.add.collider(
      this.recolectables,
      this.plataformas,
      this.onRecolectableBounced,
      null,
      this
    );
  }

  update() {
    if (this.gameOver && this.r.isDown) {
      this.Scene.restart();
    }
    if (this.gameOver) {
      this.physics.pause();
      this.timerText.setText("Game Over");
      return;
    }
    //movimientos de personajes
    if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-160);
    } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(160);
    } else {
      this.personaje.setVelocityX(0);
    }
    if (this.cursor.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-330)
    }
  }

  onSecond() {
    if (this.gameOver) {
      return;
    }
    //crear recolectable
    const tipos = ["triangulo", "cuadrado", "rombo", "bomba"];

    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
    recolectable.setVelocity(0, 100);

    //asignar rebote: busca un numero entre 0.4 y 0.8
    const rebote = Phaser.Math.FloatBetween(0.4, 0.8);
    recolectable.setBounce(rebote);

    //set data
    recolectable.setData("puntos", this.shapes[tipo].puntos);
    recolectable.setData("tipo", tipo)
  }

  onShapeCollect (personaje, recolectable) {
    const nombreFig = recolectable.getData("tipo");
    const puntos = recolectable.getData("puntos");

    this.score += puntos;

    this.shapes[nombreFig].contar += 1;

    console.table(this.shapes);
    console.log("recolectado ", recolectable.texture.key, puntos);
    console.log("score ", this.score);
    recolectable.destroy();

    this.scoreText.setText(
      `Puntaje: ${this.score}
      T: ${this.shapes["triangulo"].contar}
      C: ${this.shapes["cuadrado"].contar}
      R: ${this.shapes["rombo"].contar}`
    );

    this.checkWin();
  }

  checkWin() {
    const cumplePuntos = this.score >= 100;
    const cumpleFiguras =
      this.shapes["triangulo"].contar >= 2 &&
      this.shapes["cuadrado"].contar >= 2 &&
      this.shapes["rombo"].contar >= 2;

    if (cumplePuntos && cumpleFiguras) {
      console.log("Ganaste");
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  handlerTaimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer <= 0) {
      this.gameOver = true;
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  onRecolectableBounced(recolectable, plataforma) {
    console.log("recolectable rebote");
    let puntos = recolectable.getData("puntos");
    puntos -= 5;
    recolectable.setData("puntos", puntos);
    if (puntos <= 0) {
      recolectable.destroy();
    }
  }
}