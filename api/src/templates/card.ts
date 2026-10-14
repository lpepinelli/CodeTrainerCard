import fs from 'fs'
import path from 'path'

import { renderBack } from './cardBack';
import { flipStyles, motionStyles, shine, shineDefs, shineStyles } from './effects';
import { cardBodyClip, renderChrome } from './frame';
import { circle, customShape, fill, outline, roundRect } from './shapes';
import { format } from './text';

export type CardData = {
    id: string;
    login: string;
    since: string;
    name: string;
    role: string;
    avatar: string;
    pixelated: boolean;
    skills: string[];
    badges: string[];
    followers: string;
    commits: string;
    pullRequests: string;
    color: string;
    shine: boolean;
    flipSeconds?: number;
}

// The card is served through <img> (e.g. GitHub's camo proxy), which blocks external resources, so the font must be inlined
const font = fs.readFileSync(path.join(__dirname, '..', 'assets', 'fonts', 'pokemonFireRed.ttf')).toString('base64');

// Block size, in card units, of the stepped edges drawn when the card is pixelated
const pixelStep = 4;

const shadowText = (x: number, y: number, content: string, anchor = 'start') => `
    <text x="${x + 2}" y="${y + 3}" text-anchor="${anchor}" fill="#D0D0C8">${content}</text>
    <text x="${x}" y="${y}" text-anchor="${anchor}" fill="#4B4B4B">${content}</text>`;

const bullet = (y: number, step?: number) => {
    const dot = circle(81, y - 13, 12);
    return `${fill(dot, 'fill="#E3D4FF"', step)}
    ${outline(dot, 5, '#B994F7', step)}`;
}

const statRow = (y: number, label: string, value: string, step?: number, maxLength = 12) => `
    ${bullet(y, step)}
    ${shadowText(110, y, label)}
    ${shadowText(607, y, format(value, maxLength), 'end')}`;

export const avatarSize = 247;
export const skillSize = 56;
export const badgeSize = 68;

const avatarShape = circle(823.5, 348.5, 123.5);

const idBox = roundRect(591, 70, 369, 64, 8);

// Two quarter rings centred on (988, 491), behind the avatar
const avatarArcs = customShape(
    (attrs) => `<path d="M658 491A330 330 0 0 1 988 161V298A193 193 0 0 0 795 491ZM862 491A126 126 0 0 1 988 365V491Z" ${attrs}/>`,
    (x, y) => {
        if (x > 988 || y > 491) return false;
        const distance = Math.hypot(x - 988, y - 491);
        return (distance >= 193 && distance <= 330) || distance <= 126;
    },
    { x: 658, y: 161, w: 330, h: 330 },
);

const badgeSlots = [165, 265, 365];
const skillSlots = [591, 691, 791, 891];

const slot = (x: number, step?: number) => {
    const box = roundRect(x, 536, 80, 80, 10);
    return `${fill(box, 'fill="#F0F0F0"', step)}
    ${outline(box, 3, 'white', step, 0.8)}`;
}

// Icons are centred in the 80-unit slots that start at y=536
const slotIcons = (slots: number[], icons: string[], size: number) => icons.slice(0, slots.length)
    .map((icon, index) => `<image href="${icon}" x="${slots[index] + (80 - size) / 2}" y="${536 + (80 - size) / 2}" width="${size}" height="${size}"/>`)
    .join('\n        ');

export const renderCard = (data: CardData) => {
    const step = data.pixelated ? pixelStep : undefined;
    return `<svg width="1029" height="686" viewBox="0 0 1029 686" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <style>
            @font-face { font-family: 'PokemonFireRed'; src: url(data:font/ttf;base64,${font}) format('truetype'); }
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
            ${fill(avatarShape, '', step)}
        </clipPath>${data.shine ? shineDefs(step) : ''}
    </defs>

    <g class="flip">
        ${renderFront(data, step)}${data.flipSeconds ? `
        <g class="back">${renderBack(data, step)}
        </g>` : ''}${data.shine ? shine : ''}
    </g>
</svg>
`;
}

const renderFront = (data: CardData, step?: number) => `
    ${renderChrome(data.color, '#E3EAEA', step)}
    <g clip-path="url(#cardBody)">
        <rect x="35" y="35" width="959" height="616" fill="url(#innerStripes)"/>
        ${fill(avatarArcs, 'fill="#CDB8F7"', step)}
        <rect x="35" y="62" width="959" height="80" fill="#8B63CC" fill-opacity="0.75"/>
        <rect x="35" y="524" width="959" height="100" fill="#8B63CC" fill-opacity="0.75"/>
    </g>

    <path d="M58 78H488M57 128H487" stroke="white" stroke-width="3"/>
    <text class="title" x="58" y="117" fill="white">DEVELOPER TRAINER CARD</text>
    ${fill(idBox, 'fill="#F0F0F0"', step)}
    <text class="id" x="775" y="122" text-anchor="middle" fill="#4B4B4B">IDNo.${format(data.id, 6)}</text>

    ${bullet(223, step)}
    ${shadowText(110, 223, `NAME: ${format(data.name, 18)}`)}
    <path d="M110 240H650" stroke="#ABABAB" stroke-width="5"/>

    ${statRow(316, 'ROLE', data.role, step, 15)}
    ${statRow(374, 'FOLLOWERS', data.followers, step)}
    ${statRow(432, 'COMMITS', data.commits, step)}
    ${statRow(490, 'PULL-REQUESTS', data.pullRequests, step)}

    ${fill(avatarShape, 'fill="#333333"', step)}

    <path d="M38 572H991M38 594H991" stroke="#8F72C3" stroke-opacity="0.7" stroke-width="4"/>
    <path d="M38 583H991" stroke="#8F72C3" stroke-opacity="0.7" stroke-width="9"/>
    <text class="label" x="51" y="557" fill="white">BADGES</text>
    ${badgeSlots.map((x) => slot(x, step)).join('\n    ')}
    <path d="M479 521V621" stroke="white" stroke-width="5"/>
    <text class="label" x="494" y="557" fill="white">SKILLS</text>
    ${skillSlots.map((x) => slot(x, step)).join('\n    ')}

    <g${data.pixelated ? ' style="image-rendering: pixelated"' : ''}>
        <image href="${data.avatar}" x="700" y="225" width="${avatarSize}" height="${avatarSize}" clip-path="url(#avatar)" preserveAspectRatio="xMidYMid slice"/>
        ${slotIcons(badgeSlots, data.badges, badgeSize)}
        ${slotIcons(skillSlots, data.skills, skillSize)}
    </g>`;
