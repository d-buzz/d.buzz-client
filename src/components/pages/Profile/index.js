import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Chip from '@material-ui/core/Chip'
import { createUseStyles } from 'react-jss'
import {
  Avatar,
  ContainedButton,
} from 'components/elements'
import { NotificationBox } from 'components'
import {
  getProfileRequest,
  getAccountPostsRequest,
  setProfileIsVisited,
  getAccountRepliesRequest,
  clearAccountPosts,
  clearAccountReplies,
  getFollowersRequest,
  clearProfile,
  getFollowingRequest,
  clearAccountFollowers,
  clearAccountFollowing,
} from 'store/profile/actions'
import {
  followRequest,
  unfollowRequest,
  setPageFrom,
} from 'store/posts/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { anchorTop, getProfileMetaData } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { renderRoutes } from 'react-router-config'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { ProfileSkeleton } from 'components'

const useStyles = createUseStyles(theme => ({
  cover: {
    height: 270,
    width: '100%',
    backgroundColor: '#ffebee',
    overFlow: 'hidden',
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      overFlow: 'hidden',
    },
  },
  avatar: {
    marginTop: -70,
  },
  walletButton: {
    marginTop: 5,
    float: 'right',
    marginRight: 15,
  },
  fullName: {
    fontSize: '18px !important',
    fontWeight: 'bold',
    padding: 0,
    fontFamily: 'Segoe-Bold !important',
    ...theme.font,
  },
  userName: {
    fontSize: 16,
    padding: 0,
    marginTop: -20,
    ...theme.font,
  },
  wrapper: {
    width: '95%',
    margin: '0 auto',
    height: 'max-content',
  },
  paragraph: {
    padding: 0,
    margin: 0,
    fontSize: 14,
    ...theme.font,
  },
  spacer: {
    width: '100%',
    height: 20,
  },
  descriptionContainer: {
    borderBottom: theme.border.primary,
    ...theme.font,
  },
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      ...theme.left.sidebar.items.hover,
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      ...theme.font,
      fontWeight: 'bold',
      fontFamily: 'Segoe-Bold',
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    },
  },
  tabContainer: {
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    },
  },
  weblink: {
    color: '#d32f2f',
  },
}))

