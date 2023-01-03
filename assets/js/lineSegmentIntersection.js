import GeometryCanvas from "./GeometryCanvas.js";
import Vector2 from './Vector2.js';
import Matrix2 from './Matrix2.js';

const DOMAIN = [0, 100];
const NUM_SEGMENTS = 20;

const canvas = new GeometryCanvas('#container', DOMAIN);
const xMin = Math.min(...canvas.xScale.domain());
const xMax = Math.max(...canvas.xScale.domain());
const yMin = Math.min(...canvas.yScale.domain());
const yMax = Math.max(...canvas.yScale.domain());

// Generate random line segments
let segments = [];
for (let i = 0; i < NUM_SEGMENTS; i++) {
  const x1 = xMin + Math.random() * (xMax - xMin);
  const x2 = xMin + Math.random() * (xMax - xMin);
  const y1 = yMin + Math.random() * (yMax - yMin);
  const y2 = yMin + Math.random() * (yMax - yMin);
  
  segments.push([new Vector2(x1, y1), new Vector2(x2, y2)]);
  canvas.line([x1, y1], [x2, y2], {'stroke': 'darkgray', 'stroke-width': 2});
}

// Returns the intersection point of the lines defined by two segments, or null if the lines are parallel
function getIntersection(segmentA, segmentB) {
  const p1 = segmentA[0];
  const v1 = segmentA[1].sub(segmentA[0]);
  const p2 = segmentB[0];
  const v2 = segmentB[1].sub(segmentB[0]);

  const mat = new Matrix2([
    [v1.x, -v2.x],
    [v1.y, -v2.y]
  ]);

  const inverse = mat.invert();

  const startDelta = segmentB[0].sub(segmentA[0]);
  const fractions = inverse.apply(startDelta);

  const s = fractions.x;
  const t = fractions.y;

  if (s < 0 || s > 1 || t < 0 || t > 1) return null;

  return p1.add(v1.mult(fractions.x));
}

for (let i = 0; i < NUM_SEGMENTS; i++) {
  for (let j = i + 1; j < NUM_SEGMENTS; j++) {
    const intersection = getIntersection(segments[i], segments[j]);

    if (intersection !== null) {
      canvas.svg.append('circle')
        .attr('cx', canvas.xScale(intersection.x))
        .attr('cy', canvas.yScale(intersection.y))
        .attr('r', 5)
        .style('fill', 'black');
    }
  }
}