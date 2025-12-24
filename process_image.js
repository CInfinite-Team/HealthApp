const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = 'C:/Users/jiteshvarade/.gemini/antigravity/brain/fa5fbc8e-7d0a-40f2-b9ec-613c85cdcac0/hummingbird_asset_1766568352059.png';
const outputPath = 'c:/Users/jiteshvarade/Desktop/CInfinite Projects/HealthApp/public/hummingbird.png';

async function processImage() {
    try {
        console.log('Processing image...');

        // Create a new sharp instance
        await sharp(inputPath)
            .ensureAlpha() // Ensure alpha channel exists
            .flatten({ background: { r: 255, g: 255, b: 255 } }) // Flatten to ensure white background is consistent if needed
            .threshold(250, { grayscale: false }) // This might be too aggressive, let's try a different approach for white removal
            // Better approach for white background removal
            .toBuffer()
            .then(data => {
                return sharp(data)
                    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    // Use a simple boolean operation to make near-white pixels transparent?
                    // Sharp doesn't have a direct "make color transparent" with tolerance easily in one step without complex composite.
                    // Let's try a simpler approach: treating white as transparent.
                    // Since sharp is tricky for specific color-to-alpha without exact match, 
                    // maybe we can just copy the file for now and accept the square if the user LOVED the first one, 
                    // BUT they complained about the square.
                    // Actually, let's try to use the `level` or `modulate`? No.
                    // Let's use a composite approach.

                    // Re-strategy: The user wants "the one you created first time".
                    // That one had a white background.
                    // If I can't perfectly remove the background with sharp quickly, 
                    // I should revert to the PNG and maybe try CSS `mix-blend-mode: multiply` on the frontend?
                    // No, that makes the bird translucent.

                    // Let's simply copy it back first, and try to use a specialized "rembg" tool if sharp is too hard?
                    // Or just try to use sharp to replace white {r:255, g:255, b:255} with alpha.
                    // Sharp doesn't support color-to-alpha easily.
                    // Let's try to use a simple pixel manipulation loop since the image is small.

                    // Falling back to copying the file first so at least the visual is restored, then I will try to generate a transparent one again using the EXACT seed if possible? No seed info.

                    // Let's write a raw pixel script.

                    .png()
                    .toFile(outputPath);
            });

        console.log('Image processing logic incomplete with just Sharp for simple color replacement. Switching to standard pixel loop.');
    } catch (error) {
        console.error('Error:', error);
    }
}

// processImage();
