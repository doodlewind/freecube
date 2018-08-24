import {
  F, B, U, D, R, L,
  N, W, S, E, NW, NE, SW, SE, SLOT_M, SLOT_D,
  COLOR_D as CD, COLOR_F as CF, COLOR_R as CR
} from './consts'

const SE_D_AS_F = { [F]: CD, [U]: CF, [R]: CR }
const SE_D_AS_R = { [F]: CF, [U]: CR, [R]: CD }
const SE_D_AS_U = { [F]: CR, [U]: CD, [R]: CF }

const SLOT_M_SOLVED = { [F]: CF, [R]: CR }
const SLOT_M_REVERSED = { [F]: CR, [R]: CF }

const SLOT_D_SOLVED = { [F]: CF, [R]: CR, [D]: CD }
const SLOT_D_D_AS_F = { [F]: CD, [R]: CF, [D]: CR }
const SLOT_D_D_AS_R = { [F]: CR, [R]: CD, [D]: CF }

const topEdge = (topColor, dir) => {
  const mapping = { [W]: L, [N]: B, [E]: R, [S]: F }
  return { [U]: topColor, [mapping[dir]]: topColor === CF ? CR : CF }
}

// https://www.speedsolving.com/wiki/index.php/F2L
export const F2L = [
  // 1
  {
    match: { [E]: topEdge(CF, E), [SE]: SE_D_AS_F },
    moves: "U (R U' R')"
  },
  // 2
  {
    match: { [S]: topEdge(CR, S), [SE]: SE_D_AS_R },
    moves: "U' (F' U F)"
  },
  // 3
  {
    match: { [W]: topEdge(CR, W), [SE]: SE_D_AS_F },
    moves: "F' U' F"
  },
  // 4
  {
    match: { [N]: topEdge(CF, N), [SE]: SE_D_AS_R },
    moves: "(R U R')"
  },
  // 5
  {
    match: { [N]: topEdge(CF, N), [SE]: SE_D_AS_F },
    moves: "(U' R U R') U (R' F R F')"
  },
  // 6
  {
    match: { [W]: topEdge(CR, W), [SE]: SE_D_AS_R },
    moves: "R R (B U B' U') R R"
  },
  // 7
  {
    match: { [W]: topEdge(CF, W), [SE]: SE_D_AS_F },
    moves: "U' (R U U R') U U (R U' R')"
  },
  // 8
  {
    match: { [N]: topEdge(CR, N), [SE]: SE_D_AS_R },
    moves: "(U F' U U F) (U F' U U F)"
  },
  // 9
  {
    match: { [N]: topEdge(CR, N), [SE]: SE_D_AS_F },
    moves: "(U F' U' F) U' (F' U' F)"
  },
  // 10
  {
    match: { [W]: topEdge(CF, W), [SE]: SE_D_AS_R },
    moves: "U' (R U R' U) (R U R')"
  },
  // 11
  {
    match: { [E]: topEdge(CR, E), [SE]: SE_D_AS_F },
    moves: "U (F R' F' R) (F R' F' R) U' R U R'"
  },
  // 12
  {
    match: { [S]: topEdge(CF, S), [SE]: SE_D_AS_R },
    moves: "R' U U R R U R R U R"
  },
  // 13
  {
    match: { [S]: topEdge(CR, S), [SE]: SE_D_AS_F },
    moves: "(U F' U F) U' (F' U' F)"
  },
  // 14
  {
    match: { [E]: topEdge(CF, E), [SE]: SE_D_AS_R },
    moves: "U' (R U' R' U) (R U R')"
  },
  // 15
  {
    match: { [S]: topEdge(CF, S), [SE]: SE_D_AS_F },
    moves: "R B L U' L' B' R'"
  },
  // 16
  {
    match: { [E]: topEdge(CR, E), [SE]: SE_D_AS_R },
    moves: "(R U' R') U U (F' U' F)"
  },
  // 17
  {
    match: { [E]: topEdge(CF, E), [SE]: SE_D_AS_U },
    moves: "(R U U R') U' (R U R')"
  },
  // 18
  {
    match: { [S]: topEdge(CR, S), [SE]: SE_D_AS_U },
    moves: "F' U U F U F' U' F"
  },
  // 19
  {
    match: { [N]: topEdge(CF, N), [SE]: SE_D_AS_U },
    moves: "U R U U R R (F R F')"
  },
  // 20
  {
    match: { [W]: topEdge(CR, W), [SE]: SE_D_AS_U },
    moves: "U' F' U U F F (R' F' R)"
  },
  // 21
  {
    match: { [W]: topEdge(CF, W), [SE]: SE_D_AS_U },
    moves: "R B U U B' R'"
  },
  // 22
  {
    match: { [N]: topEdge(CR, N), [SE]: SE_D_AS_U },
    moves: "F' L' U U L F"
  },
  // 23
  {
    match: { [S]: topEdge(CF, S), [SE]: SE_D_AS_U },
    moves: "U (F R' F' R) U (R U R')"
  },
  // 24
  {
    match: { [E]: topEdge(CR, E), [SE]: SE_D_AS_U },
    moves: "U F' L' U L F R U R'"
  },
  // 25
  {
    match: { [E]: topEdge(CF, E), [SLOT_D]: SLOT_D_SOLVED },
    moves: "U' (F' U F) U (R U' R')"
  },
  // 26
  {
    match: { [S]: topEdge(CR, S), [SLOT_D]: SLOT_D_SOLVED },
    moves: "U (R U' R') U' (F' U F)"
  },
  // 27
  {
    match: { [E]: topEdge(CF, E), [SLOT_D]: SLOT_D_D_AS_F },
    moves: "(R U' R' U) (R U' R')"
  },
  // 28
  {
    match: { [S]: topEdge(CR, S), [SLOT_D]: SLOT_D_D_AS_R },
    moves: "(R U R' U') F R' F' R"
  },
  // 29
  {
    match: { [S]: topEdge(CR, S), [SLOT_D]: SLOT_D_D_AS_F },
    moves: "(R' F R F') (R' F R F')"
  },
  // 30
  {
    match: { [E]: topEdge(CF, E), [SLOT_D]: SLOT_D_D_AS_R },
    moves: "(R U R' U') (R U R')"
  },
  // 31
  {
    match: { [SLOT_M]: SLOT_M_REVERSED, [SE]: SE_D_AS_U },
    moves: "(R U' R' U) (F' U F)"
  },
  // 32
  {
    match: { [SLOT_M]: SLOT_M_SOLVED, [SE]: SE_D_AS_U },
    moves: "(R U R' U') (R U R' U') (R U R')"
  },
  // 33
  {
    match: { [SLOT_M]: SLOT_M_SOLVED, [SE]: SE_D_AS_F },
    moves: "U' (R U' R') U U (R U' R')"
  },
  // 34
  {
    match: { [SLOT_M]: SLOT_M_SOLVED, [SE]: SE_D_AS_R },
    moves: "U (F' U F) U U (F' U F)"
  },
  // 35
  {
    match: { [SLOT_M]: SLOT_M_REVERSED, [SE]: SE_D_AS_F },
    moves: "U U (R U' R') U' (F' U' F)"
  },
  // 36
  {
    match: { [SLOT_M]: SLOT_M_REVERSED, [SE]: SE_D_AS_R },
    moves: "U F' U' F U' (R U R')"
  },
  // 37 Solved
  // 38
  {
    match: { [SLOT_M]: SLOT_M_REVERSED, [SLOT_D]: SLOT_D_SOLVED },
    moves: "(R' F R F') (R U' R' U) (R U' R' U U) (R U' R')"
  },
  // 39
  {
    match: { [SLOT_M]: SLOT_M_SOLVED, [SLOT_D]: SLOT_D_D_AS_F },
    moves: "(R U' R') U' (R U R') U U (R U' R')"
  },
  // 40
  {
    match: { [SLOT_M]: SLOT_M_SOLVED, [SLOT_D]: SLOT_D_D_AS_R },
    moves: "(R U' R' U) (R U U R') U (R U' R')"
  },
  // 41
  {
    match: { [SLOT_M]: SLOT_M_REVERSED, [SLOT_D]: SLOT_D_D_AS_F },
    moves: "R F (U R U' R' F') U' R'"
  },
  // 42
  {
    match: { [SLOT_M]: SLOT_M_REVERSED, [SLOT_D]: SLOT_D_D_AS_R },
    moves: "(R U R' U') (R U' R') U U (F' U' F)"
  }
].map(rule => ({
  match: rule.match,
  moves: rule.moves.replace(/(\(|\))/g, '').split(' ')
}))

