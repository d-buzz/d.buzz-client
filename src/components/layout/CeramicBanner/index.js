import React from 'react'
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles(theme => ({
  container: {
    position: 'relative',
    top: 0,
    width: '100%',
    display: 'grid',
    placeItems: 'center',
    background: '#e61c34',
    fontSize: '1em',
    color: '#ffffff',
    fontWeight: 600,
    padding: '5px 0',
    zIndex: 99,
  },
}))

const CeramicBanner = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      This is the test version of DBUZZ Lite, any posts made on the platform will be removed when we go live!
    </div>
  )
}

export default CeramicBanner