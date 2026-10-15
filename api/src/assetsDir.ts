import path from 'path'

// Lives at the src root so __dirname is src/ under tsx and dist/ in the esbuild bundle, with assets/ next to it in both
export const assetsDir = path.join(__dirname, 'assets');
