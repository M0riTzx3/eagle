import Wingfoots from "./wingfoot"
import Score from "./score"

const WIDTH = 1920
const HEIGHT = 1080
let gamespeed = 500

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
    let timer;
    const gameTimeLimit = 60;
    const increaseGameSpeed = 200;
    var timeoutEvent

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
        Score.init(game, WIDTH-128, 32)

        // Add Game End Timer
        timer = game.add.text(WIDTH/2-100, 32, "Remaining Time: ", { font: "20px Arial", fill: "#ffffff", align: "left" })

        Wingfoots.init(game, Phaser, wingfootCollisionGroup)
        // Create timer to spawn wingfoots
        // Until Game Ends

        game.time.events.loop(Phaser.Timer.SECOND * 2, createWingfoot, this);
        game.time.events.loop(Phaser.Timer.SECOND * 10, increaseSpeed, this)
        
        player.body.setCollisionGroup(playerCollisionGroup)
        player.body.collides(wingfootCollisionGroup, onWingfootCollision, this)
    }

    function gameEnd(){
        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.5);
        bar.drawRect(0, HEIGHT/3, WIDTH, 300);
        var text = game.add.text(WIDTH/2-100, HEIGHT/2 - 100, "GAME END", { font: "32px Arial", fill: "#ffffff", align: "left",alpha:1 })
        var thanksText = game.add.text(WIDTH/2-175, HEIGHT/2, "Thank you for playing !", { font: "32px Arial", fill: "#ffffff", align: "left",alpha:1 })

        game.paused = true;

        setTimeout(function(){
            window.location="/index.html?score="+Score.currentScore()
        },3000)

    }

    function increaseSpeed(){
        gamespeed += increaseGameSpeed;
    }

    function onWingfootCollision(player, wingfoot) {
        Wingfoots.onCollision(wingfoot, Score)
    }

    function createWingfoot() {
        Wingfoots.create(gamespeed, playerCollisionGroup)
    }

    function update() {
        var elapsedTime = parseInt(this.game.time.totalElapsedSeconds())
        updateTimer(elapsedTime)        
        ground.autoScroll(-Math.abs(gamespeed), 0)
        player.body.rotateRight(gamespeed / 4)
        player.body.setZeroVelocity()
        //Update Score
        Score.update()
        //Update Timer
        
        if (cursors.up.isDown) {
            player.body.moveUp(400)
        } else if (cursors.down.isDown) {
            player.body.moveDown(400)
        }
        
        if(elapsedTime > gameTimeLimit){
            gameEnd()
        }
    }


    function updateTimer(elapsedTime){
        if(gameTimeLimit-elapsedTime >= 0 ){
            timer.text = "Remaining Time: "+(gameTimeLimit-elapsedTime)
        }
    }

}

Smaf.on('action', function(keypress) {
    if(keypress.keyCode === 8 || keypress.type === 'BACK') {
        window.location.href = "/";
    }
});

export default initGame
