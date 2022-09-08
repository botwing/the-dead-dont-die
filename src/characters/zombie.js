import { SpriteSheet, Vector, angleToTarget, imageAssets } from "../../node_modules/kontra/kontra.mjs";
import { getRandomPosition, collidesWithWalls } from "../helper.js";

export function createZobmie(target) {
    let randomPosition = getRandomPosition()
    
    return {
        x: randomPosition.x,
        y: randomPosition.y,
        type: 'zombie',
        width: 15,
        height: 23,

        scaleX: 1.7,
        scaleY: 1.7,

        life: 100,
        opacity: 1,
        lifeColor: 255,
        dt: 1,

        anchor: {x: 0.5, y: 0.5},
        radius: 16,

        rotation: 0,

        animations: getZombieAnimations(),

        hitObstacle (map) {
            let zombieX = this.x
            let zombieY = this.y
            let zombieDX = this.dx
            let zombieDY = this.dy

            this.dy = 0;
            this.advance();

            if (collidesWithWalls(this, map)) {
                this.x = zombieX - this.dx * 10
                return
            }

            this.dy = zombieDY

            this.dx = 0
            this.advance()

            if (collidesWithWalls(this, map)) {
                this.y = zombieY - this.dy * 10
                return
            }

            this.dx = zombieDX
        },

        rotateToTarget(target) {
            let direction = Vector(target.x - this.x, target.y - this.y)
            direction = direction.normalize()

            if (this.currentAnimation != this.animations.dead) {
                this.dx = direction.x * 0.65
                this.dy = direction.y * 0.65
                this.rotation = angleToTarget(this, {x: target.x, y: target.y})
            }
        },

        die() {
            this.life = -1
            this.ttl = 150
            this.playAnimation('dead')

            this.dx = 0
            this.dy = 0
        },
    
        update() {
            this.currentAnimation.update();
        },
    };
}

function getZombieAnimations()
{
    return (SpriteSheet({
        image: imageAssets['sprites'],
        frameWidth: 15,
        frameHeight: 25,
        
        animations: {
            walk: {
                frames: '2..3',
                frameRate: 1.5,
            },
            dead: {
                frames: 4
            }
        }
    })).animations
}
