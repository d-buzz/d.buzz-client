import TweetSkeleton from 'components/skeleton/TweetSkeleton'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  tweetWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    maxHeight: '350',
  },
  skeleton: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
})

function TwitterEmbed(props) {
  const classes = useStyles()
  const { tweetId } = props
  const username = tweetId.split('&')[0]
  const id = tweetId.split('&')[1]
  const [loading, setLoading] = useState(true)

  const showTweet = () => {
    document.querySelector('.twitterEmbedWrapper').style.display = 'block'
    setLoading(false)
  }

  return (
    <React.Fragment>
      <div className={classes.tweetWrapper}>
        {loading && <span className={classes.skeleton}><TweetSkeleton /></span>}
        <iframe
          style={{ borderRadius: 0 }}
          className='twitterEmbedWrapper'
          title='Embedded Tweet'
          src={`/#/twitterEmbed&https://twitter.com/${username}/status/${id}`}
          allowFullScreen={true}
          frameBorder='0'
          width='100%'
          height='300'
          onLoad={showTweet}
        >hi</iframe>
      </div>
    </React.Fragment>
  )
}

export default TwitterEmbed
