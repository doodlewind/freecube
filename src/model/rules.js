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
    id: 1,
    match: {
      [NW]: L, [N]: B, [NE]: R, [E]: R, [SE]: R, [S]: F, [SW]: L, [W]: L
    },
    moves: "R U B' R B R R U' R' F R F'"
  },
  {
    id: 2,
    match: {
      [NW]: L, [N]: B, [NE]: B, [E]: R, [SE]: F, [S]: F, [SW]: L, [W]: L
    },
    moves: "U U F R' F' R U R R B' R' B U' R'"
  },
  {
    id: 3,
    match: { [NW]: B, [N]: B, [E]: R, [SE]: F, [S]: F, [SW]: L, [W]: L },
    moves: "L (U F U' F') L' U' R (B U B' U') R'"
  },
  {
    id: 4,
    match: { [NW]: L, [N]: B, [E]: R, [SE]: R, [S]: F, [SW]: F, [W]: L },
    moves: "B (U L U' L') B' U F (R U R' U') F'"
  },
  {
    id: 5,
    match: { [NW]: B, [N]: B, [NE]: R, [SW]: L, [W]: L },
    moves: "L' B B R B R' B L"
  },
  {
    id: 6,
    match: { [NW]: L, [N]: B, [NE]: B, [E]: R, [SE]: R },
    moves: "R B B L' B' L B' R'"
  },
  {
    id: 7,
    match: { [NW]: B, [NE]: R, [E]: R, [SE]: F, [S]: F },
    moves: "F R' F' R U U R U U R'"
  },
  {
    id: 8,
    match: { [NW]: L, [NE]: B, [S]: F, [SW]: F, [W]: L },
    moves: "R U U R' U U R' F R F'"
  },
  {
    id: 9,
    match: { [NW]: L, [NE]: B, [SE]: R, [S]: F, [W]: L },
    moves: "R' U' R U' R' U R' F R F' U R"
  },
  {
    id: 10,
    match: { [NW]: B, [NE]: R, [E]: R, [S]: F, [SW]: L },
    moves: "(F U F' U) (F' L F L') F U U F'"
  },
  {
    id: 11,
    match: { [N]: B, [NE]: R, [E]: R, [SE]: F, [SW]: L },
    moves: "R U' R' U' R U' R' U U F' U F U' R U R'"
  },
  {
    id: 12,
    match: { [NW]: L, [N]: B, [SE]: R, [SW]: F, [W]: L },
    moves: "F (R U R' U') F' U F (R U R' U') F'"
  },
  {
    id: 13,
    match: { [NW]: B, [N]: B, [NE]: R, [SE]: F, [S]: F },
    moves: "F U R U' R R F' R U R U' R'"
  },
  {
    id: 14,
    match: { [NW]: L, [N]: B, [NE]: B, [S]: F, [SW]: F },
    moves: "F' U' L' U U L U L' U' L F"
  },
  {
    id: 15,
    match: { [NW]: B, [N]: B, [NE]: R, [S]: F, [SW]: L },
    moves: "L' B' L R' U' R U L' B L"
  },
  {
    id: 16,
    match: { [NW]: L, [N]: B, [NE]: B, [SE]: R, [S]: F },
    moves: "R B R' (L U L' U') R B' R'"
  },
  {
    id: 17,
    match: { [N]: B, [NE]: B, [E]: R, [S]: F, [SW]: L, [W]: L },
    moves: "R U R' U (R' F R F') U U (R' F R F')"
  },
  {
    id: 18,
    match: { [NW]: L, [N]: B, [E]: R, [S]: F, [SW]: L, [W]: L },
    moves: "(L' B L B') U U (L' B L B') (U B' U B)"
  },
  {
    id: 19,
    match: { [N]: B, [E]: R, [SE]: R, [S]: F, [SW]: L, [W]: L },
    moves: "R' U U F R U R' U' F F U U F R"
  },
  {
    id: 28,
    match: { [E]: R, [S]: F },
    moves: "F R U R' U' F F L' U' L U F"
  },
  {
    id: 20,
    match: { [N]: B, [E]: R, [S]: F, [W]: L },
    moves: "R B U B' R' F F B D' L' D B' F F"
  },
  {
    id: 29,
    match: { [N]: B, [E]: R, [SE]: R, [SW]: L },
    moves: "L' L' U' L B L' U L' L' U' L' B' L"
  },
  {
    id: 30,
    match: { [N]: B, [SE]: R, [SW]: L, [W]: L },
    moves: "R' R' U R' B' R U' R' R' U R B R'"
  },
  {
    id: 31,
    match: { [N]: B, [NE]: B, [E]: R, [SE]: F },
    moves: "L' U' B U L U' L' B' L"
  },
  {
    id: 32,
    match: { [NW]: B, [N]: B, [SW]: F, [W]: L },
    moves: "R U B' U' R' U R B R'"
  },
  {
    id: 33,
    match: { [NW]: B, [N]: B, [S]: F, [SW]: F },
    moves: "(R U R' U') (R' F R F')"
  },
  {
    id: 34,
    match: { [NW]: L, [N]: B, [NE]: R, [S]: F },
    moves: "(R U R' U') B' (R' F R F') B"
  },
  {
    id: 35,
    match: { [N]: B, [NE]: R, [SW]: F, [W]: L },
    moves: "R U U R' R' F R F' R U U R'"
  },
  {
    id: 36,
    match: { [N]: B, [NE]: R, [E]: R, [SW]: F },
    moves: "R' U' R U' R' U R U R B' R' B"
  },
  {
    id: 37,
    match: { [NW]: B, [N]: B, [E]: R, [SE]: R },
    moves: "R B' R' B U B U' B'"
  },
  {
    id: 38,
    match: { [NW]: L, [N]: B, [SE]: F, [W]: L },
    moves: "L U L' U L U' L' U' L' B L B'"
  },
  {
    id: 39,
    match: { [NW]: B, [N]: B, [SE]: R, [S]: F },
    moves: "L F' (L' U' L U) F U' L'"
  },
  {
    id: 40,
    match: { [N]: B, [NE]: B, [S]: F, [SW]: L },
    moves: "R' F (R U R' U') F' U R"
  },
  {
    id: 41,
    match: { [N]: B, [SE]: F, [SW]: F, [W]: L },
    moves: "B U L U' L' B' L' U U L U L' U L"
  },
  {
    id: 42,
    match: { [N]: B, [E]: R, [SE]: F, [SW]: F },
    moves: "R' U' R U F R U R' U' R' U R U' F'"
  },
  {
    id: 43,
    match: { [N]: B, [NE]: R, [E]: R, [SE]: R },
    moves: "B' U' R' U R B"
  },
  {
    id: 44,
    match: { [NW]: L, [N]: B, [SW]: L, [W]: L },
    moves: "B U L U' L' B'"
  },
  {
    id: 45,
    match: { [NW]: L, [N]: B, [S]: F, [SW]: L },
    moves: "F (R U R' U') F'"
  },
  {
    id: 46,
    match: { [NE]: R, [E]: R, [SE]: R, [W]: L },
    moves: "R' U' R' F R F' U R"
  },
  {
    id: 47,
    match: { [NW]: B, [NE]: R, [W]: L, [SW]: F, [S]: F, [SE]: R },
    moves: "F' (L' U' L U) (L' U' L U) F"
  },
  {
    id: 48,
    match: { [NW]: L, [NE]: B, [E]: R, [SE]: F, [S]: F, [SW]: L },
    moves: "F (R U R' U') (R U R' U') F'"
  },
  {
    id: 49,
    match: { [NW]: B, [N]: B, [NE]: R, [E]: R, [SE]: R, [SW]: F },
    moves: "R B' R R F R R B R R F' R"
  },
  {
    id: 50,
    match: { [NW]: L, [N]: B, [NE]: B, [SE]: F, [SW]: L, [W]: L },
    moves: "R B' R B R R U U F R' F' R"
  },
  {
    id: 51,
    match: { [NW]: B, [N]: B, [NE]: R, [SE]: R, [S]: F, [SW]: F },
    moves: "F U R U' R' U R U' R' F'"
  },
  {
    id: 52,
    match: { [NW]: B, [NE]: R, [E]: R, [SE]: R, [SW]: F, [W]: L },
    moves: "R' U' R U' R' U F' U F R"
  },
  {
    id: 53,
    match: { [NW]: L, [SW]: L, [S]: F, [SE]: R, [E]: R, [NE]: R },
    moves: "F R U R' U' F' R U R' U' R' F R F'"
  },
  {
    id: 54,
    match: { [NW]: L, [NE]: R, [SE]: R, [S]: F, [SW]: L, [W]: L },
    moves: "U U F R' F' R U U F F L F L' F"
  },
  {
    id: 55,
    match: { [NW]: L, [NE]: R, [E]: R, [SE]: R, [SW]: L, [W]: L },
    moves: "R U U R R U' R U' R' U U F R F'"
  },
  {
    id: 56,
    match: { [NW]: L, [N]: B, [NE]: R, [SE]: R, [S]: F, [SW]: L },
    moves: "L F L' U R U' R' U R U' R' L F' L'"
  },
  {
    id: 57,
    match: { [N]: B, [S]: F },
    moves: "R U R' U' L R' F R F' L'"
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
