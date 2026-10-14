import fs from 'fs'
import path from 'path'

export const font = `data:font/ttf;base64,${fs.readFileSync(path.join(__dirname, '..', 'assets', 'fonts', 'pokemonFireRed.ttf')).toString('base64')}`;
