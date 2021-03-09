const config = {
  TAG: 'hive-193084',
  VERSION: process.env.REACT_APP_VERSION || '0.0.0',
  SEARCH_API: process.env.REACT_APP_SEARCH_API || 'http://localhost:3030/api/v1',
  SCRAPE_API: process.env.REACT_APP_SCRAPE_API,
  IMAGE_API: process.env.REACT_APP_IMAGE_API || 'http://localhost:3040/api/v1',
  CENSOR_API: process.env.REACT_APP_CENSOR_API || 'http://localhost:3001/api/v1/censor',
  API_KEY: 'ixc0LdVDyuWarUhdt9ix3w==',
  API_SECRET: 'D4e7pwZphykKWsG0ElancXSzDmDEqImeC9yenZMMfVo=',
  BUCKET: 'nathansenn-team-bucket.storage.fleek.co',
  GIPHY_API_KEY: 'ecohRlzr8FrMGrTfX8JJ4uoilgdIiZI5',
  DISABLE_MOBILE: false,
  BRANCH: 'prod',
}

export default config
