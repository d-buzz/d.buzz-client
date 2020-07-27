import React, { useEffect } from 'react'
import { PostList } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getLatestPostsRequest,
  setLatestIsVisited,
  setHomeIsVisited,
  setTrendingIsVisited,
  clearHomePosts,
  clearTrendingPosts,
} from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import { HashtagLoader } from 'components/elements'
import InfiniteScroll from 'react-infinite-scroll-component'
import { anchorTop } from 'services/helper'

const Latest = (props) => {
  const {
    getLatestPostsRequest,
    setLatestIsVisited,
    isVisited,
    setHomeIsVisited,
    setTrendingIsVisited,
    clearHomePosts,
    clearTrendingPosts,
    items,
    last,
    loading
  } = props

  useEffect(() => {
    if(!isVisited) {
      anchorTop()
      clearHomePosts()
      clearTrendingPosts()
      setLatestIsVisited()
      getLatestPostsRequest()
      setHomeIsVisited(false)
      setTrendingIsVisited(false)
    }
    //eslint-disable-next-line
  }, [])

  const loadMorePosts = () => {
    const { permlink, author } = last
    getLatestPostsRequest(permlink, author)
  }

  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        {
          items.map((item) => (
            <PostList
              active_votes={item.active_votes}
              author={item.author}
              permlink={item.permlink}
              created={item.created}
              body={item.body}
              upvotes={item.active_votes.length}
              replyCount={item.children}
              meta={item.json_metadata}
              payout={item.payout}
              profile={item.profile}
            />
          ))
        }
      </InfiniteScroll>
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_LATEST_POSTS_REQUEST'),
  items: state.posts.get('latest'),
  isVisited: state.posts.get('isLatestVisited'),
  last: state.posts.get('lastLatest'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getLatestPostsRequest,
    setLatestIsVisited,
    setHomeIsVisited,
    setTrendingIsVisited,
    clearHomePosts,
    clearTrendingPosts,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Latest)
