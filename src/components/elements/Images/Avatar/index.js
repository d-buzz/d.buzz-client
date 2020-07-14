import React from 'react'
import Image from 'react-bootstrap/Image'

const Avatar = (props) => {
  const { author, height = 50 } = props

  return (
    <React.Fragment>
      <Image 
        src={`https://images.hive.blog/u/${author}/avatar/small`}
        roundedCircle
        height={height}
      />
    </React.Fragment>
  )
}

export default Avatar