import { Sprite, SpriteSheet, imageAssets } from "../../node_modules/kontra/kontra.mjs";

export function getHeartIcon() {
    return Sprite ({
        x: 15,
        y: 15,
    
        width: 30,
        height: 26,
    
        animations: getHeartAnimations()
    })
}

function getHeartAnimations()
{
    return (SpriteSheet({
        image: imageAssets['sprites'],
        frameWidth: 15,
        frameHeight: 13,

        animations: {
            idle: {
                frames: '8',
            },
        }
    })).animations
}
