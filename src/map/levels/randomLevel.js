import { randInt, TileEngine, imageAssets } from '../../../node_modules/kontra/kontra.mjs'
import { GRASS, ROCKS, GRAVE } from '../map.js'

let weAlreadyHaveGrave = false;
export function getRandomLevelLayer(tile)
{
    let result = [];

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 15; j++) {
            let rand = randInt(0, 100);

            if (rand < 9 && tile == ROCKS) {
                result.push(randInt(ROCKS, GRAVE));
            } else if (rand > 10 && rand < 36 && tile == GRASS) {
                result.push(GRASS);
            } else {
                result.push(0);
            }
        }
    }

    if (tile == GRAVE) {
        let k = randInt(3, 17);
        let l = randInt(3, 13);
        weAlreadyHaveGrave = true;
        k = 7; l = 5;

        result[k + (l - 1) * 20] = GRAVE;
        result[k + l * 20] = GRAVE+1;
    }

    return result;
}

export function getRandomLevel() {
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
                data: getRandomLevelLayer(ROCKS),
            }
        ]
    })
}