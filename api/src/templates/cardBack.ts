import { renderChrome } from './frame';
import { circle, customShape, fill, outline } from './shapes';
import { escapeXml, format } from './text';

type BackData = {
    login: string;
    since: string;
    color: string;
}

const ink = '#4B4B4B';

const ball = circle(514.5, 265, 150);
const button = circle(514.5, 265, 52);

const topHalf = customShape(
    (attrs) => `<path d="M364.5 265A150 150 0 0 1 664.5 265Z" ${attrs}/>`,
    (x, y) => y < 265 && ball.contains(x, y),
    { x: 364.5, y: 115, w: 300, h: 150 },
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
);

// A trainer ball with a code tag as its button, centred above the card title
const devBall = (color: string, step?: number) => `
    ${fill(ball, 'fill="white"', step)}
    ${fill(topHalf, `fill="#${color}"`, step)}
    ${fill(topHalf, 'fill="black" fill-opacity="0.12"', step)}
    ${fill(glint, 'fill="white" fill-opacity="0.45"', step)}
    <path d="M364.5 265H664.5" stroke="${ink}" stroke-width="20"/>
    ${outline(ball, 12, ink, step)}
    ${fill(button, 'fill="white"', step)}
    ${outline(button, 14, ink, step)}
    <text class="label" x="514.5" y="278" text-anchor="middle" fill="${ink}">&lt;/&gt;</text>`;

export const renderBack = (data: BackData, step?: number) => `
    ${renderChrome(data.color, '#8B63CC', step)}
    <g clip-path="url(#cardBody)">
        <rect x="35" y="35" width="959" height="616" fill="url(#innerStripes)" opacity="0.25"/>
    </g>
    ${devBall(data.color, step)}
    <text class="title" x="514.5" y="500" text-anchor="middle" fill="white">DEVELOPER TRAINER CARD</text>
    <path d="M300 520H729" stroke="white" stroke-width="3"/>
    <text class="label" x="514.5" y="575" text-anchor="middle" fill="white">@${escapeXml(data.login)}</text>
    <text class="label" x="514.5" y="622" text-anchor="middle" fill="white" fill-opacity="0.8">TRAINER SINCE ${format(data.since, 4)}</text>`;
