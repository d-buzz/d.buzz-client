import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { getTheme } from 'services/helper'

const useStyles = createUseStyles({
  wrapper: {
    position: 'absolute',
    display: 'flex',
    margin: '0 auto',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'twitterLoader infinite linear 1000ms',
  },
})

const TweetLoader = () => {
  const classes = useStyles()
  const [theme] = useState(getTheme() === 'gray' || getTheme() === 'night' ? 'dark' : 'light')
  const [logo]  = useState(theme === 'light' ? `${window.location.origin}/x.svg` : `${window.location.origin}/x-white.svg`)

  return(
    <React.Fragment>
      <div className={classes.wrapper}>
        <img src={logo} height={30} alt='loading tweet...' loading='lazy'/>
      </div>
    </React.Fragment>
  )
}

export default TweetLoader