import GeometryCanvas from './GeometryCanvas.js';
import Vector2 from './Vector2.js';
import Matrix2 from './Matrix2.js';

// Represents the set of points (x, y) in R^2 such that a*x + b*y <= c
class HalfPlane {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.perp = new Vector2(this.a, this.b).normalized();
  }

  static horizontal(y, side) {
    return new HalfPlane(0, side ? -1 : 1, side ? -y : y);
  }

  static vertical(x, side) {
    return new HalfPlane(side ? -1 : 1, 0, side ? -x : x);
  }

  isHorizontal() {
    return this.a === 0;
  }

  isVertical() {
    return this.b === 0;
  }

  gradient() {
    return -this.a / this.b;
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

  // Returns the y position of the vertex at the bottom of the i'th edge on the given side
  // Side is specified as 'left' or 'right'
  getBottomY(side, i) {
    const edges = side === 'left' ? this.left : this.right;
    const otherEdges = side === 'left' ? this.right : this.left;

    if (i < edges.length - 1) {
      return findIntersection(edges[i], edges[i+1]).y;
    }

    // No more edges on this side. Bottom vertex is the intersection with the lowest edge
    // on the other side if it exists.
    if (otherEdges.length > 0) {
      const other = otherEdges[otherEdges.length - 1];
      if (edges[i].perp.equals(other.perp) || edges[i].perp.equals(other.perp.neg())) {
        return -Infinity;
      } else { 
        return findIntersection(edges[i], otherEdges[otherEdges.length - 1]).y;
      }
    }

    return -Infinity;
  }

  // Returns the highest y position contained in this region, or Infinity if the region is unbounded.
  // Also returns pointers to the left and right edges that define this bound, or null if not involved.
  getMaxY() {
    // At least one right edge and at least one left edge
    if (this.left.length > 0 && this.right.length > 0) {
      const topLeft = this.left[0];
      const topRight = this.right[0];

      // Special case when edges are parallel or anti-parallel
      if (topLeft.perp.equals(topRight.perp.neg())) {
        return this.left[0].isHorizontal()
          ? [topLeft.c / topLeft.b, 0, 0]
          : [Infinity, null, null];
      } else {
        return [findIntersection(this.left[0], this.right[0]).y, 0, 0];
      }
    } else {
      // Special cases when only one edge...

      // No left (or top) edges, but at least one right (or bottom) edge: The region is unbounded in +y.
      if (this.right.length > 0 && this.left.length === 0) {
        return [Infinity, null, null];
      }

      // No right (or bottom) edges, but at least one left (or top) edge: The region is unbounded in +y
      // UNLESS there is a top edge, in which case it defines a bound
      if (this.left.length > 0 && this.right.length === 0) {
        return this.left[0].isHorizontal()
          ? [this.left[0].c / this.left[0].b, 0, null]
          : [Infinity, null, null];
      }
    }
  }

  numEdges() {
    return this.left.length + this.right.length;
  }

  static R2 = new ConvexRegion([], []);
}

function intersectHalfPlanes(halfPlanes) {
  if (halfPlanes.length === 0) {
    return ConvexRegion.R2;
  }

  if (halfPlanes.length === 1) {
    const halfPlane = halfPlanes[0];
    if (halfPlane.isHorizontal()) {
      if (halfPlane.b > 0) {
        return new ConvexRegion([halfPlane], []);
      } else {
        return new ConvexRegion([], [halfPlane]);
      }
    } else {
      if (halfPlane.a > 0) {
        return new ConvexRegion([], [halfPlane]);
      } else {
        return new ConvexRegion([halfPlane], []);
      }
    }
  }

  const h1 = halfPlanes.slice(0, Math.ceil(halfPlanes.length / 2));
  const h2 = halfPlanes.slice(Math.ceil(halfPlanes.length / 2), halfPlanes.length);

  const c1 = intersectHalfPlanes(h1);
  const c2 = intersectHalfPlanes(h2);
  
  return intersectConvexRegions(c1, c2);
}

