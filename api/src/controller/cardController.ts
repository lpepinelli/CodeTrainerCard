import type { Request, Response } from "express"

import { renderCard } from '../templates/card';

const hexColor = /^[0-9a-f]{6}$/i;

const queryText = (value: unknown, fallback: string) => typeof value === 'string' && value ? value : fallback;

export const getCard = (req: Request, res: Response) => {
    const { username } = req.params;
    const { color, id, name, role, followers, commits, prs } = req.query;

    const card = renderCard({
        id: queryText(id, '00000'),
        name: queryText(name, username),
        role: queryText(role, '-'),
        followers: queryText(followers, '0'),
        commits: queryText(commits, '0'),
        pullRequests: queryText(prs, '0'),
        color: typeof color === 'string' && hexColor.test(color) ? color : 'BC93FF',
    });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(card);
}
