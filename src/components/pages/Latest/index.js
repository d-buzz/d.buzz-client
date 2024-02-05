import React, {useEffect, useCallback, useState} from 'react'
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
import { createUseStyles } from 'react-jss'
import { isUserAlreadyVotedForProposal } from 'services/api'
import IconButton from '@material-ui/core/IconButton'
import { CloseIcon } from 'components/elements'
import Cookies from 'js-cookie'
import {Spinner} from "../../elements"

const useStyles = createUseStyles(theme => ({
  opensourceWrapper: {
    position: 'relative',
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
      },
    },
  },
}))

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
    user,
  } = props

  const classes = useStyles()

  const [isUserVotedForProposal, setIsUserVotedForProposal] = useState(true)

  useEffect(() => {
    setPageFrom('latest')
    if (!isVisited) {
      anchorTop()
      clearHomePosts()
      clearScrollIndex()
      clearTrendingPosts()
      setLatestIsVisited()
      getLatestPostsRequest()
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

  // state if the latest post is loaded
  const [isLatestPostsLoaded , setLatestPostsLoaded] = useState(false)


  useEffect(() => {
    // loading the page for the first time
    if(refreshRouteStatus.pathname === "latest"){
      anchorTop()
      clearScrollIndex()
      clearLatestPosts()
      getLatestPostsRequest()
      setLatestPostsLoaded(true)
      clearRefreshRouteStatus()
    }
    // eslint-disable-next-line
  }, [refreshRouteStatus])

  const [loadingMore, setLoadingMore] = useState(false) // Add this state to manage loading more items

  const loadMorePosts = useCallback(() => {
    // Check if already loading more posts to avoid multiple calls
    if (!loadingMore && !loading && items.length > 0) {
      setLoadingMore(true) // Set loading more to true

      // Add a delay before fetching more posts
      setTimeout(() => {
        const { permlink, author } = last
        getLatestPostsRequest(permlink, author)
        setLoadingMore(false) // Reset loading more state after fetching
      }, 2000) // Delay in milliseconds, adjust as needed
    }
  }, [last, loading, loadingMore, items.length, getLatestPostsRequest])

  useEffect(() => {
    if (items.length < 3  && !loading && isLatestPostsLoaded) {
      loadMorePosts()
    } else {
      setLatestPostsLoaded(true)
    }
  }, [isLatestPostsLoaded, items.length, loadMorePosts, loading])

  const handleReirectToProposal = () => {
    return window.location = 'https://vote.d.buzz'
  }

  useEffect(() =>{
    if(user.username) {
      const showProposalBannerString = Cookies.get('showProposalBanner')

      if (showProposalBannerString) {
        const showProposalBanner = JSON.parse(showProposalBannerString)

        if(showProposalBanner.visibility === true) {
          isUserAlreadyVotedForProposal(user.username)
            .then((response) => {
              setIsUserVotedForProposal(response)
            })
        } else {
          setIsUserVotedForProposal(true)
        }
      } else {
        isUserAlreadyVotedForProposal(user.username)
          .then((response) => {
            setIsUserVotedForProposal(response)
          })
      }
    } else {
      setIsUserVotedForProposal(false)
    }
  }, [user])

  const handleHideProposalBanner = () => {
    const showProposalBanner = {
      visibility: false,
    }

    const showProposalBannerString = JSON.stringify(showProposalBanner)

    Cookies.set('showProposalBanner', showProposalBannerString, { expires: 10 })

    setIsUserVotedForProposal(true)
  }

  return (
    <React.Fragment>
      {/* disable banner */}
      {!isUserVotedForProposal &&
        <div className={classes.opensourceWrapper}>
          <IconButton style={{ position: 'absolute', right: 0, top: 15, marginLeft: 'auto', marginRight: 15 }} onClick={handleHideProposalBanner}>
            <CloseIcon />
          </IconButton>
          {<span className='title'>Vote for DBuzz - Proposal #2</span>}
          <span className='button' onClick={handleReirectToProposal}>Vote for DBuzz Proposal</span>
        </div>}
      <HelmetGenerator page='Latest' />
      <InfiniteList loading={loading} items={items} onScroll={loadMorePosts} />
      <Spinner size={30} loading={loadingMore} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
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
