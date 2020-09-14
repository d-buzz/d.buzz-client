import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import Chip from '@material-ui/core/Chip'
import Popover from '@material-ui/core/Popover'
import Skeleton from 'react-loading-skeleton'
import { ContainedButton, Avatar } from 'components/elements'
import { Link } from 'react-router-dom'
import { getProfileMetaData } from 'services/helper'
import { createUseStyles } from 'react-jss'
import { followRequest, unfollowRequest, getFollowDetailsRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import { bindActionCreators} from 'redux'
import { broadcastNotification } from 'store/interface/actions'

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

const UserDialog = (props) => {
  const classes = useStyles()
  const {
    loading,
    unguardedLinks,
    followRequest,
    recentFollows,
    unfollowRequest,
    recentUnfollows,
    user,
    getFollowDetailsRequest,
    detailsFetching,
    broadcastNotification,
    userDialogData,
  } = props

  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [reputation, setReputation] = useState(0)
  const [anchorEl, setAnchor] = useState(null)
  const [author, setAuthor] = useState('')
  const { username, is_authenticated } = user
  const [shouldStayOpen, setShouldStayOpen] = useState(false)
  const [hasRecentlyFollowed, setHasRecentlyFollowed] = useState(false)
  const [hasRecentlyUnfollowed, setHasRecentlyUnfollowed] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowed, setIsFollowed] = useState(false)

  const followButtonStyle = { float: 'right', marginTop: 5 }
  const zeroPaddingRight = { paddingRight: 0 }

  const fetchFollowInformation = () => {
    getFollowDetailsRequest(author)
      .then(({ isFollowed: followed, count }) => {
        setFollowerCount(count.follower_count)
        setFollowingCount(count.following_count)
        setIsFollowed(followed)
      })
  }

  useEffect(() => {
    if(userDialogData.hasOwnProperty('open') && typeof userDialogData === 'object') {
      const { open } = userDialogData
      if(open) {
        const { profile, anchorEl } = userDialogData
        const { name, about } = getProfileMetaData(profile)
        const { reputation = 0, name: author } = profile
        setAnchor(anchorEl)
        setName(name)
        setAbout(about)
        setReputation(reputation)
        setAuthor(author)
      } else {
        setAnchor(null)
        setName('')
        setAbout('')
        setReputation(0)
        setAuthor('')
      }
      setOpen(open)
    }
  }, [userDialogData])

  useEffect(() => {
    checkIfRecentlyFollowed()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(open) {
      fetchFollowInformation()
    }
    // eslint-disable-next-line
  }, [open])

  const onMouseEnter = () => {
    setOpen(true)
  }

  const onMouseLeave = () => {
    setOpen(false)
  }

  let authorLink = `/@${author}?ref=card`

  if(unguardedLinks) {
    authorLink = `ug${authorLink}`
  }

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
    setShouldStayOpen(true)
    followRequest(author).then((result) => {
      if(result) {
        broadcastNotification('success', `Successfully followed @${author}`)
        setHasRecentlyFollowed(true)
        setHasRecentlyUnfollowed(false)
      } else {
        broadcastNotification('error', `Failed following @${author}`)
      }
      setShouldStayOpen(false)
    })
  }

  const unfollowUser = () => {
    setShouldStayOpen(true)
    unfollowRequest(author).then((result) => {
      if(result) {
        broadcastNotification('success', `Successfully Unfollowed @${author}`)
        setHasRecentlyFollowed(false)
        setHasRecentlyUnfollowed(true)
      } else {
        broadcastNotification('error', `Failed Unfollowing @${author}`)
      }
      setShouldStayOpen(false)
    })
  }

  useEffect(() => {
    checkIfRecentlyFollowed()
    checkIfRecentlyUnfollowed()
  // eslint-disable-next-line
  }, [recentFollows, recentUnfollows, author, loading])

  return (
    <React.Fragment>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open || shouldStayOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableScrollLock={!is_authenticated}
        PaperProps={{ onMouseEnter, onMouseLeave }}
        onClose={onMouseLeave}
      >
        <div className={classes.wrapper}>
          <div className={classes.inner}>
            <div className={classes.row}>
              <Row>
                <Col xs="auto" style={zeroPaddingRight}>
                  <div className={classes.left}>
                    <Avatar author={author} />
                  </div>
                </Col>
                <Col>
                  <div className={classes.right}>
                    {is_authenticated && (
                      <React.Fragment>
                        {((!isFollowed && !hasRecentlyFollowed) || hasRecentlyUnfollowed) && (username !== author) && (
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
                        {((isFollowed || hasRecentlyFollowed) && !hasRecentlyUnfollowed) && (username !== author) && (
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
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col style={zeroPaddingRight}>
                  <div className={classes.fullWidth}>
                    <label className={classes.name}>
                      <Link
                        to={authorLink}
                      >
                        {name ? name : `${author}`}
                      </Link>&nbsp;<Chip  size="small" label={reputation} />
                    </label>
                    <p className={classNames(classes.paragraph, classes.username)}>
                      {`@${author}`}
                    </p>
                    <p className={classes.paragraph}>
                      {about}
                    </p>
                    {!detailsFetching && (
                      <p className={classNames(classes.paragraph, classes.followWrapper)}>
                        <b>{followingCount}</b> Following &nbsp; <b>{followerCount}</b> Follower
                      </p>
                    )}
                    {detailsFetching && (
                      <p className={classNames(classes.paragraph, classes.followWrapper)}>
                        <Skeleton height={10} width={30} /> Following &nbsp; <Skeleton height={10} width={30} /> Follower
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Popover>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  loading: pending(state, 'FOLLOW_REQUEST') || pending(state, 'UNFOLLOW_REQUEST'),
  userDialogData: state.interfaces.get('userDialogData'),
  detailsFetching: pending(state, 'GET_FOLLOW_DETAILS_REQUEST'),
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

export default connect(mapStateToProps, mapDispatchToProps)(UserDialog)
