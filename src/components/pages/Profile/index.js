import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import { IconButton, Chip, Tab, Tabs } from '@material-ui/core'
import { createUseStyles } from 'react-jss'
import {
  Avatar,
  ContainedButton,
  MoreCircleIconRed,
  CustomizedMenu,
} from 'components/elements'
import { broadcastNotification } from 'store/interface/actions'
import {
  getProfileRequest,
  getAccountPostsRequest,
  setProfileIsVisited,
  getAccountRepliesRequest,
  getAccountCommentsRequest,
  clearAccountPosts,
  clearAccountReplies,
  getFollowersRequest,
  clearProfile,
  getFollowingRequest,
  clearAccountFollowers,
  clearAccountFollowing,
  clearAccountComments,
  clearAccountBlacklist,
  clearAccountFollowedBlacklist,
} from 'store/profile/actions'
import {
  followRequest,
  unfollowRequest,
  setPageFrom,
} from 'store/posts/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { anchorTop } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { renderRoutes } from 'react-router-config'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { clearScrollIndex, openMuteDialog } from 'store/interface/actions'
import {
  ProfileSkeleton,
  HelmetGenerator,
  HiddenBuzzListModal,
  EditProfileModal,
} from 'components'
import queryString from 'query-string'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import DateRangeIcon from '@material-ui/icons/DateRange'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Tooltip from '@material-ui/core/Tooltip'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import PersonIcon from '@material-ui/icons/Person'
import { checkForCeramicAccount, followUserRequest, unFollowUserRequest } from 'services/ceramic'

