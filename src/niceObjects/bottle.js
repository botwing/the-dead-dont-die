import { Sprite, SpriteSheet, imageAssets } from "../../node_modules/kontra/kontra.mjs";
import { getRandomPosition } from "../helper.js";

export function getBottleIcon() {
    let randomPosition = getRandomPosition();

    return Sprite ({
        x: randomPosition.x,
        y: randomPosition.y,
    
        width: 21,
        height: 26,
    
        animations: getBottleAnimations()
    })
}

function getBottleAnimations()
{
    return (SpriteSheet({
        image: imageAssets['sprites'],
        frameWidth: 15,
        frameHeight: 20,

        animations: {
            idle: {
                frames: '7',
            },
        }
    })).animations
}
