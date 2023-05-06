import TweetLoader from 'components/skeleton/TweetLoader'
import React, { useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { getTheme } from 'services/helper'

const useStyles = createUseStyles({
  tweetWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    minHeight: 200,
    width: '100%',
    height: '100%',
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
  const { tweet, onIframeLoad } = props
  const username = tweet[0]?.id !== undefined && tweet[0].id.split('&')[0]
  const id = tweet[0]?.id !== undefined && tweet[0].id.split('&')[1].replace(/\?t=[a-zA-Z0-9_]+/, '')
  const [loaded, setLoaded] = useState(false)
  const [theme] = useState(getTheme() === 'gray' || getTheme() === 'night' ? 'dark' : 'light')

  
  const [tweetUrl] = useState(`/#/twitterEmbed&https://twitter.com/${username}/status/${id}`)


  const tweetWrapperRef = useRef()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)
  
    const onTweetRendered = () => {
      setLoaded(true)
      
      const reRender = () => {
        if(onIframeLoad) {
          onIframeLoad()
        } else {
          setTimeout(reRender, 100)
        }
      }

      reRender()
    }
  
    const waitForTwttr = () => {
      if(tweetUrl) {
        if (window.twttr && window.twttr.events && tweetWrapperRef.current) {
          window.twttr.events.bind('rendered', onTweetRendered)
          window.twttr.widgets.createTweet(id, tweetWrapperRef.current, {
            theme,
          })

          window.twttr.widgets.load()
        } else {
          setTimeout(waitForTwttr, 100)
        }
      }
    }

    waitForTwttr()
  
    return () => {
      if (window.twttr && window.twttr.events) {
        window.twttr.events.unbind('rendered', onTweetRendered)
      }
      document.body.removeChild(script)
    }

    // eslint-disable-next-line
  }, [])
  
  return (
    <React.Fragment>
      {tweetUrl &&
        <div ref={tweetWrapperRef} className={classes.tweetWrapper}>
          {!loaded && <TweetLoader />}
        </div>}
    </React.Fragment>
  )
}

export default TwitterEmbed
