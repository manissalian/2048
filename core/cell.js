class Cell {
  #value = 0
  #eventEmitter = null
  #position = []
  #immutable = false

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

  isImmutable () {
    return this.#immutable
  }

  setValue (value) {
    this.#value = value
  }

  setPosition (position) {
    this.#position = position
  }

  setImmutable (immutable) {
    this.#immutable = immutable
  }
}

module.exports = Cell
