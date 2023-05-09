import React from 'react'
import { createUseStyles } from 'react-jss'

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

  return(
    <React.Fragment>
      <div className={classes.wrapper}>
        <img src={`${window.location.origin}/twitter.svg`} height={30} alt='loading tweet...' loading='lazy'/>
      </div>
    </React.Fragment>
  )
}

export default TweetLoader