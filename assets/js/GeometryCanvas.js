const AXIS_PADDING = 30;

export default class GeometryCanvas {
  constructor(containerId, targetDomain) {
    const container = d3.select(containerId);
    const size = container.node().getBoundingClientRect();

    const svg = container.append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    const isPortrait = size.height > size.width;
    const aspectRatio = (size.width - 2 * AXIS_PADDING) / (size.height - 2 * AXIS_PADDING);
    
    const truncateFactorX = isPortrait ? aspectRatio : 1;
    const x = d3.scaleLinear()
      .domain([truncateFactorX * targetDomain[0], truncateFactorX * targetDomain[1]])
      .range([AXIS_PADDING, size.width - AXIS_PADDING]);
    
    const truncateFactorY = isPortrait ? 1 : 1 / aspectRatio;
    const y = d3.scaleLinear()
      .domain([truncateFactorY * targetDomain[0], truncateFactorY * targetDomain[1]])
      .range([size.height - AXIS_PADDING, AXIS_PADDING]);

    const xDelta = d3.scaleLinear()
      .domain([0, 1])
      .range([0, Math.abs(x(1) - x(0))]);

    const yDelta = d3.scaleLinear()
      .domain([0, 1])
      .range([0, Math.abs(y(1) - y(0))]);

    const axisLeft = d3.axisLeft(y);
    const axisBottom = d3.axisBottom(x);

    const yAxis = svg.append('g')
      .attr('transform', `translate(${x(0)}, 0)`);

    const xAxis = svg.append('g')
      .attr('transform', `translate(0, ${y(0)})`);
    
    yAxis.call(axisLeft);
    xAxis.call(axisBottom);
    
    this.xScale = x;
    this.yScale = y;
    this.xDeltaScale = xDelta;
    this.yDeltaScale = yDelta;
    this.svg = svg;
    this.g = svg.append('g');
  }

  line(p1, p2, style) {
    const line = this.g.append('line')
      .attr('x1', this.xScale(p1[0]))
      .attr('y1', this.yScale(p1[1]))
      .attr('x2', this.xScale(p2[0]))
      .attr('y2', this.yScale(p2[1]));

    for (const prop in style) {
      line.style(prop, style[prop]);
    }

    return line;
  }
}