import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  tweetWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
    width: '100%',
  },
})

function TwitterEmbed(props) {
  const classes = useStyles()
  const { tweetId } = props
  const username = tweetId.split('&')[0]
  const id = tweetId.split('&')[1]

  useEffect(() => {
    const script = document.createElement('script')
    script.src = "https://platform.twitter.com/widgets.js"
    script.async = true
    document.body.appendChild(script)
	
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const getTheme =() => {
    const theme = localStorage.getItem('theme')
    let mode = ''
    if(theme.includes('night') || theme.includes('gray')){
      mode = 'dark'
    }
    else {
      mode = 'light'
    }
    return mode
  }

  return (
    <React.Fragment>
      <div className={classes.tweetWrapper}>
        <iframe
          title='Embedded Tweet'
          src={`https://twitframe.com/show?url=https://twitter.com/${username}/status/${id}&theme=${getTheme()}`}
          allowFullScreen={true}
          frameBorder='0'
          height='100%'
          width='100%'
        ></iframe>
      </div>
    </React.Fragment>
  )
}

export default TwitterEmbed
