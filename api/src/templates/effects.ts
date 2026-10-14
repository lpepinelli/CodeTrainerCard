// Effects are CSS animations inside the SVG because the card is usually shown through an <img>, which never receives hover or clicks

const flipTime = 0.6;

// A 3D rotateY isn't reliably supported on SVG elements, so the flip squashes the card to zero width and swaps sides at the midpoint
export const flipStyles = (secondsPerSide: number) => {
    const total = 2 * secondsPerSide + 2 * flipTime;
    const at = (seconds: number) => `${(seconds / total * 100).toFixed(2)}%`;
    const toBack = secondsPerSide + flipTime / 2;
    const toFront = 2 * secondsPerSide + 1.5 * flipTime;

    return `
            .flip { transform-origin: 514.5px 343px; animation: flip ${total}s ease-in-out infinite; }
            .back { opacity: 0; animation: back ${total}s step-end infinite; }
            @keyframes flip {
                0%, ${at(secondsPerSide)}, ${at(secondsPerSide + flipTime)}, ${at(2 * secondsPerSide + flipTime)}, 100% { transform: scaleX(1); }
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

export const motionStyles = `
            @media (prefers-reduced-motion: reduce) {
                .flip, .back, .shine { animation: none; }
            }`;

// Two hard-edged bands instead of a soft gradient, to match the pixel style
export const shineDefs = `
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
            <rect width="1029" height="686" rx="41"/>
        </clipPath>`;

// Starts just off the left edge, so it stays hidden when animations are disabled
export const shine = `
    <g clip-path="url(#cardShape)">
        <g class="shine">
            <rect x="-560" y="-50" width="300" height="786" fill="url(#shineBands)" transform="skewX(-20)"/>
        </g>
    </g>`;
