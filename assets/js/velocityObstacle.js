const width = 500;
const height = 500;

const tau = 300;

const axisPadding = 30;

let pointA = [20, 20];
const radiusA = 5;

let pointB = [80, 70];
const radiusB = 8;

const svg = d3.select('#velocityObstacleDemo')
  .append('svg')
    .attr('width', width)
    .attr('height', height);

// Set up axes
const yAxis = svg.append('g')
  .attr('transform', `translate(${axisPadding}, ${axisPadding})`);

const xAxis = svg.append('g')
  .attr('transform', `translate(${axisPadding}, ${axisPadding + 400})`);

const x = d3.scaleLinear().domain([0, 100]).range([0, 400]);
const y = d3.scaleLinear().domain([0, 100]).range([400, 0]);

const axisLeft = d3.axisLeft(y);
const axisBottom = d3.axisBottom(x);

yAxis.call(axisLeft);
xAxis.call(axisBottom);

const g = svg.append('g').attr('transform', `translate(${axisPadding}, ${axisPadding})`);
render();

svg.on('click', function(event) {
  // const newPointA = [x.invert(event.offsetX - axisPadding), y.invert(event.offsetY - axisPadding)];

  const agentA = g.select('#agentA');
  agentA.transition()
    .duration(tau)
    .ease(d3.easeLinear)
    .attr('cx', event.offsetX - axisPadding)
    .attr('cy', event.offsetY - axisPadding);
})

function render() {
  g.selectAll('*').remove();

  // Draw circles
  g.append('circle')
    .attr('id', 'agentA')
    .attr('cx', x(pointA[0]))
    .attr('cy', y(pointA[1]))
    .attr('r', x(radiusA));

  g.append('circle')
    .attr('cx', x(pointB[0]))
    .attr('cy', y(pointB[1]))
    .attr('r', x(radiusB));
}