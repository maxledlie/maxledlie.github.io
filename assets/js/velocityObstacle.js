// Constants
const TAU = 1;
const WAIT = 1;
const AXIS_PADDING = 30;

// Data
let pointA = [20, 20];
const radiusA = 5;

let pointB = [50, 70];
const radiusB = 8;

function defineAxes(container, svg, targetDomain) {
  const size = container.node().getBoundingClientRect();

  const isPortrait = size.height > size.width;
  const aspectRatio = (size.width - 2 * AXIS_PADDING) / (size.height - 2 * AXIS_PADDING);
  
  // Set up axes
  const yAxis = svg.append('g')
    .attr('transform', `translate(${AXIS_PADDING}, 0)`);
  
  const xAxis = svg.append('g')
    .attr('transform', `translate(0, ${size.height - AXIS_PADDING})`);
  
  const x = d3.scaleLinear()
    .domain([targetDomain[0], isPortrait ? targetDomain[1] * aspectRatio : targetDomain[1]])
    .range([AXIS_PADDING, size.width - AXIS_PADDING]);
  
  const delta = x.copy().range([0, size.width - 2 * AXIS_PADDING]);
  
  const y = d3.scaleLinear()
    .domain([targetDomain[0], isPortrait ? targetDomain[1] : targetDomain[1] * aspectRatio])
    .range([size.height - AXIS_PADDING, AXIS_PADDING]);

  const axisLeft = d3.axisLeft(y);
  const axisBottom = d3.axisBottom(x);
  
  yAxis.call(axisLeft);
  xAxis.call(axisBottom);
  
  return [x, y, delta];
}

const positionContainer = d3.select('#positionSpace');
const positionSvg = positionContainer.append('svg')
  .attr('width', '100%')
  .attr('height', '100%');
const [xPos, yPos, deltaPos] = defineAxes(positionContainer, positionSvg, [0, 100]);

const velocityContainer = d3.select('#velocitySpace');
const velocitySvg = velocityContainer.append('svg')
  .attr('width', '100%')
  .attr('height', '100%');
const [xVel, yVel, deltaVel] = defineAxes(velocityContainer, velocitySvg, [0, 80]);

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
  const voGroup = velocitySvg.append('g');

  const m1 = (-b - Math.sqrt(disc)) / (2 * a);
  let alpha = 1 + m1 * m1;
  let beta = -2 * (relPosX + m1 * relPosY);
  const anchor1X = -beta / (2 * alpha * TAU);
  const anchor1Y = m1 * anchor1X / TAU;

  const m2 = (-b + Math.sqrt(disc)) / (2 * a);
  alpha = 1 + m2 * m2;
  beta = -2 * (relPosX + m2 * relPosY);
  const anchor2X = -beta / (2 * alpha * TAU);
  const anchor2Y = m2 * anchor2X / TAU;

  const circleRadius = deltaVel(combinedRadius / TAU);

  voGroup.append('path')
    .attr('d', `M ${xVel(anchor1X)} ${yVel(anchor1Y)}
      A ${circleRadius} ${circleRadius} 0 0 0 ${xVel(anchor2X)} ${yVel(anchor2Y)}
      L ${xVel(100)} ${yVel(m2 * 100)}
      L ${xVel(100)} ${yVel(m1 * 100)}
      Z`)
    .style('stroke', '#800000')
    .style('stroke-width', 2)
    .style('fill', '#ff9999');
}

const g = positionSvg.append('g');
drawAgents();

velocitySvg.on('click', function(event) {
  const agentA = g.select('#agentA');

  const velX = xVel.invert(event.offsetX);
  const velY = yVel.invert(event.offsetY);

  const finalPosX = pointA[0] + TAU * velX;
  const finalPosY = pointA[1] + TAU * velY;

  agentA.interrupt('move');
  agentA.interrupt('wait');

  agentA.transition('move')
    .duration(TAU * 1000)
    .ease(d3.easeLinear)
    .attr('cx', xPos(finalPosX))
    .attr('cy', yPos(finalPosY))
    .on('end', () => {
      agentA.transition('wait')
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
}

function drawAgents() {
  g.selectAll('*').remove();

  // Draw circles
  g.append('circle')
    .attr('id', 'agentA')
    .attr('cx', xPos(pointA[0]))
    .attr('cy', yPos(pointA[1]))
    .attr('r', deltaPos(radiusA))
    .style('fill', '#9999ff')
    .style('stroke', '#000066')
    .style('stroke-width', 2);

  g.append('circle')
    .attr('cx', xPos(pointB[0]))
    .attr('cy', yPos(pointB[1]))
    .attr('r', deltaPos(radiusB))
    .style('fill', '#ff9999')
    .style('stroke', '#800000')
    .style('stroke-width', 2);
}