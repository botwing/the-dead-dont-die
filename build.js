const esbuild = require('esbuild');
const kontra = require('esbuild-plugin-kontra');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'build',
  plugins: [
    kontra({
        gameObject: {
            acceleration: true,
            anchor: true,
            group: false,
            opacity: true,
            rotation: true,
            scale: true,
            ttl: true,
            velocity: true,
        },
        sprite: {
            animation: true,
            image: true,
        },
        text: {
            autoNewline: true,
            newline: false,
            rtl: true,
            textAlign: false,
        },
        tileEngine: {
            camera: false,
            dynamic: false,
            query: true,
            tiled: false,
        },
        vector: {
            angle: false,
            clamp: false,
            distance: false,
            dot: false,
            length: true,
            normalize: true,
            scale: false,
            subtract: false,
        }
    })
  ]
}).catch(() => process.exit(1));
