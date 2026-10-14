import assert from 'node:assert/strict';
import { test } from 'node:test';

import { circle, fill, outline, outlineOutside, roundRect } from '../../src/templates/shapes';

const step = 4;

// Turns a pixel path back into the set of blocks it covers, as "column,row"
const blocksOf = (svg: string) => {
    const blocks = new Set<string>();
    const d = svg.match(/d="([^"]*)"/)?.[1] ?? '';
    for (const [, left, top, right, bottom] of d.matchAll(/M(-?[\d.]+) (-?[\d.]+)H(-?[\d.]+)V(-?[\d.]+)H-?[\d.]+z/g)) {
        for (let col = +left / step; col < +right / step; col++) {
            for (let row = +top / step; row < +bottom / step; row++) blocks.add(`${col},${row}`);
        }
    }
    return blocks;
}

const rowWidths = (blocks: Set<string>) => {
    const rows = new Map<number, number>();
    blocks.forEach((block) => {
        const row = Number(block.split(',')[1]);
        rows.set(row, (rows.get(row) || 0) + 1);
    });
    return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, width]) => width);
}

test('identical circles come out identical wherever they sit on the grid', () => {
    const shapes = [210, 303, 361, 419, 477].map((y) => rowWidths(blocksOf(fill(circle(81, y, 12), '', step))));
    shapes.forEach((shape) => assert.deepEqual(shape, shapes[0]));
});

test('a bullet is a classic pixel circle with a one-block outline around its fill', () => {
    const dot = circle(81, 210, 12);
    const inside = blocksOf(fill(dot, '', step));
    const ring = blocksOf(outlineOutside(dot, 4, 'black', step));

    assert.deepEqual(rowWidths(inside), [4, 6, 6, 6, 6, 4]);
    assert.deepEqual(rowWidths(new Set([...inside, ...ring])), [4, 6, 8, 8, 8, 8, 6, 4]);
    inside.forEach((block) => assert.ok(!ring.has(block), `outline overlaps the fill at ${block}`));
});

test('outlines leave no gap between themselves and the fill', () => {
    for (const [shape, width] of [[circle(514.5, 265, 52), 14], [roundRect(31, 31, 967, 624, 30), 8], [roundRect(165, 536, 80, 80, 10), 3]] as const) {
        const covered = new Set([...blocksOf(fill(shape, '', step)), ...blocksOf(outline(shape, width, 'black', step))]);
        // Every row painted by the two together is one unbroken run
        const rows = new Map<number, number[]>();
        covered.forEach((block) => {
            const [col, row] = block.split(',').map(Number);
            rows.set(row, [...(rows.get(row) || []), col]);
        });
        rows.forEach((cols, row) => {
            const sorted = cols.sort((a, b) => a - b);
            assert.equal(sorted.length, sorted[sorted.length - 1] - sorted[0] + 1, `hole in row ${row}`);
        });
    }
});

test('nested card shapes stay centred on each other', () => {
    const card = blocksOf(fill(roundRect(0, 0, 1029, 686, 41), '', step));
    const body = blocksOf(fill(roundRect(35, 35, 959, 616, 26), '', step));
    const columns = (blocks: Set<string>) => [...blocks].map((block) => Number(block.split(',')[0]));
    const [cardLeft, cardRight] = [Math.min(...columns(card)), Math.max(...columns(card))];
    const [bodyLeft, bodyRight] = [Math.min(...columns(body)), Math.max(...columns(body))];
    assert.equal(bodyLeft - cardLeft, cardRight - bodyRight);
});

const centreOf = (blocks: Set<string>) => {
    const points = [...blocks].map((block) => block.split(',').map(Number));
    const middle = (axis: number) => (Math.min(...points.map((p) => p[axis])) + Math.max(...points.map((p) => p[axis])) + 1) / 2;
    return [middle(0), middle(1)];
}

test('the ball and its button share a centre in pixel mode', () => {
    const ball = circle(514.5, 265, 150);
    const button = circle(514.5, 265, 50);
    assert.deepEqual(centreOf(blocksOf(fill(button, '', step))), centreOf(blocksOf(fill(ball, '', step))));
});

test('a thick outline is equally thick along both axes and the diagonal', () => {
    const ball = circle(514.5, 265, 150);
    const ring = blocksOf(outline(ball, 12, 'black', step));
    const [cx, cy] = centreOf(ring).map((c) => c - 0.5);
    const thickness = (dx: number, dy: number) => {
        let count = 0;
        for (let i = 0; i < 100; i++) if (ring.has(`${Math.round(cx + dx * i)},${Math.round(cy + dy * i)}`)) count++;
        return count;
    };
    assert.equal(thickness(1, 0), 3);
    assert.equal(thickness(0, 1), 3);
    // Along a diagonal each block step covers √2 of distance, so an even ring is crossed in 2 or 3 blocks
    assert.ok([2, 3].includes(thickness(1, 1)));
});

test('an outside outline is the same size with and without pixelate', () => {
    const dot = circle(81, 210, 12);
    const smooth = outlineOutside(dot, 4, 'black');
    const [, r, width] = smooth.match(/r="([\d.]+)".*stroke-width="([\d.]+)"/) ?? [];
    const smoothDiameter = 2 * (Number(r) + Number(width) / 2);
    const columns = [...blocksOf(outlineOutside(dot, 4, 'black', step))].map((block) => Number(block.split(',')[0]));
    const pixelDiameter = (Math.max(...columns) - Math.min(...columns) + 1) * step;
    assert.equal(pixelDiameter, smoothDiameter);
});
