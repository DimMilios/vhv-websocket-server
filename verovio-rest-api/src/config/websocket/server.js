#!/usr/bin/env node

/**
 * @type {any}
 */
import { Server } from 'ws'
const wss = new Server({ noServer: true })
import { setupWSConnection } from './utils.js'

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen(port, () => {
  console.log(`running at '${host}' on port ${port}`)
})
