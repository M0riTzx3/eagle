let wingfoots
import GameSettings from "./gameSettings"

let game
let collisionGroup
let spawnEvent
let spawnDelay
const SPRITE_HEIGHT=GameSettings.getWingfootSprite()


export default {
    init(_game, Phaser, colGroup, spwnEvent) {
        game = _game
        collisionGroup = colGroup
        wingfoots = game.add.group()
        wingfoots.enableBody = true
        console.log("init wingfoots", Phaser.Physics.P2JS)
        wingfoots.physicsBodyType = Phaser.Physics.P2JS
        spawnEvent = spwnEvent
    },
    create(gamespeed, playerCollisionGroup,wingfootDestroyerCollisionGroup) {
        spawnDelay = spawnEvent.events[0].delay
        var randomY = game.world.randomY
        if(randomY < SPRITE_HEIGHT){
            randomY +=SPRITE_HEIGHT-randomY
        }
        if(randomY > game.height-SPRITE_HEIGHT){
            randomY = randomY - SPRITE_HEIGHT
        }
        const wingfoot = wingfoots.create(game.width, randomY, 'wingfoot')
        wingfoot.body.velocity.mx=gamespeed+200
        //  Tell the panda to use the pandaCollisionGroup
        wingfoot.body.setCollisionGroup(collisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        wingfoot.body.collides([collisionGroup, playerCollisionGroup,wingfootDestroyerCollisionGroup]);
    },
    increaseSpawnSpeed(){
        spawnDelay = spawnDelay - 275
        spawnEvent.events[0].delay = spawnDelay
        
    },
    onCollision(wingfoot, score) {
        score.add(100)
        if(wingfoot.sprite!=null){
            wingfoot.sprite.destroy()
        }
    },
    onDestroyCollision(wingfoot){
        if(wingfoot.sprite!=null){
            wingfoot.sprite.destroy()
        }
    }
}
