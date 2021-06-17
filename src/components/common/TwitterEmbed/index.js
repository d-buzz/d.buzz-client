import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  tweetWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    maxHeight: '350',
  },
})

function TwitterEmbed(props) {
  const classes = useStyles()
  const { tweetId } = props
  const username = tweetId.split('&')[0]
  const id = tweetId.split('&')[1]

  return (
    <React.Fragment>
      <div className={classes.tweetWrapper}>
        <iframe
          className='twitterEmbedWrapper'
          title='Embedded Tweet'
          src={`http://localhost:3000/#/twitterEmbed&https://twitter.com/${username}/status/${id}`}
          allowFullScreen={true}
          frameBorder='0'
          width='100%'
          height='300'
          style={{borderRadius: 0}}
        ></iframe>
      </div>
    </React.Fragment>
  )
}

export default TwitterEmbed
