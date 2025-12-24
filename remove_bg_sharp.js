const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:/Users/jiteshvarade/.gemini/antigravity/brain/fa5fbc8e-7d0a-40f2-b9ec-613c85cdcac0/hummingbird_asset_1766568352059.png';
const outputPath = 'c:/Users/jiteshvarade/Desktop/CInfinite Projects/HealthApp/public/hummingbird.png';

async function removeBackground() {
    try {
        console.log('Processing image with sharp...');

        // 1. Load the original image
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // 2. Create a mask: identifying white pixels
        // specific approach: extract the white channel or use threshold
        // simple approach for "white background" is to flatten to white (if transparent) then invert and threshold?
        // No, simplest is:
        // Use `bandbool` or comparison but sharp doesn't have direct "replace color".

        // Alternative: Use raw buffer manipulation with sharp for speed and safety.
        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const channels = info.channels;
        const pixelCount = info.width * info.height;

        for (let i = 0; i < pixelCount; i++) {
            const r = data[i * channels + 0];
            const g = data[i * channels + 1];
            const b = data[i * channels + 2];

            // Check for near-white (checkerboard gray is around 204-255 depending on representation, 
            // but the user's screenshot showing gray box suggests the "transparency" pattern itself was burned in 
            // OR it's just a white background displayed on gray.
            // The original generation had a WHITE background per my prompt.
            // So any r,g,b > 240 should be transparent.

            if (r > 240 && g > 240 && b > 240) {
                data[i * channels + 3] = 0; // Set alpha to 0
            }
        }

        // 3. Save back
        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: channels
            }
        })
            .png()
            .toFile(outputPath);

        console.log('Successfully saved transparent version to', outputPath);

    } catch (err) {
        console.error('Error processing image:', err);
    }
}

removeBackground();
