const config = {
  TAG: 'hive-193084',
  VERSION: process.env.REACT_APP_VERSION || '0.0.0',
  SEARCH_API: process.env.REACT_APP_SEARCH_API || 'http://localhost:3030/api/v1',
  SCRAPE_API: process.env.REACT_APP_SCRAPE_API,
  IMAGE_API: process.env.REACT_APP_IMAGE_API || 'http://localhost:3040/api/v1',
  VIDEO_API: process.env.REACT_APP_VIDEO_API || 'http://localhost:5454/api/v1',
  CENSOR_API: process.env.REACT_APP_CENSOR_API || 'http://localhost:3001/api/v1/censor',
  PRICE_API: process.env.REACT_APP_PRICE_CHART_API,
  BUCKET: process.env.REACT_APP_FLEEK_BUCKET,
  GIPHY_API_KEY: 'ecohRlzr8FrMGrTfX8JJ4uoilgdIiZI5',
  DISABLE_MOBILE: false,
  BRANCH: process.env.REACT_APP_ENV,
  DEFAULT_RPC_NODE: process.env.REACT_APP_DEFAULT_RPC_NODE,
  APP_NAME: 'D.Buzz',
  APP_DESCRIPTION: 'Micro-blogging social media Dapp on the HIVE blockchain.',
  APP_ICON: 'https://images.hive.blog/p/D5zH9SyxCKdAD9rYwjD1VDFVfes4J8WBmiaYPdeZndqBcsWCe3xdjZ9FWukYQcKxKMUaJu2FLm66h23z4KvAS7BxXaBpNLPzMVDqas4kKbBvZPf2zny6g2ePMPCmbC44pcvGUN?width=128&height=128',
}

export default config