const Profile = (props) => {
  const {
    match,
    getProfileRequest,
    getAccountPostsRequest,
    setProfileIsVisited,
    getAccountRepliesRequest,
    getFollowersRequest,
    isVisited,
    profile,
    loading,
    route,
    clearAccountPosts,
    clearProfile,
    clearAccountReplies,
    getFollowingRequest,
    clearAccountFollowers,
    clearAccountFollowing,
    setPageFrom,
    user,
    followRequest,
    unfollowRequest,
    loadingFollow,
    recentFollows,
    recentUnfollows,
  } = props

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const { username: loginuser } = user

  const classes = useStyles()
  const [index, setIndex] = useState(0)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')
  const [hasRecentlyFollowed, setHasRecentlyFollowed] = useState(false)
  const [hasRecentlyUnfollowed, setHasRecentlyUnfollowed] = useState(false)

  const checkIfRecentlyFollowed = () => {
    if(Array.isArray(recentFollows) && recentFollows.length !== 0) {
      const hasBeenFollowed = recentFollows.filter((item) => item === username).length

      if(hasBeenFollowed) {
        setHasRecentlyFollowed(true)
        setHasRecentlyUnfollowed(false)
      }
    }
  }

  const checkIfRecentlyUnfollowed = () => {
    if(Array.isArray(recentUnfollows) && recentUnfollows.length !== 0) {
      const hasBeenUnfollowed = recentUnfollows.filter((item) => item === username).length

      if(hasBeenUnfollowed) {
        setHasRecentlyUnfollowed(true)
        setHasRecentlyFollowed(false)
      }
    }
  }

  useEffect(() => {
    checkIfRecentlyFollowed()
    checkIfRecentlyUnfollowed()
  // eslint-disable-next-line
  }, [recentFollows, recentUnfollows, loading])

  const onChange = (e, index) => {
    setIndex(index)
  }

  const handleTabs = (index) => () => {
    let tab = 'buzz'

    if(index === 1) {
      tab = 'replies'
    } else if (index === 2) {
      tab = 'followers'
    } else if (index === 3) {
      tab = 'following'
    }
    const { is_authenticated } = user
    if(is_authenticated) {
      history.push(`/@${username}/t/${tab}/`)
    } else {
      history.push(`/ug/@${username}/t/${tab}/`)
    }
  }


  const { params } = match
  const { username } = params

  useEffect(() => {
    setPageFrom(null)
    const params = queryString.parse(location.search)

    if(!isVisited || (params.ref && (params.ref === 'replies' || params.ref === 'nav'))) {
      anchorTop()
      clearProfile()
      clearAccountPosts()
      clearAccountReplies()
      clearAccountFollowers()
      clearAccountFollowing()
      setProfileIsVisited()
      getProfileRequest(username)
      getAccountPostsRequest(username)
      getAccountRepliesRequest(username)
      getFollowersRequest(username)
      getFollowingRequest(username)
    }
    // eslint-disable-next-line
  }, [username])

  useEffect(() => {
    if(pathname.match(/(\/t\/buzz\/)$|(\/t\/buzz)$/m)) {
      setIndex(0)
    } else if(pathname.match(/(\/t\/replies\/)$|(\/t\/replies)$/m)) {
      setIndex(1)
    } else if(pathname.match(/(\/t\/followers\/)$|(\/t\/followers)$/m)) {
      setIndex(2)
    } else if(pathname.match(/(\/t\/following\/)$|(\/t\/following)$/m)) {
      setIndex(3)
    } else {
      setIndex(0)
    }
  }, [pathname])

  let following_count = 0
  let follower_count = 0

  if(profile.follow_count) {
    follower_count = profile.follow_count.follower_count
    following_count = profile.follow_count.following_count
  }

  const { cover, name, about, website } = getProfileMetaData(profile)
  const { reputation = 0, isFollowed } = profile

  const followUser = () => {
    followRequest(username).then((result) => {
      setShowSnackbar(true)
      if(result) {
        setMessage(`Successfully followed @${username}`)
        setHasRecentlyFollowed(true)
        setHasRecentlyUnfollowed(false)
      } else {
        setMessage(`Failed following @${username}`)
        setSeverity('error')
      }
    })
  }

  const unfollowUser = () => {
    unfollowRequest(username).then((result) => {
      setShowSnackbar(true)
      if(result) {
        setMessage(`Successfully Unfollowed @${username}`)
        setHasRecentlyFollowed(false)
        setHasRecentlyUnfollowed(true)
      } else {
        setMessage(`Failed Unfollowing @${username}`)
        setSeverity('error')
      }
    })
  }

  const handleSnackBarClose = () => {
    setShowSnackbar(false)
  }

  return (
    <React.Fragment>
      <ProfileSkeleton loading={loading} />
      {!loading && (
        <React.Fragment>
          <div className={classes.cover}>
            {cover !== '' && (<img src={`https://images.hive.blog/0x0/${cover}`} alt="cover"/>)}
          </div>
          <div className={classes.wrapper}>
            <Row>
              <Col xs="auto">
                <div className={classes.avatar}>
                  <Avatar border={true} height="135" author={username} size="medium" />
                </div>
              </Col>
              <Col>
                {((!isFollowed && !hasRecentlyFollowed) || hasRecentlyUnfollowed) && (loginuser !== username) && (
                  <ContainedButton
                    fontSize={14}
                    loading={loadingFollow}
                    disabled={loading}
                    style={{ float: 'right', marginTop: 5 }}
                    transparent={true}
                    label="Follow"
                    className={classes.button}
                    onClick={followUser}
                  />
                )}
                {((isFollowed || hasRecentlyFollowed) && !hasRecentlyUnfollowed) && (loginuser !== username) && (
                  <ContainedButton
                    fontSize={14}
                    loading={loadingFollow}
                    disabled={loading}
                    style={{ float: 'right', marginTop: 5 }}
                    transparent={true}
                    label="Unfollow"
                    className={classes.button}
                    onClick={unfollowUser}
                  />
                )}
              </Col>
            </Row>
          </div>
        </React.Fragment>
      )}
      <div style={{ width: '100%', height: 'max-content' }} className={classes.descriptionContainer}>
        <div className={classNames(classes.wrapper)}>
          {!loading && (
            <React.Fragment>
              <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                <Col xs="auto">
                  <p className={classNames(classes.paragraph, classes.fullName)}>
                    {name || username}&nbsp;<Chip  size="small" label={reputation} />
                  </p>
                  <p className={classNames(classes.paragraph, classes.userName)}>
                        @{username}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs="auto">
                  <p className={classes.paragraph}>
                    {about}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs="auto">
                  <p className={classes.paragraph}>
                    <a href={website} target="_blank" rel="noopener noreferrer" className={classes.weblink}>
                      {website}
                    </a>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs="auto">
                  <p className={classes.paragraph}>
                    <b>{following_count}</b> Following &nbsp; <b>{follower_count}</b> Follower
                  </p>
                </Col>
              </Row>
            </React.Fragment>
          )}
        </div>
        <div className={classes.spacer} />
        <Tabs
          value={index}
          indicatorColor="primary"
          textColor="primary"
          centered
          onChange={onChange}
          className={classes.tabContainer}
        >
          <Tab disableTouchRipple onClick={handleTabs(0)} className={classes.tabs} label="Buzz's" />
          <Tab disableTouchRipple onClick={handleTabs(1)} className={classes.tabs} label="Replies" />
          <Tab disableTouchRipple onClick={handleTabs(2)} className={classes.tabs} label="Followers" />
          <Tab disableTouchRipple onClick={handleTabs(3)} className={classes.tabs} label="Following" />
        </Tabs>
      </div>
      <React.Fragment>
        {renderRoutes(route.routes, { author: username })}
      </React.Fragment>
      <NotificationBox
        show={showSnackbar}
        message={message}
        severity={severity}
        onClose={handleSnackBarClose}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_PROFILE_REQUEST'),
  profile: state.profile.get('profile'),
  isVisited: state.profile.get('isProfileVisited'),
  user: state.auth.get('user'),
  loadingFollow: pending(state, 'FOLLOW_REQUEST') || pending(state, 'UNFOLLOW_REQUEST'),
  recentFollows: state.posts.get('hasBeenRecentlyFollowed'),
  recentUnfollows: state.posts.get('hasBeenRecentlyUnfollowed'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getProfileRequest,
    getAccountPostsRequest,
    setProfileIsVisited,
    getAccountRepliesRequest,
    clearAccountPosts,
    getFollowersRequest,
    clearProfile,
    clearAccountReplies,
    getFollowingRequest,
    clearAccountFollowers,
    clearAccountFollowing,
    setPageFrom,
    followRequest,
    unfollowRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
