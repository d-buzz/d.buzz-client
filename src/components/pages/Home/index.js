import React, { useEffect, useCallback } from 'react'
import { CreateBuzzForm, InfiniteList } from 'components'
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
import { clearScrollIndex } from 'store/interface/actions'
import { anchorTop } from 'services/helper'
import { isMobile } from 'react-device-detect'


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
    clearScrollIndex,
  } = props

  useEffect(() => {
    setPageFrom('home')
    if(!isHomeVisited) {
      anchorTop()
      clearScrollIndex()
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

  const loadMorePosts =  useCallback(() => {
    const { permlink, author } = last
    getHomePostsRequest(permlink, author)
    // eslint-disable-next-line
  }, [last])

  return (
    <React.Fragment>
      {!isMobile && (<CreateBuzzForm />)}
      <InfiniteList loading={loading} items={items} onScroll={loadMorePosts} />
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
    clearScrollIndex,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
