const Grid = require('./grid')

class Game {
  score = 0
  grid = new Grid()

  constructor () {}

  start () {
    this.grid.spawnCell()
    this.grid.spawnCell()
  }
}

module.exports = Game
