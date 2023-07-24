import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getLatestPostsRequest,
  setLatestIsVisited,
  setHomeIsVisited,
  setTrendingIsVisited,
  clearHomePosts,
  clearTrendingPosts,
  clearTagsPost,
  setTagsIsVisited,
  setPageFrom,
  clearLastSearchTag,
  clearSearchPosts,
  clearAppendReply,
  clearReplies,
  clearLatestPosts,
} from 'store/posts/actions'
import {
  setProfileIsVisited,
  clearAccountPosts,
  clearAccountReplies,
} from 'store/profile/actions'
import { pending } from 'redux-saga-thunk'
import { anchorTop } from 'services/helper'
import { InfiniteList, HelmetGenerator } from 'components'
import { clearScrollIndex, clearRefreshRouteStatus } from 'store/interface/actions'

const Latest = (props) => {
  const {
    getLatestPostsRequest,
    setLatestIsVisited,
    isVisited,
    setHomeIsVisited,
    setTrendingIsVisited,
    clearHomePosts,
    clearTrendingPosts,
    setProfileIsVisited,
    clearAccountPosts,
    clearAccountReplies,
    items,
    last,
    loading,
    clearTagsPost,
    setTagsIsVisited,
    setPageFrom,
    clearLastSearchTag,
    clearSearchPosts,
    clearAppendReply,
    clearReplies,
    clearScrollIndex,
    clearLatestPosts,
    refreshRouteStatus,
    clearRefreshRouteStatus,
    match,
  } = props

  const { tag } = match.params;
  useEffect(() => {
    setPageFrom('latest')
    if (!isVisited) {
      anchorTop()
      clearHomePosts()
      clearScrollIndex()
      clearTrendingPosts()
      setLatestIsVisited()
      getLatestPostsRequest('','',tag)
      setHomeIsVisited(false)
      setTrendingIsVisited(false)
    }
    clearAppendReply()
    clearSearchPosts()
    clearLastSearchTag()
    clearAccountPosts()
    clearAccountReplies()
    clearTagsPost()
    clearReplies()
    setTagsIsVisited(false)
    setProfileIsVisited(false)

    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(refreshRouteStatus.pathname === "latest"){
      anchorTop()
      clearScrollIndex()
      clearLatestPosts()
      getLatestPostsRequest()
      clearRefreshRouteStatus()
    }
    // eslint-disable-next-line
  }, [refreshRouteStatus])

  const loadMorePosts = useCallback(() => {
    const { permlink, author , tag } = last

    getLatestPostsRequest(permlink, author, tag)
    // eslint-disable-next-line
  }, [last])

  return (
    <React.Fragment>
      <HelmetGenerator page='Latest' />
      <InfiniteList loading={loading} items={items} onScroll={loadMorePosts} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_LATEST_POSTS_REQUEST'),
  items: state.posts.get('latest'),
  isVisited: state.posts.get('isLatestVisited'),
  last: state.posts.get('lastLatest'),
  mutelist: state.auth.get('mutelist'),
  refreshRouteStatus: state.interfaces.get('refreshRouteStatus'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getLatestPostsRequest,
    setLatestIsVisited,
    setHomeIsVisited,
    setTrendingIsVisited,
    clearHomePosts,
    clearTrendingPosts,
    setProfileIsVisited,
    clearAccountPosts,
    clearAccountReplies,
    clearTagsPost,
    setTagsIsVisited,
    setPageFrom,
    clearLastSearchTag,
    clearSearchPosts,
    clearAppendReply,
    clearReplies,
    clearScrollIndex,
    clearLatestPosts,
    clearRefreshRouteStatus,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Latest)
