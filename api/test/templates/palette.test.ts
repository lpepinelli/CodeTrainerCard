import assert from 'node:assert/strict';
import { test } from 'node:test';

import { cardPalette } from '../../src/templates/palette';

const channels = (hex: string) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));

const assertClose = (actual: string, expected: string) =>
    channels(actual).forEach((value, index) => assert.ok(Math.abs(value - channels(expected)[index]) <= 4, `${actual} should be close to ${expected}`));

test('the default color keeps the original purple shades', () => {
    const palette = cardPalette('BC93FF');
    assert.equal(palette.base, '#BC93FF');
    assertClose(palette.bar, '#8B63CC');
    assertClose(palette.stripe, '#8F72C3');
    assertClose(palette.arc, '#CDB8F7');
    assertClose(palette.bulletLine, '#B994F7');
    assertClose(palette.bulletFill, '#E3D4FF');
});

test('another color gets shades of its own hue instead of purple', () => {
    const palette = cardPalette('7EDC9A');
    for (const shade of [palette.bar, palette.stripe, palette.arc, palette.bulletLine, palette.bulletFill]) {
        const [red, green, blue] = channels(shade);
        assert.ok(green > red && green > blue, `${shade} should be green`);
    }
});

test('the bar is darker than the base and the bullet fill lighter', () => {
    const brightness = (hex: string) => channels(hex).reduce((sum, value) => sum + value);
    const palette = cardPalette('FF9ED2');
    assert.ok(brightness(palette.bar) < brightness(palette.base));
    assert.ok(brightness(palette.bulletFill) > brightness(palette.base));
});
