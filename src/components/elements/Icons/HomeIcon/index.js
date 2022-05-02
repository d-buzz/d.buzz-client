import React  from 'react'

const HomeIcon = ({ height = 24, top = 0, type='outline' }) => {
  return (
    type === 'outline' ?
      <svg height="24.5" viewBox="0 0 84 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M68.7273 74H15.2727C14.2601 74 13.2889 73.6032 12.5729 72.8969C11.8568 72.1906 11.4545 71.2326 11.4545 70.2338V36.3378H5.22617C3.39141 36.3378 2.52495 34.0737 3.89096 32.8488L39.4304 0.980563C40.1333 0.349638 41.0496 0 42 0C42.9504 0 43.8667 0.349638 44.5696 0.980563L80.109 32.8488C81.475 34.0737 80.6086 36.3378 78.7738 36.3378H73.5455C72.9932 36.3378 72.5455 36.7855 72.5455 37.3378V70.2338C72.5455 71.2326 72.1432 72.1906 71.4271 72.8969C70.7111 73.6032 69.7399 74 68.7273 74ZM17.0909 68.4676H66.9091V29.3967L42 6.85573L17.0909 29.3967V68.4676ZM42 51.4027C39.4684 51.4027 37.0405 50.4107 35.2503 48.6449C33.4602 46.8792 32.4545 44.4843 32.4545 41.9871C32.4545 39.49 33.4602 37.0951 35.2503 35.3293C37.0405 33.5636 39.4684 32.5716 42 32.5716C44.5316 32.5716 46.9595 33.5636 48.7497 35.3293C50.5398 37.0951 51.5455 39.49 51.5455 41.9871C51.5455 44.4843 50.5398 46.8792 48.7497 48.6449C46.9595 50.4107 44.5316 51.4027 42 51.4027Z" fill="black"/>
      </svg> :
      <svg height="24.5" viewBox="0 0 84 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M72.5455 70.2338C72.5455 71.2326 72.1432 72.1906 71.4271 72.8969C70.7111 73.6032 69.7399 74 68.7273 74H15.2727C14.2601 74 13.2889 73.6032 12.5729 72.8969C11.8568 72.1906 11.4545 71.2326 11.4545 70.2338V36.3378H5.22617C3.39141 36.3378 2.52495 34.0737 3.89096 32.8488L39.4304 0.980563C40.1333 0.349638 41.0496 0 42 0C42.9504 0 43.8667 0.349638 44.5696 0.980563L80.109 32.8488C81.475 34.0737 80.6086 36.3378 78.7738 36.3378H72.5455V70.2338ZM42 51.4027C44.5316 51.4027 46.9595 50.4107 48.7497 48.6449C50.5398 46.8792 51.5455 44.4843 51.5455 41.9871C51.5455 39.49 50.5398 37.0951 48.7497 35.3293C46.9595 33.5636 44.5316 32.5716 42 32.5716C39.4684 32.5716 37.0405 33.5636 35.2503 35.3293C33.4602 37.0951 32.4545 39.49 32.4545 41.9871C32.4545 44.4843 33.4602 46.8792 35.2503 48.6449C37.0405 50.4107 39.4684 51.4027 42 51.4027Z" fill="#e61c34"/>
      </svg>    
  )
}


export default HomeIcon
