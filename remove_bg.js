const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'C:/Users/jiteshvarade/.gemini/antigravity/brain/fa5fbc8e-7d0a-40f2-b9ec-613c85cdcac0/hummingbird_asset_1766568352059.png';
const outputPath = 'c:/Users/jiteshvarade/Desktop/CInfinite Projects/HealthApp/public/hummingbird.png';

fs.createReadStream(inputPath)
    .pipe(new PNG())
    .on('parsed', function () {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let idx = (this.width * y + x) << 2;

                let r = this.data[idx];
                let g = this.data[idx + 1];
                let b = this.data[idx + 2];

                // Check if pixel is near white (tolerance 10)
                if (r > 240 && g > 240 && b > 240) {
                    this.data[idx + 3] = 0; // Set alpha to 0
                }
            }
        }

        this.pack().pipe(fs.createWriteStream(outputPath))
            .on('finish', () => console.log('Image processed and saved to', outputPath));
    });
