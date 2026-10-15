import { renderBack } from './cardBack';
import { flipStyles, motionStyles, shine, shineDefs, shineStyles } from './effects';
import { cardBodyClip, renderChrome } from './frame';
import { cardPalette } from './palette';
import type { Palette } from './palette';
import { circle, customShape, fill, fillOnImageGrid, outline, outlineOutside, roundRect } from './shapes';
import { format } from './text';

export type CardData = {
    id: string;
    login: string;
    since: string;
    name: string;
    role: string;
    avatar: string;
    // Blocks across the avatar when the card is pixelated
    pixelBlocks?: number;
    skills: string[];
    badges: string[];
    followers: string;
    commits: string;
    pullRequests: string;
    color: string;
    shine: boolean;
    hideBadges: boolean;
    flipSeconds?: number;
}

// Block size, in card units, of the stepped edges drawn when the card is pixelated
const pixelStep = 4;

const shadowText = (x: number, y: number, content: string, anchor = 'start') => `
    <text x="${x + 2}" y="${y + 3}" text-anchor="${anchor}" fill="#D0D0C8">${content}</text>
    <text x="${x}" y="${y}" text-anchor="${anchor}" fill="#4B4B4B">${content}</text>`;

const bullet = (y: number, palette: Palette, step?: number) => {
    const dot = circle(81, y - 13, 12);
    return `${fill(dot, `fill="${palette.bulletFill}"`, step)}
    ${outlineOutside(dot, 4, palette.bulletLine, step)}`;
}

const statRow = (y: number, label: string, value: string, palette: Palette, step?: number, maxLength = 12) => `
    ${bullet(y, palette, step)}
    ${shadowText(110, y, label)}
    ${shadowText(607, y, format(value, maxLength), 'end')}`;

export const avatarSize = 247;
export const skillSize = 56;
export const badgeSize = 68;

const avatarShape = circle(823.5, 348.5, 123.5);

// A pixelated avatar's circle is drawn on the photo's own pixel grid, so its rim steps along the photo's pixels
const avatarFill = (attrs: string, blocks?: number) =>
    blocks ? fillOnImageGrid(avatarShape, attrs, avatarShape.bounds, blocks) : avatarShape.svg(attrs);

const idBox = roundRect(591, 70, 369, 64, 8);

// Two quarter rings behind the avatar, centred on the frame's inner edge so they run into its outline
const arcsCenter = { x: 994, y: 491 };

const avatarArcs = customShape(
    (attrs) => `<path d="M${arcsCenter.x - 330} 491A330 330 0 0 1 ${arcsCenter.x} 161V298A193 193 0 0 0 ${arcsCenter.x - 193} 491ZM${arcsCenter.x - 126} 491A126 126 0 0 1 ${arcsCenter.x} 365V491Z" ${attrs}/>`,
    (x, y) => {
        if (x > arcsCenter.x || y > arcsCenter.y) return false;
        const distance = Math.hypot(x - arcsCenter.x, y - arcsCenter.y);
        return (distance >= 193 && distance <= 330) || distance <= 126;
    },
    { x: arcsCenter.x - 330, y: 161, w: 330, h: 330 },
    arcsCenter,
);

const badgeSlots = [165, 265, 365];
const skillSlots = [591, 691, 791, 891];
// Without badges the skills take the whole row, keeping the same right edge
const wideSkillSlots = [191, 291, 391, 491, 591, 691, 791, 891];

export const maxSkills = (hideBadges: boolean) => (hideBadges ? wideSkillSlots : skillSlots).length;

const slot = (x: number, step?: number) => {
    const box = roundRect(x, 536, 80, 80, 10);
    return `${fill(box, 'fill="#F0F0F0"', step)}
    ${outline(box, 3, 'white', step, 0.8)}`;
}

const slotIcons = (slots: number[], icons: string[], size: number) => icons.slice(0, slots.length)
    .map((icon, index) => `<image href="${icon}" x="${slots[index] + (80 - size) / 2}" y="${536 + (80 - size) / 2}" width="${size}" height="${size}"/>`)
    .join('\n        ');

const renderBadgesAndSkills = (step?: number) => `
    <text class="label" x="51" y="557" fill="white">BADGES</text>
    ${badgeSlots.map((x) => slot(x, step)).join('\n    ')}
    <path d="M479 521V621" stroke="white" stroke-width="5"/>
    <text class="label" x="494" y="557" fill="white">SKILLS</text>
    ${skillSlots.map((x) => slot(x, step)).join('\n    ')}`;