function intersectConvexRegions(c1, c2) {
  // Handle special cases with two parallel or anti-parallel half-planes
  if (c1.numEdges() === 1 && c2.numEdges() === 1) {
    const h1 = c1.left.length > 0 ? c1.left[0] : c1.right[0];
    const h2 = c2.left.length > 0 ? c2.left[0] : c2.right[0];

    // Parallel: We want to keep the 'outer' line. Determine which this is by picking an
    // arbitrary point on each line and finding the vector between these points.
    // The 'outer' line will be the one whose perp vector dotted with the displacement
    // vector to the other point is negative
    if (h1.perp.equals(h2.perp)) {
      if (h1.isVertical()) {
        const perpPointsLeft = h1.a < 0;
        const x1 = h1.c / h1.a;
        const x2 = h2.c / h2.a;
        if (perpPointsLeft) {
          const relevantHalfPlane = HalfPlane.vertical(Math.min(x1, x2), true);
          return new ConvexRegion([relevantHalfPlane], []);
        }
      }

      const sample1 = new Vector2(0, h1.c / h1.b);
      const sample2 = new Vector2(0, h2.c / h2.b);
      const delta = sample2.sub(sample1);

      const isLeft = h1.perp.x < 0;
      const relevantHalfPlane = h1.perp.dot(delta) < 0 ? h1 : h2;

      return isLeft
        ? new ConvexRegion([relevantHalfPlane], [])
        : new ConvexRegion([], [relevantHalfPlane]);
    } 
    // Anti-parallel: Keep both half-planes as a left and right edge
    else if (h1.perp.equals(h2.perp.neg())) {
      const h1Left = h1.perp.x < 0 || (h1.isVertical() && h1.perp.y > 0);
      return h1Left
        ? new ConvexRegion([h1], [h2])
        : new ConvexRegion([h2], [h1]);
    }
  }

  let [y1, leftEdgeC1, rightEdgeC1] = c1.getMaxY();
  let [y2, leftEdgeC2, rightEdgeC2] = c2.getMaxY();

  let yStart = Math.min(y1, y2);

  // If there are no intersections (i.e. each region consists of two parallel lines), then
  // we start our sweep at the first intersection between lines in the different regions.
  if (!isFinite(yStart)) {
    const iLL = findIntersection(c1.left[0], c2.left[0]);
    const iLR = findIntersection(c1.left[0], c2.right[0]);
    const iRL = findIntersection(c1.right[0], c2.left[0]);
    const iRR = findIntersection(c1.right[0], c2.right[0]);
    yStart = Math.max(iLL.y, iLR.y, iRL.y, iRR.y);
  }

  // The next event point is the highest of the lower endpoints of the edges intersecting
  // the sweep line.

  const c1LY = leftEdgeC1 !== null ? c1.getBottomY('left', leftEdgeC1) : -Infinity;
  const c2LY = leftEdgeC2 !== null ? c2.getBottomY('left', leftEdgeC2) : -Infinity;
  const c1RY = rightEdgeC1 !== null ? c1.getBottomY('right', rightEdgeC1) : -Infinity;
  const c2RY = rightEdgeC2 !== null ? c2.getBottomY('right', rightEdgeC2) : -Infinity;

  const eventY = Math.max(c1LY, c2LY, c1RY, c2RY);

  if (!isFinite(eventY)) {
    return 
  }
}

function findIntersection(h1, h2) {
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
    return null;
  }

  return mat.invert().apply(cVec);
}

function boundConvexRegionVertically(c, yMin, yMax) {
  const top = HalfPlane.horizontal(yMax, false);
  const bottom = HalfPlane.horizontal(yMin, true);

  const indexOfLeftEdgeIntersectingTop = _.maxBy(_.range(c.left.length), i => {
    const intersection = findIntersection(c.left[i], top);
    return intersection !== null ? intersection.x : -Infinity;
  });

  const indexOfLeftEdgeIntersectingBottom = _.maxBy(_.range(c.left.length), i => {
    const intersection = findIntersection(c.right[i], bottom);
    return intersection !== null ? intersection.x : -Infinity;
  });

  const leftBounds = [
    top,
    ...c.left.slice(indexOfLeftEdgeIntersectingTop, indexOfLeftEdgeIntersectingBottom + 1),
  ];

  const indexOfRightEdgeIntersectingTop = _.minBy(_.range(c.right.length), i => {
    const intersection = findIntersection(c.right[i], top);
    return intersection !== null ? intersection.x : Infinity;
  });

  const indexOfRightEdgeIntersectingBottom = _.minBy(_.range(c.right.length), i => {
    const intersection = findIntersection(c.right[i], bottom);
    return intersection !== null ? intersection.x : Infinity;
  });

  const rightBounds = [
    ...c.right.slice(indexOfRightEdgeIntersectingTop, indexOfRightEdgeIntersectingBottom + 1),
    bottom
  ];

  return new ConvexRegion(leftBounds, rightBounds);
}

