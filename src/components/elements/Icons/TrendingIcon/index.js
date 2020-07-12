import React from 'react'

const TrendingIcon = ({ height = 20, top = 0 }) => {
  return (
    <svg height={height} style={{ marginTop: top }} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 8V1L1 12H8V19L17 8H10Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

export default TrendingIcon