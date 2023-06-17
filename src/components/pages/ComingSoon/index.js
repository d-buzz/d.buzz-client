import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    ...theme.font,
  },
}))

const ComingSoon = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <center><br/>
        <div className={classes.wrapper}>
          <h6>Coming soon!</h6>
        </div>
      </center>
    </React.Fragment>
  )
}

export default ComingSoon