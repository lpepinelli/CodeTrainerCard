import { devBall } from './cardBack';

// The ball from the back of the card on its own, used as the web app's logo; the viewBox fits the ball and its outline
export const renderLogo = (color: string, font: string) => `<svg width="314" height="314" viewBox="357.5 108 314 314" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <style>
            @font-face { font-family: 'PokemonFireRed'; src: url(${font}) format('truetype'); }
            text { font-family: 'PokemonFireRed', monospace; }
            .label { font-size: 40px; }
        </style>
    </defs>
    ${devBall(`#${color}`)}
</svg>
`;
