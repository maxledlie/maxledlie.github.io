import GeometryCanvas from './GeometryCanvas.js';

const DOMAIN = [0, 100];
const GRADIENT_THICKNESS = 20;

const canvas = new GeometryCanvas('#container', DOMAIN);

const defs = canvas.svg.append('defs');

const grad = defs.append('linearGradient')
  .attr('id', 'myGrad');
grad.append('stop')
  .attr('offset', '0%')
  .attr('stop-color', '#9999ff')
  .attr('stop-opacity', '0%');
grad.append('stop')
  .attr('offset', '49%')
  .attr('stop-color', '#9999ff')
  .attr('stop-opacity', '0%');
grad.append('stop')
  .attr('offset', '50%')
  .attr('stop-color', '#9999ff')
  .attr('stop-opacity', '100%');
grad.append('stop')
  .attr('offset', '100%')
  .attr('stop-color', '#9999ff')
  .attr('stop-opacity', '0%');

let currentLine = null;
let currentRect = null;
let currentPerp = null;
let dragStart = null;
const halfPlanePerps = [];

canvas.svg.on('mousedown', e => {
  e.stopPropagation();

  const p1 = [canvas.xScale.invert(e.offsetX), canvas.yScale.invert(e.offsetY)];

  currentRect = canvas.svg.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 0)
  .attr('height', 0);
  currentLine = canvas.line(p1, p1, {'stroke': 'black', 'stroke-width': 3});
  currentPerp = canvas.line(p1, p1, {'stroke': 'red', 'stroke-width': 2});
  dragStart = p1;
});

canvas.svg.on('mousemove', e => {
  if (currentLine === null) return;
  
  currentPerp
    .attr('x2', e.offsetX)
    .attr('y2', e.offsetY);

  // Find and draw the line perpendicular to selectedPerp
  const selectedPerpVec = [
    canvas.xScale.invert(e.offsetX) - dragStart[0],
    canvas.yScale.invert(e.offsetY) - dragStart[1]
  ];

  if (selectedPerpVec === 0 && selectedLineVec === 0) return;

  const selectedLineVec = [
    selectedPerpVec[1],
    -selectedPerpVec[0]
  ];

  // Special case for vertical line
  if (selectedLineVec[0] === 0) {
    currentLine
      .attr('x1', canvas.xScale(dragStart[0]))
      .attr('y1', canvas.yScale(DOMAIN[0] - 10))
      .attr('x2', canvas.xScale(dragStart[0]))
      .attr('y2', canvas.yScale(DOMAIN[1] + 10));

    return;
  }

  const selectedPerpGrad = selectedPerpVec[1] / selectedPerpVec[0];
  const selectedLineGrad = selectedLineVec[1] / selectedLineVec[0];
  const lineStartX = DOMAIN[0] - 10;
  const lineStartY = dragStart[1] - selectedLineGrad * (dragStart[0] - lineStartX);
  const lineStart = [lineStartX, lineStartY];
  const lineEndX = DOMAIN[1] + 10;
  const lineEnd = [lineEndX, dragStart[1] - selectedLineGrad * (dragStart[0] - lineEndX)];

  currentLine
    .attr('x1', canvas.xScale(lineStart[0]))
    .attr('y1', canvas.yScale(lineStart[1]))
    .attr('x2', canvas.xScale(lineEnd[0]))
    .attr('y2', canvas.yScale(lineEnd[1]));

  const theta = 180 * Math.atan2(selectedPerpVec[1], selectedPerpVec[0]) / Math.PI;

  console.log(`theta: ${theta}`);
  console.log(`grad: ${selectedPerpGrad}`);

  currentRect
    .attr('width', 2 * GRADIENT_THICKNESS)
    .attr('height', canvas.yDeltaScale(1000))
    .attr('x', canvas.xScale(dragStart[0]) - GRADIENT_THICKNESS)
    .attr('y', canvas.yScale(dragStart[1] + 200))
    .attr('transform', `rotate(${-theta}, ${canvas.xScale(dragStart[0])}, ${canvas.yScale(dragStart[1])})`)
    .style('fill', 'url(#myGrad)');
});

canvas.svg.on('mouseup', e => {
  currentPerp.remove();
  currentPerp = null;
  currentLine = null;
  currentRect = null;
});