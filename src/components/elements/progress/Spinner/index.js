import React from 'react'
import { createUseStyles } from 'react-jss'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = createUseStyles({
  loader: {
    width: 'max-content',
    margin: '0 auto',
  },
})

const Spinner = ({ loading, top = 30, size, style = {}, color }) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      {loading && (
        <div style={{ paddingTop: top, ...style }} className={classes.loader}>
          <CircularProgress
            style={{color: !color ? '#e61c34' : color}}
            size={size}
          />
        </div>
      )}
    </React.Fragment>
  )
}

export default Spinner
