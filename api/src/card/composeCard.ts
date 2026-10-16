import { skills } from '../config/skills';
import { avatarSize, badgeSize, maxSkills, renderCard, skillSize } from '../templates/card';
import { parseRenderOptions } from './options';

// Everything the card needs from GitHub, also served as JSON so the web app can render previews itself
export type CardSource = {
    id: number;
    login: string;
    name: string | null;
    createdAt: string;
    avatar: string;
    followers: number;
    commits: number;
    privateContributions: number;
    pullRequests: number;
    languages: string[];
    badges: string[];
}

// What differs between the API (fs, sharp) and the browser (bundled assets, canvas)
export type CardRuntime = {
    font: string;
    skillIcon: (key: string) => string | Promise<string>;
    pixelate: (image: string, size: number) => Promise<string>;
}

const skillForLanguage = (language: string) => Object.keys(skills).find((key) => skills[key].includes(language));

const pickSkills = (requested: string | undefined, languages: string[], limit: number) => {
    const keys = requested
        ? requested.toLowerCase().split(',').map((key) => key.trim())
        : languages.map(skillForLanguage);

    return [...new Set(keys)]
        .filter((key): key is string => !!key && key in skills)
        .slice(0, limit);
}

export const composeCard = async (source: CardSource, query: Record<string, unknown>, runtime: CardRuntime) => {
    const options = parseRenderOptions(query);
    const skillIcons = await Promise.all(pickSkills(options.skills, source.languages, maxSkills(options.hideBadges)).map(runtime.skillIcon));
    const badgeIcons = options.hideBadges ? [] : source.badges;

    const blocks = options.pixelateBlocks;
    // Icons get proportionally fewer pixels so their blocks are the same size as the avatar's
    const scaled = (size: number) => Math.round((blocks || 0) * size / avatarSize);
    const [avatar, badges, skillImages] = blocks
        ? await Promise.all([
            runtime.pixelate(source.avatar, blocks),
            Promise.all(badgeIcons.map((badge) => runtime.pixelate(badge, scaled(badgeSize)))),
            Promise.all(skillIcons.map((icon) => runtime.pixelate(icon, scaled(skillSize)))),
        ])
        : [source.avatar, badgeIcons, skillIcons];

    return renderCard({
        id: String(source.id).slice(-5).padStart(5, '0'),
        login: source.login,
        since: source.createdAt.slice(0, 4),
        name: options.name || source.name || source.login,
        role: options.role || '-',
        avatar,
        pixelBlocks: blocks,
        skills: skillImages,
        badges,
        followers: String(source.followers),
        commits: String(source.commits + (options.includePrivate ? source.privateContributions : 0)),
        pullRequests: String(source.pullRequests),
        color: options.color,
        shine: options.shine,
        float: options.float,
        floatShadow: options.shadow,
        flipSeconds: options.flipSeconds,
        hideBadges: options.hideBadges,
    }, runtime.font);
}
