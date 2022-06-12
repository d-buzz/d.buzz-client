import React from 'react'

const TrendingIcon = ({ height = 24, width = 18, top = 0, type='outline' }) => {
  return (
    type === 'outline' ?
      <svg height="27" viewBox="0 0 65 83" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M62.2393 37.5619C60.4468 33.5085 57.8411 29.8703 54.5852 26.875L51.8984 24.398C51.8072 24.3163 51.6974 24.2582 51.5786 24.229C51.4598 24.1998 51.3358 24.2003 51.2173 24.2306C51.0987 24.2608 50.9894 24.3198 50.8989 24.4024C50.8084 24.4849 50.7394 24.5886 50.6981 24.7042L49.4978 28.1645C48.7499 30.3352 47.3742 32.5524 45.4261 34.7325C45.2968 34.8716 45.1491 34.9087 45.0475 34.918C44.946 34.9273 44.789 34.9087 44.6505 34.7789C44.5213 34.6675 44.4566 34.5006 44.4659 34.3336C44.8075 28.7489 43.1456 22.4499 39.5078 15.5943C36.4978 9.8983 32.3153 5.45469 27.0895 2.35621L23.2763 0.101936C22.7777 -0.194924 22.1406 0.194704 22.1683 0.779146L22.3714 5.23204C22.5099 8.27485 22.1591 10.9651 21.3281 13.2009C20.3125 15.9375 18.8537 18.4794 16.9886 20.7615C15.6907 22.3475 14.2196 23.7821 12.603 25.0382C8.70949 28.0454 5.54358 31.8987 3.34233 36.3095C1.14649 40.7588 0.00267904 45.6575 0 50.6237C0 55.0024 0.858664 59.242 2.55753 63.2403C4.19791 67.0899 6.56517 70.5836 9.5284 73.5283C12.5199 76.4969 15.9915 78.8347 19.8601 80.4581C23.8672 82.1465 28.1143 83 32.5 83C36.8856 83 41.1328 82.1465 45.1399 80.4674C48.9989 78.8535 52.5082 76.4997 55.4715 73.5376C58.463 70.569 60.8082 67.0995 62.4424 63.2496C64.1387 59.2622 65.0089 54.9694 64.9999 50.633C64.9999 46.1059 64.0766 41.7087 62.2393 37.5619V37.5619ZM51.0582 69.0383C46.1001 73.9736 39.517 76.6825 32.5 76.6825C25.4829 76.6825 18.8998 73.9736 13.9417 69.0383C9.00212 64.1123 6.2784 57.5814 6.2784 50.633C6.2784 46.5976 7.18323 42.7291 8.96519 39.1297C10.701 35.6138 13.2862 32.4689 16.4254 30.0477C18.4275 28.5095 20.2433 26.741 21.8359 24.7784C24.1442 21.949 25.9538 18.7948 27.2095 15.4088C27.7246 14.012 28.0988 12.5669 28.3267 11.095C30.5518 13.1545 32.4169 15.6407 33.9772 18.5536C37.061 24.3609 38.4829 29.5282 38.2059 33.9254C38.1397 34.961 38.3081 35.9983 38.6983 36.9591C39.0885 37.92 39.6904 38.7795 40.4588 39.473C41.1246 40.0773 41.9034 40.5427 42.7498 40.8421C43.5962 41.1415 44.4933 41.2689 45.3892 41.217C47.208 41.1242 48.8792 40.3171 50.098 38.9534C51.3259 37.5712 52.3877 36.1611 53.2741 34.7232C54.5667 36.3838 55.647 38.1927 56.5056 40.1409C57.9737 43.462 58.7215 46.9965 58.7215 50.633C58.7215 57.5814 55.9978 64.1216 51.0582 69.0383Z" fill="#e61c34" stroke="#e61c34" stroke-width="0.5"/>
      </svg> :
      <svg height="27" viewBox="0 0 65 83" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M62.2393 37.5619C60.4468 33.5084 57.8411 29.8703 54.5852 26.875L51.8984 24.398C51.8072 24.3163 51.6974 24.2582 51.5786 24.229C51.4598 24.1998 51.3358 24.2003 51.2173 24.2306C51.0987 24.2608 50.9894 24.3198 50.8989 24.4024C50.8084 24.4849 50.7394 24.5886 50.6981 24.7042L49.4978 28.1645C48.7499 30.3352 47.3742 32.5524 45.4261 34.7325C45.2968 34.8716 45.1491 34.9087 45.0475 34.918C44.946 34.9273 44.789 34.9087 44.6505 34.7789C44.5213 34.6675 44.4566 34.5006 44.4659 34.3336C44.8075 28.7489 43.1456 22.4499 39.5078 15.5943C36.4978 9.8983 32.3153 5.45469 27.0895 2.35621L23.2763 0.101936C22.7777 -0.194924 22.1406 0.194704 22.1683 0.779146L22.3714 5.23204C22.5099 8.27485 22.1591 10.9651 21.3281 13.2009C20.3125 15.9375 18.8537 18.4794 16.9886 20.7615C15.6907 22.3475 14.2196 23.7821 12.603 25.0382C8.70949 28.0454 5.54358 31.8987 3.34233 36.3095C1.14649 40.7588 0.00267904 45.6575 0 50.6237C0 55.0024 0.858664 59.242 2.55753 63.2403C4.19791 67.0899 6.56517 70.5836 9.5284 73.5283C12.5199 76.4969 15.9915 78.8347 19.8601 80.4581C23.8672 82.1465 28.1143 83 32.5 83C36.8856 83 41.1328 82.1465 45.1399 80.4674C48.9989 78.8535 52.5082 76.4997 55.4715 73.5376C58.463 70.569 60.8082 67.0995 62.4424 63.2496C64.1387 59.2622 65.0089 54.9694 64.9999 50.633C64.9999 46.1059 64.0766 41.7087 62.2393 37.5619Z" fill="#e61c34"/>
      </svg>    
  )
}

export default TrendingIcon