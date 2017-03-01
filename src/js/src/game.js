const WIDTH = 960
const HEIGHT = 540

function initGame() {
  const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, '', { 
    preload: preload, 
    create: create,
    update: update
  })
  let ground
  let player
  let keyboard

  function preload () {
    game.load.image('logo', 'images/gy-logo.png')
    game.load.image('road', 'images/road-seamless.jpg')
    game.load.image('player', 'images/eagle360Player.png')
  }

  function create () {
    const logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo')
    logo.anchor.setTo(0.5, 0.5)
    game.physics.startSystem(Phaser.Physics.P2)

    // Adds ground texture & start scrolling
    ground = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'road')
    ground.autoScroll(-200, 0)
    // Enable cursor keys
    keyboard = game.input.keyboard.createCursorKeys();
    // Add player
    player = game.add.sprite(100, game.height/2, 'player');
    player.anchor.set(0.5);
    // Add player constraints
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.immovable = true;
    player.checkWorldBounds = true;
    player.body.collideWorldBounds = true;
  }

  function update() {
    if (keyboard.up.isDown) {
      var rightTween = game.add.tween(player).to({y: '-64'}, 150, Phaser.Easing.Linear.None, true);
    } else if (keyboard.down.isDown) {
      var leftTween = game.add.tween(player).to({y: '+64'}, 150, Phaser.Easing.Linear.None, true);
    } 
  }
}

export default initGame
