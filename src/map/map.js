import { getRandomLevel } from './levels/randomLevel.js'
import { getBossLevel } from './levels/bossLevel.js'

export const GRASS = 5
export const ROCKS = 6
export const GRAVE = 7

export function generateMap() {

    let map = {
        sizeX: 3,
        sizeY: 3,
        levels: [],
        currentLevel: {x: 2, y: 2},

        fillLevels() {
            this.levels.push([])
            for(let x = 1; x <= this.sizeX; x++) {
                this.levels.push([])
                for(let y = 1; y <= this.sizeY; y++) {
                    this.levels[x][y] = getRandomLevel()
                }
            }
            this.levels[2][0] = getBossLevel()
        },

        getCurrentLevel() {
            return this.levels[this.currentLevel.x][this.currentLevel.y]
        },

        moveRight() {
            let newLevel = Object.assign({}, this.currentLevel);
            newLevel.x++

            return this.moveLevel(newLevel)
        },

        moveLeft() {
            let newLevel = Object.assign({}, this.currentLevel);
            newLevel.x--

            return this.moveLevel(newLevel)
        },

        moveUp() {
            let newLevel = Object.assign({}, this.currentLevel);
            newLevel.y--

            return this.moveLevel(newLevel)
        },

        moveDown() {
            let newLevel = Object.assign({}, this.currentLevel);
            newLevel.y++

            return this.moveLevel(newLevel)
        },

        moveLevel(newCurrentLevel) {
            if (!this.levelExists(newCurrentLevel)) {
                return false
            }

            this.currentLevel = Object.assign({}, newCurrentLevel);
            return true
        },

        levelExists(level) {
            if (typeof this.levels[level.x] !== 'undefined') {
                if (typeof this.levels[level.x][level.y] !== 'undefined') {
                    return true
                }
            }

            return false
        }
    }    

    map.fillLevels()

    return map
}
