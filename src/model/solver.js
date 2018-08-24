import { Cube } from './cube'
import {
  F, B, U, D, R, L, SLOT_M, SLOT_D,
  S, E, N, W, SE, NE, NW, SW,
  COLORS, COLOR_D, COLOR_U, PAIRS, EDGE_COORDS, BLOCK_COORDS, TOP_BLOCKS,
  Y_ROTATE_MAPPING, SLOT_COORDS_MAPPING, EDGE_GRID_MAPPING, CORNER_GRID_MAPPING,
  GRID_MAPPING, TOP_FACE_MAPPING, EDGE_GRIDS, INIT_BLOCKS
} from './consts'
import * as RULES from './rules'

const base = INIT_BLOCKS() // base cube blocks
const baseBlockAt = ([x, y, z]) => base[(x + 1) * 9 + (y + 1) * 3 + z + 1]

const isCorner = ([x, y, z]) => Math.abs(x) + Math.abs(y) + Math.abs(z) === 3

const coordEqual = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2]

const colorsEqual = (a, b) => a.colors.every((c, i) => c === b.colors[i])

const blockHasColor = (block, color) => block.colors.some(c => c === color)

const isPairSolved = (cube, pair) => {
  return SLOT_COORDS_MAPPING[pair].every(
    coord => colorsEqual(cube.getBlock(coord), baseBlockAt(coord))
  )
}

const isOrientationSolved = (cube) => {
  return TOP_BLOCKS.every(coord => cube.getBlock(coord).colors[U] === COLOR_U)
}

const isPermutationSolved = (colors) => (
  colors[NW][B] === colors[N][B] && colors[N][B] === colors[NE][B] &&
  colors[NE][R] === colors[E][R] & colors[E][R] === colors[SE][R] &&
  colors[SE][F] === colors[S][F] && colors[S][F] === colors[SW][F] &&
  colors[SW][L] === colors[W][L] && colors[W][L] === colors[SW][L]
)

const isTopLayerAligned = (cube) => {
  return colorsEqual(cube.getBlock(TOP_BLOCKS[0]), baseBlockAt(TOP_BLOCKS[0]))
}

const findCrossCoords = cube => EDGE_COORDS.filter(coord => {
  const block = cube.getBlock(coord)
  return (
    blockHasColor(block, COLOR_D) &&
    !colorsEqual(block, baseBlockAt(coord))
  )
})

const findPairCoords = (cube, pair) => BLOCK_COORDS.filter(coord => {
  const block = cube.getBlock(coord)
  const faces = isCorner(coord) ? [...pair, COLOR_D] : pair
  return faces.every(c => block.colors.includes(c))
})

const inPairSlot = (coord, pair) => {
  const targetSlot = SLOT_COORDS_MAPPING[pair]
  return targetSlot.some(slotCoord => coordEqual(coord, slotCoord))
}

const preparePair = (cube, pair, moves = []) => {
  const [edgeCoord, cornerCoord] = findPairCoords(cube, pair)
  let sideMoves = ['R', 'U', "R'"]
  if (!inPairSlot(edgeCoord, pair) && edgeCoord[1] === 0) {
    const tmpVec = [edgeCoord[0], 1, edgeCoord[2]]
    sideMoves = movesRelativeTo(tmpVec, sideMoves); cube.move(sideMoves)
    return preparePair(cube, pair, [...moves, ...sideMoves])
  }
  if (!inPairSlot(cornerCoord, pair) && cornerCoord[1] === -1) {
    const tmpVec = [cornerCoord[0], 1, cornerCoord[2]]
    sideMoves = movesRelativeTo(tmpVec, sideMoves); cube.move(sideMoves)
    return preparePair(cube, pair, [...moves, ...sideMoves])
  }
  return moves
}

const getTopColors = (cube) => {
  const result = []
  TOP_BLOCKS.forEach(coord => result.push([...cube.getBlock(coord).colors]))
  return result
}

const getTopFaceMove = ([x0, y0, z0], [x1, y1, z1]) => {
  const offsetMapping = {
    '0': { '1': { '1': 0, '-1': 2 } },
    '-1': { '1': { '0': 3 } },
    '1': { '1': { '0': 1 } }
  }
  const fromOffset = offsetMapping[x0][y0][z0]
  const toOffset = offsetMapping[x1][y1][z1]
  const moveMapping = {
    '-3': ["U'"],
    '-2': ['U', 'U'],
    '-1': ['U'],
    '0': [],
    '1': ["U'"],
    '2': ['U', 'U'],
    '3': ['U']
  }
  return moveMapping[toOffset - fromOffset]
}

const movesRelativeTo = (coord, moves) => {
  const moveRelativeTo = ([x, y, z], move) => {
    const base = ['F', 'L', 'B', 'R']
    const baseIndex = base.indexOf(move.replace("'", ''))
    if (baseIndex === -1) return move
    let newNotation = base[(baseIndex + Y_ROTATE_MAPPING[x][y][z]) % 4]
    newNotation += move.includes("'") ? "'" : ''
    return newNotation
  }
  return moves.map(move => moveRelativeTo(coord, move))
}

