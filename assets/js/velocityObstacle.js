import GeometryCanvas from "./GeometryCanvas.js";

// Constants
const TAU = 2;
const WAIT = 1;

// Data
let pointA = [0, 0];
const radiusA = 5;

let pointB = [50, 70];
const radiusB = 8;

const vb = [-30, -50];

const cVel = new GeometryCanvas('#velocitySpace', [-50, 50]);
const cPos = new GeometryCanvas('#positionSpace', [-50, 100]);

// Draw the velocity obstacle
const relPosX = pointB[0] - pointA[0];
const relPosY = pointB[1] - pointA[1];
const combinedRadius = radiusA + radiusB;
const combinedRadiusSq = combinedRadius * combinedRadius;

// Find the gradients of the two lines that pass through the origin and are tangent to the circle
const a = combinedRadiusSq - relPosX * relPosX;
const b = 2 * relPosX * relPosY;
const c = combinedRadiusSq - relPosY * relPosY;

const disc = b * b - 4 * a * c;

if (disc >= 0) {
  const voGroup = cVel.svg.append('g')
    .attr('transform', `translate(${cVel.xDeltaScale(vb[0])}, ${cVel.yDeltaScale(vb[1])})`)

  const m1 = (-b - Math.sqrt(disc)) / (2 * a);
  let alpha = 1 + m1 * m1;
  let beta = -2 * (relPosX + m1 * relPosY);
  const anchor1X = -beta / (2 * alpha * TAU);
  const anchor1Y = m1 * anchor1X;

  const m2 = (-b + Math.sqrt(disc)) / (2 * a);
  alpha = 1 + m2 * m2;
  beta = -2 * (relPosX + m2 * relPosY);
  const anchor2X = -beta / (2 * alpha * TAU);
  const anchor2Y = m2 * anchor2X;

  const circleRadius = cVel.xDeltaScale(combinedRadius / TAU);

  voGroup.append('path')
    .attr('d', `M ${cVel.xScale(anchor1X)} ${cVel.yScale(anchor1Y)}
      A ${circleRadius} ${circleRadius} 0 0 0 ${cVel.xScale(anchor2X)} ${cVel.yScale(anchor2Y)}
      L ${cVel.xScale(100)} ${cVel.yScale(m2 * 100)}
      L ${cVel.xScale(100)} ${cVel.yScale(m1 * 100)}
      Z`)
    .style('stroke', '#333333')
    .style('stroke-width', 2)
    .style('fill', '#b3b3b3')
    .style('opacity', 0.7);
}

// Mark the velocity of agent B
cVel.svg.append('circle')
  .attr('cx', cVel.xScale(vb[0]))
  .attr('cy', cVel.yScale(vb[1]))
  .attr('r', 3)
  .style('fill', '#ff9999');

const g = cPos.svg.append('g');
drawAgents();

cVel.svg.on('click', function(event) {
  const agentA = g.select('#agentA');
  const agentB = g.select('#agentB');

  const velX = cVel.xScale.invert(event.offsetX);
  const velY = cVel.yScale.invert(event.offsetY);

  const finalPosA = [pointA[0] + TAU * velX, pointA[1] + TAU * velY];
  const finalPosB = [pointB[0] + TAU * vb[0], pointB[1] + TAU * vb[1]];

  agentA.interrupt('move');
  agentA.interrupt('wait');

  agentA.transition('move')
    .duration(TAU * 1000)
    .ease(d3.easeLinear)
    .attr('cx', cPos.xScale(finalPosA[0]))
    .attr('cy', cPos.yScale(finalPosA[1]))
    .on('end', () => {
      agentA.transition('wait')
        .duration(WAIT * 1000)
        .on('end', reset)
        .on('interrupt', reset);
    })
    .on('interrupt', reset);

  agentB.transition('move')
    .duration(TAU * 1000)
    .ease(d3.easeLinear)
    .attr('cx', cPos.xScale(finalPosB[0]))
    .attr('cy', cPos.yScale(finalPosB[1]))
    .on('end', () => {
      agentB.transition('wait')
        .duration(WAIT * 1000)
        .on('end', reset)
        .on('interrupt', reset);
    })
    .on('interrupt', reset);
})

function reset() {
  g.select('#agentA')
    .attr('cx', cPos.xScale(pointA[0]))
    .attr('cy', cPos.yScale(pointA[1]))

  g.select('#agentB')
    .attr('cx', cPos.xScale(pointB[0]))
    .attr('cy', cPos.yScale(pointB[1]));
}

function drawAgents() {
  g.selectAll('*').remove();

  // Draw circles
  g.append('circle')
    .attr('id', 'agentA')
    .attr('cx', cPos.xScale(pointA[0]))
    .attr('cy', cPos.yScale(pointA[1]))
    .attr('r', cPos.xDeltaScale(radiusA))
    .style('fill', '#9999ff')
    .style('stroke', '#000066')
    .style('stroke-width', 2);

  g.append('circle')
    .attr('id', 'agentB')
    .attr('cx', cPos.xScale(pointB[0]))
    .attr('cy', cPos.yScale(pointB[1]))
    .attr('r', cPos.xDeltaScale(radiusB))
    .style('fill', '#ff9999')
    .style('stroke', '#800000')
    .style('stroke-width', 2);
}