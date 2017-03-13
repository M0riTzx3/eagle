import GameSettings from "./gameSettings"
let nailboards
let game
let collisionGroup
let spawnEvent
let spawnDelay
const SPRITE_HEIGHT=GameSettings.getNailboardSprite()


export default {
    

    init(_game, Phaser, colGroup, spwnEvent) {
        game = _game
        collisionGroup = colGroup
        nailboards = game.add.group()
        nailboards.enableBody = true
        console.log("init nailboard", Phaser.Physics.P2JS)
        nailboards.physicsBodyType = Phaser.Physics.P2JS
        spawnEvent = spwnEvent
    },
    create(gamespeed, playerCollisionGroup,nailBoardDestroyerCollisionGroup) {
        spawnDelay = spawnEvent.events[0].delay
        var randomY = game.world.randomY
        if(randomY < SPRITE_HEIGHT){
            randomY +=SPRITE_HEIGHT-randomY
        }
        if(randomY > game.height-SPRITE_HEIGHT){
            randomY = randomY - SPRITE_HEIGHT
        }
        const nailboard = nailboards.create(game.width, randomY, 'nailboard')
        nailboard.body.velocity.mx=gamespeed+200
        
        //  Tell the panda to use the pandaCollisionGroup
        nailboard.body.setCollisionGroup(collisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        nailboard.body.collides([collisionGroup, playerCollisionGroup,nailBoardDestroyerCollisionGroup]);
    },
    increaseSpawnSpeed(){
        spawnDelay = spawnDelay - 275
        spawnEvent.events[0].delay = spawnDelay
        
    },
    onCollision(player, nailboard,Score) {
        playExplosionMusic()
        if(nailboard.sprite!=null){
             nailboard.sprite.destroy()
        }
        setTimeout(function(){
           gameOver(Score)  
        },250)
            
    },

    
    onDestroyCollision(nailboard){
        if(nailboard.sprite!=null){
            nailboard.sprite.destroy()
        }
    }
}

    function playExplosionMusic(){
        var music =  game.add.audio('tireExplosion');
        music.volume = 10
        music.play()
    }

    function gameOver(Score){
        const HEIGHT = game.height
        const WIDTH = game.width
        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.5);
        bar.drawRect(0, HEIGHT/3, WIDTH, 300);
        var text = game.add.text(WIDTH/2-100, HEIGHT/2 - 100, "GAME OVER", { font: "32px Arial", fill: "#ffffff", align: "left",alpha:1 })
        var thanksText = game.add.text(WIDTH/2-175, HEIGHT/2, "Thank you for playing !", { font: "32px Arial", fill: "#ffffff", align: "left",alpha:1 })
        game.paused = true
        var score = Score.currentScore()
        manageHighscore(score)
    
        setTimeout(function(){
            window.location="index.html?score="+score
        },3000)
    }


    function manageHighscore(score){
        Smaf.storage().getItem('highscore', function(err, value) {
            if(value==null){
                storeScore(score);
            }else{
                var storageScore = parseInt(value);
                if(score > storageScore) {
                    storeScore(score);  
                }   
            }
        });
    }

    
    function storeScore(score) {
        Smaf.storage().setItem("highscore", score);
    }