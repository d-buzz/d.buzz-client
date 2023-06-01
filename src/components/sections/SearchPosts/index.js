import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { pending } from 'redux-saga-thunk'
import { PostlistSkeleton } from 'components'
import { useLocation } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  searchWrapper: {
    minHeight: '100vh',
    '& h6': {
      ...theme.font,
    },
  },
}))

const SearchPosts = (props) => {
  const classes = useStyles()
  const {
    items,
    loading,
  } = props
  const [full, setFull] = useState([])
  const location = useLocation()
  const params = queryString.parse(location.search)
  const [index, setIndex] = useState(20)
  const query = params.q

  useEffect(() => {
    if(items.hasOwnProperty('results')) {
      setFull(items.results)
    } else {
      setFull([])
    }
  }, [items])

  const loadMorePosts = () => {
    setIndex(index + 20)
  }

  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={full.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        {full.slice(0, index).map((item) => (
          <PostList
            disableUpvote={true}
            searchListMode={true}
            profileRef="SearchPosts"
            active_votes={item.total_votes}
            author={item.author}
            permlink={item.permlink}
            created={item.created_at}
            title={item.title}
            body={item.body}
            upvotes={item.total_votes}
            replyCount={item.children}
            meta={{ app: item.app, tags: item.tags || [] }}
            payout={item.payout}
            profile={item.profile}
            payoutAt={item.payout_at}
            highlightTag={`${query}`.replace('#', '')}
            disableUserMenu={true}
            disableOpacity={true}
            type='HIVE'
          />),
        )}
      </InfiniteScroll>
      <PostlistSkeleton loading={loading} />
      {(!loading && full.length === 0) &&
        (<center><br/><div className={classes.searchWrapper}>
          <h6>No Buzz's found {query!=='' && 
          (<React.Fragment>
            for <span style={{ color: '#d32f2f', fontFamily: 'Segoe-Bold' }}>{query}</span>
          </React.Fragment>)}</h6></div></center>)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.posts.get('search'),
  loading: pending(state, 'SEARCH_REQUEST'),
})


export default connect(mapStateToProps)(SearchPosts)
