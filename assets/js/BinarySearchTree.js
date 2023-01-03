class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

export default class BinarySearchTree {
  constructor(compare = defaultComparer) {
    this.compare = compare;
    this.root = null;
  }

  insertNode(node) {
    let pointer = this.root;
    let pointerParent = null;
    while (pointer !== null) {
      pointerParent = pointer;
      pointer = this.compare(node.data, pointer.data) < 0 ? pointer.left : pointer.right;
    }
    node.parent = pointerParent;

    if (node.parent === null) {
      this.root = node;
    } else if (this.compare(node.data, node.parent.data) < 0) {
      node.parent.left = node;
    } else {
      node.parent.right = node;
    }
  }

  insert(value) {
    const node = new Node(value);
    this.insertNode(node);
  }
}

function defaultComparer(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }

  return 0;
}