const faceRelativeTo = ([x, y, z], face) => {
  if (face === U || face === D) return face
  const base = [F, L, B, R]
  const baseIndex = base.indexOf(face)
  return base[(baseIndex + Y_ROTATE_MAPPING[x][y][z]) % 4]
}

const edgeRelativeTo = (vec, dir = 'left') => {
  return {
    [[1, 1, 1]]: [[0, 1, 1], [1, 1, 0]],
    [[1, 1, -1]]: [[1, 1, 0], [0, 1, -1]],
    [[-1, 1, -1]]: [[0, 1, -1], [-1, 1, 0]],
    [[-1, 1, 1]]: [[-1, 1, 0], [0, 1, 1]]
  }[vec][dir === 'left' ? 0 : 1]
}

const centerByColor = (color) => {
  return {
    [COLORS.BLUE]: [0, 0, 1],
    [COLORS.GREEN]: [0, 0, -1],
    [COLORS.RED]: [1, 0, 0],
    [COLORS.ORANGE]: [-1, 0, 0],
    [COLORS.YELLOW]: [0, 1, 0],
    [COLORS.WHITE]: [0, -1, 0]
  }[color]
}

const gridByPair = (pair, gridDir) => {
  gridDir = parseInt(gridDir)
  if (gridDir === SLOT_M) return SLOT_COORDS_MAPPING[pair][1]
  else if (gridDir === SLOT_D) return SLOT_COORDS_MAPPING[pair][0]
  const isEdge = gridDir < 4
  const index = isEdge
    ? (gridDir + PAIRS.indexOf(pair)) % 4
    : ((gridDir - 4 + PAIRS.indexOf(pair)) % 4) + 4
  const mapping = EDGE_GRIDS.includes(gridDir)
    ? EDGE_GRID_MAPPING : CORNER_GRID_MAPPING
  return mapping[index]
}

const matchPairRule = (cube, rule, pair) => {
  return Object.keys(rule.match).every(dir => {
    const ruleFaces = Object.keys(rule.match[dir]).map(x => parseInt(x))
    const targetBlock = cube.getBlock(gridByPair(pair, dir))
    const topCornerCoord = gridByPair(pair, SE)
    const mappedFaces = ruleFaces.map(f => faceRelativeTo(topCornerCoord, f))
    const result = ruleFaces.every((face, i) => {
      const ruleColor = rule.match[dir][face]
      const expectedColor = ruleColor === COLOR_D ? COLOR_D : pair[ruleColor]
      return targetBlock.colors[mappedFaces[i]] === expectedColor
    })
    return result
  })
}

const tryPairRules = (cube, pair) => {
  if (isPairSolved(cube, pair)) return []

  const preMoves = preparePair(new Cube(null, cube.moves), pair)
  const topMoves = [[], ['U'], ['U', 'U'], ["U'"]]
  for (let i = 0; i < topMoves.length; i++) {
    const testCube = new Cube(
      null, [...cube.moves, ...preMoves, ...topMoves[i]]
    )
    for (let j = 0; j < RULES.F2L.length; j++) {
      if (matchPairRule(testCube, RULES.F2L[j], pair)) {
        const topCornerCoord = gridByPair(pair, SE)
        const mappedMoves = movesRelativeTo(topCornerCoord, RULES.F2L[j].moves)
        const result = [...preMoves, ...topMoves[i], ...mappedMoves]
        cube.move(result)
        if (!isPairSolved(cube, pair)) console.error(`Error F2L at ${j}`)
        return result
      }
    }
  }
  return null // rule not found
}

const matchOrientationRule = (cube, { match }) => {
  return [S, E, N, W, SE, NE, NW, SW].every(dir => {
    const faceIndex = Number.isInteger(match[dir]) ? match[dir] : U
    return cube.getBlock(GRID_MAPPING[dir]).colors[faceIndex] === COLOR_U
  })
}

const tryOrientationRules = (cube) => {
  if (isOrientationSolved(cube)) return []

  const topMoves = [[], ['U'], ['U', 'U'], ["U'"]]
  for (let i = 0; i < topMoves.length; i++) {
    const testCube = new Cube(null, [...cube.moves, ...topMoves[i]])
    for (let j = 0; j < RULES.OLL.length; j++) {
      const rule = RULES.OLL[j]
      if (matchOrientationRule(testCube, rule)) {
        const result = [...topMoves[i], ...rule.moves]
        cube.move(result)
        if (!isOrientationSolved(cube)) console.error(`Error OLL id ${rule.id}`)
        return result
      }
    }
  }
  return null // rule not found
}

const matchPermutationRule = (cube, { match }) => {
  const oldColors = getTopColors(cube); const newColors = getTopColors(cube)
  Object.keys(match).forEach(fromGrid => {
    const toGrid = match[fromGrid]
    for (let i = 0; i < TOP_FACE_MAPPING[fromGrid].length; i++) {
      newColors[toGrid][TOP_FACE_MAPPING[toGrid][i]] =
      oldColors[fromGrid][TOP_FACE_MAPPING[fromGrid][i]]
    }
  })
  return isPermutationSolved(newColors)
}

