import fs from 'fs'
import path from 'path'

import { assetsDir } from '../assetsDir';

export const font = `data:font/ttf;base64,${fs.readFileSync(path.join(assetsDir, 'fonts', 'pokemonFireRed.ttf')).toString('base64')}`;
