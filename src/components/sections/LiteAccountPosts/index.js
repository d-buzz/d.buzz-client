import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { createUseStyles } from 'react-jss'
import LiteInfiniteList from 'components/common/LiteInfiniteList'
import { ACCOUNT_POSTS_QUERY } from 'services/union'
import { deepClone, removeFootNote } from 'services/api'
import { useQuery } from '@apollo/client'
import _ from 'lodash'

const useStyle = createUseStyles(theme => ({
  wrapper: {
    '& h6': {
      ...theme.font,
    },
  },
}))

const LiteAccountPosts = (props) => {
  const {
    match,
    // eslint-disable-next-line
    user,
  } = props
  const classes = useStyle()

  const { params } = match
  const { username } = params

  // eslint-disable-next-line
  const { loading, data=[], refetch } = useQuery(ACCOUNT_POSTS_QUERY, {
    variables: { user: username },
  })
  const [allPosts, setAllPosts] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    const posts = deepClone(data?.socialFeed?.items || [])
    removeFootNote(posts)

    if (!_.isEqual(posts, allPosts)) {
      setAllPosts(posts)
    }
    // eslint-disable-next-line
  }, [data])

  useEffect(() => {
    if (allPosts.length > 0) {
      setItems(allPosts.slice(0, 10))
    }
  }, [allPosts])

  const loadMorePosts = () => {
    const newLimit = items.length + 10
    if (newLimit <= allPosts.length) {
      setItems(allPosts.slice(0, newLimit))
    }
  }

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        {(
          <React.Fragment>
            <LiteInfiniteList disableOpacity={true} loading={loading} items={items} onScroll={loadMorePosts} />
            {(!loading && items.length === 0) &&
          (<center><br/><h6>No Buzz's</h6></center>)}
          </React.Fragment>
        )}
        {/* {muted && <center><br /><h6>This user is on your mutelist, unmute this user to view their buzzes</h6></center>} */}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps, null)(LiteAccountPosts)
