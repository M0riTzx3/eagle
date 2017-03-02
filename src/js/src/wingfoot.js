export default {
    create(game, gamespeed) {
        const wingfoot = game.add.sprite(game.width, game.world.randomY, 'wingfoot')
        game.physics.p2.enable(wingfoot)
        wingfoot.body.velocity.x = -Math.abs(gamespeed)
        wingfoot.body.collideWorldBounds = true
        return wingfoot
    },
    onCollision(sprite, score) {
        score.add(100)
        sprite.destroy()
    }
}
