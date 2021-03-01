import React, { useEffect, useCallback } from 'react'
import { CreateBuzzForm, InfiniteList, HelmetGenerator } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { useLocation } from 'react-router-dom'
import { createUseStyles } from 'react-jss'
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
  clearHomePosts,
} from 'store/posts/actions'
import {
  setProfileIsVisited,
  clearAccountPosts,
  clearAccountReplies,
} from 'store/profile/actions'
import { clearScrollIndex } from 'store/interface/actions'
import { anchorTop } from 'services/helper'
import { isMobile } from 'react-device-detect'
import { Link } from 'react-router-dom'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    ...theme.font,
    paddingTop: '5%',
    '& a': {
      color: '#e53934 !important',
    },
  },
}))

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
    buzzModalStatus,
    clearHomePosts,
  } = props
  const classes = useStyles()

  useEffect(() => {
    setPageFrom('home')
    if (!isHomeVisited) {
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

  const location = useLocation()
  useEffect(() => {
    anchorTop()
    clearScrollIndex()
    clearHomePosts()
    getHomePostsRequest()
    // eslint-disable-next-line
  }, [location.search])

  const loadMorePosts = useCallback(() => {
    const { permlink, author } = last
    getHomePostsRequest(permlink, author)
    // eslint-disable-next-line
  }, [last])

  return (
    <React.Fragment>
      <HelmetGenerator page='Home' />
      {!isMobile && !buzzModalStatus && (<CreateBuzzForm />)}
      {(items.length === 0) && !loading && (
        <React.Fragment>
          <center>
            <h6 className={classes.wrapper}>
              Hi there! it looks like you haven't followed anyone yet, <br />
              you may start following people by reading the&nbsp;
              <Link to="/latest">latest</Link> <br /> or <Link to="/trending">trending</Link>&nbsp;
              buzzes on d.buzz today.
            </h6>
          </center>
        </React.Fragment>
      )}
      <InfiniteList loading={loading} items={items} onScroll={loadMorePosts} />
    </React.Fragment>
  )
})

const mapStateToProps = (state) => ({
  buzzModalStatus: state.interfaces.get('buzzModalStatus'),
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
    clearHomePosts,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
