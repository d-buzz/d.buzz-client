import React from 'react'
import Loader from 'react-loader-spinner'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  loader: {
    width: 'max-content',
    margin: '0 auto',
  },
})

const Spinner = ({ loading, top = 30, size, style = {} }) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      {loading && (
        <div style={{ paddingTop: top, ...style }} className={classes.loader}>
          <Loader
            type="Oval"
            color="#e61c34"
            height={size}
            width={size}
          />
        </div>
      )}
    </React.Fragment>
  )
}

export default Spinner
