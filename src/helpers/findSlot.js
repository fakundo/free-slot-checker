/* eslint-disable no-restricted-syntax, no-await-in-loop */

const fetch = require('node-fetch')
const config = require('helpers/config')
const stats = require('helpers/stats')

const dates = config.date.split(',')

const items = dates.map((date) => {
  const url = new URL(config.dataUrl)
  url.searchParams.set(config.dateParamName, date)
  return { url, date }
})

const fetchData = async (url) => {
  stats.requests.total++
  try {
    const res = await fetch(url.href)
    const data = await res.json()
    return data
  } catch (e) {
    stats.requests.bad++
    throw e
  }
}

const findFreeTime = (data) => {
  const { data: { [config.dataTable]: slots } } = data
  const { time } = slots.find((slot) => slot.status === config.dataStatusFree)
  return time
}

const processItem = async ({ url, date }) => {
  try {
    const data = await fetchData(url)
    const time = findFreeTime(data)
    return { date, time }
  } catch (e) {
    return null
  }
}

module.exports = async () => {
  for (const item of items) {
    const slot = await processItem(item)
    if (slot) {
      return slot
    }
  }
  return null
}
