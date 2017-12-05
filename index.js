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

async function getRepos (who, max = 100) {
  if (!who || typeof who !== 'string') {
    throw new Error('Provide user or organization')
  }

  let repos = []

  const res = await fetch(
    `https://api.github.com/${who}/repos?per_page=${max}&type=all`,
    {
      headers: {
        Accept: 'application/vnd.github.preview'
      }
    }
  )
  if (res.status !== 200) {
    return logError('Non-200 response code from GitHub: ' + res.status)
  }
  const data_ = await res.json()
  if (!data_) {
    return []
  }

  repos = data_
    .map(({ name, description, stargazers_count, html_url }) => ({
      name,
      description,
      url: html_url,
      stars: stargazers_count
    }))

  return repos
}

async function cacheData () {
  const start = Date.now()

  const repos = [
    ...(await getRepos('users/pablopunk')),
    ...(await getRepos('orgs/ladjs', 1)),
    ...(await getRepos('orgs/lassjs', 1))
  ]

  // Order by stars
  data = repos
    .sort((p1, p2) => p2.stars - p1.stars)

  log(
    `Re-built projects cache. ` +
    `Total: ${data.length} public projects. ` +
    `Elapsed: ${new Date() - start}ms`
  )
}
