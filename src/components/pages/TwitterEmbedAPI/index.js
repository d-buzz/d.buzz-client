import TweetLoader from 'components/skeleton/TweetLoader'
import React, { useEffect } from 'react'

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

  const getTheme =() => {
    const theme = localStorage.getItem('theme')
    let mode = ''
    if(theme?.includes('night') || theme?.includes('gray')){
      mode = 'dark'
    }
    else {
      mode = 'light'
    }
    return mode
  }

  return (
	  <React.Fragment>
		  <blockquote className='twitter-tweet' data-theme={getTheme()} data-height="100">
			  <a href={tweetUrl}> <TweetLoader /> </a>
		  </blockquote>
	  </React.Fragment>
  )
}

export default TwitterEmbedAPI