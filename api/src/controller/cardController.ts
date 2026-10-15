import type { NextFunction, Request, Response } from "express"

import { composeCard } from '../card/composeCard';
import type { CardSource } from '../card/composeCard';
import { getBadgeIcons } from '../services/achievements';
import { cacheFor } from '../services/cache';
import { font } from '../services/font';
import { getGithubProfile, GithubUserNotFoundError } from '../services/github';
import { pixelate } from '../services/pixelate';
import { skillIcon } from '../services/skills';

// The card builder re-requests the same user on every option change, so a warm Lambda keeps GitHub data briefly instead of refetching it
const githubCacheMs = 10 * 60 * 1000;
const loadProfile = cacheFor(githubCacheMs, getGithubProfile);
const loadBadgeIcons = cacheFor(githubCacheMs, getBadgeIcons);

const loadSource = async (username: string): Promise<CardSource> => {
    const login = username.toLowerCase();
    const [profile, badges] = await Promise.all([loadProfile(login), loadBadgeIcons(login)]);
    return { ...profile, badges };
}

// CloudFront caches cards for 4 hours, so these show who uses the card, not how often it is viewed
const logUsage = (usage: 'card' | 'builder', username: string) => {
    console.log(JSON.stringify({ usage, username: username.toLowerCase() }));
}

const sendError = (error: unknown, username: string, res: Response, next: NextFunction) => {
    if (error instanceof GithubUserNotFoundError) {
        res.status(404).send({ error: `GitHub user '${username}' not found` });
        return;
    }
    next(error);
}

export const getCard = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    try {
        const card = await composeCard(await loadSource(username), req.query, { font, skillIcon, pixelate });

        // GitHub's image proxy honours this, which keeps README traffic from exhausting the API rate limit
        res.setHeader('Cache-Control', 'public, max-age=14400');
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(card);
        logUsage('card', username);
    } catch (error) {
        sendError(error, username, res, next);
    }
}

// Lets the web app render previews itself, fetching GitHub data once per username instead of once per option change
export const getCardSource = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    try {
        res.setHeader('Cache-Control', 'public, max-age=600');
        res.send(await loadSource(username));
        logUsage('builder', username);
    } catch (error) {
        sendError(error, username, res, next);
    }
}
