import type { NextFunction, Request, Response } from "express"

import { getGithubProfile, GithubUserNotFoundError } from '../services/github';
import { renderCard } from '../templates/card';

const hexColor = /^[0-9a-f]{6}$/i;

const queryText = (value: unknown, fallback: string) => typeof value === 'string' && value ? value : fallback;

export const getCard = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const { color, name, role } = req.query;

    try {
        const profile = await getGithubProfile(username);

        const card = renderCard({
            id: String(profile.id).slice(-5).padStart(5, '0'),
            name: queryText(name, profile.name || profile.login),
            role: queryText(role, '-'),
            avatar: profile.avatar,
            followers: String(profile.followers),
            commits: String(profile.commits),
            pullRequests: String(profile.pullRequests),
            color: typeof color === 'string' && hexColor.test(color) ? color : 'BC93FF',
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
