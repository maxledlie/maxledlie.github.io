
const PIXEL_WIDTH = 500;
const PIXEL_HEIGHT = 500;
const X_DOMAIN = [-10, 10];
const Y_DOMAIN = [-10, 10];
const NCELLS = 50;

const GRID_SPEC = {
    NX: 25,
    NY: 25,
    X_MIN: -1,
    X_MAX: 1,
    Y_MIN: -1,
    Y_MAX: 1
}

const FUNCS = {
    source: (x, y) => [x, y],
    sink: (x, y) => [-x, -y],
    orbit: (x, y) => [-y, x],
    bias: (x, y) => [x, 0.5],
    periodic: (x, y) => [Math.cos(2 * Math.PI * x), Math.sin(2 * Math.PI * y)],
    cyclical: (x, y) => [Math.cos(-2 * Math.PI * y), Math.sin(2 * Math.PI * x)],
    vortices: (x, y) => [Math.cos(2 * Math.PI * (x + y)), Math.sin(2 * Math.PI * (x - y))]
}


function initGrid(gridSpec) {
    return {
        ...gridSpec,
        DX: (gridSpec.X_MAX - gridSpec.X_MIN) / gridSpec.NX,
        DY: (gridSpec.Y_MAX - gridSpec.Y_MIN) / gridSpec.NY
    }
}


function evaluate(func, grid) {
    const idx = Array(grid.NX * grid.NY).fill().map((_, i) => i);
    const iRow = idx.map(i => Math.floor(i / grid.NX));
    const jCol = idx.map(i => i % grid.NX);

    // Compute positions at CENTRE of each cell
    const xPos = jCol.map(j => grid.X_MIN + grid.DX * (j + 0.5));
    const yPos = iRow.map(i => grid.Y_MIN + grid.DY * (i + 0.5));

    return idx.map(i => ({
        row: iRow[i],
        col: jCol[i],
        x: xPos[i],
        y: yPos[i],
        value: func(xPos[i], yPos[i])
    }));
}

document.addEventListener("DOMContentLoaded", function() {
    const func = FUNCS.vortices;

    const grid = initGrid(GRID_SPEC);
    const data = evaluate(func, grid)

    // Convert each vector to a magnitude and direction
    const vectorField = data.map(point => {
        const val = point.value
        const dir = Math.atan2(val[1], val[0]);
        const mag = Math.sqrt(val[0] * val[0] + val[1] * val[1])
        return {...point, value: {dir, mag}}
    });

    const xScale = d3.scaleLinear().domain([grid.X_MIN, grid.X_MAX]).range([0, PIXEL_WIDTH]);
    const yScale = d3.scaleLinear().domain([grid.Y_MIN, grid.Y_MAX]).range([0, PIXEL_HEIGHT]);
    const lengthScale = d3.scaleSqrt([0, d3.max(vectorField, d => d.value.mag)], [0, 2]);
    const colorScale = d3.scaleSequential([0, 360], d3.interpolateRainbow);

    const svg = d3.select("#vectorfield")
        .attr("width", PIXEL_WIDTH)
        .attr("height", PIXEL_HEIGHT)
        .attr("style", "outline: thin solid red; background: black");

    // Path for arrow at each point
    const path = d3.path();
    path.moveTo(-2, -2);
    path.lineTo(2, -2);
    path.lineTo(0, 8);
    path.closePath();

    svg.selectAll("g")
        .data(vectorField)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${xScale(d.x)}, ${yScale(d.y)}) rotate(${d.value.dir * 180 / Math.PI}) scale(${lengthScale(d.value.mag)}, ${lengthScale(d.value.mag)})`)
        .attr("fill", d => colorScale(d.value.dir * 180 / Math.PI))
        .append("path").attr("d", path.toString());
});
