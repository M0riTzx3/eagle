import Wingfoots from "./wingfoot"
import Nailboards from "./nailboard"
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

    let music

    let player 
    let playerCollisionGroup

    let nailBoardSpawnEvent
    let nailBoardCollisionGroup

    let wingfootSpawnEvent
    let wingfootCollisionGroup

    let voidBar
    let voidBarCollisionGroup
    const VOID_BAR_WIDTH=20;
    
    let cursors
    
    const gameTimeLimit = 60000;
    const increaseGameSpeed = 300;
    
    var timeoutEvent

    function preload () {
        game.load.image('road', 'images/street_new.png')
        game.load.image('player', 'images/goodyear-tire-concept_128.png')
        game.load.image('wingfoot', 'images/wingfoot_128.png')
        game.load.image('nailboard', 'images/tirekiller.png')
        game.load.audio('tireExplosion', ['sounds/tire_explosion.mp3', 'sounds/tire_explosion.wav']);
        

        // Init Game World
        game.world.setBounds(0, 0, WIDTH, HEIGHT)
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.physics.startSystem(Phaser.Physics.P2JS)
        game.physics.p2.setImpactEvents(true)


    }

    function create () {

        // Create Playfield
        ground = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'road')
        ground.autoScroll(-Math.abs(gamespeed), 0)
      

        //Create Entities
        initPlayer()
        initWingfoots()
        initNailboards()
        initVoidBar()

        //Update CollisionGroupBounds        
        game.physics.p2.updateBoundsCollisionGroup()
        
        // Enable cursor keys
        cursors = game.input.keyboard.createCursorKeys()
        
        // Add score
        Score.init(game, WIDTH-256, 32)

        // Init all events
        
        wingfootSpawnEvent.loop(Phaser.Timer.SECOND * 2, createWingfoot, this);
        nailBoardSpawnEvent.loop(Phaser.Timer.SECOND * 5, createNailboard, this)
        game.time.events.repeat(Phaser.Timer.SECOND * 10, 20, increaseSpeed, this)
        game.time.events.repeat(Phaser.Timer.SECOND * 15, 5, Wingfoots.increaseSpawnSpeed,this)
        game.time.events.repeat(Phaser.Timer.SECOND * 20, 5, Nailboards.increaseSpawnSpeed,this)


        //Start all loops
        wingfootSpawnEvent.start()
        nailBoardSpawnEvent.start()
    }


    function initPlayer(){
        playerCollisionGroup = game.physics.p2.createCollisionGroup()
        player = game.add.sprite(100, game.height/2, 'player')
        game.physics.p2.enable(player)
        player.body.setCollisionGroup(playerCollisionGroup)
        
    }

    function initWingfoots(){
        wingfootCollisionGroup = game.physics.p2.createCollisionGroup()   
        wingfootSpawnEvent = game.time.create(false);
        Wingfoots.init(game, Phaser, wingfootCollisionGroup,wingfootSpawnEvent)
        player.body.collides(wingfootCollisionGroup, onWingfootCollision, this) 
    }

    function initVoidBar(){
        var bmd = game.make.bitmapData(VOID_BAR_WIDTH, HEIGHT);
        bmd.rect(0, 0, VOID_BAR_WIDTH, HEIGHT, 'rgba(255,0,255,0)');
        voidBar = game.add.sprite(0, 0, bmd);
        game.physics.p2.enable(voidBar)
        voidBarCollisionGroup = game.physics.p2.createCollisionGroup()
        voidBar.body.setCollisionGroup(voidBarCollisionGroup)
        voidBar.body.collides(wingfootCollisionGroup, onWingfootDestroyCollision,this)
        voidBar.body.collides(nailBoardCollisionGroup, onNailBoardDestroyCollision,this)
    }

    function initNailboards(){
        nailBoardCollisionGroup = game.physics.p2.createCollisionGroup()   
        nailBoardSpawnEvent = game.time.create(false);
        Nailboards.init(game, Phaser, nailBoardCollisionGroup,nailBoardSpawnEvent)
        player.body.collides(nailBoardCollisionGroup, onNailBoardCollision, this) 
    }
  

    function increaseSpeed(){
        gamespeed += increaseGameSpeed;
        
    }

    function onWingfootCollision(player, wingfoot) {
        Wingfoots.onCollision(wingfoot, Score)
    }

    function onWingfootDestroyCollision(voidBar, wingfoot){
        Wingfoots.onDestroyCollision(wingfoot);
    }

    function onNailBoardCollision(player,nailboard){
        Nailboards.onCollision(player,nailboard,Score,music)

    }

    function onNailBoardDestroyCollision(voidBar, nailboard){
        Nailboards.onDestroyCollision(nailboard)
    }

    function createWingfoot() {
        Wingfoots.create(gamespeed, playerCollisionGroup,voidBarCollisionGroup)
    }

    function createNailboard() {
        Nailboards.create(gamespeed, playerCollisionGroup,voidBarCollisionGroup)
    }

    function update() {
        var elapsedTime = parseInt(this.game.time.totalElapsedSeconds())

        ground.autoScroll(-Math.abs(gamespeed), 0)
        player.body.rotateRight(gamespeed / 4)
        player.body.setZeroVelocity()
        voidBar.body.setZeroVelocity()
        //Update Score
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
