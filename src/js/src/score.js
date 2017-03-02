let value = 0
let text

export default {
    init(game, x, y) {
        text = game.add.text(x, y, value, { font: "20px Arial", fill: "#ffffff", align: "left" })
    },
    update() {
        text.text = value
    },
    add(amount) {
        value += amount
    }
}
