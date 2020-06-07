class Cell {
  #value = 0

  constructor (value) {
    const randomValue = Math.floor(Math.random() * 2) + 1
    this.#value = value || (randomValue * 2)
  }

  getValue () {
    return this.#value
  }

  setValue (value) {
    this.#value = value
  }
}

module.exports = Cell
