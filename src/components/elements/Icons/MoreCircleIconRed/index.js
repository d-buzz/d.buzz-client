import React from 'react'

const MoreCircleIconRed = ({ size = 30 }) => {
  return (
    <svg height={size} width={size} viewBox="0 0 512 512" fill="#e61c34" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,480
				C132.288,480,32,379.712,32,256S132.288,32,256,32s224,100.288,224,224S379.712,480,256,480z"/>
        <circle cx="256" cy="256" r="32"/>
        <circle cx="368" cy="256" r="32"/>
        <circle cx="144" cy="256" r="32"/>
      </g>
    </svg>
  )
}

export default MoreCircleIconRed
