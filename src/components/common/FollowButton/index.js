import React, { useState, useEffect } from 'react'
import { ContainedButton } from 'components/elements'
import { broadcastNotification } from 'store/interface/actions'
import { createUseStyles } from 'react-jss'
import { followRequest, unfollowRequest, getFollowDetailsRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const useStyles = createUseStyles(theme => ({
  left: {
    height: '100%',
    width: 50,
    fontSize: 14,
  },
  right: {
    height: 'max-content',
    width: '98%',
    fontSize: 14,
  },
  inner: {
    height: '100%',
    width: '95%',
    margin: '0 auto',
    marginTop: 5,
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
    ...theme.font,
  },
  username: {
    color: '#657786',
    paddingBottom: 0,
  },
  paragraph: {
    padding: 0,
    margin: 0,
    width: '97%',
    fontSize: 14,
    wordBreak: 'break-word',
  },
  popover: {
    pointerEvents: 'none',
    '& :after': {
      border: '1px solid red',
    },
    '& div.MuiPopover-paper': {
      borderRadius: '20px 20px !important',
    },
  },
  paper: {
    backgroundColor: `${theme.background.primary} !important`,
    pointerEvents: 'auto',
    padding: 2,
    '& :after': {
      border: '1px solid red',
    },
    '&:hover': {
      overflowY: 'overlay',
    },
    ...theme.dialog.user,
  },
  wrapper: {
    width: 300,
    minHeight: 135,
  },
  followWrapper: {
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
}))

const FollowButton = (props) => {
  const {
    author,
    recentFollows,
    recentUnfollows,
    followRequest,
    unfollowRequest,
    getFollowDetailsRequest,
    user,
  } = props

  const { username, is_authenticated } = user
  const [hasRecentlyFollowed, setHasRecentlyFollowed] = useState(false)
  const [hasRecentlyUnfollowed, setHasRecentlyUnfollowed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [detailsFetching, setDetailsFetching] = useState(true)
  const classes = useStyles()

  const followButtonStyle = { float: 'right', marginTop: 5 }

  const fetchFollowInformation = () => {
    getFollowDetailsRequest(author)
      .then(({ isFollowed: followed, count }) => {
        setDetailsFetching(false)
        setIsFollowed(followed)
      })
  }

  useEffect(() => {
    if(author && username && author !== '' && username !== '' && is_authenticated) {
      fetchFollowInformation()
    }
    // eslint-disable-next-line
  }, [author, username])

  const checkIfRecentlyFollowed = () => {
    if(Array.isArray(recentFollows) && recentFollows.length !== 0) {
      const hasBeenFollowed = recentFollows.filter((item) => item === author).length

      if(hasBeenFollowed) {
        setHasRecentlyFollowed(true)
        setHasRecentlyUnfollowed(false)
      }
    }
  }

  const checkIfRecentlyUnfollowed = () => {
    if(Array.isArray(recentUnfollows) && recentUnfollows.length !== 0) {
      const hasBeenUnfollowed = recentUnfollows.filter((item) => item === author).length

      if(hasBeenUnfollowed) {
        setHasRecentlyUnfollowed(true)
        setHasRecentlyFollowed(false)
      }
    }
  }

  const followUser = () => {
    setLoading(true)
    followRequest(author).then((result) => {
      setLoading(false)
      if(result) {
        broadcastNotification('success', `Successfully followed @${author}`)
        setHasRecentlyFollowed(true)
        setHasRecentlyUnfollowed(false)
      } else {
        broadcastNotification('error', `Failed following @${author}`)
      }
    })
  }

  const unfollowUser = () => {
    setLoading(true)
    unfollowRequest(author).then((result) => {
      setLoading(false)
      if(result) {
        broadcastNotification('success', `Successfully Unfollowed @${author}`)
        setHasRecentlyFollowed(false)
        setHasRecentlyUnfollowed(true)
      } else {
        broadcastNotification('error', `Failed Unfollowing @${author}`)
      }
    })
  }

  useEffect(() => {
    checkIfRecentlyFollowed()
    checkIfRecentlyUnfollowed()
  // eslint-disable-next-line
  }, [recentFollows, recentUnfollows, author, loading])

  return (
    <React.Fragment>
      {((!isFollowed && !hasRecentlyFollowed) || hasRecentlyUnfollowed) && (username !== author) && is_authenticated && (
        <ContainedButton
          fontSize={14}
          loading={loading || detailsFetching}
          disabled={loading || detailsFetching}
          style={followButtonStyle}
          transparent={true}
          label="Follow"
          className={classes.button}
          onClick={followUser}
        />
      )}
      {((isFollowed || hasRecentlyFollowed) && !hasRecentlyUnfollowed) && (username !== author) && is_authenticated && (
        <ContainedButton
          fontSize={14}
          loading={loading || detailsFetching}
          disabled={loading || detailsFetching}
          style={followButtonStyle}
          transparent={true}
          label="Unfollow"
          className={classes.button}
          onClick={unfollowUser}
        />
      )}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  recentFollows: state.posts.get('hasBeenRecentlyFollowed'),
  recentUnfollows: state.posts.get('hasBeenRecentlyUnfollowed'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    followRequest,
    unfollowRequest,
    getFollowDetailsRequest,
    broadcastNotification,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton)
