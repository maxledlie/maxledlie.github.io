import RedBlackTree from "./RedBlackTree.js";
import Vector2 from './Vector2.js';

const NODE_RADIUS = 20;
const VERTICAL_GAP = 20;

const svg = d3.select('#container')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .style('background-color', 'cornsilk');

let g = svg.append('g');

let tree = new RedBlackTree();

// Handle input
d3.select('#submitInsert').on('click', () => {
  const currentKey = d3.select('#key').property('value');
  const currentKeyInt = parseInt(currentKey);
  
  if (isNaN(currentKeyInt)) return;

  tree.insert(currentKeyInt);
  redraw();
});

function redraw() {
  g.remove();
  g = svg.append('g');

  renderTree(tree.root, 0, 0);
}

function renderTree(root) {
  const xPos = 0.5 * svg.node().getBoundingClientRect().width;
  const yPos = VERTICAL_GAP + NODE_RADIUS;
  
  g.append('circle')
    .attr('cx', xPos)
    .attr('cy', yPos)
    .attr('r', NODE_RADIUS)
    .style('fill', root.isBlack ? 'black' : 'red')
    .style('stroke', 'dimgray')
    .style('stroke-width', 2);

  g.append('text')
    .attr('x', xPos - 4)
    .attr('y', yPos + 4)
    .style('fill', 'white')
    .text(root.key);

  renderSubtree(root.left, 1, true, new Vector2(xPos, yPos));
  renderSubtree(root.right, 1, false, new Vector2(xPos, yPos));
}

// Renders a tree starting at the given depth and horizontal position by rendering the root node
// and then recursively rendering its subtrees.
function renderSubtree(root, depth, isLeft, parentPos) {
  if (root === null || root.key === null) return;

  const xDelta = (1 / 2 ** (depth + 1)) * (isLeft ? -1 : 1) * svg.node().getBoundingClientRect().width;
  const xPos = parentPos.x + xDelta;
  const yPos = parentPos.y + 2 * NODE_RADIUS + VERTICAL_GAP;
  const pos = new Vector2(xPos, yPos);

  const direction = parentPos.sub(pos).normalized();
  const lineStart = pos.add(direction.mult(NODE_RADIUS));
  const lineEnd = parentPos.sub(direction.mult(NODE_RADIUS));

  g.append('line')
    .attr('x1', lineStart.x)
    .attr('y1', lineStart.y)
    .attr('x2', lineEnd.x)
    .attr('y2', lineEnd.y)
    .style('stroke', 'lightgray')
    .style('stroke-width', 2);

  g.append('circle')
    .attr('cx', xPos)
    .attr('cy', yPos)
    .attr('r', NODE_RADIUS)
    .style('fill', root.isBlack ? 'black' : 'red')
    .style('stroke', 'dimgray')
    .style('stroke-width', 2);

  g.append('text')
    .attr('x', xPos - 4)
    .attr('y', yPos + 4)
    .style('fill', 'white')
    .text(root.key);

  renderSubtree(root.left, depth + 1, true, new Vector2(xPos, yPos));
  renderSubtree(root.right, depth + 1, false, new Vector2(xPos, yPos));
}