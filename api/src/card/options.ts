export type RenderOptions = {
    name?: string;
    role?: string;
    color: string;
    skills?: string;
    pixelateBlocks?: number;
    shine: boolean;
    float: boolean;
    shadow: boolean;
    flipSeconds?: number;
    includePrivate: boolean;
    hideBadges: boolean;
}

const hexColor = /^[0-9a-f]{6}$/i;

const text = (value: unknown) => typeof value === 'string' && value ? value : undefined;

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

export const parseRenderOptions = (query: Record<string, unknown>): RenderOptions => ({
    name: text(query.name),
    role: text(query.role),
    color: typeof query.color === 'string' && hexColor.test(query.color) ? query.color : 'BC93FF',
    skills: text(query.skills),
    pixelateBlocks: blocksAcrossAvatar(query.pixelate),
    shine: isEnabled(query.shine),
    float: isEnabled(query.float),
    shadow: isEnabled(query.shadow),
    flipSeconds: frontSeconds(query['auto-flip']),
    includePrivate: isEnabled(query.private),
    hideBadges: isEnabled(query['hide-badges']),
});
