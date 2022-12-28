// Constants
const TAU = 2;
const WAIT = 1;
const AXIS_PADDING = 30;

// Data
let pointA = [0, 0];
const radiusA = 5;

let pointB = [50, 70];
const radiusB = 8;

const vb = [-30, -50];

function defineAxes(container, svg, targetDomain) {
  const size = container.node().getBoundingClientRect();

  const isPortrait = size.height > size.width;
  const aspectRatio = (size.width - 2 * AXIS_PADDING) / (size.height - 2 * AXIS_PADDING);
  
  const truncateFactorX = isPortrait ? aspectRatio : 1;
  const x = d3.scaleLinear()
    .domain([truncateFactorX * targetDomain[0], truncateFactorX * targetDomain[1]])
    .range([AXIS_PADDING, size.width - AXIS_PADDING]);
  
  const truncateFactorY = isPortrait ? 1 : aspectRatio;
  const y = d3.scaleLinear()
    .domain([truncateFactorY * targetDomain[0], truncateFactorY * targetDomain[1]])
    .range([size.height - AXIS_PADDING, AXIS_PADDING]);

  const xDelta = d3.scaleLinear()
    .domain([0, 1])
    .range([0, x(1) - x(0)]);

  const yDelta = d3.scaleLinear()
    .domain([0, 1])
    .range([0, y(1) - y(0)]);

  const axisLeft = d3.axisLeft(y);
  const axisBottom = d3.axisBottom(x);

  const yAxis = svg.append('g')
    .attr('transform', `translate(${x(0)}, 0)`);

  const xAxis = svg.append('g')
    .attr('transform', `translate(0, ${y(0)})`);
  
  yAxis.call(axisLeft);
  xAxis.call(axisBottom);
  
  return [x, y, xDelta, yDelta];
}

const positionContainer = d3.select('#positionSpace');
const positionSvg = positionContainer.append('svg')
  .attr('width', '100%')
  .attr('height', '100%');
const [xPos, yPos, xDeltaPos, yDeltaPos] = defineAxes(positionContainer, positionSvg, [-50, 100]);

const velocityContainer = d3.select('#velocitySpace');
const velocitySvg = velocityContainer.append('svg')
  .attr('width', '100%')
  .attr('height', '100%');
const [xVel, yVel, xDeltaVel, yDeltaVel] = defineAxes(velocityContainer, velocitySvg, [-50, 50]);

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
  const voGroup = velocitySvg.append('g')
    .attr('transform', `translate(${xDeltaVel(vb[0])}, ${yDeltaVel(vb[1])})`)

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

  const circleRadius = xDeltaVel(combinedRadius / TAU);

  voGroup.append('path')
    .attr('d', `M ${xVel(anchor1X)} ${yVel(anchor1Y)}
      A ${circleRadius} ${circleRadius} 0 0 0 ${xVel(anchor2X)} ${yVel(anchor2Y)}
      L ${xVel(100)} ${yVel(m2 * 100)}
      L ${xVel(100)} ${yVel(m1 * 100)}
      Z`)
    .style('stroke', '#333333')
    .style('stroke-width', 2)
    .style('fill', '#b3b3b3')
    .style('opacity', 0.7);
}

// Mark the velocity of agent B
velocitySvg.append('circle')
  .attr('cx', xVel(vb[0]))
  .attr('cy', yVel(vb[1]))
  .attr('r', 3)
  .style('fill', '#ff9999');

const g = positionSvg.append('g');
drawAgents();

velocitySvg.on('click', function(event) {
  const agentA = g.select('#agentA');
  const agentB = g.select('#agentB');

  const velX = xVel.invert(event.offsetX);
  const velY = yVel.invert(event.offsetY);

  const finalPosA = [pointA[0] + TAU * velX, pointA[1] + TAU * velY];
  const finalPosB = [pointB[0] + TAU * vb[0], pointB[1] + TAU * vb[1]];

  agentA.interrupt('move');
  agentA.interrupt('wait');

  agentA.transition('move')
    .duration(TAU * 1000)
    .ease(d3.easeLinear)
    .attr('cx', xPos(finalPosA[0]))
    .attr('cy', yPos(finalPosA[1]))
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
    .attr('cx', xPos(finalPosB[0]))
    .attr('cy', yPos(finalPosB[1]))
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
    .attr('cx', xPos(pointA[0]))
    .attr('cy', yPos(pointA[1]))

  g.select('#agentB')
    .attr('cx', xPos(pointB[0]))
    .attr('cy', yPos(pointB[1]));
}

function drawAgents() {
  g.selectAll('*').remove();

  // Draw circles
  g.append('circle')
    .attr('id', 'agentA')
    .attr('cx', xPos(pointA[0]))
    .attr('cy', yPos(pointA[1]))
    .attr('r', xDeltaPos(radiusA))
    .style('fill', '#9999ff')
    .style('stroke', '#000066')
    .style('stroke-width', 2);

  g.append('circle')
    .attr('id', 'agentB')
    .attr('cx', xPos(pointB[0]))
    .attr('cy', yPos(pointB[1]))
    .attr('r', xDeltaPos(radiusB))
    .style('fill', '#ff9999')
    .style('stroke', '#800000')
    .style('stroke-width', 2);
}