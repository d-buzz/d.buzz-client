import React from 'react'
import Image from 'react-bootstrap/Image'
import { checkForCeramicAccount } from 'services/ceramic'

const Avatar = React.memo((props) => {
  const { 
    author, 
    height = 50, 
    size = 'small', 
    border = false, 
    style = {}, 
    className = {}, 
    id,
    onClick = () => {},
    onLoad,
    avatarUrl = '',
  } = props

  let avatar_src = ''

  if(author) {
    if(checkForCeramicAccount(author)) {
      avatar_src = `${window.location.origin}/ceramic_user_avatar.svg`
    } else {
      avatar_src = `https://images.hive.blog/u/${author}/avatar/${size}`
    }
  }

  if(avatarUrl){
    avatar_src = avatarUrl
  }

  return (
    <React.Fragment>
      <Image
        id={id}
        onLoad={onLoad}
        onClick={onClick}
        src={avatar_src}
        roundedCircle
        height={height}
        width={height}
        className={`${className} user-avatar-image`}
        style={{
          border: border ? '5px solid white' : 'none', 
          backgroundColor: 'none', 
          objectFit : avatarUrl ? "cover" : "inherit", 
          ...style,
        }}
      />
    </React.Fragment>
  )
})

export default Avatar
