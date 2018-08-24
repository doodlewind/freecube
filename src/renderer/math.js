// Inline from gl-matrix
// https://github.com/toji/gl-matrix

const ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array
const EPSILON = 0.000001

export function create () {
  let out = new ARRAY_TYPE(16)
  if (ARRAY_TYPE !== Float32Array) {
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 0
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[11] = 0
    out[12] = 0
    out[13] = 0
    out[14] = 0
  }
  out[0] = 1
  out[5] = 1
  out[10] = 1
  out[15] = 1
  return out
}

export function perspective (out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2)
  let nf
  out[0] = f / aspect
  out[1] = 0
  out[2] = 0
  out[3] = 0
  out[4] = 0
  out[5] = f
  out[6] = 0
  out[7] = 0
  out[8] = 0
  out[9] = 0
  out[11] = -1
  out[12] = 0
  out[13] = 0
  out[15] = 0
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far)
    out[10] = (far + near) * nf
    out[14] = (2 * far * near) * nf
  } else {
    out[10] = -1
    out[14] = -2 * near
  }
  return out
}

export function translate (out, a, [x, y, z]) {
  let a00, a01, a02, a03
  let a10, a11, a12, a13
  let a20, a21, a22, a23

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
  } else {
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3]
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7]
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11]

    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03
    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13
    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23

    out[12] = a00 * x + a10 * y + a20 * z + a[12]
    out[13] = a01 * x + a11 * y + a21 * z + a[13]
    out[14] = a02 * x + a12 * y + a22 * z + a[14]
    out[15] = a03 * x + a13 * y + a23 * z + a[15]
  }

  return out
}

export function rotate (out, a, rad, [x, y, z]) {
  let len = Math.sqrt(x * x + y * y + z * z)
  let s, c, t
  let a00, a01, a02, a03
  let a10, a11, a12, a13
  let a20, a21, a22, a23
  let b00, b01, b02
  let b10, b11, b12
  let b20, b21, b22

  if (len < EPSILON) { return null }

  len = 1 / len
  x *= len
  y *= len
  z *= len

  s = Math.sin(rad)
  c = Math.cos(rad)
  t = 1 - c

  a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3]
  a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7]
  a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11]

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s
  b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s
  b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02
  out[1] = a01 * b00 + a11 * b01 + a21 * b02
  out[2] = a02 * b00 + a12 * b01 + a22 * b02
  out[3] = a03 * b00 + a13 * b01 + a23 * b02
  out[4] = a00 * b10 + a10 * b11 + a20 * b12
  out[5] = a01 * b10 + a11 * b11 + a21 * b12
  out[6] = a02 * b10 + a12 * b11 + a22 * b12
  out[7] = a03 * b10 + a13 * b11 + a23 * b12
  out[8] = a00 * b20 + a10 * b21 + a20 * b22
  out[9] = a01 * b20 + a11 * b21 + a21 * b22
  out[10] = a02 * b20 + a12 * b21 + a22 * b22
  out[11] = a03 * b20 + a13 * b21 + a23 * b22

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[12] = a[12]
    out[13] = a[13]
    out[14] = a[14]
    out[15] = a[15]
  }
  return out
}

export function rotateX (out, a, b, c) {
  let [p, r] = [[], []]
  // Translate point to the origin
  p[0] = a[0] - b[0]
  p[1] = a[1] - b[1]
  p[2] = a[2] - b[2]

  // perform rotation
  r[0] = p[0]
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c)
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c)

  // translate to correct position
  out[0] = r[0] + b[0]
  out[1] = r[1] + b[1]
  out[2] = r[2] + b[2]

  return out
}

export function rotateY (out, a, b, c) {
  let [p, r] = [[], []]
  // Translate point to the origin
  p[0] = a[0] - b[0]
  p[1] = a[1] - b[1]
  p[2] = a[2] - b[2]

  // perform rotation
  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c)
  r[1] = p[1]
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c)

  // translate to correct position
  out[0] = r[0] + b[0]
  out[1] = r[1] + b[1]
  out[2] = r[2] + b[2]

  return out
}

export function rotateZ (out, a, b, c) {
  let [p, r] = [[], []]
  // Translate point to the origin
  p[0] = a[0] - b[0]
  p[1] = a[1] - b[1]
  p[2] = a[2] - b[2]

  // perform rotation
  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c)
  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c)
  r[2] = p[2]

  // translate to correct position
  out[0] = r[0] + b[0]
  out[1] = r[1] + b[1]
  out[2] = r[2] + b[2]

  return out
}
