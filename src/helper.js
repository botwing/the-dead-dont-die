import { randInt, getCanvas } from '../node_modules/kontra/kontra.mjs'

let canvas = getCanvas()
export let minX = 0
export let minY = 0
export let maxX = canvas.width
export let maxY = canvas.height

canvas.oncontextmenu = function(e){
    stopEvent(e);
}
function stopEvent(event){
    if(event.preventDefault != undefined)
        event.preventDefault();
    if(event.stopPropagation != undefined)
        event.stopPropagation();
}

export function collidesWithWalls(someone, map)
{
    let heroWidth = someone.width;
    let herHeight = someone.height;
    let collides = false;

    someone.width = 10;
    someone.height = 10;
    if (map.layerCollidesWith('walls', someone)) {
        collides = true;
    }
    someone.width = heroWidth;
    someone.height = herHeight;

    return collides;
}

export function getRandomPosition() {
    let x = randInt(minX + 40, maxX - 40);
    let y = randInt(minY + 40, maxY - 40);

    return {x, y};
}
