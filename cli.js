#!/usr/bin/env node

const summary = require('server-summary')
const cliclopts = require('cliclopts')
const isStream = require('is-stream')
const minimist = require('minimist')
const router = require('./build')
const http = require('http')
const path = require('path')
const url = require('url')

const copts = cliclopts([
  {
    name: 'port',
    abbr: 'p',
    default: 1337,
    help: 'port for the server to listen on'
  }
])

const argv = minimist(process.argv.slice(2), copts.options())
const cmd = argv._[0]

// help
if (argv.help || !cmd) {
  console.log('Usage: command [options]')
  copts.print()
  process.exit()
}

// listen
if (cmd === 'start') {
  server().listen(argv.port, function () {
    const addr = 'localhost:' + this.address().port
    console.log(JSON.stringify({ type: 'connect', url: addr }))
    summary.call(this)
  })
}

// build
if (cmd === 'build') {
  router.build(__dirname + '/build', function (err, res) {
    if (err) {
      console.log('error:', err)
      process.exit(1)
    }
    process.exit()
  })
}

// create a server
// null -> null
function server () {
  return http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname
    pathname = pathname === '/' ? '/index.html' : pathname
    const ext = path.extname(pathname)

    console.log(JSON.stringify({url: pathname, type: 'static'}))

    if (ext === '.css') res.setHeader('Content-Type', 'text/css')
    if (ext === '.js') res.setHeader('Content-Type', 'application/javascript')

    router.match(pathname, function (err, body) {
      if (err) {
        err = (typeof err === 'object') ? err.toString() : err
        const ndj = JSON.stringify({level: 'error', url: pathname, message: err})
        console.log(ndj)
      }
      if (isStream(body)) return body.pipe(res)
      res.end(body)
    })
  })
}
