import React from 'react'
import HashLoader from 'react-spinners/HashLoader'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  loader: {
    width: 'max-content',
    margin: '0 auto',
  }
})

const HashtagLoader = ({ loading, top = 30 }) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      {
        loading && (
          <div style={{ paddingTop: top }} className={classes.loader}>
            <HashLoader
              color="#e61c34"
              loading={true}
            />
          </div>
        )
      }
    </React.Fragment>
  )
}

export default HashtagLoader
