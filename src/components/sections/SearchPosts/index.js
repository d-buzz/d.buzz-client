import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { pending } from 'redux-saga-thunk'
import { PostlistSkeleton } from 'components'
import { useLocation } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

const SearchPosts = (props) => {
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
            searchListMode={true}
            title={item.title}
            profileRef="SearchPosts"
            active_votes={item.total_votes}
            author={item.author}
            permlink={item.permlink}
            created={item.created_at}
            body={item.body}
            upvotes={item.total_votes}
            replyCount={item.children}
            meta={{ app: item.app, tags: item.tags }}
            payout={item.payout}
            profile={item.profile}
            payoutAt={item.payout_at}
            highlightTag={`${query}`.replace('#', '')}
          />)
        )}
      </InfiniteScroll>
      <PostlistSkeleton loading={loading} />
      {(!loading && full.length === 0) &&
        (<center><br/><h6>No Buzz's found with <span style={{ color: '#d32f2f', fontFamily: 'Segoe-Bold' }}>{query}</span></h6></center>)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.posts.get('search'),
  loading: pending(state, 'SEARCH_REQUEST'),
})


export default connect(mapStateToProps)(SearchPosts)
