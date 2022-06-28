import React from 'react'

import {
  ListGroup,
} from 'components/elements'

const Skeleton = React.lazy(() => import('react-loading-skeleton'))

const SidebarRightSkeleton = ({ loading }) => {
  return (
    <React.Fragment>
      {loading && (
        <React.Fragment>
          <div>
            <ListGroup label="Trends for you">
              <Skeleton height={50} />
              <br />
              <Skeleton height={50} />
              <br />
              <Skeleton height={50} />
              <br />
              <Skeleton height={50} />
              <br />
              <Skeleton height={50} />
              <br />
            </ListGroup>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default SidebarRightSkeleton
