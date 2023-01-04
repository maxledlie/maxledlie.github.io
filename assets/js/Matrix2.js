import Vector2 from './Vector2.js';

export default class Matrix2 {
  constructor(arr) {
    this.arr = arr;
  }

  scale(scalar) {
    return new Matrix2([
      [this.arr[0][0] * scalar, this.arr[0][1] * scalar],
      [this.arr[1][0] * scalar, this.arr[1][1] * scalar]
    ]);
  }

  // Premultiplies a vector by this matrix
  apply(vec) {
    return new Vector2(
      this.arr[0][0] * vec.x + this.arr[0][1] * vec.y,
      this.arr[1][0] * vec.x + this.arr[1][1] * vec.y
    );
  }

  // Returns the inverse of the matrix, or null if the matrix is not invertible
  invert() {
    const det = this.det();
    
    if (det === 0) {
      return null;
    }

    const mat = new Matrix2([
      [this.arr[1][1], -this.arr[0][1]],
      [-this.arr[1][0], this.arr[0][0]]
    ]);

    return mat.scale(1 / det);
  }

  det() {
    return this.arr[1][1] * this.arr[0][0] - this.arr[0][1] * this.arr[1][0];
  }
}