class Cell {
  #value = 0
  #eventEmitter = null
  #position = []

  constructor (eventEmitter, position) {
    this.#eventEmitter = eventEmitter
    this.#position = position

    const randomValue = Math.floor(Math.random() * 2) + 1
    this.#value = randomValue * 2

    this.#eventEmitter.emit('cellSpawned', this)
  }

  getValue () {
    return this.#value
  }

  getPosition () {
    return this.#position
  }

  setValue (value) {
    this.#value = value
  }

  setPosition (position) {
    this.#position = position
  }
}

module.exports = Cell
