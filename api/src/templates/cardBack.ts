import { renderChrome } from './frame';
import type { Palette } from './palette';
import { circle, customShape, fill, outline } from './shapes';
import { escapeXml, format } from './text';

type BackData = {
	login: string;
	since: string;
}

const ink = '#4B4B4B';

const ballCenter = { x: 514.5, y: 265 };

const ball = circle(ballCenter.x, ballCenter.y, 150);
// 25 blocks across in pixel mode, odd like the ball's 75, so both centre on the same block and keep their exact size
const button = circle(ballCenter.x, ballCenter.y, 50);

const topHalf = customShape(
	(attrs) => `<path d="M364.5 265A150 150 0 0 1 664.5 265Z" ${attrs}/>`,
	(x, y) => y < 265 && ball.contains(x, y),
	{ x: 364.5, y: 115, w: 300, h: 150 },
	ballCenter,
);

const equator = customShape(
	(attrs) => `<rect x="364.5" y="255" width="300" height="20" ${attrs}/>`,
	(x, y) => Math.abs(y - ballCenter.y) < 10 && ball.contains(x, y),
	{ x: 364.5, y: 255, w: 300, h: 20 },
	ballCenter,
);

const glintAngle = 35 * Math.PI / 180;

const glint = customShape(
	(attrs) => `<ellipse cx="455" cy="185" rx="38" ry="20" transform="rotate(-35 455 185)" ${attrs}/>`,
	(x, y) => {
		const dx = x - 455;
		const dy = y - 185;
		const along = dx * Math.cos(glintAngle) - dy * Math.sin(glintAngle);
		const across = dx * Math.sin(glintAngle) + dy * Math.cos(glintAngle);
		return (along / 38) ** 2 + (across / 20) ** 2 <= 1;
	},
	{ x: 417, y: 147, w: 76, h: 76 },
	ballCenter,
);

// Spread apart so the tag still reads as code from a distance instead of blurring into one shape
const codeTag = ['&lt;', '/', '&gt;']
	.map((char, i) => `<text class="label" x="${ballCenter.x + (i - 1) * 18}" y="278" text-anchor="middle" fill="${ink}">${char}</text>`)
	.join('');

// A trainer ball with a code tag as its button, centred above the card title
export const devBall = (color: string, step?: number) => `
    ${fill(ball, 'fill="white"', step)}
    ${fill(topHalf, `fill="${color}"`, step)}
    ${fill(topHalf, 'fill="black" fill-opacity="0.12"', step)}
    ${fill(glint, 'fill="white" fill-opacity="0.45"', step)}
    ${fill(equator, `fill="${ink}"`, step)}
    ${outline(ball, 12, ink, step)}
    ${fill(button, 'fill="white"', step)}
    ${outline(button, 14, ink, step)}
    ${codeTag}`;

export const renderBack = (data: BackData, palette: Palette, step?: number) => `
    ${renderChrome(palette.base, palette.bar, step)}
    <g clip-path="url(#cardBody)">
        <rect x="35" y="35" width="959" height="616" fill="url(#innerStripes)" opacity="0.25"/>
    </g>
    ${devBall(palette.base, step)}
    <text class="title" x="514.5" y="500" text-anchor="middle" fill="white">CODE TRAINER CARD</text>
    <path d="M351.5 520H677.5" stroke="white" stroke-width="3"/>
    <text class="label" x="514.5" y="575" text-anchor="middle" fill="white">@${escapeXml(data.login)}</text>
    <text class="label" x="514.5" y="622" text-anchor="middle" fill="white" fill-opacity="0.8">TRAINER SINCE ${format(data.since, 4)}</text>`;
