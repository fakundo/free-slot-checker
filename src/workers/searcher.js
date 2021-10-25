const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/fixed')
const config = require('helpers/config')
const findSlot = require('helpers/findSlot')
const sendMessage = require('helpers/sendMessage')

class Searcher {
  constructor() {
    this.slot = null
    this.running = false
    this.interval = null
  }

  async tick() {
    this.slot = await findSlot()
    if (this.slot) {
      await sendMessage(this.slot)
      this.stop()
    }
  }

  start() {
    const time = parseInt(config.interval, 10)
    this.interval = setIntervalAsync(() => this.tick(), time)
    this.running = true
    this.slot = null
  }

  stop() {
    clearIntervalAsync(this.interval)
    this.running = false
  }
}

module.exports = new Searcher()
