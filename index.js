'use strict'

const {parse} = require('url')
const ms = require('ms')
const getRepos = require('./lib/repos')

let data = []

// Controller
module.exports = async (req, res) => {
  if (req.url === '/force') {
    console.log('Forcing cache reload')
    await cacheData()
  }

  let max = data.length
  const query = parse(req.url, true).query
  if (query && query.max) {
    max = parseInt(query.max)
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  return data.slice(0, max)
}

// Cache data now and every hour
cacheData()
setInterval(cacheData, ms('1h'))

async function cacheData () {
  const start = Date.now()

  const repos = [
    ...(await getRepos('users/pablopunk')),
    ...(await getRepos('orgs/ladjs', 1)),
    ...(await getRepos('orgs/lassjs', 1))
  ]

  // Order by stars
  data = repos
    .sort((p1, p2) => p2.lastPush < p1.lastPush)
    .sort((p1, p2) => p2.stars - p1.stars)

  console.log(
    `Re-built projects cache. ` +
    `Total: ${data.length} public projects. ` +
    `Elapsed: ${new Date() - start}ms`
  )
}
