import React, { useEffect, useState } from 'react'
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
import { HelmetGenerator } from 'components'
import { clearScrollIndex, clearRefreshRouteStatus } from 'store/interface/actions'
import { createUseStyles } from 'react-jss'
import { isMobile } from 'react-device-detect'
import { deepClone, isUserAlreadyVotedForProposal, removeFootNote } from 'services/api'
import IconButton from '@material-ui/core/IconButton'
import { CloseIcon } from 'components/elements'
import Cookies from 'js-cookie'
import LiteInfiniteList from 'components/common/LiteInfiniteList'
import { TRENDING_POSTS_QUERY } from 'services/union'
import { useQuery } from '@apollo/client'
import _ from 'lodash'

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

const LiteTrending = (props) => {
  const {
    user,
    unguardedLinks,
    refreshRouteStatus,
  } = props

  const classes = useStyles()

  const [isUserVotedForProposal, setIsUserVotedForProposal] = useState(true)
  // eslint-disable-next-line
  const { loading, error, data=[], refetch } = useQuery(TRENDING_POSTS_QUERY)
  const [allPosts, setAllPosts] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    const posts = deepClone(data?.trendingFeed?.items || [])
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

  useEffect(() => {
    if(refreshRouteStatus.pathname === "trending"){
      refetch()
    }
    // eslint-disable-next-line
  }, [refreshRouteStatus])

  const loadMorePosts = () => {
    const newLimit = items.length + 10
    if (newLimit <= allPosts.length) {
      setItems(allPosts.slice(0, newLimit))
    }
  }

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
      {!isUserVotedForProposal &&
        <div className={classes.opensourceWrapper}>
          <IconButton style={{ position: 'absolute', right: 0, top: 15, marginLeft: 'auto', marginRight: 15 }} onClick={handleHideProposalBanner}>
            <CloseIcon />
          </IconButton>
          {isMobile ? <span className='title'>Support & Open Source : D.Buzz</span> : <span className='title'>Help us OPEN SOURCE & continue : DBUZZ</span>}
          <span className='button' onClick={handleReirectToProposal}>Vote for DBuzz Proposal</span>
        </div>}
      <LiteInfiniteList
        unguardedLinks={unguardedLinks} 
        loading={loading} 
        items={items} 
        onScroll={loadMorePosts}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(LiteTrending)
