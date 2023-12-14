import React, { useEffect, useState } from 'react'
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
import { LiteInfiniteList, HelmetGenerator } from 'components'
import { clearScrollIndex, clearRefreshRouteStatus } from 'store/interface/actions'
import { TODAY_POSTS_QUERY } from 'services/union'
import { deepClone, removeFootNote } from 'services/api'
import { useQuery } from '@apollo/client'
import _ from 'lodash'

const LiteLatest = (props) => {
  const {
    // eslint-disable-next-line
    refreshRouteStatus,
  } = props

  // eslint-disable-next-line
  const { loading, error, data=[], refetch } = useQuery(TODAY_POSTS_QUERY)

  const [allPosts, setAllPosts] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    const posts = deepClone(data?.socialFeed?.items || []).filter(post => post?.permlink !== null)
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
      <HelmetGenerator page='Latest' />
      <LiteInfiniteList loading={loading} items={items} onScroll={loadMorePosts} />
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

export default connect(mapStateToProps, mapDispatchToProps)(LiteLatest)
