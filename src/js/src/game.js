const WIDTH = 960
const HEIGHT = 540
let gamespeed = 300

function initGame() {
  const game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, '', { 
    preload: preload, 
    create: create,
    update: update
  })
  let ground
  let player
  let cursors

  function preload () {
    game.load.image('logo', 'images/gy-logo.png')
    game.load.image('road', 'images/road-seamless.jpg')
    game.load.image('player', 'images/goodyear-tire-concept_128.png')
  }

  function create () {
    game.world.setBounds(0, 0, WIDTH, HEIGHT)
    game.physics.startSystem(Phaser.Physics.P2JS)
    // Adds ground texture & start scrolling
    ground = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'road')
    ground.autoScroll(-Math.abs(gamespeed), 0)
    // Enable cursor keys
    cursors = game.input.keyboard.createCursorKeys()
    // Add player
    player = game.add.sprite(100, game.height/2, 'player')
    game.physics.p2.enable(player)
  }

  function update() {
    gamespeed = document.getElementById("gamespeed").value
    ground.autoScroll(-Math.abs(gamespeed), 0)

    player.body.rotateRight(gamespeed / 4)
    player.body.setZeroVelocity()
    if (cursors.up.isDown) {
      player.body.moveUp(400);
    } else if (cursors.down.isDown) {
      player.body.moveDown(400);
    }
  }
}

export default initGame
