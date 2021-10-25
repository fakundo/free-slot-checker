const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const express = require('express')
const searcher = require('workers/searcher')
const stats = require('helpers/stats')

const templatePath = path.resolve(__dirname, '../template.ejs')
const template = ejs.compile(fs.readFileSync(templatePath, 'utf8'))

class WebServer {
  static routeSearcherStart(req, res) {
    searcher.start()
    res.sendStatus(200)
  }

  static routeSearcherStop(req, res) {
    searcher.stop()
    res.sendStatus(200)
  }

  static async routeDefault(req, res) {
    const data = {
      running: searcher.running,
      freeSlot: searcher.slot,
      stats,
    }
    const content = await template(data)
    res.send(content)
  }

  constructor() {
    this.app = express()
    this.configureRoutes()
  }

  configureRoutes() {
    this.app.post('/start', WebServer.routeSearcherStart)
    this.app.post('/stop', WebServer.routeSearcherStop)
    this.app.get('*', WebServer.routeDefault)
  }

  start() {
    this.app.listen(process.env.PORT)
  }
}

module.exports = new WebServer()
