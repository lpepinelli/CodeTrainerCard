import fs from 'fs'
import path from 'path'

import { achievements, tiers } from '../config/achievements';

type Achievement = { slug: string; tier: string };

const maxBadges = 3;

const iconsDir = path.join(__dirname, '..', 'assets', 'achievements');

const icons = new Map(fs.readdirSync(iconsDir).filter((file) => file.endsWith('.png')).map((file) => {
    const image = fs.readFileSync(path.join(iconsDir, file));
    return [path.basename(file, '.png'), `data:image/png;base64,${image.toString('base64')}`];
}));

const badgeTag = /<img[^>]*data-hovercard-type="achievement"[^>]*>/g;

// Skin-tone variants look like quickdraw-default--light-<hash>.png; they map to the default artwork
const badgeImage = /assets\/([a-z0-9-]+?)-(default|bronze|silver|gold)(?:--[a-z-]+)?-[0-9a-f]+\.png/;

const parseAchievements = (html: string): Achievement[] => {
    const found = new Map<string, string>();
    (html.match(badgeTag) || []).forEach((tag) => {
        const match = tag.match(badgeImage);
        if (match) found.set(match[1], match[2]);
    });
    return [...found].map(([slug, tier]) => ({ slug, tier }));
}

const rank = ({ slug, tier }: Achievement) => tiers.indexOf(tier) * achievements.length + achievements.indexOf(slug);

// Achievements aren't exposed by GitHub's API, so they're read from the public profile page.
// That page can change or block us at any time, so any failure just means an empty badge row
export const getBadgeIcons = async (login: string) => {
    try {
        const response = await fetch(`https://github.com/${encodeURIComponent(login)}?tab=achievements`, {
            headers: { 'User-Agent': 'developer-trainer-card' },
            signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) return [];

        return parseAchievements(await response.text())
            .filter((achievement) => icons.has(`${achievement.slug}-${achievement.tier}`))
            .sort((a, b) => rank(a) - rank(b))
            .slice(0, maxBadges)
            .map((achievement) => icons.get(`${achievement.slug}-${achievement.tier}`) as string);
    } catch (error) {
        console.error('Failed to load achievements', error);
        return [];
    }
}
