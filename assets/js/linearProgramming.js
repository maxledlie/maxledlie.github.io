import GeometryCanvas from './GeometryCanvas.js';
import Vector2 from './Vector2.js';

// Represents the set of points (x, y) in R^2 such that a*x + b*y <= c
class HalfPlane {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

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
const halfPlanes = [];

canvas.svg.on('mousedown', e => {
  e.stopPropagation();

  dragStart = new Vector2(canvas.xScale.invert(e.offsetX), canvas.yScale.invert(e.offsetY));

  currentRect = canvas.svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 0)
    .attr('height', 0);
  currentLine = canvas.line(dragStart, dragStart, {'stroke': 'black', 'stroke-width': 3});
  currentPerp = canvas.line(dragStart, dragStart, {'stroke': 'red', 'stroke-width': 2});
});

function updateCurrentHalfPlane(halfPlane, displayLine, displayRect) {
  const { a, b, c } = {...halfPlane};

  // Special case for vertical line
  if (b === 0) {
    displayLine
      .attr('x1', canvas.xScale(dragStart.x))
      .attr('y1', canvas.yScale(DOMAIN[0] - 10))
      .attr('x2', canvas.xScale(dragStart.x))
      .attr('y2', canvas.yScale(DOMAIN[1] + 10));

    return;
  }

  const gradient = -a / b;
  const intercept = c / b;
  const lineStartX = DOMAIN[0] - 10;
  const lineStart = new Vector2(lineStartX, gradient * lineStartX + intercept);
  const lineEndX = DOMAIN[1] + 10;
  const lineEnd = new Vector2(lineEndX, gradient * lineEndX + intercept);

  displayLine
    .attr('x1', canvas.xScale(lineStart.x))
    .attr('y1', canvas.yScale(lineStart.y))
    .attr('x2', canvas.xScale(lineEnd.x))
    .attr('y2', canvas.yScale(lineEnd.y));

  const theta = 180 * Math.atan2(b, a) / Math.PI;

  displayRect
    .attr('width', 2 * GRADIENT_THICKNESS)
    .attr('height', canvas.yDeltaScale(1000))
    .attr('x', canvas.xScale(dragStart.x) - GRADIENT_THICKNESS)
    .attr('y', canvas.yScale(dragStart.y + 200))
    .attr('transform', `rotate(${-theta}, ${canvas.xScale(dragStart.x)}, ${canvas.yScale(dragStart.y)})`)
    .style('fill', 'url(#myGrad)');
}

canvas.svg.on('mousemove', e => {
  if (currentLine === null) return;
  
  currentPerp
    .attr('x2', e.offsetX)
    .attr('y2', e.offsetY);

  // Find and draw the line perpendicular to selectedPerp
  const currentPerpVec = new Vector2(
    canvas.xScale.invert(e.offsetX) - dragStart.x,
    canvas.yScale.invert(e.offsetY) - dragStart.y
  ).normalized();

  const a = currentPerpVec.x;
  const b = currentPerpVec.y;
  const c = a * dragStart.x + b * dragStart.y;

  const halfPlane = new HalfPlane(a, b, c);

  updateCurrentHalfPlane(halfPlane, currentLine, currentRect);
});

canvas.svg.on('mouseup', e => {
  currentPerp.remove();
  currentPerp = null;
  currentLine = null;
  currentRect = null;
});