import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    borderRadius: 16,
    overflow: 'hidden',
    '& video': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  },
})

const VideoPreview = (props) => {
  const classes = useStyles()
  const { url } = props
  
  return (
    <React.Fragment>
      <div className={classes.videoWrapper} >
        <video
          src={url}
          width='100%'
          controls
        />
      </div>
      <br />
    </React.Fragment>
  )
}

export default VideoPreview