const useStyles = createUseStyles(theme => ({
  cover: {
    height: 270,
    width: '100%',
    background: 'transparent',
    objectFit: 'cover',
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

    '& img': {
      backgroundColor: `${theme.background.primary} !important`,
    },
  },
  avatarStyles: {
    borderColor: `${theme.background.primary} !important`,
  },
  walletButton: {
    marginTop: 5,
    float: 'right',
    marginRight: 15,
  },
  fullName: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px !important',
    fontWeight: 'bold',
    padding: 0,
    fontFamily: 'Segoe-Bold !important',
    ...theme.font,
  },
  userName: {
    display: 'flex',
    padding: 0,
    margin: 0,
    marginBottom: 15,
    fontSize: 14,
    ...theme.font,
    color: 'rgb(136, 153, 166) !important',
  },
  wrapper: {
    width: '95%',
    margin: '0 auto',
    height: 'max-content',
  },
  paragraph: {
    display: 'flex',
    padding: 0,
    margin: 0,
    fontSize: 14,
    ...theme.font,
    '& span': {
      wordBreak: 'break-all',
    },
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
    '&:hover': {
      color: '#d32f2f',
    },
  },
  followLinks: {
    ...theme.font,
    marginTop: 5,
    fontSize: "1.2em",

    '&:first-child': {
      marginRight: 12,
    },
  },
  textIcon : {
    ...theme.textIcon,
    display: "inline-flex",
    alignItems: "center",
  },
  clipboard: {
    margin: 0,
    marginBottom: 5,
  },
  usernameStyle: {
    border: '1px solid rgba(230, 28, 52, 0.2)',
    margin: '5px 2px',
    padding: '1px 5px',
    paddingBottom: 2,
    background: 'rgba(255, 235, 238, 0.8)',
    borderRadius: 5,
    transition: 'opacity 250ms',

    '& a': {
      textDecoration: 'none',
      color: '#E61C34 !important',
    },

    '&:hover': {
      opacity: 0.8,
    },
  },
  invalidUser: {
    display: 'flex',
    width: '100%',
    height: '80vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#E61C34',
    fontWeight: 600,
    fontSize: '1.2em',
    gap: 20,

    '& .errorHint': {
      fontSize:'0.8em',
      opacity: 0.8,
      fontWeight: 400,
    },

    '@media (max-width: 480px)': {
      textAlign: 'center',

      '& .userIcon': {
        fontSize: '8em !important',
      },
    },

    '& .userIcon': {
      fontSize: '8em !important',
    },
  },
  followYouText: {
    marginLeft: 5,
    fontSize: 12,
    padding: '5px 15px',
    borderRadius: 35,
    background: theme.context.view.backgroundColor ,
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
    clearAccountBlacklist,
    clearAccountFollowedBlacklist,
    setPageFrom,
    user,
    followRequest,
    unfollowRequest,
    loadingFollow,
    recentFollows,
    recentUnfollows,
    broadcastNotification,
    clearScrollIndex,
    openMuteDialog,
    mutelist,
    getAccountCommentsRequest,
    clearAccountComments,
    follows,
  } = props

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const { username: loginuser, is_authenticated } = user

  const classes = useStyles()
  const [index, setIndex] = useState(0)
  const [hasRecentlyFollowed, setHasRecentlyFollowed] = useState(false)
  const [hasRecentlyUnfollowed, setHasRecentlyUnfollowed] = useState(false)
  const [openHiddenBuzzList, setOpenHiddenBuzzList] = useState(false)
  const [moreOptionsEl, setMoreOptionsEl] = useState(null)

  const [moreOptions, setMoreOptions] = useState([])
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [copied, setCopied] = useState(false)
  const [invalidUser, setInvalidUser] = useState(false)
  const [ceramicProfile, setCeramicProfile] = useState({})

  
  useEffect(() => {
    if(profile.ceramic) {
      setCeramicProfile(profile.basic_profile)
    }
  }, [profile])

  const reloadProfile = () => {
    getProfileRequest(username)
  }

  const [followsYou, setFollowsYou] = useState(false)

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

  const checkIfFollowsYou = () => {
    if(follows.find(u => u.following === user.username)) {
      setFollowsYou(true)
    } else {
      setFollowsYou(false)
    }
  }
  
  useEffect(() => {
    checkIfRecentlyFollowed()
    checkIfRecentlyUnfollowed()
    // eslint-disable-next-line
  }, [recentFollows, recentUnfollows, loading])

  useEffect(() => {
    checkIfFollowsYou()
    // eslint-disable-next-line
  }, [follows, user, loading])

  const onChange = (e, index) => {
    setIndex(index)
  }

  const handleTabs = (index) => () => {
    let tab = 'buzz'
    
    if(index === 1) {
      tab = 'comments'
    } else if (index === 2) {
      tab = 'replies'
    } else if (index === 3) {
      tab = 'pockets'
    }
    
    history.push(`/@${username}/t/${tab}/`)
  }
  
  const openMuteModal = () => {
    openMuteDialog(username)
  }
  

  const { params } = match
  const { username } = params

  useEffect(() => {
    setPageFrom(null)
    const params = queryString.parse(location.search)

    if((!isVisited || (params.ref && (params.ref === 'replies' || params.ref === 'nav')) || username)) {
      anchorTop()
      clearScrollIndex()
      clearProfile()
      clearAccountPosts()
      clearAccountReplies()
      clearAccountFollowers()
      clearAccountFollowing()
      clearAccountComments()
      clearAccountBlacklist()
      clearAccountFollowedBlacklist()
      setProfileIsVisited()
      getProfileRequest(username)
      getAccountPostsRequest(username)
      getAccountCommentsRequest(username)
      getAccountRepliesRequest(username)
      getFollowersRequest(username)
      getFollowingRequest(username)
    }

    setMoreButtonOptions()

    // eslint-disable-next-line
  }, [username])

  
  const setMoreButtonOptions = () => {
    const moreOptionsList = [
      {
        label: "Blacklisted Users",
        icon: '',
        onClick: navigateToBlackListed,
      },
      {
        label: "Muted Users",
        icon: '',
        onClick: navigateToMutedUsers,
      },
      {
        label: "Followed Blacklists",
        icon: '',
        onClick: navigateToFollowedBlacklist,
      },
      {
        label: "Followed Muted Lists",
        icon: '',
        onClick: navigateToFollowedMuted,
      },
    ]
    
    if(username === loginuser) {
      const options = [
        {
          label: "Hidden Buzzes",
          icon: '',
          onClick: handleClickOpenHiddenBuzzList,
        },
      ]
      setMoreOptions([...options, ...moreOptionsList])
    }else{
      setMoreOptions(moreOptionsList)
    }
  }
  
  useEffect(() => {
    if(pathname.match(/(\/t\/buzz\/)$|(\/t\/buzz)$/m)) {
      setIndex(0)
    } else if(pathname.match(/(\/t\/comments\/)$|(\/t\/comments)$/m)) {
      setIndex(1)
    } else if(pathname.match(/(\/t\/replies\/)$|(\/t\/replies)$/m)) {
      setIndex(2)
    } else if(pathname.match(/(\/t\/pockets)$|(\/t\/pockets)$/m) || pathname.match(/(\/t\/pockets\/.*)$|(\/t\/pockets\/.*)$/m)) {
      setIndex(3)
    } else {
      setIndex(0)
    }
  }, [pathname])
  
  
  const { metadata, stats, hivepower, ceramic, created: accountCreated } = profile || ''
  const { profile: profileMeta } = metadata || ''
  const { name, cover_image, profile_image, location: profile_location, website, about } = profileMeta || ''
  const { followers, following } = stats || 0
  
  const { reputation = 0, isFollowed } = profile
  
  const userAbout = about || ceramicProfile.description ? (about ? about : ceramicProfile.description).replace(/@([A-Za-z0-9-]+\.?[A-Za-z0-9-]+)/gi, n => `<b class=${classes.usernameStyle}><a href=${window.location.origin}/${n.toLowerCase()}>${n}</a></b>`) : ''

  const [loader, setLoader] = useState(false)
  
  useEffect(() => {
    if(!checkForCeramicAccount(username)){
      setAvatarUrl(profile_image)
    } else if(checkForCeramicAccount(username) && ceramicProfile.images?.avatar) {
      const avatar = ceramicProfile.images?.avatar.replace('ipfs://', '')
      setAvatarUrl(`https://ipfs.io/ipfs/${avatar}`)
    } else {
      setAvatarUrl(`${window.location.origin}/ceramic_user_avatar.svg`)
    }
  // eslint-disable-next-line
  },[profile_image, username, ceramicProfile])

  // check for invalid user
  useEffect(() => {
    if(!ceramic) {
      getProfileRequest(username).then((result) => {
        result.toString() === ('RPCError: Invalid parameters') && setInvalidUser(true)
      })
    }
    // eslint-disable-next-line
  }, [username])

  const followUser = () => {
    setLoader(true)
    if(!ceramicProfile) {
      followRequest(username).then((result) => {
        if(result) {
          broadcastNotification('success', `Successfully followed @${username}`)
          setHasRecentlyFollowed(true)
          setHasRecentlyUnfollowed(false)
          setLoader(false)
        } else {
          broadcastNotification('error', `Failed following @${username}`)
        }
      }).catch((e) => {
        setLoader(false)
      })
    } else {
      followUserRequest(username).then(res => {
        broadcastNotification('success', `Successfully followed @${username}`)
        setHasRecentlyFollowed(true)
        setHasRecentlyUnfollowed(false)
        setLoader(false)
      }).catch((e) => {
        if(e.message === 'Already following') {
          setLoader(false)
        }
      })
    }
  }
  
  const unfollowUser = () => {
    if(!ceramicProfile) {
      unfollowRequest(username).then((result) => {
        if(result) {
          broadcastNotification('success', `Successfully Unfollowed @${username}`)
          setHasRecentlyFollowed(false)
          setHasRecentlyUnfollowed(true)
        } else {
          broadcastNotification('error', `Failed Unfollowing @${username}`)
        }
      })
    } else {
      unFollowUserRequest(username).then(res => {
        broadcastNotification('success', `Successfully Unfollowed @${username}`)
        setHasRecentlyFollowed(false)
        setHasRecentlyUnfollowed(true)
      })
    }
  }

  const handleClickOpenHiddenBuzzList = () => {
    setOpenHiddenBuzzList(!openHiddenBuzzList)
    handleCloseMoreOptions()
  }

  const handleCloseMoreOptions = () => {
    setMoreOptionsEl(null)
  }

  const handleOpenMoreOptions = (e) => {
    setMoreOptionsEl(e.currentTarget)
  }

  const handleOpenEditProfileModal = () => {
    setOpenEditProfileModal(!openEditProfileModal)
  }

  const navigateToBlackListed = () => {
    history.push(`/@${username}/lists/blacklisted/users`)
  }

  const navigateToFollowedBlacklist = () => {
    history.push(`/@${username}/lists/blacklisted/followed`)
  }

  const navigateToMutedUsers = () => {
    history.push(`/@${username}/lists/muted/users`)
  }

  const navigateToFollowedMuted = () => {
    history.push(`/@${username}/lists/muted/followed`)
  }

  const copyReferalLink = () => {
    setCopied(true)
  }

  const handleCloseReferalCopy = () => {
    setCopied(false)
  }

  return (
    <>
      {!invalidUser ?
        <React.Fragment>
          <HelmetGenerator page='Profile' />
          <ProfileSkeleton loading={loading} />
          {!loading && (
            <React.Fragment>
              <div className={classes.cover}>
                <img src={(cover_image || ceramicProfile.images?.background) ? cover_image ? `https://images.hive.blog/0x0/${cover_image}` : `https://ipfs.io/ipfs/${ceramicProfile.images.background.replace('ipfs://', '')}` : `${window.location.origin}/dbuzz_full.svg`} alt="cover" style={{borderRadius: cover_image ? '0 0 25px 25px' : ''}} onError={(e) => e.target.src = `${window.location.origin}/dbuzz_full.svg`} loading='lazy'/>
              </div>
              <div className={classes.wrapper}>
                <Row>
                  <Col xs="auto">
                    <div className={classes.avatar}>
                      <Avatar className={classes.avatarStyles} border={true} height="135" author={username} size="medium" avatarUrl={avatarUrl}/>
                    </div>
                  </Col>
                  <Col>
                    {is_authenticated && (
                      <React.Fragment>
                        <IconButton
                          size="medium"
                          style={{ float: 'right', marginTop: -5, marginLeft: -5, marginRight: -15}}
                          onClick={handleOpenMoreOptions}
                        >
                          <MoreCircleIconRed/>
                        </IconButton>
                        <CustomizedMenu anchorEl={moreOptionsEl} handleClose={handleCloseMoreOptions} items={moreOptions}/>
                        {loginuser === username && (
                          <ContainedButton
                            fontSize={14}
                            disabled={loading}
                            style={{ float: 'right', marginTop: 5 }}
                            transparent={true}
                            label="Edit profile"
                            className={classes.button}
                            onClick={handleOpenEditProfileModal}
                          />
                        )}
                        {loginuser !== username && !mutelist.includes(username) && (
                          <ContainedButton
                            fontSize={14}
                            disabled={loading}
                            style={{ float: 'right', marginTop: 5, marginLeft: 10 }}
                            transparent={true}
                            label="Mute"
                            className={classes.button}
                            onClick={openMuteModal}
                          />
                        )}
                        {loginuser !== username && mutelist.includes(username) && (
                          <ContainedButton
                            fontSize={14}
                            disabled={loading}
                            style={{ float: 'right', marginTop: 5, marginLeft: 10 }}
                            transparent={true}
                            label="Unmute"
                            className={classes.button}
                            onClick={openMuteModal}
                          />
                        )}
                        {((!isFollowed && !hasRecentlyFollowed) || hasRecentlyUnfollowed) && (loginuser !== username) && (
                          <ContainedButton
                            fontSize={14}
                            loading={loadingFollow || loader}
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
                            loading={loadingFollow || loader}
                            disabled={loading}
                            style={{ float: 'right', marginTop: 5 }}
                            transparent={true}
                            label="Unfollow"
                            className={classes.button}
                            onClick={unfollowUser}
                          />
                        )}
                      </React.Fragment>
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
                        {!ceramic ? name || username : ceramicProfile.name || 'Ceramic User'}&nbsp;{!ceramic && <Chip component="span" style={{marginRight: 5}}  size="small" label={`${reputation} Rep`} />}
                        {!ceramic && <Chip component="span"  size="small" label={`${parseFloat(hivepower).toFixed(2)} HP`} />}
                        {followsYou && <div className={classes.followYouText}><span>Follows you</span></div>}
                      </p>
                    </Col>
                  </Row>
                  <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                    {(name || ceramic) &&
                      <Col xs="auto">
                        <p className={classes.userName}>
                          @{username}
                        </p>
                      </Col>}
                  </Row>
                  <Row>
                    <Col xs="auto">
                      <p className={classes.paragraph}>
                        <div dangerouslySetInnerHTML={{ __html: userAbout || ceramicProfile.bio }} />
                      </p>
                    </Col>
                  </Row>
                  <div style={{ width: '100%', height: 10 }} />
                  <Row style={{ marginLeft: -5 }}>
                    <p className={classes.paragraph}>
                      {accountCreated && (
                        <span className={classes.textIcon} >
                          <DateRangeIcon fontSize="small" />&nbsp;
                          Joined {new Date(accountCreated).toLocaleDateString("en-US",{month: 'long', year: 'numeric' })}
                        </span>
                      )}
                    </p>
                  </Row>
                  {!ceramic && <Row>
                    <Col xs="auto" style={{ marginLeft: -5 }}>
                      <p className={classes.paragraph}>
                        <span>
                          <LinkIcon fontSize="small" className={classes.textIcon}/> {" Blogs - "}
                          <a href={`https://blog.d.buzz/#/@${username}`} target="_blank" rel="noopener noreferrer" className={classes.weblink}>
                            https://blog.d.buzz/#/@{username}
                          </a>
                        </span>
                      </p>
                    </Col>
                  </Row>}
                  {!ceramic && <Row>
                    <Col xs="auto" style={{ marginLeft: -5 }}>
                      <Tooltip title="Click to copy referal link">
                        <CopyToClipboard className={classes.clipboard} text={`https://${window.location.hostname}/#/?ref=${username}`} onCopy={copyReferalLink}>
                          <p className={classes.paragraph}>
                            <span>
                              <FileCopyIcon fontSize="small" className={classes.textIcon}/>
                              <span style={{ fontSize: 14 }}>{" Copy Referal - "}</span>
                              {/* eslint-disable-next-line */}
                              <span id="user-referal" className={classes.weblink}>
                                https://{window.location.hostname}/#/?ref={username}
                              </span>
                            </span>
                          </p>
                        </CopyToClipboard>
                      </Tooltip>
                    </Col>
                  </Row>}
                  <Row>
                    <Col xs="auto" style={{ marginLeft: -5 }}>
                      <p className={classes.paragraph}>
                        {(profile_location || ceramicProfile.location) && (
                          <span className={classes.textIcon} style={{ marginRight: 10 }}>
                            <LocationOnIcon fontSize="small" className={classes.textIcon}/>&nbsp;
                            {profile_location || ceramicProfile.location}
                          </span>
                        )}
                        {(website || ceramicProfile.url) && (
                          <span>
                            <LinkIcon fontSize="small" className={classes.textIcon}/>&nbsp;
                            <a href={website || ceramicProfile.url} target="_blank" rel="noopener noreferrer" className={classes.weblink}>
                              {(website || ceramicProfile.url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </a>
                          </span>
                        )}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="auto">
                      <p className={classes.paragraph}>
                        <Link className={classes.followLinks} to={`/@${username}/follow/following`}>
                          <b>{following}</b> <span className={classes.textIcon}>Following</span>
                        </Link> &nbsp;
                        <Link className={classes.followLinks} to={`/@${username}/follow/followers`}>
                          <b>{followers}</b> <span className={classes.textIcon}>Followers</span>
                        </Link> &nbsp;
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
              {!loading && <Tab disableTouchRipple onClick={handleTabs(0)} className={classes.tabs} label="Buzz's" />}
              {!loading && !ceramic && <Tab disableTouchRipple onClick={handleTabs(1)} className={classes.tabs} label="Comments" />}
              {!loading && !ceramic &&  <Tab disableTouchRipple onClick={handleTabs(2)} className={classes.tabs} label="Replies" />}
              {!loading && !ceramic && <Tab disableTouchRipple onClick={handleTabs(3)} className={classes.tabs} label="Pockets" />}
            </Tabs>
          </div>
          <React.Fragment>
            {renderRoutes(route.routes, { author: username })}
          </React.Fragment>
          <HiddenBuzzListModal open={openHiddenBuzzList} onClose={handleClickOpenHiddenBuzzList} />
          <EditProfileModal show={openEditProfileModal} onHide={handleOpenEditProfileModal} reloadProfile={reloadProfile}/>
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={copied} autoHideDuration={6000} onClose={handleCloseReferalCopy}>
            <Alert onClose={handleCloseReferalCopy} severity="success">
              Referal link Successfully copied
            </Alert>
          </Snackbar>
        </React.Fragment> :

        <div className={classes.invalidUser}>
          <PersonIcon className='userIcon' />
          <span className='errorTitle'>This account doesn’t exist.</span>
          <span className='errorHint'>Try searching for another.</span>
        </div>}
    </>
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
  mutelist: state.auth.get('mutelist'),
  follows: state.profile.get('following'),
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
    clearAccountBlacklist,
    clearAccountFollowedBlacklist,
    setPageFrom,
    followRequest,
    unfollowRequest,
    broadcastNotification,
    clearScrollIndex,
    openMuteDialog,
    getAccountCommentsRequest,
    clearAccountComments,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
