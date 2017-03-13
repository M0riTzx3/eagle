import Wingfoots from "./wingfoot"
import Nailboards from "./nailboard"
import Score from "./score"
import GameSettings from "./gameSettings"


function initGame() {
    const game = new Phaser.Game(GameSettings.getWidth(), GameSettings.getHeight(), Phaser.AUTO, '', {
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
    const increaseGameSpeed = 200;
    
    var timeoutEvent

    function preload () {
        game.load.image('road', 'images/'+GameSettings.getDisplayDevice()+'/street_new.png')
        game.load.image('player', 'images/'+GameSettings.getDisplayDevice()+'/goodyear-tire-concept.png')
        game.load.image('wingfoot', 'images/'+GameSettings.getDisplayDevice()+'/wingfoot.png')
        game.load.image('nailboard', 'images/'+GameSettings.getDisplayDevice()+'/tirekiller.png')
        game.load.audio('tireExplosion', ['sounds/tire_explosion.mp3', 'sounds/tire_explosion.wav']);
        

        // Init Game World
        game.world.setBounds(0, 0, GameSettings.getWidth(), GameSettings.getHeight())
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.physics.startSystem(Phaser.Physics.P2JS)
        game.physics.p2.setImpactEvents(true)


    }

    function create () {

        // Create Playfield
        ground = game.add.tileSprite(0, 0, GameSettings.getWidth(), GameSettings.getHeight(), 'road')
        ground.autoScroll(-Math.abs(GameSettings.getGamespeed()), 0)
      

        //Create Entities
        initPlayer()
        initWingfoots()
        initNailboards()
        initVoidBar()

        //
        initTouchControl()

        //Update CollisionGroupBounds        
        game.physics.p2.updateBoundsCollisionGroup()
        
        // Enable cursor keys
        cursors = game.input.keyboard.createCursorKeys()
        
        // Add score
        Score.init(game, GameSettings.getWidth()-256, 32)

        // Init all events
        
        wingfootSpawnEvent.loop(Phaser.Timer.SECOND * 3, createWingfoot, this);
        nailBoardSpawnEvent.loop(Phaser.Timer.SECOND * 2.5, createNailboard, this)
        game.time.events.repeat(Phaser.Timer.SECOND * 10, 10, increaseSpeed, this)
        game.time.events.repeat(Phaser.Timer.SECOND * 8, 7, Wingfoots.increaseSpawnSpeed,this)
        game.time.events.repeat(Phaser.Timer.SECOND * 10, 7, Nailboards.increaseSpawnSpeed,this)


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
        var bmd = game.make.bitmapData(VOID_BAR_WIDTH, GameSettings.getHeight());
        bmd.rect(0, 0, VOID_BAR_WIDTH, GameSettings.getHeight(), 'rgba(255,0,255,0)');
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

    function initTouchControl(){
        game.input.addPointer();
        
    }
  

    function increaseSpeed(){
		GameSettings.setGamespeed(GameSettings.getGamespeed()+increaseGameSpeed)
		GameSettings.setPlayerMovementSpeed(GameSettings.getPlayerMovementSpeed() + (increaseGameSpeed / 12.5))
        
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
        Wingfoots.create(GameSettings.getGamespeed(), playerCollisionGroup,voidBarCollisionGroup)
    }

    function createNailboard() {
        Nailboards.create(GameSettings.getGamespeed(), playerCollisionGroup,voidBarCollisionGroup)
    }

    function update() {
        var elapsedTime = parseInt(this.game.time.totalElapsedSeconds())

        ground.autoScroll(-Math.abs(GameSettings.getGamespeed()), 0)
        player.body.rotateRight(GameSettings.getGamespeed() / 4)
        player.body.setZeroVelocity()
        voidBar.body.setZeroVelocity()
        //Update Score
        Score.update()
        movePlayer()     
    }

    function movePlayer(){
        // Cursor support
        if (cursors.up.isDown) {
            player.body.moveUp(GameSettings.getPlayerMovementSpeed())
        } else if (cursors.down.isDown) {
            player.body.moveDown(GameSettings.getPlayerMovementSpeed())
        }

        //Touch support
        if(game.input.pointer1.isDown){

            if(game.input.pointer1.positionDown.y >= GameSettings.getHeight() / 2){
                player.body.moveDown(GameSettings.getPlayerMovementSpeed())
            } 
            if (game.input.pointer1.positionDown.y < GameSettings.getHeight() / 2 ){
                player.body.moveUp(GameSettings.getPlayerMovementSpeed())
            }
        }

        //Mouse support
        if( game.input.mousePointer.isDown){
           if(game.input.mousePointer.positionDown.y >= GameSettings.getHeight() / 2){
                player.body.moveDown(GameSettings.getPlayerMovementSpeed())
            }else if (game.input.mousePointer.positionDown.y < GameSettings.getHeight() / 2 ){
                player.body.moveUp(GameSettings.getPlayerMovementSpeed())
            }
        }
    }

}

Smaf.on('action', function(keypress) {
    if(keypress.keyCode === 8 || keypress.type === 'BACK') {
        window.location.href = "/";
    }
});

export default initGame
