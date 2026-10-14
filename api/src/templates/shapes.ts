type Point = { x: number; y: number };

type Bounds = { x: number; y: number; w: number; h: number };

export type Shape = {
    svg: (attrs: string) => string;
    contains: (x: number, y: number) => boolean;
    bounds: Bounds;
    // The point pixel mode snaps to the grid; shapes that make up one drawing share it so they stay aligned
    anchor?: Point;
}

export type ResizableShape = Shape & {
    inset: (distance: number) => ResizableShape;
    // The same shape with its size and position in whole blocks, which is what makes pixel mode draw it symmetric
    snap: (step: number) => ResizableShape;
    // How a thick pixel outline is cut: circles keep an even thickness all the way round, while rounded rectangles use
    // the pixel-art habit of rows as wide as the outline, which keeps their small corners round instead of turning them
    // into heavy diagonals
    evenOutline: boolean;
};

// Half-sizes become whole blocks around a centre on a grid line, or whole-and-a-half around a block's centre, so edges land on grid lines
const toGrid = (blocks: number, centredOnLine: boolean) => Math.max(centredOnLine ? Math.round(blocks) : Math.round(blocks - 0.5) + 0.5, 0.5);

export const roundRect = (x: number, y: number, w: number, h: number, r: number): ResizableShape => ({
    svg: (attrs) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${attrs}/>`,
    contains: (px, py) => {
        if (px < x || px > x + w || py < y || py > y + h) return false;
        const dx = Math.max(x + r - px, 0, px - (x + w - r));
        const dy = Math.max(y + r - py, 0, py - (y + h - r));
        return dx * dx + dy * dy <= r * r;
    },
    bounds: { x, y, w, h },
    inset: (d) => roundRect(x + d, y + d, w - 2 * d, h - 2 * d, Math.max(r - d, 0)),
    evenOutline: false,
    snap: (step) => {
        const half = step / 2;
        const cx = Math.round((x + w / 2) / half) * half;
        const cy = Math.round((y + h / 2) / half) * half;
        const halfWidth = toGrid(w / 2 / step, cx % step === 0) * step;
        const halfHeight = toGrid(h / 2 / step, cy % step === 0) * step;
        return roundRect(cx - halfWidth, cy - halfHeight, 2 * halfWidth, 2 * halfHeight, Math.round(r / step) * step);
    },
});

export const circle = (cx: number, cy: number, r: number): ResizableShape => ({
    svg: (attrs) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${attrs}/>`,
    contains: (px, py) => (px - cx) ** 2 + (py - cy) ** 2 < r * r,
    bounds: { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r },
    inset: (d) => circle(cx, cy, r - d),
    evenOutline: true,
    snap: (step) => {
        const diameter = Math.max(1, Math.round(2 * r / step));
        // An even diameter is centred on a grid line and an odd one on a block's centre, the only ways it comes out symmetric
        const centre = (c: number) => (diameter % 2 ? Math.round(c / step - 0.5) + 0.5 : Math.round(c / step)) * step;
        return circle(centre(cx), centre(cy), diameter * step / 2);
    },
});

export const customShape = (svg: Shape['svg'], contains: Shape['contains'], bounds: Bounds, anchor?: Point): Shape => ({ svg, contains, bounds, anchor });

// Blocks of a shape on a grid starting at `origin`: cells[r][c] is the block at column `col + c`, row `row + r`
type Grid = { col: number; row: number; cells: boolean[][]; origin: Point };

const cardGrid: Point = { x: 0, y: 0 };

const isResizable = (shape: Shape): shape is ResizableShape => 'snap' in shape;

// Custom shapes can't be resized, so they're only moved: block centres mirror around any multiple of half a block,
// and moving the anchor onto one keeps them symmetric and aligned with the shapes that share the anchor
const pixelShape = (shape: Shape, step: number): Shape => {
    if (isResizable(shape)) return shape.snap(step);
    const { x, y, w, h } = shape.bounds;
    const anchor = shape.anchor || { x: x + w / 2, y: y + h / 2 };
    const half = step / 2;
    const dx = Math.round(anchor.x / half) * half - anchor.x;
    const dy = Math.round(anchor.y / half) * half - anchor.y;
    return { ...shape, contains: (px, py) => shape.contains(px - dx, py - dy), bounds: { x: x + dx, y: y + dy, w, h } };
}

// A block is filled when its centre is inside the shape. Card shapes share one grid starting at 0
const rasterize = (shape: Shape, step: number, frame = shape.bounds, origin = cardGrid): Grid => {
    const col = Math.floor((frame.x - origin.x) / step);
    const row = Math.floor((frame.y - origin.y) / step);
    const cols = Math.ceil((frame.x + frame.w - origin.x) / step) - col;
    const rows = Math.ceil((frame.y + frame.h - origin.y) / step) - row;
    const cells = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) =>
        shape.contains(origin.x + (col + c + 0.5) * step, origin.y + (row + r + 0.5) * step)));
    return { col, row, cells, origin };
}

const runsOf = (line: boolean[]) => {
    const runs: number[][] = [];
    let start: number | undefined;
    line.concat(false).forEach((filled, c) => {
        if (filled && start === undefined) start = c;
        if (!filled && start !== undefined) {
            runs.push([start, c]);
            start = undefined;
        }
    });
    return runs;
}

