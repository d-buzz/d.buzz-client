import TweetLoader from 'components/skeleton/TweetLoader'
import React, { useEffect } from 'react'
import { getTheme } from 'services/helper'

function TwitterEmbedAPI() {
  const tweetUrl = window.location.href.split('&')[1]

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)
	
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
	  <React.Fragment>
		  <blockquote className='twitter-tweet' data-theme={getTheme()} data-height="100">
			  <a href={tweetUrl}> <TweetLoader /> </a>
		  </blockquote>
	  </React.Fragment>
  )
}

export default TwitterEmbedAPI