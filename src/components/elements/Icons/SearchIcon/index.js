import React from 'react'

const SearchIcon = ({ height = 20, top = 0, style = 0, type = 'outline' }) => {
  return (
    type === 'outline' ?
      <svg width="77" height="77" viewBox="0 0 77 77" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M72.0015 72.0015L54.789 54.789M54.789 54.789C57.5517 52.0263 59.7432 48.7465 61.2383 45.1369C62.7335 41.5273 63.503 37.6585 63.503 33.7515C63.503 29.8445 62.7335 25.9757 61.2383 22.3661C59.7432 18.7565 57.5517 15.4767 54.789 12.714C52.0263 9.95133 48.7465 7.75985 45.1369 6.2647C41.5273 4.76954 37.6585 4 33.7515 4C29.8445 4 25.9757 4.76954 22.3661 6.2647C18.7565 7.75985 15.4767 9.95133 12.714 12.714C7.13453 18.2935 4 25.8609 4 33.7515C4 41.6421 7.13453 49.2095 12.714 54.789C18.2935 60.3685 25.8609 63.503 33.7515 63.503C41.6421 63.503 49.2095 60.3685 54.789 54.789Z" stroke="black" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      :
      <svg width="77" height="77" viewBox="0 0 77 77" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49514 34C8.49514 30.6513 9.15471 27.3354 10.4362 24.2416C11.7177 21.1478 13.596 18.3367 15.9639 15.9688C18.3318 13.6009 21.1429 11.7226 24.2367 10.4411C27.3305 9.15958 30.6464 8.5 33.9951 8.5C37.3438 8.5 40.6598 9.15958 43.7536 10.4411C46.8474 11.7226 49.6585 13.6009 52.0264 15.9688C54.3943 18.3367 56.2726 21.1478 57.5541 24.2416C58.8356 27.3354 59.4951 30.6513 59.4951 34C59.4951 40.763 56.8085 47.249 52.0264 52.0312C47.2442 56.8134 40.7582 59.5 33.9951 59.5C27.2321 59.5 20.7461 56.8134 15.9639 52.0312C11.1817 47.249 8.49514 40.763 8.49514 34ZM33.9951 2.10019e-07C28.5843 0.000774886 23.2518 1.29293 18.4407 3.76907C13.6297 6.24521 9.47913 9.83382 6.33394 14.2367C3.18876 18.6395 1.1398 23.7294 0.357366 29.0834C-0.425072 34.4374 0.0816035 39.9008 1.83528 45.0196C3.58897 50.1383 6.539 54.7646 10.4402 58.514C14.3414 62.2634 19.0812 65.0275 24.2655 66.5767C29.4499 68.1258 34.9291 68.4153 40.2478 67.421C45.5665 66.4268 50.5711 64.1774 54.8456 60.86L69.2404 75.2548C70.0419 76.0289 71.1155 76.4573 72.2298 76.4476C73.3442 76.4379 74.4101 75.991 75.1981 75.203C75.9861 74.415 76.4331 73.349 76.4428 72.2347C76.4524 71.1204 76.0241 70.0468 75.2499 69.2452L60.8551 54.8505C64.757 49.8247 67.1704 43.8048 67.8208 37.4755C68.4712 31.1462 67.3325 24.7613 64.5343 19.047C61.736 13.3327 57.3904 8.51823 51.9917 5.1511C46.593 1.78398 40.3578 -0.000706862 33.9951 2.10019e-07ZM33.9951 51C38.5038 51 42.8278 49.2089 46.016 46.0208C49.2041 42.8327 50.9951 38.5087 50.9951 34C50.9951 29.4913 49.2041 25.1673 46.016 21.9792C42.8278 18.7911 38.5038 17 33.9951 17C29.4865 17 25.1624 18.7911 21.9743 21.9792C18.7862 25.1673 16.9951 29.4913 16.9951 34C16.9951 38.5087 18.7862 42.8327 21.9743 46.0208C25.1624 49.2089 29.4865 51 33.9951 51Z" fill="black"/>
      </svg>
  )
}

export default SearchIcon