import {
    GameLoop, Pool,
    Sprite, collides,
    pointerPressed,
    load,
    Vector,
    randInt,
} from '../node_modules/kontra/kontra.mjs'

import './init.js'

import { generateMap } from './map/map.js'
import { getHero } from './characters/myHero.js'
import { getTheQueen } from './characters/theQueen.js'
import { createZobmie } from './characters/zombie.js'

import { minX, minY, maxX, maxY } from './helper.js'
import { emitBlast } from './weapons/effects/blast.js'
import { emmitHeroDamage } from './weapons/effects/heroDamage.js'

import { getHeartIcon } from './niceObjects/heart.js'
import { getBottleIcon } from './niceObjects/bottle.js'

import lifeCaption from './captions/lifeCaption.js'
import bottleCount from './captions/bottleCount.js'
import URDead from './captions/heroDied.js'
import QDead from './captions/queenDied.js'
import QSaved from './captions/queenHealed.js'

let bullets = []
let spits = []
let bulletBlasts = []
let zombies = []
let zombiePool = Pool({
    create: Sprite,
    maxSize: 10,
})
let bottles = []

let myHero = null
let theQueen = null
let map = null

let heartIcon = null
let bottleIcon = null

load('sprites.png')
.then(function() {
    map = generateMap()
    map.getCurrentLevel().render()
    
    myHero = getHero()
    heartIcon = getHeartIcon()
    bottleIcon = getBottleIcon()
    bottleIcon.x = 125
    bottleIcon.y = 15
}).then(function() {
    loop.start()
});


let loop = GameLoop({
    update: function() {

        zombiePool.get(createZobmie(myHero))
        zombiePool.update()

        bullets.map(bullet => {bullet.update()})
        spits.map(spit => {spit.update()})
        bulletBlasts.map(bulletBlast => {bulletBlast.update()})

        zombies = zombiePool.getAliveObjects()

        for (let j = 0; j < zombies.length; j++) {

            zombies[j].hitObstacle(map.getCurrentLevel())
            zombies[j].rotateToTarget(myHero)

            if (collides(zombies[j], myHero) && zombies[j].life >= 0) {
                zombies[j].x -= zombies[j].dx * 10
                zombies[j].y -= zombies[j].dy * 10
                zombies[j].dx *= 0.5;
                zombies[j].dy *= 0.5;

                zombies[j].dt += 1 / 60;
                if (zombies[j].dt > 0.045) {
                    myHero.life -= 5;
                    zombies[j].dt = 0;

                    bulletBlasts.push(emmitHeroDamage());
                }
            }
        }

        for (let i = 0; i < bullets.length; i++) {
            // check zombie hit
            for (let j = 0; j < zombies.length; j++) {
                if (bullets[i].type == 'healer') {
                    break
                }

                if (collides(zombies[j], bullets[i]) && zombies[j].life >= 0) {
                    bulletBlasts.push(emitBlast(bullets[i].x, bullets[i].y));
                    targetGotShot(zombies[j], bullets[i])
                }
            }

            // check queen hit
            if (theQueen !== null && collides(theQueen, bullets[i]) && theQueen.life >= 0) {
                bulletBlasts.push(emitBlast(bullets[i].x, bullets[i].y));
                targetGotShot(theQueen, bullets[i])
            }
        }

        for (let i = 0; i < spits.length; i++) {
            if (collides(myHero, spits[i])) {
                bulletBlasts.push(emmitHeroDamage());
                targetGotShot(myHero, spits[i])
            }
        }

        for (let i = 0; i < bottles.length; i++) {
            if (collides(myHero, bottles[i])) {
                myHero.bottles += 5;
                bottles[i].ttl = 0;
            }
        }

        bullets = bullets.filter(bullet => bullet.isAlive());
        spits = spits.filter(spit => spit.isAlive());
        bulletBlasts = bulletBlasts.filter(bulletBlast=> bulletBlast.isAlive());
        
        bottles = bottles.filter(bottle=> bottle.isAlive());
        

        myHero.update()
        myHero.hitObstacle(map.getCurrentLevel())

        if (switchMapLevels()) {
            myHero.resetPosition()
            bullets = []
            spits = []
            bottles = []
            zombiePool.clear()

            if (map.currentLevel.y == 0) {
                theQueen = getTheQueen()
            } else {
                theQueen = null
            }

            if (randInt(0, 300) < 100) {
                bottles.push(getBottleIcon())
            }

        } else {
            myHero.keepHeroInsideCanvas()
        }

        if (pointerPressed('left') && myHero.dt > 0.35) {
            bullets.push(myHero.fire())
        }

        if (pointerPressed('right')) {  
            if (myHero.dt2 > 0.5 && myHero.bottles > 0) {
                bullets.push(myHero.throwBottle())
            }
        }
        
        if (myHero.life <= 0) {
            myHero.ttl = 0;
            myHero.life = 0;
        }

        lifeCaption.update(myHero)
        bottleCount.update(myHero)
        if (theQueen !== null) {
            theQueen.update()
            theQueen.rotateToTarget(myHero)
            theQueen.keepQueenInsideCanvas()
            
            if (theQueen.dt > 1.3) {
                spits.push(theQueen.fire(myHero))
            }

            let theQueenMovingVector = Vector(maxX/2 - theQueen.x, maxY/3 - theQueen.y)

            theQueenMovingVector = theQueenMovingVector.normalize()

            for (let i = 0; i < bullets.length; i++) {
                let vectorToQueen = Vector(theQueen.x - bullets[i].x, theQueen.y - bullets[i].y)

                if (vectorToQueen.length() < 100) {
                    theQueenMovingVector = theQueenMovingVector.add(vectorToQueen.normalize())
                    theQueenMovingVector = theQueenMovingVector.normalize()
                }
            }

            theQueen.move(theQueenMovingVector)

            if (theQueen.zombiness <= 0) {
                for (let j = 0; j < zombies.length; j++) {
                    zombies[j].die()

                }
            }
        }
    },
    render: function() {
        map.getCurrentLevel().render()
        lifeCaption.render()
        bottleCount.render()
        
        bullets.map(bullet => {bullet.render()})
        spits.map(spit => {spit.render()})
        bulletBlasts.map(bulletBlast => {bulletBlast.render()})
        bottles.map(bottle => {bottle.render()})
        
        zombiePool.render()
        myHero.render()

        if (myHero.life <= 0) {
            URDead.render()
            loop.stop()
        }

        if (theQueen !== null) {
            theQueen.render()

            if (theQueen.life <= 0) {
                QDead.render()
                loop.stop()
            }

            if (theQueen.zombiness <= 0) {
                QSaved.render()
                loop.stop()
            }
        }

        heartIcon.render()
        bottleIcon.render()
    }
});

function switchMapLevels() {
    if (myHero.x > maxX - 20) {
        return map.moveRight()
    }

    if (myHero.x < minX + 20) {
        return map.moveLeft()
    }

    if (myHero.y > maxY - 20) {
        return map.moveDown()
    }

    if (myHero.y < minY + 20) {
        return map.moveUp()
    }
}

function targetGotShot(target, weapon) {
    weapon.ttl = 0

    if (weapon.type == 'bullet') {
        target.life -= weapon.damage * weapon.velocity.length()
        target.life = Math.ceil(target.life)
    } else {
        target.zombiness -= weapon.damage * weapon.velocity.length()
        target.zombiness = Math.ceil(target.zombiness)

        if (target.zombiness < 0) {
            target.healed()
        }
    }

    target.x = target.x + weapon.dx * 0.2
    target.y = target.y + weapon.dy * 0.2

    if (target.life < 0) {
        target.die()
    }
}