const renderSkillsOnly = (step?: number) => `
    <text class="label" x="51" y="557" fill="white">SKILLS</text>
    ${wideSkillSlots.map((x) => slot(x, step)).join('\n    ')}`;

// The card is shown through <img> (e.g. GitHub's camo proxy), which blocks external resources, so the font comes in as a data URI
export const renderCard = (data: CardData, font: string) => {
    const step = data.pixelBlocks ? pixelStep : undefined;
    const palette = cardPalette(data.color);
    return `<svg width="1029" height="686" viewBox="0 0 1029 686" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <style>
            @font-face { font-family: 'PokemonFireRed'; src: url(${font}) format('truetype'); }
            text { font-family: 'PokemonFireRed', monospace; font-size: 64px; }
            .title { font-size: 55px; }
            .label { font-size: 40px; }
            .id { font-size: 65px; }${data.flipSeconds ? flipStyles(data.flipSeconds) : ''}${data.shine ? shineStyles : ''}${motionStyles}
        </style>
        <pattern id="outerStripes" width="1029" height="18.6" patternUnits="userSpaceOnUse">
            <rect width="1029" height="5" fill="#F8F8F8" fill-opacity="0.4"/>
        </pattern>
        <pattern id="innerStripes" y="2" width="951" height="12" patternUnits="userSpaceOnUse">
            <rect width="951" height="5" fill="white" fill-opacity="0.5"/>
        </pattern>
        ${cardBodyClip(step)}
        <clipPath id="avatar">
            ${avatarFill('', data.pixelBlocks)}
        </clipPath>${data.shine ? shineDefs(step) : ''}
    </defs>

    <g class="flip">
        ${renderFront(data, palette, step)}${data.flipSeconds ? `
        <g class="back">${renderBack(data, palette, step)}
        </g>` : ''}${data.shine ? shine : ''}
    </g>
</svg>
`;
}

const renderFront = (data: CardData, palette: Palette, step?: number) => `
    ${renderChrome(palette.base, '#E3EAEA', step)}
    <g clip-path="url(#cardBody)">
        <rect x="35" y="35" width="959" height="616" fill="url(#innerStripes)"/>
        ${fill(avatarArcs, `fill="${palette.arc}"`, step)}
        <rect x="35" y="62" width="959" height="80" fill="${palette.bar}" fill-opacity="0.75"/>
        <rect x="35" y="524" width="959" height="100" fill="${palette.bar}" fill-opacity="0.75"/>
    </g>

    <path d="M58 78H385M57 128H384" stroke="white" stroke-width="3"/>
    <text class="title" x="58" y="117" fill="white">CODE TRAINER CARD</text>
    ${fill(idBox, 'fill="#F0F0F0"', step)}
    <text class="id" x="775" y="122" text-anchor="middle" fill="#4B4B4B">IDNo.${format(data.id, 6)}</text>

    ${bullet(223, palette, step)}
    ${shadowText(110, 223, `NAME: ${format(data.name, 18)}`)}
    <path d="M110 240H650" stroke="#ABABAB" stroke-width="5"/>

    ${statRow(316, 'ROLE', data.role, palette, step, 15)}
    ${statRow(374, 'FOLLOWERS', data.followers, palette, step)}
    ${statRow(432, 'COMMITS', data.commits, palette, step)}
    ${statRow(490, 'PULL-REQUESTS', data.pullRequests, palette, step)}

    ${avatarFill('fill="#333333"', data.pixelBlocks)}

    <path d="M38 572H991M38 594H991" stroke="${palette.stripe}" stroke-opacity="0.7" stroke-width="4"/>
    <path d="M38 583H991" stroke="${palette.stripe}" stroke-opacity="0.7" stroke-width="9"/>
    ${data.hideBadges ? renderSkillsOnly(step) : renderBadgesAndSkills(step)}

    <g${data.pixelBlocks ? ' style="image-rendering: pixelated"' : ''}>
        <image href="${data.avatar}" x="700" y="225" width="${avatarSize}" height="${avatarSize}" clip-path="url(#avatar)" preserveAspectRatio="xMidYMid slice"/>
        ${data.hideBadges ? '' : slotIcons(badgeSlots, data.badges, badgeSize)}
        ${slotIcons(data.hideBadges ? wideSkillSlots : skillSlots, data.skills, skillSize)}
    </g>`;
