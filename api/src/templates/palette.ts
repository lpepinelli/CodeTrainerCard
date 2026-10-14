export type Palette = {
    base: string;
    bar: string;
    stripe: string;
    arc: string;
    bulletLine: string;
    bulletFill: string;
}

type Hsl = { h: number; s: number; l: number };

// Saturation multiplier and lightness offset for each shade, measured from the original hand-picked purples
// so the default BC93FF keeps its look and any other color gets matching shades
const shades: Record<Exclude<keyof Palette, 'base'>, [number, number]> = {
    bar: [0.507, -19.4],
    stripe: [0.403, -18.2],
    arc: [0.797, 5.7],
    bulletLine: [0.861, -1.3],
    bulletFill: [1, 12.8],
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const toHsl = (hex: string): Hsl => {
    const [r, g, b] = [0, 2, 4].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const delta = max - min;
    if (!delta) return { h: 0, s: 0, l: l * 100 };

    const s = delta / (1 - Math.abs(2 * l - 1));
    const h = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
    return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

const toHex = ({ h, s, l }: Hsl) => {
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    const channel = (n: number) => {
        const k = (n + h / 30) % 12;
        const value = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return Math.round(value * 255).toString(16).padStart(2, '0');
    };
    return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}

export const cardPalette = (color: string): Palette => {
    const base = toHsl(color);
    const shade = ([saturation, lightness]: [number, number]) =>
        toHex({ h: base.h, s: clamp(base.s * saturation), l: clamp(base.l + lightness) });

    return {
        base: `#${color.toUpperCase()}`,
        bar: shade(shades.bar),
        stripe: shade(shades.stripe),
        arc: shade(shades.arc),
        bulletLine: shade(shades.bulletLine),
        bulletFill: shade(shades.bulletFill),
    };
}