// https://www.speedsolving.com/wiki/index.php/OLL
export const OLL = [
  {
    id: 47,
    match: { [NW]: B, [NE]: R, [W]: L, [SW]: F, [S]: F, [SE]: R },
    moves: "F' (L' U' L U) (L' U' L U) F"
  },
  {
    id: 49,
    match: { [NW]: B, [N]: B, [NE]: R, [E]: R, [SE]: R, [SW]: F },
    moves: "R B' R R F R R B R R F' R"
  },
  {
    id: 50,
    match: { [NW]: L, [N]: B, [NE]: B, [SE]: F, [SW]: L, [W]: L },
    moves: "R B' R B R2' U2 F R' F' R"
  },
  {
    id: 53,
    match: { [NW]: L, [SW]: L, [S]: F, [SE]: R, [E]: R, [NE]: R },
    moves: "F R U R' U' F' R U R' U' R' F R F'"
  },
  {
    id: 54,
    match: { [NW]: L, [NE]: R, [SE]: R, [S]: F, [SW]: L, [W]: L },
    moves: "U U F R' F' R U2 F2 L F L' F"
  }
].map(rule => ({
  id: rule.id,
  match: rule.match,
  moves: rule.moves.replace(/(\(|\))/g, '').split(' ')
}))

// https://www.speedsolving.com/wiki/index.php/PLL
export const PLL = [
  {
    name: 'A-PLL b',
    match: { [NE]: SW, [SW]: SE, [SE]: NE },
    moves: "R B' R F F R' B R F F R R"
  }
].map(rule => ({
  name: rule.name,
  match: rule.match,
  moves: rule.moves.replace(/(\(|\))/g, '').split(' ')
}))
