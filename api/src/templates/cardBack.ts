import { escapeXml, format } from './text';

type BackData = {
    login: string;
    since: string;
    color: string;
}

const ink = '#4B4B4B';

// A trainer ball with a code tag as its button, centred above the card title
const devBall = (color: string) => `
    <circle cx="514.5" cy="265" r="150" fill="white"/>
    <path d="M364.5 265A150 150 0 0 1 664.5 265Z" fill="#${color}"/>
    <path d="M364.5 265A150 150 0 0 1 664.5 265Z" fill="black" fill-opacity="0.12"/>
    <ellipse cx="455" cy="185" rx="38" ry="20" transform="rotate(-35 455 185)" fill="white" fill-opacity="0.45"/>
    <path d="M364.5 265H664.5" stroke="${ink}" stroke-width="20"/>
    <circle cx="514.5" cy="265" r="150" stroke="${ink}" stroke-width="12"/>
    <circle cx="514.5" cy="265" r="52" fill="white" stroke="${ink}" stroke-width="14"/>
    <text class="label" x="514.5" y="278" text-anchor="middle" fill="${ink}">&lt;/&gt;</text>`;

export const renderBack = (data: BackData) => `
    <rect width="1029" height="686" rx="41" fill="#${data.color}"/>
    <rect width="1029" height="686" rx="41" fill="url(#outerStripes)"/>
    <rect x="31" y="31" width="967" height="624" rx="30" fill="#8B63CC" stroke="#5F5C6E" stroke-width="8"/>
    <g clip-path="url(#cardBody)">
        <rect x="35" y="35" width="959" height="616" fill="url(#innerStripes)" opacity="0.25"/>
    </g>
    ${devBall(data.color)}
    <text class="title" x="514.5" y="500" text-anchor="middle" fill="white">DEVELOPER TRAINER CARD</text>
    <path d="M300 520H729" stroke="white" stroke-width="3"/>
    <text class="label" x="514.5" y="575" text-anchor="middle" fill="white">@${escapeXml(data.login)}</text>
    <text class="label" x="514.5" y="622" text-anchor="middle" fill="white" fill-opacity="0.8">TRAINER SINCE ${format(data.since, 4)}</text>`;
