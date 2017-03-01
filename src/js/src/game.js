const WIDTH = 960;
const HEIGHT = 540;

function initGame() {
  const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, '', { preload: preload, create: create });
  let ground;

  function preload () {
    game.load.image('logo', 'images/gy-logo.png');
    game.load.image('road', 'images/road-seamless.jpg');
  }

  function create () {
    const logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);
    game.physics.setBoundsToWorld();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Adds ground texture & start scrolling
    ground = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'road');
    ground.autoScroll(-200, 0);
  }
}

export default initGame;
