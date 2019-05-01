
import { Cube } from '../src/model/cube.js'
import {
  matchOrientationRule,
  matchPermutationRule,
  isOrientationSolved,
  isPermutationSolved
} from '../src/model/solver/js'
import { OLL, PLL } from '../src/model/rules.js'

console.clear()

const getTopColors = (cube) => {
  const result = []
  ;[
    [0, 1, 1], [1, 1, 0], [0, 1, -1], [-1, 1, 0],
    [1, 1, 1], [1, 1, -1], [-1, 1, -1], [-1, 1, 1]
  ].forEach(coord => result.push([...cube.getBlock(coord).colors]))
  return result
}
const flip = moves => moves.map(x => x.length > 1 ? x[0] : x + "'").reverse()

OLL.forEach(rule => {
  const rMoves = flip(rule.moves)
  const cube = new Cube(null, rMoves)
  if (
    matchOrientationRule(cube, rule) &&
    isOrientationSolved(cube.move(rule.moves))
  ) {
    console.log('OLL test pass', rule.id)
  } else console.error('Error OLL rule match', rule.id)
})

PLL.forEach(rule => {
  const rMoves = flip(rule.moves)
  const cube = new Cube(null, rMoves)
  if (matchPermutationRule(cube, rule)) {
    const colors = getTopColors(cube.move(rule.moves))
    if (isPermutationSolved(colors)) {
      console.log('PLL test pass', rule.name)
    } else console.error('Error PLL rule match', rule.name)
  } else console.error('Error PLL rule match', rule.name)
})
