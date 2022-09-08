import { Sprite } from "../../../node_modules/kontra/kontra.mjs";
import { maxX, maxY } from "../../helper.js";

export function emmitHeroDamage() {
    return Sprite({
        x: 0,
        y: 0,
        width: maxX,
        height: maxY,
        opacity: 0.4,
        
        color: '#770000',
        ttl: 45,
    
        update() {
            this.opacity *= 0.93
        },
    })
}
