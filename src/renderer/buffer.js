import { rotateX, rotateY, rotateZ } from './math'

const coordInFace = (coord, face) => {
  return {
    U: () => coord[1] === 1,
    D: () => coord[1] === -1,
    L: () => coord[0] === -1,
    R: () => coord[0] === 1,
    F: () => coord[2] === 1,
    B: () => coord[2] === -1
  }[face]()
}

const rotatorByFace = (face) => ({
  U: rotateY, D: rotateY, L: rotateX, R: rotateX, F: rotateZ, B: rotateZ
}[face])

const baseIndices = [
  0, 1, 2, 0, 2, 3, // front
  4, 5, 6, 4, 6, 7, // back
  8, 9, 10, 8, 10, 11, // top
  12, 13, 14, 12, 14, 15, // bottom
  16, 17, 18, 16, 18, 19, // right
  20, 21, 22, 20, 22, 23 // left
]

export function getBuffer (gl, blocks, moveFace, moveAngle) {
  let [positions, faceColors, colors, indices] = [[], [], [], []]

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const i = (x + 1) * 9 + (y + 1) * 3 + z + 1
        if (moveFace && coordInFace([x, y, z], moveFace)) {
          const pos = blocks[i].positions
          for (let j = 0; j < 72; j += 3) {
            const tmp = []
            rotatorByFace(moveFace)(
              tmp,
              [pos[j], pos[j + 1], pos[j + 2]],
              [0, 0, 0],
              moveAngle / 180 * Math.PI
            )
            positions.push(tmp[0], tmp[1], tmp[2])
          }
        } else {
          positions = [...positions, ...blocks[i].positions]
        }
      }
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    faceColors = [...faceColors, ...blocks[i].colors]
    indices = [...indices, ...baseIndices.map(x => x + i * 24)]
  }

  for (let i = 0; i < faceColors.length; i++) {
    const c = faceColors[i]
    // Repeat each color four times for the four vertices of the face.
    colors = colors.concat(c, c, c, c)
  }

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW
  )

  return {
    positions: positionBuffer,
    colors: colorBuffer,
    indices: indexBuffer
  }
}
