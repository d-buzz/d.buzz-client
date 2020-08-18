import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import Chip from '@material-ui/core/Chip'
import Popover from '@material-ui/core/Popover'
import { ContainedButton, Avatar } from 'components/elements'
import { Link } from 'react-router-dom'
import { getProfileMetaData } from 'services/helper'
import { createUseStyles } from 'react-jss'
import { followRequest, unfollowRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import { bindActionCreators} from 'redux'
import { NotificationBox } from 'components'

const useStyles = createUseStyles({
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
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
    marginBottom: 0,
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
    wordBreak: 'break-all',
  },
  popover: {
    pointerEvents: 'none',
    '& :after': {
      border: '1px solid red',
    },
    '& div.MuiPopover-paper': {
      borderRadius: '20px 20px !important',
    }
  },
  paper: {
    pointerEvents: "auto",
    padding: 2,
    '& :after': {
      border: '1px solid red',
    },
    '&:hover': {
      overflowY: 'overlay',
    }
  },
  wrapper: {
    width: 300,
    minHeight: 135,
  },
  followWrapper: {
    width: '100%',
  }
})

const UserDialog = (props) => {
  const classes = useStyles()
  const {
    open,
    anchorEl,
    onMouseEnter,
    onMouseLeave,
    profile,
    loading,
    unguardedLinks,
    followRequest,
    recentFollows,
    unfollowRequest,
    recentUnfollows,
    user,
  } = props

  const { username } = user
  const { name, about } = getProfileMetaData(profile)
  const { reputation = 0, name: author, isFollowed } = profile
  const [shouldStayOpen, setShouldStayOpen] = useState(false)
  const [hasRecentlyFollowed, setHasRecentlyFollowed] = useState(false)
  const [hasRecentlyUnfollowed, setHasRecentlyUnfollowed] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')

  useEffect(() => {
    checkIfRecentlyFollowed()
  // eslint-disable-next-line
  }, [])

  let following_count = 0
  let follower_count = 0

  if(profile.follow_count) {
    follower_count = profile.follow_count.follower_count
    following_count = profile.follow_count.following_count
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
      setShowSnackbar(true)
      if(result) {
        setMessage(`Successfully followed @${author}`)
        setHasRecentlyFollowed(true)
        setHasRecentlyUnfollowed(false)
      } else {
        setMessage(`Failed following @${author}`)
        setSeverity('error')
      }
      setShouldStayOpen(false)
    })
  }

  const unfollowUser = () => {
    setShouldStayOpen(true)
    unfollowRequest(author).then((result) => {
      setShowSnackbar(true)
      if(result) {
        setMessage(`Successfully Unfollowed @${author}`)
        setHasRecentlyFollowed(false)
        setHasRecentlyUnfollowed(true)
      } else {
        setMessage(`Failed Unfollowing @${author}`)
        setSeverity('error')
      }
      setShouldStayOpen(false)
    })
  }

  const handleSnackBarClose = () => {
    setShowSnackbar(false)
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
        open={open | shouldStayOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableScrollLock
        PaperProps={{ onMouseEnter, onMouseLeave }}
        onClose={onMouseLeave}
      >
        <div className={classes.wrapper}>
        <div style={{ height: '100%', width: '95%', margin: '0 auto', marginTop: 5, marginBottom: 5, }}>
          <div className={classes.row}>
              <Row>
                <Col xs="auto" style={{ paddingRight: 0 }}>
                  <div className={classes.left}>
                    <Avatar author={author} />
                  </div>
                </Col>
                <Col>
                  <div className={classes.right}>
                    {((!isFollowed && !hasRecentlyFollowed) || hasRecentlyUnfollowed) && (username !== author) && (
                      <ContainedButton
                        fontSize={14}
                        loading={loading}
                        disabled={loading}
                        style={{ float: 'right', marginTop: 5, }}
                        transparent={true}
                        label="Follow"
                        className={classes.button}
                        onClick={followUser}
                      />
                    )}
                    {((isFollowed || hasRecentlyFollowed) && !hasRecentlyUnfollowed) && (username !== author) && (
                      <ContainedButton
                        fontSize={14}
                        loading={loading}
                        disabled={loading}
                        style={{ float: 'right', marginTop: 5, }}
                        transparent={true}
                        label="Unfollow"
                        className={classes.button}
                        onClick={unfollowUser}
                      />
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs="auto" style={{ paddingRight: 0 }}>
                  <label className={classes.name} style={{ color: 'black' }}>
                    <Link
                      to={authorLink}
                      style={{ color: 'black' }}
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
                  <p className={classNames(classes.paragraph, classes.followWrapper)}>
                    <b>{following_count}</b> Following &nbsp; <b>{follower_count}</b> Follower
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Popover>
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
  user: state.auth.get('user'),
  loading: pending(state, 'FOLLOW_REQUEST') || pending(state, 'UNFOLLOW_REQUEST'),
  recentFollows: state.posts.get('hasBeenRecentlyFollowed'),
  recentUnfollows: state.posts.get('hasBeenRecentlyUnfollowed'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    followRequest,
    unfollowRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDialog)
