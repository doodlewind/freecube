export const setBlockColor = (cube, coord, face, color) => {
  cube.getBlock(coord).colors[face] = color
}

export const setBlockColors = (cube, coord, color) => {
  for (let i = 0; i < 6; i++) { setBlockColor(cube, coord, i, color) }
}

export const showOnly = (cube, coords) => {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (!coords.some(([i, j, k]) => i === x && j === y && k === z)) {
          setBlockColors(cube, [x, y, z], [0, 0, 0, 1])
        }
      }
    }
  }
}

export const animateY = (cube, baseX, baseY, speed = 1) => {
  const beginTime = +new Date()
  cube.__ANIMATING = true
  const tick = () => {
    const diff = +new Date() - beginTime
    cube.render(baseX, (baseY + diff) / 20 * speed)
    window.requestAnimationFrame(tick)
  }
  window.requestAnimationFrame(tick)
}
