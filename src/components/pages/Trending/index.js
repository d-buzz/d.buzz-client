import React, {useEffect, useCallback, useState} from 'react'
import React, {useEffect, useCallback, useState} from 'react'
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
import { isUserAlreadyVotedForProposal } from 'services/api'
import IconButton from '@material-ui/core/IconButton'
import { CloseIcon } from 'components/elements'
import Cookies from 'js-cookie'

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

const Trending = (props) => {
  const {
    user,
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

  const [isUserVotedForProposal, setIsUserVotedForProposal] = useState(true)

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

  // sets if the trending is loaded already
  const [isTrendingPostsLoaded , setTrendingPostsLoaded] = useState(false)

  useEffect(() => {
    // loading the page for the first time
    if(refreshRouteStatus.pathname === "trending"){
      anchorTop()
      clearScrollIndex()
      clearTrendingPosts()
      getTrendingPostsRequest()
      setTrendingPostsLoaded(true)
      clearRefreshRouteStatus()
    }
    // eslint-disable-next-line
  }, [refreshRouteStatus])

  const loadMorePosts = useCallback(() => {
    if(items.length>0) {
      const { permlink, author } = last
      getTrendingPostsRequest(permlink, author)
    }
    // eslint-disable-next-line
  }, [last, items])


  useEffect(() => {
    if (items.length === 0 && !loading && isTrendingPostsLoaded) {
      loadMorePosts()
    }
  }, [isTrendingPostsLoaded, items.length, loadMorePosts, loading])

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
      <HelmetGenerator page='Trending' />
      {/* disable banner */}
      {!isUserVotedForProposal &&
        <div className={classes.opensourceWrapper}>
          <IconButton style={{ position: 'absolute', right: 0, top: 15, marginLeft: 'auto', marginRight: 15 }} onClick={handleHideProposalBanner}>
            <CloseIcon />
          </IconButton>
          {<span className='title'>Vote for DBuzz - Proposal #2</span>}
          <span className='button' onClick={handleReirectToProposal}>Vote for DBuzz Proposal</span>
        </div>}
      <InfiniteList unguardedLinks={unguardedLinks} loading={loading} items={items} onScroll={loadMorePosts} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
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
