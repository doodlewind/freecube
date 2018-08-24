import { initProgram } from '../renderer/shaders'
import { getBuffer } from '../renderer/buffer'
import { renderFrame } from '../renderer/render'
import { F, B, U, D, R, L, INIT_BLOCKS } from './consts'

export class Cube {
  constructor (canvas, moves = []) {
    [this.rX, this.rY, this.__ANIMATING] = [0, 0, false]
    this.blocks = INIT_BLOCKS()
    this.moves = []
    moves.forEach(n => this.move(n))

    if (!canvas) return
    this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
    this.programInfo = initProgram(this.gl)
    this.gl.useProgram(this.programInfo.program)
  }

  animate (move = null, duration = 500) {
    if (move && move.length === 0) return Promise.resolve()
    if (!move || this.__ANIMATING) throw new Error('Unable to animate!')

    // Recursively calling with poped moves, then animate from "inner" to here.
    if (Array.isArray(move) && move.length > 1) {
      const lastMove = move.pop()
      return this.animate(move).then(() => this.animate(lastMove))
    } else if (move.length === 1) move = move[0]

    this.__ANIMATING = true
    let k = move.includes("'") ? 1 : -1
    if (/B|D|L/.test(move)) k = k * -1
    const beginTime = +new Date()
    return new Promise((resolve, reject) => {
      const tick = () => {
        const diff = +new Date() - beginTime
        const percentage = diff / duration
        const face = move.replace("'", '')
        if (percentage < 1) {
          this.render(this.rX, this.rY, face, 90 * percentage * k)
          window.requestAnimationFrame(tick)
        } else {
          this.move(move)
          this.render(this.rX, this.rY, null, 0)
          this.__ANIMATING = false
          resolve()
        }
      }
      window.requestAnimationFrame(tick)
    })
  }

  getBlock ([x, y, z]) {
    return this.blocks[(x + 1) * 9 + (y + 1) * 3 + z + 1]
  }

  move (m) {
    if (Array.isArray(m)) { m.forEach(m => this.move(m)); return this }

    const mapping = {
      'F': () => this.rotate([0, 0, 1], true),
      "F'": () => this.rotate([0, 0, 1], false),
      'B': () => this.rotate([0, 0, -1], true),
      "B'": () => this.rotate([0, 0, -1], false),
      'R': () => this.rotate([1, 0, 0], true),
      "R'": () => this.rotate([1, 0, 0], false),
      'L': () => this.rotate([-1, 0, 0], true),
      "L'": () => this.rotate([-1, 0, 0], false),
      'U': () => this.rotate([0, 1, 0], true),
      "U'": () => this.rotate([0, 1, 0], false),
      'D': () => this.rotate([0, -1, 0], true),
      "D'": () => this.rotate([0, -1, 0], false)
    }
    mapping[m] && mapping[m](); this.moves.push(m)
    return this
  }

  render (rX = 0, rY = 0, moveFace = null, moveAngle = 0) {
    if (!this.gl) throw new Error('Missing WebGL context!')
    this.buffer = getBuffer(this.gl, this.blocks, moveFace, moveAngle)
    renderFrame(this.gl, this.programInfo, this.buffer, rX, rY)
  }

  rotate (center, clockwise = true) {
    const axis = center.indexOf(1) + center.indexOf(-1) + 1
    // Fix y direction in right-handed coordinate system.
    clockwise = center[1] !== 0 ? !clockwise : clockwise
    // Fix directions whose faces are opposite to axis.
    clockwise = center[axis] === 1 ? clockwise : !clockwise

    let cs = [[1, 1], [1, -1], [-1, -1], [-1, 1]] // corner coords
    let es = [[0, 1], [1, 0], [0, -1], [-1, 0]] // edge coords
    const prepareCoord = coord => coord.splice(axis, 0, center[axis])
    cs.forEach(prepareCoord); es.forEach(prepareCoord)
    if (!clockwise) { cs = cs.reverse(); es = es.reverse() }

    // Rotate affected edge and corner blocks.
    const rotateBlocks = ([a, b, c, d]) => {
      const set = (a, b) => { for (let i = 0; i < 6; i++) a[i] = b[i] }
      const tmp = []; set(tmp, a); set(a, d); set(d, c); set(c, b); set(b, tmp)
    }
    const colorsAt = coord => this.getBlock(coord).colors
    rotateBlocks(cs.map(colorsAt)); rotateBlocks(es.map(colorsAt))

    // Roatate all block faces with same rotation.
    const swap = [
      [[F, U, B, D], [L, F, R, B], [L, U, R, D]],
      [[F, D, B, U], [F, L, B, R], [D, R, U, L]]
    ][clockwise ? 0 : 1][axis]
    const rotateFaces = coord => {
      const block = colorsAt(coord)
      ;[block[swap[1]], block[swap[2]], block[swap[3]], block[swap[0]]] =
      [block[swap[0]], block[swap[1]], block[swap[2]], block[swap[3]]]
    }
    cs.forEach(rotateFaces); es.forEach(rotateFaces)
    return this
  }

  shuffle (n = 20, animate = false) {
    const notations = ['F', 'B', 'U', 'D', 'R', 'L']
    const runner = animate ? this.animate.bind(this) : this.move.bind(this)
    return runner(
      [...Array(n)].map(() => notations[parseInt(Math.random() * 6)])
    )
  }
}
