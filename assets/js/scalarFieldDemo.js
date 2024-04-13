const PIXEL_WIDTH = 500;
const PIXEL_HEIGHT = 500;
const X_DOMAIN = [-10, 10];
const Y_DOMAIN = [-10, 10];
const NCELLS = 50;

const GRID_SPEC = {
    NX: 25,
    NY: 25,
    X_MIN: -10,
    X_MAX: 10,
    Y_MIN: -10,
    Y_MAX: 10
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
    const xPos = jCol.map(j => grid.DX * (j + 0.5));
    const yPos = iRow.map(i => grid.DY * (i + 0.5));

    return idx.map(i => ({
        row: iRow[i],
        col: jCol[i],
        value: func(xPos[i], yPos[i])
    }));
}


document.addEventListener("DOMContentLoaded", function() {
    const func = (x, y) => x + y;
    const grid = initGrid(GRID_SPEC);
    const data = evaluate(func, grid)

    const gridSize = PIXEL_WIDTH / GRID_SPEC.NX;

    const svg = d3.select("#scalarfield")
        .attr("width", PIXEL_WIDTH)
        .attr("height", PIXEL_HEIGHT)
        .attr("style", "outline: thin solid red");

    const colorScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range(["white", "red"]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => d.col * gridSize)
        .attr("y", d => d.row * gridSize)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .attr("fill", d => colorScale(d.value));
});
