type Bounds = { x: number; y: number; w: number; h: number };

export type Shape = {
    svg: (attrs: string) => string;
    contains: (x: number, y: number) => boolean;
    bounds: Bounds;
}

export type ResizableShape = Shape & { inset: (distance: number) => ResizableShape };

export const roundRect = (x: number, y: number, w: number, h: number, r: number): ResizableShape => ({
    svg: (attrs) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${attrs}/>`,
    contains: (px, py) => {
        if (px < x || px >= x + w || py < y || py >= y + h) return false;
        const dx = Math.max(x + r - px, 0, px - (x + w - r));
        const dy = Math.max(y + r - py, 0, py - (y + h - r));
        return dx * dx + dy * dy <= r * r;
    },
    bounds: { x, y, w, h },
    inset: (d) => roundRect(x + d, y + d, w - 2 * d, h - 2 * d, Math.max(r - d, 0)),
});

export const circle = (cx: number, cy: number, r: number): ResizableShape => ({
    svg: (attrs) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`,
    contains: (px, py) => (px - cx) ** 2 + (py - cy) ** 2 < r * r,
    bounds: { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r },
    inset: (d) => circle(cx, cy, r - d),
});

export const customShape = (svg: Shape['svg'], contains: Shape['contains'], bounds: Bounds): Shape => ({ svg, contains, bounds });

const sameRuns = (a: number[][], b: number[][]) => a.length === b.length && a.every((run, i) => run[0] === b[i][0] && run[1] === b[i][1]);

// Fills every grid block whose centre is inside the shape. The grid starts at 0 so all shapes on the card share it,
// and identical consecutive rows are merged so straight edges become single rectangles instead of one per row
const pixelPath = (contains: Shape['contains'], { x, y, w, h }: Bounds, step: number) => {
    const firstCol = Math.floor(x / step);
    const lastCol = Math.ceil((x + w) / step);
    const rowRuns = (row: number) => {
        const runs: number[][] = [];
        let start: number | undefined;
        for (let col = firstCol; col <= lastCol; col++) {
            const inside = col < lastCol && contains((col + 0.5) * step, (row + 0.5) * step);
            if (inside && start === undefined) start = col;
            if (!inside && start !== undefined) {
                runs.push([start, col]);
                start = undefined;
            }
        }
        return runs;
    };

    const blocks: string[] = [];
    let open: { runs: number[][]; top: number; height: number } | undefined;
    const close = (block: typeof open) => {
        if (!block) return;
        const { top, height } = block;
        block.runs.forEach(([start, end]) => {
            blocks.push(`M${start * step} ${top * step}h${(end - start) * step}v${height * step}h${(start - end) * step}z`);
        });
    };

    for (let row = Math.floor(y / step); row * step < y + h; row++) {
        const runs = rowRuns(row);
        if (open && sameRuns(open.runs, runs)) {
            open.height++;
        } else {
            close(open);
            open = runs.length ? { runs, top: row, height: 1 } : undefined;
        }
    }
    close(open);
    return blocks.join('');
}

const pixelElement = (contains: Shape['contains'], bounds: Bounds, step: number, attrs: string) =>
    `<path d="${pixelPath(contains, bounds, step)}" shape-rendering="crispEdges" ${attrs}/>`;

export const fill = (shape: Shape, attrs: string, step?: number) =>
    step ? pixelElement(shape.contains, shape.bounds, step, attrs) : shape.svg(attrs);

// In pixel mode the outline is a filled ring at least one block thick, so thin strokes don't break into gaps
export const outline = (shape: ResizableShape, width: number, color: string, step?: number, opacity = 1) => {
    const opacityAttr = (name: string) => opacity < 1 ? ` ${name}="${opacity}"` : '';
    if (!step) return shape.svg(`fill="none" stroke="${color}" stroke-width="${width}"${opacityAttr('stroke-opacity')}`);

    const half = Math.max(width, step) / 2;
    const outer = shape.inset(-half);
    const inner = shape.inset(half);
    return pixelElement((x, y) => outer.contains(x, y) && !inner.contains(x, y), outer.bounds, step, `fill="${color}"${opacityAttr('fill-opacity')}`);
}
