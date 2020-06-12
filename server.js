const express = require('express')
const app = express()
const http = require('http').createServer(app)
const port = process.env.PORT != null && process.env.PORT != '' ? process.env.PORT : 3000
const io = require('socket.io')(http, {
  pingTimeout: 600 * 1000
})

const Game = require('./core/game')

app.use(express.static(__dirname + '/client'))

http.listen(port, () => {
  console.log('listening on port: ' + port)
})

io.on('connection', socket => {
  socket.on('requestPlay', () => {
    socket.emit('acceptPlayRequest')
  })

  socket.on('requestStart', () => {
    const game = new Game()
    socket.game = game

    game.getEventEmitter().on('cellSpawned', cell => {
      socket.emit('cellSpawned', {
        position: cell.getPosition(),
        value: cell.getValue()
      })
    })

    game.getEventEmitter().on('cellMoved', (pos1, pos2) => {
      socket.emit('cellMoved', {
        from: pos1,
        to: pos2
      })
    })

    game.getEventEmitter().on('cellMerged', (pos1, pos2, value) => {
      socket.emit('cellMerged', {
        from: pos1,
        to: pos2,
        value
      })
    })

    game.getEventEmitter().on('gameOver', () => {
      socket.emit('gameOver')
    })

    game.start()
    socket.emit('gameStarted')
  })

  socket.on('requestPull', direction => {
    socket.game.getGrid().pullCells(direction)
  })

  socket.on('disconnect', () => {
    socket.game = null
  })
})
