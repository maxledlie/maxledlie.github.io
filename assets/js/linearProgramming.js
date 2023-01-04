import GeometryCanvas from './GeometryCanvas.js';
import Vector2 from './Vector2.js';
import Matrix2 from './Matrix2.js';

// Represents the set of points (x, y) in R^2 such that a*x + b*y <= c
class HalfPlane {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  static horizontal(y, side) {
    return new HalfPlane(0, side ? -1 : 1, side ? -y : y);
  }

  static vertical(x, side) {
    return new HalfPlane(side ? -1 : 1, 0, side ? -x : x);
  }
}

// A convex region is stored as sorted lists of left edges and right edges.
// The edges are sorted according to the order in which a vertical sweep line encounters them from top to bottom.
// A horizontal edge is stored as a left edge if the region lies below it, or a right edge if the region lies above.
class ConvexRegion {
  constructor(leftEdges, rightEdges) {
    this.left = leftEdges;
    this.right = rightEdges;
  }
}

function intersectHalfPlanes(h1, h2) {
  // Solve a 2d linear equation to find the point of intersection
  const cVec = new Vector2(h1.c, h2.c);
  const mat = new Matrix2([
    [h1.a, h1.b],
    [h2.a, h2.b]
  ]);

  // Special case: half planes are parallel and do not intersect
  // If facing in same direction, intersection is their union.
  // If facing in opposite direction, intersection is the line.
  if (mat.det() === 0) {
    // TODO
  }

  return mat.invert().apply(cVec);
}

// Adds a shape to the canvas representing the passed convex region c.
// This assumes that c is bounded.
function renderConvexRegion(c, id) {
  const rightEdgesReversed = [...c.right].reverse();
  const edges = [...c.left, ...rightEdgesReversed];
  const start = intersectHalfPlanes(edges[0], edges[edges.length - 1]);
  const vertices = [start];
  for (let i = 0; i < edges.length - 1; i++) {
    vertices.push(intersectHalfPlanes(edges[i], edges[i+1]));
  }

  let pathData = `M ${canvas.xScale(start.x)} ${canvas.yScale(start.y)} `;
  for (let i = 1; i < vertices.length; i++) {
    pathData += `L ${canvas.xScale(vertices[i].x)} ${canvas.yScale(vertices[i].y)} `;
  }
  pathData += 'Z';
  const existingPath = d3.select(`#${id}`);
  const path = existingPath.empty() ? canvas.svg.append('path').attr('id', id) : existingPath;
  path.attr('d', pathData)
    .style('fill', 'pink')
    .style('stroke-width', 0)
    .style('opacity', 0.4);
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

// Initialise the half planes with boundaries off the edge of the screen so we don't have to deal with
// unbounded regions.
const halfPlanes = [
  HalfPlane.horizontal(10, true),
  HalfPlane.horizontal(60, false),
  HalfPlane.vertical(10, true),
  HalfPlane.vertical(60, false)
];

halfPlanes.forEach(h => addHalfPlane(h));

const testRegion = new ConvexRegion([halfPlanes[1], halfPlanes[2]], [halfPlanes[3], halfPlanes[0]]);
renderConvexRegion(testRegion, 'region');

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

  updateHalfPlane(halfPlane, currentLine, currentRect);
});

canvas.svg.on('mouseup', e => {
  currentPerp.remove();
  currentPerp = null;
  currentLine = null;
  currentRect = null;
});

function addHalfPlane(halfPlane) {
  const displayLine = canvas.svg.append('line')
    .style('stroke', 'black')
    .style('stroke-width', 2);
  const displayRect = canvas.svg.append('rect');
  updateHalfPlane(halfPlane, displayLine, displayRect);
}

function updateHalfPlane(halfPlane, displayLine, displayRect) {
  const { a, b, c } = {...halfPlane};

  // Arbitrarily choose the "centre" of the infinite line to be the position at x = 0, or y = 0 if the line is vertical
  const centre = b === 0
    ? new Vector2(c / a, 0)
    : new Vector2(0, c / b);
  const lineDir = new Vector2(-b, a).normalized();
  const lineStart = centre.add(lineDir.mult(1000));
  const lineEnd = centre.sub(lineDir.mult(1000));

  displayLine
    .attr('x1', canvas.xScale(lineStart.x))
    .attr('y1', canvas.yScale(lineStart.y))
    .attr('x2', canvas.xScale(lineEnd.x))
    .attr('y2', canvas.yScale(lineEnd.y));

  const theta = 180 + 180 * Math.atan2(b, a) / Math.PI;

  // Arbitrarily choose the point on the line at x = 0 as the point around which to rotate
  displayRect
    .attr('width', 2 * GRADIENT_THICKNESS)
    .attr('height', canvas.yDeltaScale(10000))
    .attr('x', canvas.xScale(centre.x) - GRADIENT_THICKNESS)
    .attr('y', canvas.yScale(centre.y + 5000))
    .attr('transform', `rotate(${-theta}, ${canvas.xScale(centre.x)}, ${canvas.yScale(centre.y)})`)
    .style('fill', 'url(#myGrad)');
}