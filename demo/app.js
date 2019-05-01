// Use `parcel index.html` for running this demo.

/* eslint-env browser */
import { Cube } from '../src/model/cube.js'
import { Solver } from '../src/model/solver.js'

const $canvas = document.querySelector('#glcanvas')
const cube = new Cube($canvas, JSON.parse(localStorage.moves || '[]'))
const solver = new Solver(cube)

const isMobile = window.orientation > -1
const [E_START, E_MOVE, E_END] = isMobile
  ? ['touchstart', 'touchmove', 'touchend']
  : ['mousedown', 'mousemove', 'mouseup']

let [rX, rY] = [30, -45]

$canvas.addEventListener(E_START, e => {
  e.preventDefault()
  const _e = isMobile ? e.touches[0] : e
  const [baseX, baseY] = [_e.clientX, _e.clientY]
  const [_rX, _rY] = [rX, rY]

  const onMove = e => {
    const _e = isMobile ? e.touches[0] : e
    const [moveX, moveY] = [_e.clientX, _e.clientY]
    const baseSize = document.body.clientWidth / 2
    const percentX = (moveX - baseX) / baseSize
    const percentY = (moveY - baseY) / baseSize
    rX = _rX + 180 * percentY; rY = _rY + 180 * percentX
    cube.rX = rX; cube.rY = rY
    if (!cube.__ANIMATING) cube.render(rX, rY)
  }
  const onEnd = e => {
    document.removeEventListener(E_MOVE, onMove)
    document.removeEventListener(E_END, onEnd)
  }
  document.addEventListener(E_MOVE, onMove)
  document.addEventListener(E_END, onEnd)
})

const flat = arr => {
  if (arr.includes(null)) return []
  else if (arr.every(x => typeof x === 'string')) return arr
  return arr.reduce((a, b) => [...a, ...b], [])
}

const rules = [
  { id: 'btn-shuffle', ops: () => cube.shuffle(20, true) },
  { id: 'btn-cross', ops: () => cube.animate(flat(solver.solveCross())) },
  { id: 'btn-f2l', ops: () => cube.animate(flat(solver.solveF2L() || [])) },
  { id: 'btn-oll', ops: () => cube.animate(flat(solver.solveOLL() || [])) },
  { id: 'btn-pll', ops: () => cube.animate(flat(solver.solvePLL() || [])) }
]
rules.forEach(rule => {
  document.getElementById(rule.id).addEventListener('click', rule.ops)
})
document.getElementById('help').addEventListener('click', () => {
  alert(`Shuffle: 随机打乱
Cross: 还原底部十字
F2L: 还原底部两层
OLL: 还原顶面颜色
PLL: 还原顶层顺序
---------------
Enjoy it`)
})

cube.rX = rX; cube.rY = rY; cube.render(rX, rY)
window.cube = cube; window.solver = solver
document.getElementById('share').src = $canvas.toDataURL()
