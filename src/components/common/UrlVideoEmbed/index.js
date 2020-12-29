import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    '& iframe': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  },
})

const UrlVideoEmbed = (props) => {
  const classes = useStyles()
  const { url } = props
  
  return (
    <React.Fragment>
      <div className={classes.videoWrapper} >
        <iframe
          title='Embedded Video'
          src={url}
          allowFullScreen={true}
          frameBorder='0'
          height='300'
          width='100%'
        ></iframe>
      </div>
      <br />
    </React.Fragment>
  )
}

export default UrlVideoEmbed