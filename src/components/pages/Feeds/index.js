import React, { useEffect, useCallback, useState } from 'react'
import { CreateBuzzForm, InfiniteList, HelmetGenerator, BuzzFormModal } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
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
import { clearScrollIndex, clearRefreshRouteStatus} from 'store/interface/actions'
import { anchorTop, useWindowDimensions } from 'services/helper'
import { isMobile } from 'react-device-detect'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { setBuzzModalStatus } from 'store/interface/actions'
import { Fab } from '@material-ui/core'
import BuzzIcon from 'components/elements/Icons/BuzzIcon'


const useStyles = createUseStyles(theme => ({
  wrapper: {
    ...theme.font,
    paddingTop: '5%',
    '& a': {
      color: '#e53934 !important',
    },
  },
}))

const floatStyle = {
  margin: 0,
  top: 'auto',
  bottom: 20,
  left: 'auto',
  position: 'fixed',
  zIndex: 500,
  backgroundColor: '#e61c34',
}

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
    refreshRouteStatus,
    clearRefreshRouteStatus,
  } = props
  const classes = useStyles()
  const location = useLocation()
  const history = useHistory()
  const { pathname } = location
  const [open, setOpen] = useState(false)
  const [minify, setMinify] = useState(false)
  const { width } = useWindowDimensions()
  const isBuzzIntent = pathname.match(/^\/intent\/buzz/)

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

  useEffect(() => {
    if(refreshRouteStatus.pathname === "home"){
      anchorTop()
      clearScrollIndex()
      clearHomePosts()
      getHomePostsRequest()
      clearRefreshRouteStatus()
    }
    // eslint-disable-next-line
  }, [refreshRouteStatus])

  useEffect(() => {
    if(width >= 1366) {
      setMinify(false)
    } else if(width >= 1026 && width < 1366) {
      setMinify(true)
    } else if(width >=706 && width < 1026) {
      setMinify(true)
    } else {
      setMinify(true)
    }
  }, [width])

  const loadMorePosts = useCallback(() => {
    const { permlink, author } = last
    getHomePostsRequest(permlink, author)
    // eslint-disable-next-line
  }, [last])

  const handleOpenBuzzModal = () => {
    setOpen(true)
  }

  const onHide = () => {
    setBuzzModalStatus(false)
    setOpen(false)
    if (isBuzzIntent) {
      history.push('/')
    }
  }

  const floatingButtonStyle = {
    marginLeft: width > 1026 && 530, right: width < 1026 && 30
  }
  
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
        {minify && (
          <Fab onClick={handleOpenBuzzModal} size="medium" color="secondary" aria-label="add" style={{...floatStyle, ...floatingButtonStyle}}>
          <BuzzIcon />
        </Fab>
      )}
      <BuzzFormModal show={open} onHide={onHide} />
    </React.Fragment>
  )
})

const mapStateToProps = (state) => ({
  buzzModalStatus: state.interfaces.get('buzzModalStatus'),
  loading: pending(state, 'GET_HOME_POSTS_REQUEST'),
  isHomeVisited: state.posts.get('isHomeVisited'),
  items: state.posts.get('home'),
  last: state.posts.get('lastHome'),
  refreshRouteStatus: state.interfaces.get('refreshRouteStatus'),
  intentBuzz: state.auth.get("intentBuzz"),
  fromIntentBuzz: state.auth.get('fromIntentBuzz'),
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
    clearRefreshRouteStatus,
    setBuzzModalStatus
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
