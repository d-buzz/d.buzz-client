import React from 'react'
import { createUseStyles } from 'react-jss'
import Skeleton from 'react-loading-skeleton'

const useStyles = createUseStyles({
  wrapper: {
    margin: '0 auto',
  },
})

const TweetSkeleton = () => {
  const classes = useStyles()

  return(
    <React.Fragment>
      <div className={classes.wrapper}>
        <Skeleton height={150} />
      </div>
    </React.Fragment>
  )
}

export default TweetSkeleton