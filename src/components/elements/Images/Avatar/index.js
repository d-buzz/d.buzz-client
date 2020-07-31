import React from 'react'
import Image from 'react-bootstrap/Image'

const Avatar = (props) => {
  const { author, height = 50, size = 'small', border = false } = props

  return (
    <React.Fragment>
      <Image
        src={`https://images.hive.blog/u/${author}/avatar/${size}`}
        roundedCircle
        height={height}
        width={height}
        style={{ border: border ? '5px solid white' : 'none', backgroundColor: '#ffebee' }}
      />
    </React.Fragment>
  )
}

export default Avatar
