import classNames from 'classnames'
import React, { useRef } from 'react'
import Image from 'react-bootstrap/Image'
import { createUseStyles } from 'react-jss'
import { checkForCeramicAccount } from 'services/ceramic'
import { getTheme, getUserTheme } from 'services/helper'

const useStyles = createUseStyles(theme => ({
  avatarStyles: {
    animation: 'skeleton-loading 1s linear infinite alternate',
  },
}))

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

  const classes = useStyles()

  const avatarImageRef = useRef(null)

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

  const loadProfileImage = () => {
    if(avatarImageRef) {

      avatarImageRef.current.style.animation = 'none'
      avatarImageRef.current.style.opacity = '1'
      avatarImageRef.current.style.background = `${getTheme(getUserTheme())?.background?.primary}`
      
      if(onLoad) {
        onLoad()
      }
    }
  }

  return (
    <React.Fragment>
      <Image
        ref={avatarImageRef}
        id={`${id}`}
        onLoad={loadProfileImage}
        onClick={onClick}
        src={avatar_src}
        roundedCircle
        height={height}
        width={height}
        className={classNames(className, 'user-avatar-image', classes.avatarStyles)}
        style={{
          border: border ? '5px solid white' : 'none', 
          backgroundImage: `url(${avatar_src})`, 
          objectFit : avatarUrl ? "cover" : "inherit", 
          ...style,
        }}
      />
    </React.Fragment>
  )
})

export default Avatar
