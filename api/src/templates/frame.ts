import { fill, outline, roundRect } from './shapes';

export const cardShape = roundRect(0, 0, 1029, 686, 41);

const frame = roundRect(31, 31, 967, 624, 30);

const cardBody = roundRect(35, 35, 959, 616, 26);

export const cardBodyClip = (step?: number) => `
        <clipPath id="cardBody">
            ${fill(cardBody, '', step)}
        </clipPath>`;

// The outer coloured edge and the dark frame, shared by the front and the back of the card
export const renderChrome = (color: string, bodyColor: string, step?: number) => `
    ${fill(cardShape, `fill="${color}"`, step)}
    ${fill(cardShape, 'fill="url(#outerStripes)"', step)}
    ${fill(frame, `fill="${bodyColor}"`, step)}
    ${outline(frame, 8, '#5F5C6E', step)}`;
