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
    onClick = () => {},
    avatarUrl = '',
  } = props

  let avatar_src = ''

  if(checkForCeramicAccount(author)) {
    avatar_src = `${window.location.origin}/ceramic_user_avatar.png`
  } else {
    avatar_src = `https://images.hive.blog/u/${author}/avatar/${size}`
  }

  if(avatarUrl){
    avatar_src = avatarUrl
  }

  const handleImageOnError = () => {
    const avatarImage = document.querySelector('.user-avatar-image')
    avatarImage.src = `${window.location.origin}/ceramic_user_avatar.png`
    avatarImage.style.animation = 'none'
    avatarImage.style.opacity = '1'
  }

  return (
    <React.Fragment>
      <Image
        onClick={onClick}
        onError={handleImageOnError}
        src={avatar_src}
        roundedCircle
        height={height}
        width={height}
        className={`${className} user-avatar-image`}
        style={{
          border: border ? '5px solid white' : 'none', 
          backgroundColor: 'white', 
          objectFit : avatarUrl ? "cover" : "inherit", 
          ...style,
        }}
      />
    </React.Fragment>
  )
})

export default Avatar
