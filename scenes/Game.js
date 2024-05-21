// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("mainh");
  }

  init() {
    this.gameOver = false;
    this.timer = 30;
    this.score = 0;
    this.shapes = {
      triangulo: { points: 10, count: 0},
      cuadrado: { points: 20, count: 0},
      rombo: { points: 30, count: 0 },
    }
  }

  preload() {
    //cargar assets

    //import Cielo
    this.load.image("cielo", "../public/assets/Cielo.webp")

    //Import Plataforma
    this.load.image("plataforma", "../public/assets/plataforma.png")

    //Importar Personaje
    this.load.image("personaje", "../public/assets/Ninja.png")

    //recolectables
    this.load.image("rombo", "../public/assets/diamond.png")
    this.load.image("cuadrado", "../public/assets/square.png")
    this.load.image("triangulo", "../public/assets/triangle.png")
  }

  create() {
    //crear elementos
    this.cielo = this.add.image(400, 300, "cielo")
    this.cielo.setScale(2);

    //Crear Grupo Plataforma
    this.plataformas = this.physics.add.staticGroup();
    //al grupo de plataformas agregar plataformas
    this.plataformas.create(400, 568, "plataforma").setScale(2).refreshBody();
    //agregamos otra plataforma
    this.plataformas.create(252, 350, "plataforma")

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
    this.physics.add.collider(this.personaje, this,this.recolectables);
    this.physics.add.collider(this.personaje, this,this.recolectables);

    //evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    //Evento de 1 segundo
    this.timer.addEvent({
      delay: 1000,
      callback: this.handlerTaimer,
      callbackScope: this,
      loop: true,
    });

    //agregar texto de tiempo
    this.timerText = this.add.text (10, 10, `tiempo restante: ${this.timer}`, {
      fontSize: "32px",
      fill: "#fff",
    })

    this.scoreText = this.add.text(
      10,
      50,
      `Puntaje: ${this.score}
      T: ${this.shapes}`
    )
  }

  onSecond() {
    //crear recolectable
    const tipos = ["triangulo", "cuadrado", "rombo"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(20, 750),
      0,
      tipo
    );
    recolectable.setVelocity(0, 100);
  }

  update() {
    if (this.gameOver && this.recolectables.isDown) {
      this.scene.resart();
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
    } 
    else {
      this.personaje.setVelocityX(0);
    }
    if (this.cursor.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-330)
    }
  }

  onShapeCollect (personaje, recolectable) {
    recolectable.log("recolectado", recolectable.texture.key);
    recolectable.destroy();
    
  }

  handlerTaimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.time === 0) {
      this.gameOver = true
    }
  }
}