function boundConvexRegionHorizontally(c, xMin, xMax) {
  function getNextEdgeLeft(i) {
    if (i < c.left.length - 1) {
      return c.left[i + 1];
    }

    if (c.right.length === 0) {
      return null;
    }

    const rightEdge = c.right[c.right.length - 1];

    // If this left edge is shallower than the last right edge, we will never meet it
    const thisGrad = c.left[i].gradient();
    const rightGrad = rightEdge.gradient();

    if (thisGrad <= rightGrad) {
      return null;
    }

    return rightEdge;
  }

  function endsLeftOfXMin(i) {
    const nextEdge = i === c.left.length - 1
      ? c.right.length > 0
        ? c.right[0]
        : null
      : c.left[i + 1];

    const endpoint = nextEdge === null
      ? null
      : findIntersection(c.left[i], nextEdge);
      
    return endpoint === null || endpoint.x < xMin;
  }

  function endsRightOfXMax(i) {
    const nextEdge = i === c.right.length - 1
      ? c.left.length > 0
        ? c.left[0]
        : null
      : c.right[i + 1];

    const endpoint = nextEdge === null
      ? null
      : findIntersection(c.right[i], nextEdge);

    return endpoint === null || endpoint.x > xMax;
  }

  const leftEdgeMarker1 = _.find(_.range(c.left.length), i => endsLeftOfXMin(i) && c.left[i].b > 0);
  const leftEdgeMarker2 = _.findLast(_.range(c.left.length), i => endsLeftOfXMin(i) && c.left[i].b < 0) + 1;

  const rightEdgeMarker1 = _.find(_.range(c.right.length), i => endsRightOfXMax(i) && c.right[i].b > 0);
  const rightEdgeMarker2 = _.findLast(_.range(c.right.length), i=> endsRightOfXMax(i) && c.right[i].b < 0);

  const leftBounds = [
    ...(isNaN(leftEdgeMarker1) ? [] : c.left.slice(0, leftEdgeMarker1 + 1)),
    HalfPlane.vertical(xMin, true),
    ...(isNaN(leftEdgeMarker2) ? [] : c.left.slice(leftEdgeMarker2))
  ];

  const rightBounds = [
    ...(isNaN(rightEdgeMarker1) ? [] : c.right.slice(0, rightEdgeMarker1 + 1)),
    HalfPlane.vertical(xMax, false),
    ...(isNaN(rightEdgeMarker2) ? [] : c.right.slice(rightEdgeMarker2))
  ];

  return new ConvexRegion(leftBounds, rightBounds);
}

// Adds a shape to the canvas representing the passed convex region c.
// This assumes that c is bounded.
function renderConvexRegion(c, id) {
  const existingPath = d3.select(`#${id}`);
  const path = existingPath.empty() ? canvas.svg.append('path').attr('id', id) : existingPath;

  const xMin = DOMAIN[0] - 100;
  const yMin = DOMAIN[0] - 100;
  const xMax = DOMAIN[1] + 100;
  const yMax = DOMAIN[1] + 100;

  // Bound the region by inserting the viewport edges into its edge lists.
  const boundedVertically = boundConvexRegionVertically(c, yMin, yMax);
  const bounded = boundConvexRegionHorizontally(boundedVertically, xMin, xMax);

  const rightEdgesReversed = [...bounded.right].reverse();
  const edges = [...bounded.left, ...rightEdgesReversed];
  const start = findIntersection(edges[0], edges[edges.length - 1]);
  const vertices = [start];
  for (let i = 0; i < edges.length - 1; i++) {
    vertices.push(findIntersection(edges[i], edges[i+1]));
  }

  let pathData = `M ${canvas.xScale(vertices[0].x)} ${canvas.yScale(vertices[0].y)} `;
  for (let i = 1; i < vertices.length; i++) {
    pathData += `L ${canvas.xScale(vertices[i].x)} ${canvas.yScale(vertices[i].y)} `;
  }
  pathData += 'Z';

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
let currentHalfPlane = HalfPlane.vertical(-Infinity, true);

// Initialise the half planes with boundaries off the edge of the screen so we don't have to deal with
// unbounded regions.
const halfPlanes = [
  // new HalfPlane(-1, -1, -10), 
  // new HalfPlane(1, 1, 60),
  // new HalfPlane(1, -1, 0),
  // new HalfPlane(-1, 1, 30)
];

const convexRegion = intersectHalfPlanes(halfPlanes);
renderConvexRegion(convexRegion, 'region');

halfPlanes.forEach(h => addHalfPlane(h));

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

  currentHalfPlane = new HalfPlane(a, b, c);

  updateHalfPlane(currentHalfPlane, currentLine, currentRect);

  const region = intersectHalfPlanes([...halfPlanes, currentHalfPlane]);
  renderConvexRegion(region, 'region');
});

canvas.svg.on('mouseup', e => {
  currentPerp.remove();
  currentPerp = null;
  currentLine = null;
  currentRect = null;
  halfPlanes.push(currentHalfPlane);
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