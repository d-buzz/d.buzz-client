import React, { useEffect } from 'react'
import { PostList } from 'components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { pending } from 'redux-saga-thunk'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getTrendingPostsRequest,
  setTrendingIsVisited,
  setHomeIsVisited,
  setLatestIsVisited,
  clearHomePosts,
  clearLatestPosts,
  clearTagsPost,
  setTagsIsVisited,
  setPageFrom,
  clearLastSearchTag,
} from 'store/posts/actions'
import {
  setProfileIsVisited,
  clearAccountPosts,
  clearAccountReplies,
} from 'store/profile/actions'
import { anchorTop } from 'services/helper'
import { PostlistSkeleton } from 'components'

const Trending = (props) => {
  const {
    isVisited,
    loading,
    items,
    last,
    unguardedLinks,
    getTrendingPostsRequest,
    setTrendingIsVisited,
    setHomeIsVisited,
    clearHomePosts,
    clearLatestPosts,
    setLatestIsVisited,
    setProfileIsVisited,
    clearAccountPosts,
    clearAccountReplies,
    clearTagsPost,
    setTagsIsVisited,
    setPageFrom,
    clearLastSearchTag,
  } = props

  useEffect(() => {
    setPageFrom('trending')
    if(!isVisited) {
      anchorTop()
      clearHomePosts()
      clearLatestPosts()
      getTrendingPostsRequest()
      setTrendingIsVisited()
      setHomeIsVisited(false)
      setLatestIsVisited(false)
    }
    clearLastSearchTag()
    clearAccountPosts()
    clearAccountReplies()
    clearTagsPost()
    setTagsIsVisited(false)
    setProfileIsVisited(false)
  // eslint-disable-next-line
  }, [])

  const loadMorePosts = () => {
    const { permlink, author } = last
    getTrendingPostsRequest(permlink, author)
  }

  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        {items.map((item) => (
          <PostList
            profileRef="trending"
            active_votes={item.active_votes}
            author={item.author}
            permlink={item.permlink}
            created={item.created}
            body={item.body}
            upvotes={item.active_votes.length}
            replyCount={item.children}
            meta={item.json_metadata}
            payout={item.payout}
            payoutAt={item.payout_at}
            profile={item.profile}
            unguardedLinks={unguardedLinks}
          />
        ))}
      </InfiniteScroll>
      <PostlistSkeleton loading={loading}/>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_TRENDING_POSTS_REQUEST'),
  isVisited: state.posts.get('isTrendingVisited'),
  items: state.posts.get('trending'),
  last: state.posts.get('lastTrending'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getTrendingPostsRequest,
    setTrendingIsVisited,
    setHomeIsVisited,
    clearHomePosts,
    setLatestIsVisited,
    clearLatestPosts,
    setProfileIsVisited,
    clearAccountPosts,
    clearAccountReplies,
    clearTagsPost,
    setTagsIsVisited,
    setPageFrom,
    clearLastSearchTag,
  },dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Trending)
