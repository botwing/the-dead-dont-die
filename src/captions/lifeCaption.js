import { Text } from "../../node_modules/kontra/kontra.mjs"

export default Text({
    text: 100,
    font: '32px Courier New',
    color: 'white',
    x: 55,
    y: 15,

    update(myHero) {
        this.text = myHero.life
    }
})
