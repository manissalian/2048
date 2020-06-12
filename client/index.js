let gameStarted = false

const playBtnClicked = () => {
  socket.emit('requestPlay')
}

socket.on('acceptPlayRequest', () => {
  document.getElementById('play-btn-cont').classList.add('display-none')
  document.getElementById('grid-cont').classList.remove('display-none')
  socket.emit('requestStart')
})

socket.on('gameStarted', () => {
  gameStarted = true
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
  fromCellEl.classList.add('zindex-1')
  fromCellEl.classList.add('cell-r' + to[0], 'cell-c' + to[1])
  fromCellEl.setAttribute('surplus', true)

  toCellEl.classList.add('cell-' + value)
  toCellEl.classList.remove('cell-' + toCellEl.innerHTML)
  toCellEl.innerHTML = value
})

socket.on('gameOver', () => {
  const gameOverEl = document.getElementById('game-over')
  gameOverEl.classList.remove('display-none')
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
    default:
      return
  }

  requestPull(direction)
})

const requestPull = (direction) => {
  if (!gameStarted) return

  removeSurplusCells()
  socket.emit('requestPull', direction)
}

const removeSurplusCells = () => {
  const grid = document.getElementById('grid')
  const surplusCells = document.querySelectorAll('div[surplus="true"]')

  for (let i = 0; i < surplusCells.length; i += 1) {
    grid.removeChild(surplusCells[i])
  }
}
