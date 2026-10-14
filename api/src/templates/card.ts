import fs from 'fs'
import path from 'path'

import { renderBack } from './cardBack';
import { flipStyles, motionStyles, shine, shineDefs, shineStyles } from './effects';
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

const shadowText = (x: number, y: number, content: string, anchor = 'start') => `
    <text x="${x + 2}" y="${y + 3}" text-anchor="${anchor}" fill="#D0D0C8">${content}</text>
    <text x="${x}" y="${y}" text-anchor="${anchor}" fill="#4B4B4B">${content}</text>`;

const bullet = (y: number) => `<circle cx="81" cy="${y - 13}" r="12" fill="#E3D4FF" stroke="#B994F7" stroke-width="5"/>`;

const statRow = (y: number, label: string, value: string) => `
    ${bullet(y)}
    ${shadowText(110, y, label)}
    ${shadowText(607, y, format(value, 12), 'end')}`;

export const avatarSize = 247;
export const iconSize = 56;

const badgeSlots = [165, 265, 365];
const skillSlots = [591, 691, 791, 891];

const slot = (x: number) => `<rect x="${x}" y="536" width="80" height="80" rx="10" fill="white" fill-opacity="0.15" stroke="white" stroke-opacity="0.8" stroke-width="3"/>`;

const slotIcons = (slots: number[], icons: string[]) => icons.slice(0, slots.length)
    .map((icon, index) => `<image href="${icon}" x="${slots[index] + 12}" y="548" width="${iconSize}" height="${iconSize}"/>`)
    .join('\n        ');

export const renderCard = (data: CardData) => `<svg width="1029" height="686" viewBox="0 0 1029 686" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <clipPath id="cardBody">
            <rect x="35" y="35" width="959" height="616" rx="26"/>
        </clipPath>
        <clipPath id="avatar">
            <circle cx="823.5" cy="348.5" r="123.5"/>
        </clipPath>${data.shine ? shineDefs : ''}
    </defs>

    <g class="flip">
        ${renderFront(data)}${data.flipSeconds ? `
        <g class="back">${renderBack(data)}
        </g>` : ''}${data.shine ? shine : ''}
    </g>
</svg>
`

const renderFront = (data: CardData) => `

    <rect width="1029" height="686" rx="41" fill="#${data.color}"/>
    <rect width="1029" height="686" rx="41" fill="url(#outerStripes)"/>

    <rect x="31" y="31" width="967" height="624" rx="30" fill="#E3EAEA" stroke="#5F5C6E" stroke-width="8"/>
    <g clip-path="url(#cardBody)">
        <rect x="35" y="35" width="959" height="616" fill="url(#innerStripes)"/>
        <path d="M658 491A330 330 0 0 1 988 161V298A193 193 0 0 0 795 491Z" fill="#CDB8F7"/>
        <path d="M862 491A126 126 0 0 1 988 365V491Z" fill="#CDB8F7"/>
        <rect x="35" y="62" width="959" height="80" fill="#8B63CC" fill-opacity="0.75"/>
        <rect x="35" y="524" width="959" height="100" fill="#8B63CC" fill-opacity="0.75"/>
    </g>

    <path d="M58 78H488M57 128H487" stroke="white" stroke-width="3"/>
    <text class="title" x="58" y="117" fill="white">DEVELOPER TRAINER CARD</text>
    <rect x="591" y="70" width="369" height="64" rx="8" fill="#F0F0F0"/>
    <text class="id" x="775" y="122" text-anchor="middle" fill="#4B4B4B">IDNo.${format(data.id, 6)}</text>

    ${bullet(223)}
    ${shadowText(110, 223, `NAME: ${format(data.name, 18)}`)}
    <path d="M110 240H650" stroke="#ABABAB" stroke-width="5"/>

    ${statRow(316, 'ROLE', data.role)}
    ${statRow(374, 'FOLLOWERS', data.followers)}
    ${statRow(432, 'COMMITS', data.commits)}
    ${statRow(490, 'PULL-REQUESTS', data.pullRequests)}

    <circle cx="823.5" cy="348.5" r="123.5" fill="#333333"/>

    <path d="M38 572H991M38 594H991" stroke="#8F72C3" stroke-opacity="0.7" stroke-width="4"/>
    <path d="M38 583H991" stroke="#8F72C3" stroke-opacity="0.7" stroke-width="9"/>
    <text class="label" x="51" y="557" fill="white">BADGES</text>
    ${badgeSlots.map(slot).join('\n    ')}
    <path d="M479 521V621" stroke="white" stroke-width="5"/>
    <text class="label" x="494" y="557" fill="white">SKILLS</text>
    ${skillSlots.map(slot).join('\n    ')}

    <g${data.pixelated ? ' style="image-rendering: pixelated"' : ''}>
        <image href="${data.avatar}" x="700" y="225" width="${avatarSize}" height="${avatarSize}" clip-path="url(#avatar)" preserveAspectRatio="xMidYMid slice"/>
        ${slotIcons(badgeSlots, data.badges)}
        ${slotIcons(skillSlots, data.skills)}
    </g>`;
