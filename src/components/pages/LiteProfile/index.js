import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import { IconButton, Tab, Tabs } from '@material-ui/core'
import { createUseStyles } from 'react-jss'
import {
  Avatar,
  ContainedButton,
  MoreCircleIconRed,
  CustomizedMenu,
} from 'components/elements'
import { broadcastNotification } from 'store/interface/actions'
import {
  setPageFrom,
} from 'store/posts/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUserTheme, proxyImage } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { renderRoutes } from 'react-router-config'
import { useHistory, useLocation } from 'react-router-dom'
import { openMuteDialog } from 'store/interface/actions'
import {
  ProfileSkeleton,
  HelmetGenerator,
  HiddenBuzzListModal,
  EditProfileModal,
} from 'components'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import PersonIcon from '@material-ui/icons/Person'
import { getIpfsLink, unFollowUserRequest } from 'services/ceramic'
import { getTheme } from 'services/theme'
import { PROFILE_QUERY } from 'services/union'
import { useQuery } from '@apollo/client'

const useStyles = createUseStyles(theme => ({
  cover: {
    height: 270,
    width: '100%',
    backgroundColor: `${getTheme(getUserTheme()).coverColor}`,
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
  },
  avatarStyles: {
    borderColor: `${theme.background.primary} !important`,
    animation: 'skeleton-loading 1s linear infinite alternate',
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
    color: '#FF0000',
    '&:hover': {
      color: '#FF0000',
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
  linkStyle: {
    '& a': {
      color: 'rgb(255, 0, 0) !important',
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
  profileImage: {
    animation: 'skeleton-loading 1s linear infinite alternate',
  },
}))

const LiteProfile = (props) => {
  const {
    match,
    route,
    setPageFrom,
    user,
    loadingFollow,
    broadcastNotification,
    openMuteDialog,
    mutelist,
  } = props

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const { username: loginuser, is_authenticated } = user

  const classes = useStyles()
  // eslint-disable-next-line
  const [profile, setProfile] = useState({})

  const [index, setIndex] = useState(0)
  const [hasRecentlyFollowed, setHasRecentlyFollowed] = useState(false)
  const [hasRecentlyUnfollowed, setHasRecentlyUnfollowed] = useState(false)
  const [openHiddenBuzzList, setOpenHiddenBuzzList] = useState(false)
  const [moreOptionsEl, setMoreOptionsEl] = useState(null)

  const [moreOptions, setMoreOptions] = useState([])
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false)
  // eslint-disable-next-line
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [copied, setCopied] = useState(false)
  // eslint-disable-next-line
  const [invalidUser, setInvalidUser] = useState(false)

  // eslint-disable-next-line
  const [followers, setFollowers] = useState([])
  // eslint-disable-next-line
  const [following, setFollowing] = useState([])
  // eslint-disable-next-line
  const [followsYou, setFollowsYou] = useState(false)


  const [loader, setLoader] = useState(false)

  // eslint-disable-next-line
  const [userProfileImage, setUserProfileImage] = useState()
  // eslint-disable-next-line
  const [userCoverImage, setUserCoverImage] = useState()
  // eslint-disable-next-line
  const [userName, setUserName] = useState()
  // eslint-disable-next-line
  const [userBio, setUserBio] = useState()
  // eslint-disable-next-line
  const [userLocation, setUserLocation] = useState()
  // eslint-disable-next-line
  const [userWebsite, setUserWebsite] = useState()
  // eslint-disable-next-line
  const [isFollowed, setIsFollowed] = useState(false)

  const [updatedCover, setUpdatedCover] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState(false)
  
  const { params } = match
  const { username } = params

  // eslint-disable-next-line
  const { loading, error, data={}, refetch } = useQuery(PROFILE_QUERY, {
    variables: { id: loginuser === username ? loginuser : username},
  })

  useEffect(() => {
    if(!loading) {
      if(data?.profile) {
        const { profile } = data
        setUserName(profile.name)
        setUserBio(profile.about)
        setUserLocation(profile.location)
        setUserWebsite(profile.website)
        setUserProfileImage(getIpfsLink(profile.images?.avatar))
        setUserCoverImage(getIpfsLink(profile.images?.cover))
        setAvatarUrl(getIpfsLink(profile.images?.avatar))
      }
    }
  }, [data, loading])

  const reloadProfile = () => {
    refetch()
  }

  const onChange = (e, index) => {
    setIndex(index)
  }

  const handleTabs = (index) => () => {
    refetch()

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

  useEffect(() => {
    setPageFrom(null)
    setMoreButtonOptions()

    // eslint-disable-next-line
  }, [username])

  
  const setMoreButtonOptions = () => {
    const moreOptionsList = [
      {
        label: "Blog",
        icon: '',
        onClick: navigateToBlog,
      },
      {
        label: "Moderation Tools",
        icon: '',
        onClick: navigateToModerationTools,
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

  useEffect(() => {
    if(userCoverImage === '' && !updatedCover) {
      setUserCoverImage(`${window.location.origin}/dbuzz_full.svg`)
    }
    // eslint-disable-next-line
  }, [userCoverImage])

  // const followUser = () => {
  //   setLoader(true)
  // }
  
  const unfollowUser = () => {
    setLoader(true)
    unFollowUserRequest(username).then(res => {
      broadcastNotification('success', `Successfully Unfollowed @${username}`)
      setHasRecentlyFollowed(false)
      setHasRecentlyUnfollowed(true)
      setLoader(false)
      reloadProfile()
    }).catch((e) => {
      console.log(e.message)
      setLoader(false)
    })
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

  const navigateToBlog = () => {
    window.open(`https://blog.d.buzz/#/@${username}`, '_blank') 
  }

  const navigateToModerationTools = () => {
    alert('Coming Soon!')
  }

  const handleCloseReferalCopy = () => {
    setCopied(false)
  }

  useEffect(() => {
    const coverImage = document.getElementById('coverImage')
    const profileImage = document.getElementById('profileImage')
    
    if(coverImage && profileImage) {
      
      if(updatedCover) {
        setUserCoverImage('')
        coverImage.src = ''
        coverImage.alt = ''
        coverImage.style.animation = 'skeleton-loading 1s linear infinite alternate'
        setUserCoverImage(`${updatedCover}?${new Date().getTime()}`)
        coverImage.src = `${updatedCover}?${new Date().getTime()}`
        
        setTimeout(() => {
          setUpdatedCover(false)
        }, 1000)
      }
      
      if(updatedProfile) {
        setUserProfileImage('')
        profileImage.src = ''
        profileImage.alt = ''
        profileImage.style.animation = 'skeleton-loading 1s linear infinite alternate'
        setUserProfileImage(`${updatedProfile}?${new Date().getTime()}`)
        profileImage.src = `${updatedProfile}?${new Date().getTime()}`
        
        setTimeout(() => {
          setUpdatedProfile(false)
        }, 1000)
      }
    }
  }, [updatedCover, updatedProfile])
  
  const loadCoverImage = () => {
    const coverImage = document.getElementById('coverImage')
    coverImage.style.background = 'none'
    coverImage.style.animation = 'none'
    coverImage.style.opacity = '1'

    if(coverImage.src === '' && !updatedCover) {
      coverImage.src = `${window.location.origin}/dbuzz_full.svg`
    } else {
      if(updatedCover === '') {
        coverImage.src = `${window.location.origin}/dbuzz_full.svg`
      }
    }
  }

  const loadProfileImage = () => {
    const profileImage = document.getElementById('profileImage')
    profileImage.style.animation = 'none'
    profileImage.style.opacity = '1'
    profileImage.style.background = `${getTheme(getUserTheme()).background.primary}`
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
                {userCoverImage && <img src={proxyImage(userCoverImage)} alt="cover" style={{borderRadius: userCoverImage ? '0 0 25px 25px' : ''}} onLoad={loadCoverImage}  className={classes.profileImage} id='coverImage' />}
              </div>
              <div className={classes.wrapper}>
                <Row>
                  <Col xs="auto">
                    <div className={classes.avatar} id='avatarContainer'>
                      <Avatar className={classes.avatarStyles} border={true} height="135" size="medium" avatarUrl={avatarUrl} onLoad={loadProfileImage} id='profileImage'/>
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
                        {/* {loginuser !== username && mutelist.includes(username) && (
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
                        {!isFollowed && (loginuser !== username) && (
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
                        )} */}
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
                        {userName || username}&nbsp;
                        {followsYou && <div className={classes.followYouText}><span>Follows you</span></div>}
                      </p>
                    </Col>
                  </Row>
                  <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                    <Col xs="auto">
                      <p className={classes.userName}>
                        @{username}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="auto">
                      <p className={classes.paragraph}>
                        <div dangerouslySetInnerHTML={{ __html: userBio }} />
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="auto" style={{ marginTop: 10, marginLeft: -5 }}>
                      <p className={classes.paragraph}>
                        {(userLocation) && (
                          <span className={classes.textIcon} style={{ marginRight: 10 }}>
                            <LocationOnIcon fontSize="small" className={classes.textIcon}/>&nbsp;
                            {userLocation}
                          </span>
                        )}
                        {(userWebsite) && (
                          <span>
                            <LinkIcon fontSize="small" className={classes.textIcon}/>&nbsp;
                            <a href={profile?.url} target="_blank" rel="noopener noreferrer" className={classes.weblink}>
                              {(userWebsite).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </a>
                          </span>
                        )}
                      </p>
                    </Col>
                  </Row>
                  {/* <Row>
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
                  </Row> */}
                </React.Fragment>
              )}
            </div>
            {/* <div className={classes.spacer} /> */}
            <Tabs
              value={index}
              indicatorColor="primary"
              textColor="primary"
              centered
              onChange={onChange}
              className={classes.tabContainer}
            >
              {!loading && <Tab disableTouchRipple onClick={handleTabs(0)} className={classes.tabs} label="Buzz's" />}
              {!loading && <Tab disableTouchRipple onClick={handleTabs(3)} className={classes.tabs} label="Pockets" />}
            </Tabs>
          </div>
          <React.Fragment>
            {renderRoutes(route.routes, { author: username })}
          </React.Fragment>
          <HiddenBuzzListModal open={openHiddenBuzzList} onClose={handleClickOpenHiddenBuzzList} />
          <EditProfileModal
            show={openEditProfileModal}
            onHide={handleOpenEditProfileModal}
            setUpdatedCover={setUpdatedCover}
            setUpdatedProfile={setUpdatedProfile}
          />
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={copied} autoHideDuration={6000} onClose={handleCloseReferalCopy}>
            <Alert onClose={handleCloseReferalCopy} severity="success">
              Referal link Successfully copied
            </Alert>
          </Snackbar>
        </React.Fragment> :

        <div className={classes.invalidUser}>
          <PersonIcon className='userIcon' />
          <span className='errorTitle'>This account doesn’t exist.</span>
          <span className='errorHint'>Try searching for another one.</span>
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
    setPageFrom,
    broadcastNotification,
    openMuteDialog,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LiteProfile)
