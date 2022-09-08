import { Text } from "../../node_modules/kontra/kontra.mjs"

export default Text({
    text: 100,
    font: '32px Courier New',
    color: 'white',
    x: 155,
    y: 15,

    update(myHero) {
        this.text = myHero.bottles
    }
})
