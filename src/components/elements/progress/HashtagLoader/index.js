import React from 'react'
import HashLoader from 'react-spinners/HashLoader'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  loader: {
    width: 'max-content',
    margin: '0 auto',
    paddingTop: 50,
  }
})

const HashtagLoader = ({ loading }) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      {
        loading && (
          <div className={classes.loader}>
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
