import { Sprite } from "../../../node_modules/kontra/kontra.mjs";

export function emitBlast(x, y, color = '#770000') {
    return Sprite({
        x: x,
        y: y,

        width: 4,
        height: 4,
        radius: 4,
        
        color: color,
        ttl: 45,

        update() {
            this.scaleX *= 1.05;
            this.scaleY *= 1.05;
            this.opacity *= 0.93;

            this.advance();
        },

        render() {
            if (this.isAlive()) {
                this.context.fillStyle = this.color;
        
                this.context.beginPath();
                this.context.arc(0, 0, this.radius, 0, 2  * Math.PI);
                this.context.fill();
            }
        }
    });
}