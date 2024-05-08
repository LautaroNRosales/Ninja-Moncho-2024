// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("mainh");
  }

  init() {}

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
    this.physics.add.collider(this.personaje, this.recolectables);

    //evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    })
  }

  onSecond() {
    //crear recolectable
    const tipos = ["triangulo", "cuadrado", "rombo"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
  }

  update() {
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
}