const fetch = require('node-fetch')
const config = require('helpers/config')

const formatMessage = ({ date, time }) => (
  `${date} | ${time}`
)

module.exports = async ({ date, time }) => {
  const url = new URL(`https://api.telegram.org/bot${config.tgToken}/sendMessage`)
  url.searchParams.set('chat_id', config.tgRecipient)
  url.searchParams.set('text', formatMessage({ date, time }))
  url.searchParams.set('parse_mode', 'Markdown')
  try {
    await fetch(url, { method: 'post' })
  } catch (e) {
    // do nothing
  }
}
