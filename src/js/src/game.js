import Wingfoots from "./wingfoot"
import Score from "./score"

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
    let playerCollisionGroup

    function preload () {
        game.load.image('road', 'images/road-seamless.jpg')
        game.load.image('player', 'images/goodyear-tire-concept_128.png')
        game.load.image('wingfoot', 'images/wingfoot_128.png')
    }

    function create () {
        game.world.setBounds(0, 0, WIDTH, HEIGHT)
        game.physics.startSystem(Phaser.Physics.P2JS)
        game.physics.p2.setImpactEvents(true)
        playerCollisionGroup = game.physics.p2.createCollisionGroup()
        const wingfootCollisionGroup = game.physics.p2.createCollisionGroup()
        game.physics.p2.updateBoundsCollisionGroup()
        // Adds ground texture & start scrolling
        ground = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'road')
        ground.autoScroll(-Math.abs(gamespeed), 0)
        // Enable cursor keys
        cursors = game.input.keyboard.createCursorKeys()
        // Add player
        player = game.add.sprite(100, game.height/2, 'player')
        game.physics.p2.enable(player)

        // Add score
        Score.init(game, WIDTH-64, 32)

        Wingfoots.init(game, Phaser, wingfootCollisionGroup)
        // Create timer to spawn wingfoots
        game.time.events.repeat(Phaser.Timer.SECOND * 2, 100, createWingfoot, this)
        player.body.setCollisionGroup(playerCollisionGroup)
        player.body.collides(wingfootCollisionGroup, onWingfootCollision, this)
    }

    function onWingfootCollision(player, wingfoot) {
        Wingfoots.onCollision(wingfoot, Score)
    }

    function createWingfoot() {
        Wingfoots.create(gamespeed, playerCollisionGroup)
    }

    function update() {
        gamespeed = document.getElementById("gamespeed").value
        ground.autoScroll(-Math.abs(gamespeed), 0)
        player.body.rotateRight(gamespeed / 4)
        player.body.setZeroVelocity()
        Score.update()
        if (cursors.up.isDown) {
            player.body.moveUp(400)
        } else if (cursors.down.isDown) {
            player.body.moveDown(400)
        }
    }
}

Smaf.on('action', function(keypress) {
    if(keypress.keyCode === 8 || keypress.type === 'BACK') {
        window.location.href = "/";
    }
});

export default initGame
