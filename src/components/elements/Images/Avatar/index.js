import React from 'react'
import Image from 'react-bootstrap/Image'

const Avatar = (props) => {
  const { author, height = 50, size = 'small', border = false, style = {}, className = {} } = props



  return (
    <React.Fragment>
      <Image
        src={`https://images.hive.blog/u/${author}/avatar/${size}`}
        roundedCircle
        height={height}
        width={height}
        className={className}
        style={{ border: border ? '5px solid white' : 'none', backgroundColor: 'white', ...style }}
      />
    </React.Fragment>
  )
}

export default Avatar
