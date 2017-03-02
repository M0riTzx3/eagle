let wingfoots
let game
let collisionGroup

export default {
    init(_game, Phaser, colGroup) {
        game = _game
        collisionGroup = colGroup
        wingfoots = game.add.group()
        wingfoots.enableBody = true
        console.log("init wingfoots", Phaser.Physics.P2JS)
        wingfoots.physicsBodyType = Phaser.Physics.P2JS
    },
    create(gamespeed, playerCollisionGroup) {
        const wingfoot = wingfoots.create(game.width, game.world.randomY, 'wingfoot')
        //  Tell the panda to use the pandaCollisionGroup
        wingfoot.body.setCollisionGroup(collisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        wingfoot.body.collides([collisionGroup, playerCollisionGroup]);
    },
    onCollision(wingfoot, score) {
        score.add(100)
        if(wingfoot.sprite!=null){
            wingfoot.sprite.destroy()
        }
    }
}
