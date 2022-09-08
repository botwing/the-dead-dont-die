import {
    Sprite, SpriteSheet,
    Vector,
    clamp, angleToTarget,
    imageAssets
} from "../../node_modules/kontra/kontra.mjs"
import { collidesWithWalls, minX, minY, maxX, maxY } from '../helper.js'

let bulletDamage = 9

export function getTheQueen(imageAssets) {
    return Sprite({
        x: maxX / 2,
        y: maxY / 4,

        dt: 0,
        life: 200,
        zombiness: 130,

        maxSpeed: 3,

        width: 15,
        height: 16,
        radius: 7,

        scaleX: 2,
        scaleY: 2,

        anchor: {x: 0.5, y: 0.5},
        rotation: 0,

        animations: getTheQueenAnimations(imageAssets),

        hitObstacle (map) {
            let queenX = this.x
            let queenY = this.y
            let queenDX = this.dx
            let queenDY = this.dy

            this.dy = 0
            this.advance()

            if (collidesWithWalls(this, map)) {
                this.x = queenX - this.dx * 1.25
                this.dx *= 0.8
            }

            this.dy = queenDY

            this.dx = 0
            this.advance()

            if (collidesWithWalls(this, map)) {
                this.y = queenY - this.dy * 1.25
                this.dy *= 0.8
            }

            this.dx = queenDX;
        },
        
        fire(target) {
            this.dt = 0;
            let direction = Vector(target.x + target.dx*55 - this.x, target.y + target.dy*55 - this.y)
            direction = direction.normalize()

            let spit = Sprite({
                color: '#33aa33',
                type: 'spit',
                damage: bulletDamage,
                ttl: 150,

                x: this.x + direction.x * 30,
                y: this.y + direction.y * 30,
                dx: direction.x * 3,
                dy: direction.y * 3,

                radius: 5,
                width: 5,
                height: 5,

                update() {
                    this.dx = this.dx * 0.993;
                    this.dy = this.dy * 0.993;

                    this.advance();
                }
            })

            return spit
        },

        keepQueenInsideCanvas()
        {
            this.x = clamp(minX + 240, maxX - 240, this.x);
            this.y = clamp(minY + 120, maxY - 280, this.y);
        },

        resetPosition() {
            this.x = maxX / 2
            this.y = maxY / 2
        },

        rotateToTarget(target) {
            return rotateToTarget(this, target)
        },

        move(directionVector) {
            this.dx = directionVector.x * 0.75
            this.dy = directionVector.y * 0.75

            this.advance()
        },

        die() {
            this.life = -1
            this.ttl = 150
            this.playAnimation('dead')

            this.dx = 0
            this.dy = 0
        },

        healed() {
            this.playAnimation('princes')
        },
        
        update () {

            this.dt += 1 / 60

            this.currentAnimation.update()

        }
    })
}

function rotateToTarget(shooter, target) {
    let direction = Vector(target.x - shooter.x, target.y - shooter.y);
    direction = direction.normalize();

    shooter.rotation = angleToTarget(shooter, {x: target.x, y: target.y});
}


function getTheQueenAnimations()
{
    return (SpriteSheet({
        image: imageAssets['sprites'],
        frameWidth: 15,
        frameHeight: 16,

        animations: {
            queen: {
                frames: '5',
            },
            princes: {
                frames: '6',
            },
            dead: {
                frames: 4
            }
        }
    })).animations
}
