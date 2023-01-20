export default class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  mult(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  div(scalar) {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  
  normalized() {
    const mag = this.mag();
    if (mag === 0) return new Vector2(0, 0);
    return this.div(mag);
  }

  equals(other, eps = 0) {
    return Math.abs(this.x - other.x) <= eps && Math.abs(this.y - other.y) <= eps;
  }

  neg() {
    return new Vector2(-this.x, -this.y);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
}