const tryPermutationRules = (cube) => {
  if (isPermutationSolved(getTopColors(cube))) return []

  const preMoves = [[], ['U'], ['U', 'U'], ["U'"]]
  let solveMoves = []; let matched = false
  for (let i = 0; i < preMoves.length; i++) {
    const testCube = new Cube(null, [...cube.moves, ...preMoves[i]])
    for (let j = 0; j < RULES.PLL.length; j++) {
      if (matchPermutationRule(testCube, RULES.PLL[j])) {
        solveMoves = [...preMoves[i], ...RULES.PLL[j].moves]
        cube.move(solveMoves)
        matched = true
        if (!isPermutationSolved(getTopColors(cube))) {
          console.error(`Error PLL name ${RULES.PLL[j].name}`)
        }
        break
      }
    }
  }
  if (!matched) return null
  const postMoves = [[], ['U'], ['U', 'U'], ["U'"]]
  for (let i = 0; i < postMoves.length; i++) {
    const testCube = new Cube(null, [...cube.moves, ...postMoves[i]])
    if (isTopLayerAligned(testCube)) {
      return [...solveMoves, ...postMoves[i]]
    }
  }
  return null
}

const topEdgeToBottom = (cube, edgeCoord) => {
  const moves = []
  const topEdge = cube.getBlock(edgeCoord)
  const targetColor = topEdge.colors.find(
    c => c !== COLOR_D && c !== COLORS.EMPTY
  )
  const toCenter = centerByColor(targetColor)
  const toTopEdge = [toCenter[0], toCenter[1] + 1, toCenter[2]]
  moves.push(...getTopFaceMove(edgeCoord, toTopEdge))
  if (topEdge.colors[U] !== COLOR_D) {
    moves.push(...movesRelativeTo(toCenter, ["U'", "R'", 'F', 'R']))
  } else {
    moves.push(...movesRelativeTo(toCenter, ['F', 'F']))
  }
  return moves
}

// TODO Clean up similar moves.
const solveCrossEdge = (cube, [x, y, z]) => {
  const moves = []
  const edge = cube.getBlock([x, y, z])
  if (y === -1) {
    // Bottom layer
    const centerCoord = [x, y + 1, z]
    if (edge.colors[D] === COLOR_D) {
      const sideMoves = movesRelativeTo(centerCoord, ['F', 'F'])
      sideMoves.forEach(m => cube.move(m))
      moves.push(...sideMoves)
    } else {
      const sideMoves = movesRelativeTo(centerCoord, ["F'", 'R', 'F', 'U'])
      sideMoves.forEach(m => cube.move(m))
      moves.push(...sideMoves)
    }
    const movesToBottom = topEdgeToBottom(cube, [x, y + 2, z])
    movesToBottom.forEach(m => cube.move(m))
    moves.push(...movesToBottom)
  } else if (y === 0) {
    // Center layer
    const topVec = [x, y + 1, z]
    const leftFace = faceRelativeTo(topVec, F)
    if (edge.colors[leftFace] === COLOR_D) {
      const sideMoves = movesRelativeTo(topVec, ['R', 'U', "R'"])
      sideMoves.forEach(m => cube.move(m))
      moves.push(...sideMoves)
    } else {
      const sideMoves = movesRelativeTo(topVec, ["F'", "U'", 'F', 'U'])
      sideMoves.forEach(m => cube.move(m))
      moves.push(...sideMoves)
    }
    const topEdge = edgeRelativeTo(topVec)
    const movesToBottom = topEdgeToBottom(cube, topEdge)
    movesToBottom.forEach(m => cube.move(m))
    moves.push(...movesToBottom)
  } else {
    // Top layer
    const movesToBottom = topEdgeToBottom(cube, [x, y, z])
    movesToBottom.forEach(m => cube.move(m))
    moves.push(...movesToBottom)
  }
  return moves
}

export class Solver {
  constructor (cube) {
    this.cube = cube
  }

  solve () {
    this.solveCross().forEach(moves => this.cube.move(moves))
    this.solveF2L().forEach(moves => this.cube.move(moves))
    this.cube.move(this.solveOLL() || [])
    this.cube.move(this.solvePLL() || [])
  }

  solveCross () {
    const clonedCube = new Cube(null, this.cube.moves)
    const moveSteps = []
    while (true) {
      const lostEdgeCoords = findCrossCoords(clonedCube)
      if (!lostEdgeCoords.length) break
      moveSteps.push(solveCrossEdge(clonedCube, lostEdgeCoords[0]))
    }
    return moveSteps
  }

  solveF2L () {
    const clonedCube = new Cube(null, this.cube.moves)
    const moveSteps = []
    for (let i = 0; i < 4; i++) {
      moveSteps.push(tryPairRules(clonedCube, PAIRS[i]))
    }
    return moveSteps
  }

  solveOLL () {
    const clonedCube = new Cube(null, this.cube.moves)
    return tryOrientationRules(clonedCube)
  }

  solvePLL () {
    const clonedCube = new Cube(null, this.cube.moves)
    return tryPermutationRules(clonedCube)
  }
}
