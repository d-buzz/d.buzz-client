import React from 'react'

const TitleIcon = ({ height = 25, top = 0, style = 0 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#E53935">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M5 4v3h5.5v12h3V7H19V4z"/>
    </svg>
  )
}

export default TitleIcon
