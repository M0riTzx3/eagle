const DESKTOP={
    WIDTH: 1920,
    HEIGHT: 1080,
    gamespeed: 500,
    wingfoot_sprite:120,
    nailboard_sprite:180,
    player_movement_speed: 400,
    images:"desktop",
    font:"26px Arial"
}

const MOBILE={
    WIDTH: 1920 / 2,
    HEIGHT: 1080 / 2,
    gamespeed: 500 / 2,
    player_movement_speed: 400 / 2,
    wingfoot_sprite:60,
    nailboard_sprite:90,
    images:"mobile",
    font:"26px Arial"
}

const DISPLAY_DEVICE = DESKTOP


export default {

    getWingfootSprite(){
        return DISPLAY_DEVICE.wingfoot_sprite
    },

    getNailboardSprite(){
        return DISPLAY_DEVICE.nailboard_sprite  
    },

    getWidth() {
        return DISPLAY_DEVICE.WIDTH
    },
    getHeight() {
        return DISPLAY_DEVICE.HEIGHT
    },
    setGamespeed(_gamespeed) {
        DISPLAY_DEVICE.gamespeed = _gamespeed
    },
    getGamespeed() {
        return DISPLAY_DEVICE.gamespeed
    },
    setPlayerMovementSpeed(_player_movement_speed) {
        DISPLAY_DEVICE.player_movement_speed = _player_movement_speed
    },
    getPlayerMovementSpeed() {
        return DISPLAY_DEVICE.player_movement_speed
    },
    getDisplayDevice() {
        return DISPLAY_DEVICE.images
    }

}
