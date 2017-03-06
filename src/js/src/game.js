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
    let wingfootSpawnEvent
    let wingfootDestroyer
    let wingfootDestroyerCollisionGroup
    let cursors
    let playerCollisionGroup
    let timerText;
    let timer;
    const gameTimeLimit = 60000;
    const increaseGameSpeed = 300;
    const WINGFOOT_DESTROYER_WIDTH=20;
    var timeoutEvent

    function preload () {
        game.load.image('road', 'images/street_new.png')
        game.load.image('player', 'images/goodyear-tire-concept_128.png')
        game.load.image('wingfoot', 'images/wingfoot_128.png')
    }

    function create () {
        game.world.setBounds(0, 0, WIDTH, HEIGHT)
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
 
        //have the game centered horizontally

        game.scale.pageAlignHorizontally = true;

        game.scale.pageAlignVertically = true;

        //screen size will be set automatically

        game.physics.startSystem(Phaser.Physics.P2JS)
        game.physics.p2.setImpactEvents(true)
        playerCollisionGroup = game.physics.p2.createCollisionGroup()
        const wingfootCollisionGroup = game.physics.p2.createCollisionGroup()
        wingfootDestroyerCollisionGroup = game.physics.p2.createCollisionGroup()
        game.physics.p2.updateBoundsCollisionGroup()
        
        // Adds ground texture & start scrolling
        ground = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'road')
        ground.autoScroll(-Math.abs(gamespeed), 0)
        // Enable cursor keys
        cursors = game.input.keyboard.createCursorKeys()
        // Add player
        player = game.add.sprite(100, game.height/2, 'player')
        game.physics.p2.enable(player)

        // Add Wingfoot destroy element

        var bmd = game.make.bitmapData(WINGFOOT_DESTROYER_WIDTH, HEIGHT);

        //  Draw a few random shapes to it
        bmd.rect(0, 0, WINGFOOT_DESTROYER_WIDTH, HEIGHT, 'rgba(255,0,255,0)');

        //  Here the sprite uses the BitmapData as a texture
        wingfootDestroyer = game.add.sprite(0, 0, bmd);
        game.physics.p2.enable(wingfootDestroyer)

        // Add score
        Score.init(game, WIDTH-256, 32)


        wingfootSpawnEvent = game.time.create(false);
        wingfootSpawnEvent.loop(Phaser.Timer.SECOND * 2, createWingfoot, this);

        Wingfoots.init(game, Phaser, wingfootCollisionGroup,wingfootSpawnEvent)
        // Create timer to spawn wingfoots
        // Until Game Ends
        
       
        game.time.events.repeat(Phaser.Timer.SECOND * 10, 20, increaseSpeed, this)
        game.time.events.repeat(Phaser.Timer.SECOND * 20, 3, Wingfoots.increaseSpawnSpeed,this)

        // wingfootDestroyer 
        // set new Collision Group on Wingfoot destroyer
        // wingfootDestroyer.body.collides(wingfootCollisionGroup, destroyWingfoot, this)
        wingfootDestroyer.body.setCollisionGroup(wingfootDestroyerCollisionGroup)
        wingfootDestroyer.body.collides(wingfootCollisionGroup, onWingfootDestroyCollision,this)
        player.body.setCollisionGroup(playerCollisionGroup)
        player.body.collides(wingfootCollisionGroup, onWingfootCollision, this)

        //Start all loops
        wingfootSpawnEvent.start()
    }

    function gameEnd(){
        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.5);
        bar.drawRect(0, HEIGHT/3, WIDTH, 300);
        var text = game.add.text(WIDTH/2-100, HEIGHT/2 - 100, "GAME END", { font: "32px Arial", fill: "#ffffff", align: "left",alpha:1 })
        var thanksText = game.add.text(WIDTH/2-175, HEIGHT/2, "Thank you for playing !", { font: "32px Arial", fill: "#ffffff", align: "left",alpha:1 })

        game.paused = true
        manageHighscore()
        setTimeout(function(){
            window.location="/index.html?score="+Score.currentScore()
        },3000)

    }

    function manageHighscore(){
        var score = Score.currentScore()
        Smaf.storage().getItem('highscore', function(err, value) {
            if(value==null){
                storeScore();
            }else{
                var storageScore = parseInt(value);
                if(score > storageScore) {
                    storeScore();  
                }   
            }
        });
    }

    function storeScore() {
        Smaf.storage().setItem("highscore", Score.currentScore());
    }

    function increaseSpeed(){
        gamespeed += increaseGameSpeed;
        
    }

    function onWingfootCollision(player, wingfoot) {
        Wingfoots.onCollision(wingfoot, Score)
    }

    function onWingfootDestroyCollision(wingfootDestroyer, wingfoot){
        Wingfoots.onDestroyCollision(wingfoot);
    }

    function createWingfoot() {
        Wingfoots.create(gamespeed, playerCollisionGroup,wingfootDestroyerCollisionGroup)
    }

    function update() {
        var elapsedTime = parseInt(this.game.time.totalElapsedSeconds())

        ground.autoScroll(-Math.abs(gamespeed), 0)
        player.body.rotateRight(gamespeed / 4)
        player.body.setZeroVelocity()
        wingfootDestroyer.body.setZeroVelocity()
        //Update Score
        Score.update()
        //Update Timer
        
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
