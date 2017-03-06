let value = 0
let text

export default {
    init(game, x, y) {
        text = game.add.text(x, y, value, { font: "26px Arial", fill: "#ffffff", align: "left" })
    },
    update() {
        text.text = "Score: "+value
    },
    add(amount) {
        value += amount
    },
    currentScore(){
        return value
    }
}
