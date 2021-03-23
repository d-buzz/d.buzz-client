import React from 'react'
import Image from 'react-bootstrap/Image'

const Avatar = React.memo((props) => {
  const { 
    author, 
    height = 50, 
    size = 'small', 
    border = false, 
    style = {}, 
    className = {}, 
    onClick = () => {},
    avatarUrl = '',
  } = props

  let avatar_src = `https://images.hive.blog/u/${author}/avatar/${size}`
  if(avatarUrl){
    avatar_src = avatarUrl
  }
  return (
    <React.Fragment>
      <Image
        onClick={onClick}
        src={avatar_src}
        roundedCircle
        height={height}
        width={height}
        className={className}
        style={{ border: border ? '5px solid white' : 'none', backgroundColor: 'white', ...style }}
      />
    </React.Fragment>
  )
})

export default Avatar
