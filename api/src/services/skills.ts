import fs from 'fs'
import path from 'path'

import { assetsDir } from '../assetsDir';
import { skills } from '../config/skills';

// Each icon is its own data URI document, so devicon's internal ids can't clash with the card's
const icons = new Map(Object.keys(skills).map((key) => {
    const svg = fs.readFileSync(path.join(assetsDir, 'skills', `${key}.svg`));
    return [key, `data:image/svg+xml;base64,${svg.toString('base64')}`];
}));

export const skillIcon = (key: string) => icons.get(key) as string;
