import React, { useEffect } from 'react'
import { CreateBuzzForm } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import {
  getHomePostsRequest,
  setHomeIsVisited,
  setTrendingIsVisited,
  clearTrendingPosts,
  setLatestIsVisited,
  clearLatestPosts,
  clearTagsPost,
  setTagsIsVisited,
  setPageFrom,
  clearLastSearchTag,
  clearSearchPosts,
  clearAppendReply,
  clearContent,
  clearReplies,
} from 'store/posts/actions'
import {
  setProfileIsVisited,
  clearAccountPosts,
  clearAccountReplies,
} from 'store/profile/actions'
import { anchorTop } from 'services/helper'
import { PostlistSkeleton, InfiniteList } from 'components'


const Feeds = React.memo((props) => {
  const {
    last,
    loading,
    items,
    isHomeVisited,
    setHomeIsVisited,
    getHomePostsRequest,
    setTrendingIsVisited,
    setLatestIsVisited,
    setProfileIsVisited,
    clearTrendingPosts,
    clearLatestPosts,
    clearAccountPosts,
    clearAccountReplies,
    clearTagsPost,
    setTagsIsVisited,
    setPageFrom,
    clearLastSearchTag,
    clearSearchPosts,
    clearAppendReply,
    clearContent,
    clearReplies,
  } = props

  useEffect(() => {
    setPageFrom('home')
    if(!isHomeVisited) {
      anchorTop()
      clearTrendingPosts()
      clearLatestPosts()
      getHomePostsRequest()
      setHomeIsVisited()
      setTrendingIsVisited(false)
      setLatestIsVisited(false)
    }
    clearTagsPost()
    clearAppendReply()
    clearSearchPosts()
    clearLastSearchTag()
    clearAccountPosts()
    clearAccountReplies()
    clearContent()
    clearReplies()
    setTagsIsVisited(false)
    setProfileIsVisited(false)
    //eslint-disable-next-line
  }, [])

  const loadMorePosts =  () => {
    const { permlink, author } = last
    getHomePostsRequest(permlink, author)
    // eslint-disable-next-line
  }

  return (
    <React.Fragment>
      <CreateBuzzForm />
      <InfiniteList items={items} onScroll={loadMorePosts} />
      <PostlistSkeleton loading={loading} />
    </React.Fragment>
  )
})

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_HOME_POSTS_REQUEST'),
  isHomeVisited: state.posts.get('isHomeVisited'),
  items: state.posts.get('home'),
  last: state.posts.get('lastHome'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setHomeIsVisited,
    getHomePostsRequest,
    setTrendingIsVisited,
    setLatestIsVisited,
    setProfileIsVisited,
    clearTrendingPosts,
    clearLatestPosts,
    clearAccountPosts,
    clearAccountReplies,
    clearTagsPost,
    setTagsIsVisited,
    setPageFrom,
    clearLastSearchTag,
    clearSearchPosts,
    clearAppendReply,
    clearContent,
    clearReplies,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
