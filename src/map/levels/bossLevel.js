import { TileEngine, imageAssets } from '../../../node_modules/kontra/kontra.mjs'
import { getRandomLevelLayer } from "./randomLevel.js";
import { GRASS, ROCKS, GRAVE } from '../map.js'

export let bossLevel = [
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 6, 0, 7, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
    6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,
]

function placeTheGrave()
{
    let result = [];

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 15; j++) {
            result.push(0);
        }
    }

    let k = 7
    let l = 5

    result[k + (l - 1) * 20] = GRAVE;
    result[k + l * 20] = GRAVE+1;

    return result;
}

export function getBossLevel() {
    return TileEngine({
        tilewidth: 40,
        tileheight: 40,
    
        width: 20,
        height: 15,
    
        tilesets: [{
            firstgid: 1,
            image: imageAssets['sprites']
        }],
    
        layers: [
            {
                name: 'grass',
                data: getRandomLevelLayer(GRASS),
            },
            {
                name: 'walls',
                data: bossLevel,
            },
            {
                name: 'grave',
                data: placeTheGrave()
            }
        ]
    })
}