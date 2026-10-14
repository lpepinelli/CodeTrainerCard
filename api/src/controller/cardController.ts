import type { NextFunction, Request, Response } from "express"

import { getBadgeIcons } from '../services/achievements';
import { cacheFor } from '../services/cache';
import { getGithubProfile, GithubUserNotFoundError } from '../services/github';
import { pixelate as pixelateImage, pixelateAll } from '../services/pixelate';
import { pickSkillIcons } from '../services/skills';
import { avatarSize, badgeSize, renderCard, skillSize } from '../templates/card';

const hexColor = /^[0-9a-f]{6}$/i;

// The card builder re-requests the same user on every option change, so a warm Lambda keeps GitHub data briefly instead of refetching it
const githubCacheMs = 10 * 60 * 1000;
const loadProfile = cacheFor(githubCacheMs, getGithubProfile);
const loadBadgeIcons = cacheFor(githubCacheMs, getBadgeIcons);

const queryText = (value: unknown, fallback: string) => typeof value === 'string' && value ? value : fallback;

const isEnabled = (value: unknown) => value === '' || value === 'true';

const blocksAcrossAvatar = (value: unknown) => {
    if (isEnabled(value)) return 80;
    const size = Number(value);
    return Number.isInteger(size) && size >= 8 && size <= 128 ? size : undefined;
}

const frontSeconds = (value: unknown) => {
    if (isEnabled(value)) return 10;
    const seconds = Number(value);
    return Number.isInteger(seconds) && seconds >= 2 && seconds <= 60 ? seconds : undefined;
}

export const getCard = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const { color, name, role, pixelate, skills, shine, private: includePrivate } = req.query;

    try {
        const [profile, badgeIcons] = await Promise.all([loadProfile(username.toLowerCase()), loadBadgeIcons(username.toLowerCase())]);
        const skillIcons = pickSkillIcons(typeof skills === 'string' ? skills : undefined, profile.languages);

        const blocks = blocksAcrossAvatar(pixelate);
        // Icons get proportionally fewer pixels so their blocks are the same size as the avatar's
        const [avatar, badges, skillImages] = blocks
            ? await Promise.all([
                pixelateImage(profile.avatar, blocks),
                pixelateAll(badgeIcons, Math.round(blocks * badgeSize / avatarSize)),
                pixelateAll(skillIcons, Math.round(blocks * skillSize / avatarSize)),
            ])
            : [profile.avatar, badgeIcons, skillIcons];

        const card = renderCard({
            id: String(profile.id).slice(-5).padStart(5, '0'),
            login: profile.login,
            since: profile.createdAt.slice(0, 4),
            name: queryText(name, profile.name || profile.login),
            role: queryText(role, '-'),
            avatar,
            pixelated: blocks !== undefined,
            skills: skillImages,
            badges,
            followers: String(profile.followers),
            commits: String(profile.commits + (isEnabled(includePrivate) ? profile.privateContributions : 0)),
            pullRequests: String(profile.pullRequests),
            color: typeof color === 'string' && hexColor.test(color) ? color : 'BC93FF',
            shine: isEnabled(shine),
            flipSeconds: frontSeconds(req.query['auto-flip']),
        });

        // GitHub's image proxy honours this, which keeps README traffic from exhausting the API rate limit
        res.setHeader('Cache-Control', 'public, max-age=14400');
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(card);
    } catch (error) {
        if (error instanceof GithubUserNotFoundError) {
            res.status(404).send({ error: `GitHub user '${username}' not found` });
            return;
        }
        next(error);
    }
}
