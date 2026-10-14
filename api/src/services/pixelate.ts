import sharp from 'sharp'

// Shrinks the image so each block becomes a single pixel; the card scales it back up with image-rendering: pixelated.
// This is what pixelit does on a canvas, done here because GitHub's own small avatars are blurry JPEGs and SVG filters render inconsistently in Chromium
export const pixelate = async (dataUri: string, size: number) => {
    const image = Buffer.from(dataUri.slice(dataUri.indexOf(',') + 1), 'base64');
    const pixels = await sharp(image).resize(size, size, { fit: 'cover' }).png().toBuffer();
    return `data:image/png;base64,${pixels.toString('base64')}`;
}

export const pixelateAll = (dataUris: string[], size: number) => Promise.all(dataUris.map((dataUri) => pixelate(dataUri, size)));
