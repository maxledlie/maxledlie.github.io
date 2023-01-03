class Node {
  constructor(key, isBlack) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.isBlack = isBlack;
  }
}

export default class RedBlackTree {
  constructor(compare = defaultComparer) {
    this.compare = compare;
    this.nil = new Node(null, true);
    this.root = this.nil;
  }

  #leftRotate(x) {
    const y = x.right;
    x.right = y.left;
    
    if (y.left !== this.nil) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === this.nil) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  #rightRotate(y) {
    const x = y.left;
    y.left = x.right;

    if (x.right !== this.nil) {
      x.right.parent = y;
    }

    x.parent = y.parent;
    
    if (y.parent === this.nil) {
      this.root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }

    x.right = y;
    y.parent = x;
  }

  #insertNode(node) {
    let pointer = this.root;
    let pointerParent = this.nil;

    while (pointer !== this.nil) {
      pointerParent = pointer;
      pointer = this.compare(node.key, pointer.key) < 0 ? pointer.left : pointer.right;
    }

    node.parent = pointerParent;

    if (pointerParent === this.nil) {
      this.root = node;
    } else if (this.compare(node.key, pointerParent.key) < 0) {
      pointerParent.left = node;
    } else {
      pointerParent.right = node;
    }

    node.left = this.nil;
    node.right = this.nil;
    node.isBlack = false;

    this.#insertFixup(node);
  }

  #insertFixup(z) {
    while (!z.parent.isBlack) {
      if (z.parent === z.parent.parent.left) {
        const y = z.parent.parent.right;
        if (!y.isBlack) {
          z.parent.isBlack = true;
          y.isBlack = true;
          z.parent.parent.isBlack = false;
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this.#leftRotate(z);
          }
          z.parent.isBlack = true;
          z.parent.parent.isBlack = false;
          this.#rightRotate(z.parent.parent);
        }
      } else {
        const y = z.parent.parent.left;
        if (!y.isBlack) {
          z.parent.isBlack = true;
          y.isBlack = true;
          z.parent.parent.isBlack = false;
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.#rightRotate(z);
          }
          z.parent.isBlack = true;
          z.parent.parent.isBlack = false;
          this.#leftRotate(z.parent.parent);
        }
      }
    }
  }

  insert(key) {
    const node = new Node(key, false);
    this.#insertNode(node);
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