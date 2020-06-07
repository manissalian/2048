const Grid = require('./grid')

const EventEmitter = require('events')

class Game {
  #score = 0
  #eventEmitter = new EventEmitter()
  #grid = new Grid(this.#eventEmitter)

  constructor () {}

  start () {
    this.#grid.spawnCell()
    this.#grid.spawnCell()
  }

  getEventEmitter () {
    return this.#eventEmitter
  }

  getGrid () {
    return this.#grid
  }
}

module.exports = Game
