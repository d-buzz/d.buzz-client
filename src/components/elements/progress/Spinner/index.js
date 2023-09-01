import React from 'react'
import { createUseStyles } from 'react-jss'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = createUseStyles((theme) => ({
  loader: {
    width: 'max-content',
    margin: '0 auto',
  },
  spinner: {
    color: theme.font.color,
  },
}))

const Spinner = ({ loading, top = 30, size, style = {}, color }) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      {loading && (
        <div style={{ paddingTop: top, ...style }} className={classes.loader}>
          <CircularProgress
            className={classes.spinner}
            size={size}
          />
        </div>
      )}
    </React.Fragment>
  )
}

export default Spinner