const sameRuns = (a: number[][], b: number[][]) => a.length === b.length && a.every((run, i) => run[0] === b[i][0] && run[1] === b[i][1]);

// Identical consecutive rows are merged so straight edges become single rectangles instead of one per row
const gridPath = ({ col, row, cells, origin }: Grid, step: number) => {
    // Grids with fractional blocks would otherwise print float noise like 737.0500000000001
    const at = (blocks: number, start: number) => Number((start + blocks * step).toFixed(3));
    const blocks: string[] = [];
    let open: { runs: number[][]; top: number; height: number } | undefined;
    const close = () => {
        if (!open) return;
        const { runs, top, height } = open;
        runs.forEach(([start, end]) => {
            const [left, right] = [at(col + start, origin.x), at(col + end, origin.x)];
            const [upper, lower] = [at(row + top, origin.y), at(row + top + height, origin.y)];
            blocks.push(`M${left} ${upper}H${right}V${lower}H${left}z`);
        });
    };

    cells.forEach((line, r) => {
        const runs = runsOf(line);
        if (open && sameRuns(open.runs, runs)) {
            open.height++;
            return;
        }
        close();
        open = runs.length ? { runs, top: r, height: 1 } : undefined;
    });
    close();
    return blocks.join('');
}

// Shapes are the same on every card, only their colours change, so each one's blocks are worked out once and reused.
// A shape's own SVG markup describes its geometry exactly, which makes it the key
const paths = new Map<string, string>();

const pixelElement = (key: string, buildPath: () => string, attrs: string) => {
    let d = paths.get(key);
    if (d === undefined) {
        d = buildPath();
        paths.set(key, d);
    }
    return `<path d="${d}" shape-rendering="crispEdges" ${attrs}/>`;
}

export const fill = (shape: Shape, attrs: string, step?: number) => step
    ? pixelElement(`fill ${step} ${shape.svg('')}`, () => gridPath(rasterize(pixelShape(shape, step), step), step), attrs)
    : shape.svg(attrs);

// Fills the shape on an image's pixel grid instead of the card's: `blocks` blocks across the image, starting at its corner,
// so the shape's edge steps along the image's own pixels
export const fillOnImageGrid = (shape: Shape, attrs: string, image: Bounds, blocks: number) => {
    const step = image.w / blocks;
    const key = `image ${blocks} ${image.x},${image.y},${image.w} ${shape.svg('')}`;
    return pixelElement(key, () => gridPath(rasterize(shape, step, shape.bounds, image), step), attrs);
}

// Keeps blocks whose four neighbours are filled, peeling off a one-block edge whose steps touch at the corners
const erode = (cells: boolean[][]) => cells.map((line, r) => line.map((filled, c) =>
    filled && !!line[c - 1] && !!line[c + 1] && !!(cells[r - 1] && cells[r - 1][c]) && !!(cells[r + 1] && cells[r + 1][c])));

// The ring is the outer shape minus a hole `blocks` thick inside it (see `evenOutline`). The hole never reaches past
// `fill`, the shape drawn underneath, so the two never leave a gap
const pixelRing = (outer: ResizableShape, fill: ResizableShape, blocks: number, step: number, attrs: string) =>
    pixelElement(`ring ${blocks} ${step} ${outer.svg('')} ${fill.svg('')}`, () => {
        const area = rasterize(outer, step);
        const filled = rasterize(fill, step, outer.bounds).cells;
        let hole = outer.evenOutline ? rasterize(outer.inset(blocks * step), step, outer.bounds).cells : area.cells;
        if (!outer.evenOutline) for (let i = 0; i < blocks; i++) hole = erode(hole);
        return gridPath({ ...area, cells: area.cells.map((line, r) => line.map((inside, c) => inside && !(hole[r][c] && filled[r][c]))) }, step);
    }, attrs);

// In pixel mode the outline is a whole number of blocks thick, split around the shape's edge like a stroke
export const outline = (shape: ResizableShape, width: number, color: string, step?: number, opacity = 1) => {
    const opacityAttr = (name: string) => opacity < 1 ? ` ${name}="${opacity}"` : '';
    if (!step) return shape.svg(`fill="none" stroke="${color}" stroke-width="${width}"${opacityAttr('stroke-opacity')}`);

    const base = shape.snap(step);
    const outer = base.inset(-Math.round(width / 2 / step) * step);
    return pixelRing(outer, base, Math.max(1, Math.round(width / step)), step, `fill="${color}"${opacityAttr('fill-opacity')}`);
}

// The outline sits entirely outside the shape, the pixel-art convention. With a width in whole blocks it lands exactly
// where the smooth stroke does, so both modes draw the same size
export const outlineOutside = (shape: ResizableShape, width: number, color: string, step?: number) => {
    if (!step) return shape.inset(-width / 2).svg(`fill="none" stroke="${color}" stroke-width="${width}"`);

    const base = shape.snap(step);
    const blocks = Math.max(1, Math.round(width / step));
    return pixelRing(base.inset(-blocks * step), base, blocks, step, `fill="${color}"`);
}
