import { cardShape } from './frame';
import { fill } from './shapes';

// Effects are CSS animations inside the SVG because the card is usually shown through an <img>, which never receives hover or clicks

const flipTime = 0.6;

// The back carries no information, so it only shows briefly; the front's time is configurable
const backSeconds = 4;

// A 3D rotateY isn't reliably supported on SVG elements, so the flip squashes the card to zero width and swaps sides at the midpoint
export const flipStyles = (frontSeconds: number) => {
    const total = frontSeconds + backSeconds + 2 * flipTime;
    const at = (seconds: number) => `${(seconds / total * 100).toFixed(2)}%`;
    const toBack = frontSeconds + flipTime / 2;
    const toFront = frontSeconds + backSeconds + 1.5 * flipTime;

    return `
            .flip { transform-origin: 514.5px 343px; animation: flip ${total}s ease-in-out infinite; }
            .back { opacity: 0; animation: back ${total}s step-end infinite; }
            @keyframes flip {
                0%, ${at(frontSeconds)}, ${at(frontSeconds + flipTime)}, ${at(frontSeconds + flipTime + backSeconds)}, 100% { transform: scaleX(1); }
                ${at(toBack)}, ${at(toFront)} { transform: scaleX(0); }
            }
            @keyframes back {
                0% { opacity: 0; }
                ${at(toBack)} { opacity: 1; }
                ${at(toFront)}, 100% { opacity: 0; }
            }`;
}

export const shineStyles = `
            .shine { animation: shine 5s ease-in-out infinite; }
            @keyframes shine {
                0%, 50% { transform: translateX(0); }
                100% { transform: translateX(1900px); }
            }`;

const floatRise = 14;
const shadowY = cardShape.bounds.h + floatRise + 22;
const shadowRadius = { x: 440, y: 12 };

// A floating card needs room to bob, and below it for its shadow, so its SVG is taller than the card
export const floatingHeight = (shadow: boolean) => shadow ? shadowY + shadowRadius.y + 2 : cardShape.bounds.h + floatRise;

// The shadow shrinks and fades as the card rises, which is what makes it read as floating rather than sliding
const shadowStyles = `
            .shadow { transform-origin: ${cardShape.bounds.w / 2}px ${shadowY}px; animation: shadow 3s ease-in-out infinite; }
            @keyframes shadow {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(0.8); opacity: 0.6; }
            }`;

export const floatStyles = (shadow: boolean) => `
            .float { animation: float 3s ease-in-out infinite; }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-${floatRise}px); }
            }${shadow ? shadowStyles : ''}`;

// A flat, hard-edged shadow rather than a blur, to match the pixel style.
// The card rests at the bottom of its rise, so it still sits on its shadow when animations are disabled
export const floating = (card: string, shadow: boolean) => `${shadow ? `
    <ellipse class="shadow" cx="${cardShape.bounds.w / 2}" cy="${shadowY}" rx="${shadowRadius.x}" ry="${shadowRadius.y}" fill="black" fill-opacity="0.2"/>` : ''}
    <g transform="translate(0 ${floatRise})">
        <g class="float">${card}
        </g>
    </g>`;

export const motionStyles = `
            @media (prefers-reduced-motion: reduce) {
                .flip, .back, .shine, .float, .shadow { animation: none; }
            }`;

// Two hard-edged bands instead of a soft gradient, to match the pixel style
export const shineDefs = (step?: number) => `
        <linearGradient id="shineBands">
            <stop offset="0" stop-color="white" stop-opacity="0"/>
            <stop offset="0.2" stop-color="white" stop-opacity="0"/>
            <stop offset="0.2" stop-color="white" stop-opacity="0.35"/>
            <stop offset="0.6" stop-color="white" stop-opacity="0.35"/>
            <stop offset="0.6" stop-color="white" stop-opacity="0"/>
            <stop offset="0.75" stop-color="white" stop-opacity="0"/>
            <stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
            <stop offset="0.9" stop-color="white" stop-opacity="0.25"/>
            <stop offset="0.9" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <clipPath id="cardShape">
            ${fill(cardShape, '', step)}
        </clipPath>`;

// Starts just off the left edge, so it stays hidden when animations are disabled
export const shine = `
    <g clip-path="url(#cardShape)">
        <g class="shine">
            <rect x="-560" y="-50" width="300" height="786" fill="url(#shineBands)" transform="skewX(-20)"/>
        </g>
    </g>`;
