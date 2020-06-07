const playBtnClicked = () => {
  socket.emit('requestPlay')
}

socket.on('acceptPlayRequest', () => {
  document.getElementById('play-btn-cont').classList.add('display-none')
  document.getElementById('grid-cont').classList.remove('display-none')
  socket.emit('requestStart')
})

socket.on('cellSpawned', cell => {
  const cellEl = document.getElementById(cell.position[0] + '' + cell.position[1])
  cellEl.innerHTML = cell.value
})

socket.on('cellMoved', positions => {
  const {
    from,
    to
  } = positions

  const fromCellEl = document.getElementById(from[0] + '' + from[1])
  const toCellEl = document.getElementById(to[0] + '' + to[1])

  toCellEl.innerHTML = fromCellEl.innerHTML
  fromCellEl.innerHTML = ''
})

socket.on('cellMerged', params => {
  const {
    from,
    to,
    value
  } = params

  const fromCellEl = document.getElementById(from[0] + '' + from[1])
  const toCellEl = document.getElementById(to[0] + '' + to[1])

  toCellEl.innerHTML = value
  fromCellEl.innerHTML = ''
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

  socket.emit('requestPush', direction)
})