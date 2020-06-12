let xDown = null
let yDown = null

const getTouches = (evt) => {
  return evt.touches
}

const handleTouchStart = (evt) => {
  const firstTouch = getTouches(evt)[0]
  xDown = firstTouch.clientX
  yDown = firstTouch.clientY
}

const handleTouchMove = (evt) => {
  if (!xDown || !yDown) return

  const xUp = evt.touches[0].clientX
  const yUp = evt.touches[0].clientY

  const xDiff = xDown - xUp
  const yDiff = yDown - yUp

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      requestPull('left')
    } else {
      requestPull('right')
    }
  } else {
    if (yDiff > 0) {
      requestPull('up')
    } else { 
      requestPull('down')
    }
  }

  xDown = null
  yDown = null
}

document.addEventListener('touchstart', handleTouchStart, false)
document.addEventListener('touchmove', handleTouchMove, false)
