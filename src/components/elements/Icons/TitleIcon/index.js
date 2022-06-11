import React from 'react'

const TitleIcon = ({ height = 25, top = 0, style = 0 }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 1.9C0 2.95133 0.861429 3.8 1.92857 3.8H7.07143V17.1C7.07143 18.1513 7.93286 19 9 19C10.0671 19 10.9286 18.1513 10.9286 17.1V3.8H16.0714C17.1386 3.8 18 2.95133 18 1.9C18 0.848667 17.1386 0 16.0714 0H1.92857C0.861429 0 0 0.848667 0 1.9Z" fill="#e74b5d"/>
    </svg>
  )
}

export default TitleIcon
