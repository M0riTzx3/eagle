let wingfoots
let game
let collisionGroup
let spawnEvent
let spawnDelay


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
        const wingfoot = wingfoots.create(game.width, game.world.randomY, 'wingfoot')
        wingfoot.body.velocity.mx=gamespeed+300
        //  Tell the panda to use the pandaCollisionGroup
        wingfoot.body.setCollisionGroup(collisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        wingfoot.body.collides([collisionGroup, playerCollisionGroup,wingfootDestroyerCollisionGroup]);
    },
    increaseSpawnSpeed(){
        spawnDelay = spawnDelay - 300
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
