import React, { useEffect, useCallback } from 'react'
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
  clearSearchPosts,
  clearTrendingPosts,
} from 'store/posts/actions'
import {
  setProfileIsVisited,
  clearAccountPosts,
  clearAccountReplies,
} from 'store/profile/actions'
import { anchorTop } from 'services/helper'
import { InfiniteList, HelmetGenerator } from 'components'
import { clearScrollIndex, clearRefreshRouteStatus } from 'store/interface/actions'
import { createUseStyles } from 'react-jss'
import { isMobile } from 'react-device-detect'

const useStyles = createUseStyles(theme => ({
  opensourceWrapper: {
    padding: '25px 0px 25px 0px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#e6ecf0',

    '& .title': {
      width: 'fit-content',
      fontSize: 20,
      fontWeight: 'bold',
    },
    
    '& .button': {
      marginTop: 15,
      borderRadius: 15,
      width: 'fit-content',
      padding: '5px 15px 5px 15px',
      fontSize: 18,
      fontWeight: 'bold',
      background: '#E61C34',
      color: '#FFFFFF',
      cursor: 'pointer',
      userSelect: 'none',

      '&:hover': {
        opacity: 0.85,
      }
    },
  },
}))

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
    clearSearchPosts,
    clearScrollIndex,
    clearTrendingPosts,
    refreshRouteStatus,
    clearRefreshRouteStatus,
  } = props

  const classes = useStyles()

  useEffect(() => {
    setPageFrom('trending')
    if (!isVisited) {
      anchorTop()
      clearScrollIndex()
      clearHomePosts()
      clearLatestPosts()
      getTrendingPostsRequest()
      setTrendingIsVisited()
      setHomeIsVisited(false)
      setLatestIsVisited(false)
    }
    clearSearchPosts()
    clearLastSearchTag()
    clearAccountPosts()
    clearAccountReplies()
    clearTagsPost()
    setTagsIsVisited(false)
    setProfileIsVisited(false)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(refreshRouteStatus.pathname === "trending"){
      anchorTop()
      clearScrollIndex()
      clearTrendingPosts()
      getTrendingPostsRequest()
      clearRefreshRouteStatus()
    }
    // eslint-disable-next-line
  }, [refreshRouteStatus])

  const loadMorePosts = useCallback(() => {
    const { permlink, author } = last
    getTrendingPostsRequest(permlink, author)
    // eslint-disable-next-line
  }, [last])

  const handleReirectToProposal = () => {
    return window.location = 'https://vote.d.buzz'
  }

  return (
    <React.Fragment>
      <HelmetGenerator page='Trending' />
      <div className={classes.opensourceWrapper}>
        
        {isMobile ? <span className='title'>Support & Open Source : D.Buzz</span> : <span className='title'>Help us OPEN SOURCE & continue : DBUZZ</span>}
        <span className='button' onClick={handleReirectToProposal}>Vote for DBuzz Proposal</span>
      </div>
      <InfiniteList unguardedLinks={unguardedLinks} loading={loading} items={items} onScroll={loadMorePosts} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_TRENDING_POSTS_REQUEST'),
  isVisited: state.posts.get('isTrendingVisited'),
  items: state.posts.get('trending'),
  last: state.posts.get('lastTrending'),
  refreshRouteStatus: state.interfaces.get('refreshRouteStatus'),
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
    clearSearchPosts,
    clearScrollIndex,
    clearTrendingPosts,
    clearRefreshRouteStatus,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Trending)
