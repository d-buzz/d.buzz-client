import React from 'react'

import {
  ListGroup,
} from 'components/elements'
import {createUseStyles} from "react-jss"

const Skeleton = React.lazy(() => import('react-loading-skeleton'))

const useStyles = createUseStyles(theme => ({
  container: {
    backgroundColor: theme.right.list.background,
    borderRadius: '10px 10px',
    padding: 10,
  },
  customLabel: { // Add this
    color: theme.font.color,
    paddingTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
}))


const SidebarRightSkeleton = ({loading}) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      {loading && (
        <React.Fragment>
          <div>
            <ListGroup label="Trends for you" labelClassName={classes.customLabel}>
              <Skeleton height={50}/>
              <br/>
              <Skeleton height={50}/>
              <br/>
              <Skeleton height={50}/>
              <br/>
              <Skeleton height={50}/>
              <br/>
              <Skeleton height={50}/>
              <br/>
            </ListGroup>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default SidebarRightSkeleton
