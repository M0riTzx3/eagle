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
  let obstacle
  let score = 0
  let scoreText

  function preload () {
    game.load.image('logo', 'images/gy-logo.png')
    game.load.image('road', 'images/road-seamless.jpg')
    game.load.image('player', 'images/goodyear-tire-concept_128.png')
    game.load.image('wingfoot', 'images/wingfoot_128.png')
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

    player.body.onBeginContact.add(collisionHandler, this)

    scoreText = game.add.text(WIDTH-64, 32, score, { font: "20px Arial", fill: "#ffffff", align: "left" })

    // Create timer to spawn obstacles
    game.time.events.repeat(Phaser.Timer.SECOND * 5, 10, createObstacle, this)
  }

  function collisionHandler(body, bodyB, shapeA, shapeB, equation) {
    let result = ""
    if (body) {
      result = 'You last hit: ' + body.sprite.key
      score += 100
      body.sprite.destroy()
    }
    else {
      result = 'You last hit: The wall :)'
    }
    console.log(result)
  }

  function createObstacle() {
    obstacle = game.add.sprite(WIDTH, game.world.randomY, 'wingfoot')

    game.physics.p2.enable(obstacle)

    obstacle.body.velocity.x = -Math.abs(gamespeed)
    obstacle.body.collideWorldBounds = true

  }

  function update() {
    gamespeed = document.getElementById("gamespeed").value
    ground.autoScroll(-Math.abs(gamespeed), 0)

    player.body.rotateRight(gamespeed / 4)
    player.body.setZeroVelocity()
    scoreText.text = score
    if (cursors.up.isDown) {
      player.body.moveUp(400)
    } else if (cursors.down.isDown) {
      player.body.moveDown(400)
    }
  }
}

export default initGame
