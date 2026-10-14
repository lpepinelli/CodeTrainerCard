import fs from 'fs'
import path from 'path'

import { skills } from '../config/skills';

const maxSkills = 4;

// Each icon is its own data URI document, so devicon's internal ids can't clash with the card's
const icons = new Map(Object.keys(skills).map((key) => {
    const svg = fs.readFileSync(path.join(__dirname, '..', 'assets', 'skills', `${key}.svg`));
    return [key, `data:image/svg+xml;base64,${svg.toString('base64')}`];
}));

const skillForLanguage = (language: string) => Object.keys(skills).find((key) => skills[key].includes(language));

export const pickSkillIcons = (requested: string | undefined, languages: string[]) => {
    const keys = requested
        ? requested.toLowerCase().split(',').map((key) => key.trim())
        : languages.map(skillForLanguage);

    return [...new Set(keys)]
        .filter((key): key is string => !!key && icons.has(key))
        .slice(0, maxSkills)
        .map((key) => icons.get(key) as string);
}
