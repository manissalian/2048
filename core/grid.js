const Cell = require('./cell')

class Grid {
  #rows = 4
  #columns = 4
  #cells = []
  #shouldSpawn = false

  constructor () {
    for (let i = 0; i < this.#rows; i += 1) {
      this.#cells[i] = []

      for (let j = 0; j < this.#columns; j += 1) {
        this.#cells[i].push(null)
      }
    }
  }

  spawnCell () {
    const rowIndex = Math.floor(Math.random() * (this.#rows - 1))
    const columnIndex = Math.floor(Math.random() * (this.#columns - 1))

    if (this.#cells[rowIndex][columnIndex]) {
      this.spawnCell()
    } else {
      this.#cells[rowIndex][columnIndex] = new Cell()
    }
  }

  pushCells (direction) {
    let pushed = false

    if (direction === 'up') {
      for (let i = 0; i < this.#columns; i += 1) {
        for (let j = this.#rows - 1; j > 0; j -= 1) {
          const success = this.pushCell([j, i], [j - 1, i])
          if (success) pushed = true
        }
      }
    } else if (direction === 'down') {
      for (let i = 0; i < this.#columns; i += 1) {
        for (let j = 0; j < this.#rows - 1; j += 1) {
          const success = this.pushCell([j, i], [j + 1, i])
          if (success) pushed = true
        }
      }
    } else if (direction === 'left') {
      for (let i = 0; i < this.#rows; i += 1) {
        for (let j = this.#columns - 1; j > 0; j -= 1) {
          const success = this.pushCell([i, j], [i, j - 1])
          if (success) pushed = true
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < this.#rows; i += 1) {
        for (let j = 0; j < this.#columns - 1; j += 1) {
          const success = this.pushCell([i, j], [i, j + 1])
          if (success) pushed = true
        }
      }
    }

    if (pushed) {
      this.pushCells(direction)
    } else if (this.#shouldSpawn) {
      this.#shouldSpawn = false
      this.spawnCell()
    }
  }

  // pushes cell1 on cell2 and merges them if possible
  // if cell2 is missing then cell1 will move to cell2's position
  // returns if push was successful or not
  pushCell (cell1Indexes, cell2Indexes) {
    const x1 = cell1Indexes[0]
    const y1 = cell1Indexes[1]
    const x2 = cell2Indexes[0]
    const y2 = cell2Indexes[1]
    let pushed = false

    if (!this.#cells[x1][y1]) return pushed

    if (!this.#cells[x2][y2]) {
      this.#cells[x2][y2] = this.#cells[x1][y1]
      this.#cells[x1][y1] = null
      pushed = true
      this.#shouldSpawn = true
    } else if (this.#cells[x2][y2].getValue() === this.#cells[x1][y1].getValue()) {
      this.#cells[x2][y2].setValue(this.#cells[x1][y1].getValue() * 2)
      this.#cells[x1][y1] = null
      pushed = true
      this.#shouldSpawn = true
    }

    return pushed
  }
}

module.exports = Grid
