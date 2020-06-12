const transitionDuration = 0.23
const playBtnClicked = () => {
  socket.emit('requestPlay')
}

socket.on('acceptPlayRequest', () => {
  document.getElementById('play-btn-cont').classList.add('display-none')
  document.getElementById('grid-cont').classList.remove('display-none')
  socket.emit('requestStart')
})

socket.on('cellSpawned', cell => {
  const cellEl = document.createElement('div')
  cellEl.classList.add(
    'cell',
    'cell-' + cell.value,
    'cell-r' + cell.position[0],
    'cell-c' + cell.position[1],
    'scale33p'
  )
  cellEl.setAttribute('style', `transition: ${transitionDuration}s all`)
  cellEl.innerHTML = cell.value
  const grid = document.getElementById('grid')
  grid.appendChild(cellEl)

  requestAnimationFrame(() => {
    cellEl.classList.add('scale100p')
    cellEl.classList.remove('scale33p')
  })
})

socket.on('cellMoved', positions => {
  const {
    from,
    to
  } = positions

  const cellEl = document.getElementsByClassName('cell-r' + from[0] + ' cell-c' + from[1])[0]
  cellEl.classList.remove('cell-r' + from[0], 'cell-c' + from[1])
  cellEl.classList.add('cell-r' + to[0], 'cell-c' + to[1])
})

socket.on('cellMerged', params => {
  const {
    from,
    to,
    value
  } = params

  const fromCellEl = document.getElementsByClassName('cell-r' + from[0] + ' cell-c' + from[1])[0]
  const toCellEl = document.getElementsByClassName('cell-r' + to[0] + ' cell-c' + to[1])[0]

  fromCellEl.classList.remove('cell-r' + from[0], 'cell-c' + from[1])
  fromCellEl.classList.add('zindex0')
  fromCellEl.classList.add('cell-r' + to[0], 'cell-c' + to[1])

  toCellEl.classList.add('cell-' + value)
  toCellEl.classList.remove('cell-' + toCellEl.innerHTML)
  toCellEl.innerHTML = value

  setTimeout(() => {
    const grid = document.getElementById('grid')
    grid.removeChild(fromCellEl)
  }, transitionDuration * 1000)
})

socket.on('gameOver', () => {
  alert('game over!')
})

document.addEventListener('keydown', e => {
  let direction

  switch (e.keyCode) {
    case 37:
      direction = 'left'
      break
    case 38:
      direction = 'up'
      break
    case 39:
      direction = 'right'
      break
    case 40:
      direction = 'down'
      break
  }

  socket.emit('requestPull', direction)
})
