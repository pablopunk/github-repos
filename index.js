const fetch = require('node-fetch')
const ms = require('ms')

let data = []

// Controller
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  return data
}

// Cache data now and every X ms
cacheData()
setInterval(cacheData, ms('15m'))

const log = console.log
const logError = console.error

function cacheData () {
  const start = Date.now()
  fetch('https://api.github.com/users/pablopunk/repos?per_page=100', {
    headers: {
      Accept: 'application/vnd.github.preview'
    }
  })
  .then(res => {
    if (res.status !== 200) {
      return logError('Non-200 response code from GitHub: ' + res.status)
    }
    return res.json()
  })
  .then(data_ => {
    if (!data_) {
      return
    }

    data = data_.map(({name, description, stargazers_count, html_url}) => ({
      name,
      description,
      url: html_url,
      stars: stargazers_count
    })).sort((p1, p2) =>
      p2.stars - p1.stars
    )

    log(`Re-built projects cache. ` +
        `Total: ${data.length} public projects. ` +
        `Elapsed: ${(new Date() - start)}ms`)
  })
  .catch(err => {
    logError('Error parsing response from GitHub: ' + err.stack)
  })
}
