# github-repos

Microservice to cache and expose GitHub projects for [pablo.life](https://pablo.life). Forked from [zeit/github-repos](https://github.com/zeit/github-repos).

## Usage

```bash
npm install
npm start
```

## API

### GET /

**200**: Returns a list of projects as follows

```json
[
  {
    "name": "project-name",
    "description": "The description woot",
    "stars": 3040,
    "url": "https://github.com/pablopunk/test"
  }
]
```
