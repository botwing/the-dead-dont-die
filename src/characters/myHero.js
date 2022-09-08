import {
    Sprite, SpriteSheet,
    getPointer, Vector,
    keyPressed,
    clamp, angleToTarget,
    imageAssets
} from "../../node_modules/kontra/kontra.mjs"
import { collidesWithWalls, minX, minY, maxX, maxY } from '../helper.js'

let bulletDamage = 9

export function getHero() {
    return Sprite({
        x: maxX / 2,
        y: maxY / 2,

        dt: 0,
        dt2: 0,
        life: 100,
        bottles: 0,

        maxSpeed: 3,

        width: 15,
        height: 23,
        radius: 7,

        scaleX: 2,
        scaleY: 2,

        anchor: {x: 0.5, y: 0.7},
        rotation: 0,

        animations: getHeroAnimations(),

        hitObstacle (map) {
            let heroX = this.x
            let heroY = this.y
            let heroDX = this.dx
            let heroDY = this.dy

            this.dy = 0
            this.advance()

            if (collidesWithWalls(this, map)) {
                this.x = heroX - this.dx * 1.25
                this.dx *= 0.8
            }

            this.dy = heroDY

            this.dx = 0
            this.advance()

            if (collidesWithWalls(this, map)) {
                this.y = heroY - this.dy * 1.25
                this.dy *= 0.8
            }

            this.dx = heroDX;
        },
        
        fire() {
            this.dt = 0;
            let pointer = getPointer()
            let direction = Vector(pointer.x - this.x, pointer.y - this.y)
            direction = direction.normalize()

            let bullet = Sprite({
                color: 'black',
                type: 'bullet',
                damage: bulletDamage,
                ttl: 160,

                x: this.x + direction.x * 45,
                y: this.y + direction.y * 45,
                dx: direction.x * 3,
                dy: direction.y * 3,

                radius: 4,
                width: 4,
                height: 8,

                update() {
                    this.dx = this.dx * 0.993;
                    this.dy = this.dy * 0.993;

                    this.advance();
                }
            })

            rotateToPointer(bullet)

            return bullet
        },

        throwBottle() {
            this.dt2 = 0
            this.bottles--
            let pointer = getPointer()
            let direction = Vector(pointer.x - this.x, pointer.y - this.y)
            direction = direction.normalize()

            let bullet = Sprite({
                color: '#203598',

                type: 'healer',
                damage: 7,
                ttl: 160,

                x: this.x + direction.x * 45,
                y: this.y + direction.y * 45,
                dx: direction.x * 3,
                dy: direction.y * 3,

                radius: 4,
                width: 4,
                height: 8,

                update() {
                    this.dx = this.dx * 0.993
                    this.dy = this.dy * 0.993

                    this.advance()
                }
            })

            rotateToPointer(bullet)

            return bullet
        },

        keepHeroInsideCanvas()
        {
            this.x = clamp(minX + 20, maxX - 20, this.x)
            this.y = clamp(minY + 20, maxY - 20, this.y)
        },

        resetPosition() {
            this.x = maxX / 2
            this.y = maxY * 0.75
        },

        die() {

        },
        
        update () {

            adjustHeroSpeed(this)
            adjustHeroAnimation(this)
            rotateToPointer(this)

            this.dt += 1 / 60
            this.dt2 += 1 / 60

            this.currentAnimation.update()

        }
    })
}

function adjustHeroSpeed(myHero)
{
    let isMoving = false;
    let multiplier = 30;

    if (keyPressed('left') || keyPressed('a')) {
        myHero.dx = myHero.dx - myHero.maxSpeed/multiplier;
        myHero.dx = clamp(-myHero.maxSpeed, myHero.maxSpeed, myHero.dx);
        isMoving = true;
    }

    if (keyPressed('right') || keyPressed('d')) {
        myHero.dx = myHero.dx + myHero.maxSpeed/multiplier;
        myHero.dx = clamp(-myHero.maxSpeed, myHero.maxSpeed, myHero.dx);
        isMoving = true;
    }

    if (keyPressed('up') || keyPressed('w')) {
        myHero.dy = myHero.dy - myHero.maxSpeed/multiplier;
        myHero.dy = clamp(-myHero.maxSpeed, myHero.maxSpeed, myHero.dy);
        isMoving = true;
    }

    if (keyPressed('down') || keyPressed('s')) {
        myHero.dy = myHero.dy + myHero.maxSpeed/multiplier;
        myHero.dy = clamp(-myHero.maxSpeed, myHero.maxSpeed, myHero.dy);
        isMoving = true;
    }

    if (!isMoving) {
        if (myHero.dx > 0) {
            myHero.dx -= myHero.maxSpeed/multiplier;
        }

        if (myHero.dx < 0) {
            myHero.dx += myHero.maxSpeed/multiplier;
        }

        if (myHero.dy > 0) {
            myHero.dy -= myHero.maxSpeed/multiplier;
        }

        if (myHero.dy < 0) {
            myHero.dy += myHero.maxSpeed/multiplier;
        }

        if (Math.abs(myHero.dx) < 0.5) {
            myHero.dx = 0;
        }

        if (Math.abs(myHero.dy) < 0.5) {
            myHero.dy = 0;
        }
    }
}

function rotateToPointer(myHero) {
    let pointer = getPointer();
    myHero.rotation = angleToTarget(myHero, {x: pointer.x, y: pointer.y});
}

function getHeroAnimations()
{
    return (SpriteSheet({
        image: imageAssets['sprites'],
        frameWidth: 15,
        frameHeight: 25,

        animations: {
            idle: {
                frames: '0',
            },
            walk: {
                frames: '0..1',
                frameRate: 3,
            }
        }
    })).animations
}

function adjustHeroAnimation(myHero)
{
    if (myHero.dx == 0 && myHero.dy == 0) {
        myHero.playAnimation('idle');
    } else {
        myHero.playAnimation('walk');
    }
}
