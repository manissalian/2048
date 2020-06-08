const Cell = require('./cell')

class Grid {
  #rows = 4
  #columns = 4
  #cells = []
  #shouldSpawn = false
  #eventEmitter = null

  constructor (eventEmitter) {
    this.#eventEmitter = eventEmitter
    for (let i = 0; i < this.#rows; i += 1) {
      this.#cells[i] = []

      for (let j = 0; j < this.#columns; j += 1) {
        this.#cells[i].push(null)
      }
    }
  }

  spawnCell () {
    const remainingEmptyCells = []
    for (let i = 0; i < this.#cells.length; i += 1) {
      for (let j = 0; j < this.#cells[i].length; j += 1) {
        if (this.#cells[i][j] === null) remainingEmptyCells.push(i + ',' + j)
      }
    }

    const indexes = remainingEmptyCells[Math.floor(Math.random() * (remainingEmptyCells.length - 1))]
    const rowIndex = indexes.split(',')[0]
    const columnIndex = indexes.split(',')[1]

    if (this.#cells[rowIndex][columnIndex]) {
      this.spawnCell()
    } else {
      this.#cells[rowIndex][columnIndex] = new Cell(this.#eventEmitter, [rowIndex, columnIndex])
    }
  }

  pullCells (direction) {
    if (direction === 'down') {
      for (let i = 0; i < this.#columns; i += 1) {
        for (let j = this.#rows - 1; j > 0; j -= 1) {
          this.pullCell([j - 1, i], [j, i])
        }
      }
    } else if (direction === 'up') {
      for (let i = 0; i < this.#columns; i += 1) {
        for (let j = 0; j < this.#rows - 1; j += 1) {
          this.pullCell([j + 1, i], [j, i])
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < this.#rows; i += 1) {
        for (let j = this.#columns - 1; j > 0; j -= 1) {
          this.pullCell([i, j - 1], [i, j])
        }
      }
    } else if (direction === 'left') {
      for (let i = 0; i < this.#rows; i += 1) {
        for (let j = 0; j < this.#columns - 1; j += 1) {
          this.pullCell([i, j + 1], [i, j])
        }
      }
    }

    this.#cells.map(row => {
      row.map(cell => {
        if (cell) cell.setImmutable(false)
      })
    })

    if (this.#shouldSpawn) {
      this.#shouldSpawn = false
      this.spawnCell()
    }
  }

  // pushes cell1 on cell2 and merges them if possible
  // if cell2 is missing then cell1 will move to cell2's position
  // after moving, it will also try to move again if possible
  pullCell (cell1Indexes, cell2Indexes) {
    const x1 = cell1Indexes[0]
    const y1 = cell1Indexes[1]
    const x2 = cell2Indexes[0]
    const y2 = cell2Indexes[1]

    if (!this.#cells[x1][y1]) return

    if (!this.#cells[x2][y2]) {
      this.#cells[x2][y2] = this.#cells[x1][y1]
      this.#cells[x2][y2].setPosition([x2, y2])
      this.#cells[x1][y1] = null

      this.#shouldSpawn = true

      this.#eventEmitter.emit('cellMoved', [x1, y1], [x2, y2])

      const nextCellIndexes = [
        x1 === x2 ? x2 : x2 + (x2 - x1),
        y1 === y2 ? y2 : y2 + (y2 - y1)
      ]

      if (nextCellIndexes[0] < 0 || nextCellIndexes[0] >= this.#rows) return
      if (nextCellIndexes[1] < 0 || nextCellIndexes[1] >= this.#rows) return

      this.pullCell(cell2Indexes, nextCellIndexes)
    } else if (this.#cells[x1][y1].getValue() === this.#cells[x2][y2].getValue() &&
      !this.#cells[x1][y1].isImmutable() && !this.#cells[x2][y2].isImmutable()) {
      this.#cells[x2][y2].setValue(this.#cells[x1][y1].getValue() * 2)
      this.#cells[x2][y2].setImmutable(true)
      this.#cells[x1][y1] = null

      this.#shouldSpawn = true

      this.#eventEmitter.emit('cellMerged', [x1, y1], [x2, y2], this.#cells[x2][y2].getValue())
    }
  }
}

module.exports = Grid
