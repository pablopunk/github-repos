'use strict'

const fetch = require('node-fetch')

module.exports = async function (who, max = 100) {
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
    throw new Error('Non-200 response code from GitHub: ' + res.status)
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
