import app from '../index'
import fs from 'fs'
import http from 'http'
import https from 'https'

const credentials = {
  key: fs.readFileSync('src/ssl/localhost.key'),
  cert: fs.readFileSync('src/ssl/localhost.crt')
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3333')
app.set('port', port)

/**
 * Create https server.
 */

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

/**
 * Listen on provided port, on all network interfaces.
 */

httpServer.listen('3334')
httpsServer.listen(port)
httpsServer.on('error', onError)
httpsServer.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val: string) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for https server "error" event.
 */

function onError (error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for https server "listening" event.
 */

function onListening () {
  const addr = httpsServer.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr!.port
  console.log(`Listening on ${bind} ☕`)
  console.log('Serving running at https://localhost:3333/api')
  console.log('                Or  http://localhost:3334/api')
}