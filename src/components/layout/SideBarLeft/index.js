import React, { useState, useEffect, useRef } from 'react'
import Nav from 'react-bootstrap/Nav'
import NavbarBrand from 'react-bootstrap/NavbarBrand'
import classNames from 'classnames'
import Badge from '@material-ui/core/Badge'
import { createUseStyles } from 'react-jss'
import { useLocation, useHistory } from 'react-router-dom'
import {
  HomeIcon,
  BrandIcon,
  BrandIconDark,
  TrendingIcon,
  LatestIcon,
  NotificationsIcon,
  ProfileIcon,
  ContainedButton,
  Avatar,
  PowerIcon,
  CircularBrandIcon,
  // BuzzIcon,
  WalletIcon,
} from 'components/elements'
import IconButton from '@material-ui/core/IconButton'
import {
  BuzzFormModal,
  ThemeModal,
  SwitchUserModal,
  LoginModal,
  MoreMenu,
} from 'components'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { signoutUserRequest, subscribeRequest } from 'store/auth/actions'
import { setBuzzModalStatus, setRefreshRouteStatus } from 'store/interface/actions'
import { generateStyles } from 'store/settings/actions'
import { pollNotifRequest } from 'store/polling/actions'
import moment from 'moment'
import SettingsModal from 'components/modals/SettingsModal'
import { getTheme as getUserTheme } from 'services/helper'
import { getTheme } from 'services/theme'
import config from 'config'
import { checkCeramicLogin, getBasicProfile, getIpfsLink } from 'services/ceramic'
import CreateBuzzIcon from 'components/elements/Icons/CreateBuzzIcon'
import MoreIcon from 'components/elements/Icons/MoreIcon'


const useStyles = createUseStyles(theme => ({
  items: {
    display: 'grid',
    placeItems: 'center',
    height: 50,
    fontFamily: 'Segoe-Bold, sans-serif',
    width: 'max-content',
    fontSize: 18,
    marginBottom: 8,
    userSelect: 'none',
    ...theme.left.sidebar.items.icons,
    borderRadius: '50px 50px',
    transition: 'background-color 250ms',
    '& a': {
      color: theme.left.sidebar.items.color,
      textDecoration: 'none',
    },
    '&:hover': {
      ...theme.left.sidebar.items.hover,
      cursor: 'pointer',
      '& svg': {
        color: '#e53935',
        '& path': {
          // stroke: '#e53935',
        },
      },
    },
  },
  minifyItems: {
    textAlign: 'left',
    marginBottom: 5,
    ...theme.left.sidebar.items.icons,
    '& a': {
      color: theme.left.sidebar.items.color,
      textDecoration: 'none',
      '&:hover': {
        color: '#e53935',
      },
    },
    '&:hover': {
      cursor: 'pointer',
      '& a': {
        color: '#e53935',
      },
      '& svg': {
        color: '#e53935',
        '& path': {
          // stroke: '#e53935',
        },
      },
    },
  },
  activeItem: {
    borderRadius: '50px 50px',
    cursor: 'pointer',
    '& a': {
      color: '#e53935',
    },
    '& svg': {
      '& path': {
        stroke: '#e61c34 !important',
        fill: '#e61c34 !important',
      },
    },
  },
  navLinkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    height: '90vh',
    fontSize: 14,
    overflow: 'auto',
    width: '100%',
  },
  bottom: {
    position: 'absolute',
    bottom: 150,
    height: 'max-content',
    width: '90%',
    borderRadius: '50px 50px',
    cursor: 'pointer',
    ...theme.left.sidebar.bottom.wrapper,
    transitionDuration: '0.3s',
    transitionProperty: 'background-color',
  },
  bottomMinify: {
    position: 'absolute',
    bottom: 150,
    ...theme.left.sidebar.bottom.wrapperMinify,
  },
  inline: {
    display: 'inline-block',
  },
  avatarWrapper: {
    width: '100%',
    minHeight: 55,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2.5,
  },
  sideBarButton: {
    width: '100%',
    marginBottom: 10,
  },
  logoutLabel: {
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
    paddingLeft: 5,
    color: theme.left.sidebar.logout.label.color,
  },
  logoutUsername: {
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
    paddingLeft: 5,
    fontSize: 12,
    color: theme.left.sidebar.logout.username.color,
  },
  logoutIcon: {
    ...theme.left.sidebar.logout.icon,
  },
  buzzButton: {
    padding: 8,
    backgroundColor: '#e53935 !important',
    '&:hover': {
      backgroundColor: '#b71c1c !important',
    },
  },
  logoutButton: {
    marginTop: 'auto',
    display: 'flex',
    height: 'max-content',
    width: '100%',
    borderRadius: '50px 50px',
    cursor: 'pointer',
    ...theme.left.sidebar.bottom.wrapper,
    transitionDuration: '0.3s',
    transitionProperty: 'background-color',
  },
  logoutButtonMinify: {
    ...theme.left.sidebar.bottom.wrapper,
  },
  menu: {
    '& .MuiPaper-root': {
      background: theme.background.primary,
    },
    '& ul':{
      background: theme.background.primary,
    },
    '& li': {
      fontSize: 18,
      fontWeight: '500 !important',
      background: theme.background.primary,
      color: theme.font.color,

      '&:hover': {
        ...theme.context.view,
      },
    },
  },
  moreButton: {
    display: 'flex',
    color: '#e61c34',

    '&:hover': {
      color: '#E53935',
    },
  },
  betaTitleContainer: {
    display: 'grid',
    placeItems: 'center',
  },
  betaTitle: {
    width: 'fit-content',
    background: '#E61C34',
    borderRadius: 5,
    textAlign: 'center',
    color: '#ffffff',
    padding: '0 3px',
    fontSize: '0.60em',
    fontWeight: 600,
    userSelect: 'none',
  },
  navBar: {
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'center !important',
    width: '100%',
  },
}))


const LinkContainer = ({ children, className, style }) => {
  return (
    <div style={{ width: '100%', ...style }}>
      <div className={className}>
        {children}
      </div>
    </div>
  )
}

const IconWrapper = ({ children, className, style = {} }) => {
  return (
    <div style={{ ...style }} className={className}>
      {children}
    </div>
  )
}


const NavLinkWrapper = (props) => {
  const {
    path,
    name,
    icon,
    active,
    textClass,
    iconClass,
    activeClass,
    minifyItemsClass,
    minify,
    onClick = () => { },
    preventDefault = false,
  } = props

  const isActivePath = (path, current) => {
    const _path = (path && path.split("?").length > 0) ? path.split("?")[0] : path
    return _path === current
  }

  const preventLink = (e) => {
    if (preventDefault) e.preventDefault()
  }
  
  return (
    <React.Fragment>
      {!minify && (
        <div onClick={onClick} className={classNames(textClass, isActivePath(path, active) ? activeClass : '')}>
          <Link onClick={onClick} to={path} style={{ display: 'flex', alignItems: 'center' }}>
            <IconWrapper onClick={onClick} style={{ textAlign: 'right', width: 50, display: 'flex', justifyContent: 'center', marginRight: 5 }} className={iconClass}>
              {icon}
            </IconWrapper>
            <span style={{ paddingRight: 15 }} onClick={onClick}>{name}</span>
          </Link>
        </div>
      )}
      {minify && (
        <div onClick={onClick} className={classNames(minifyItemsClass, isActivePath(path, active) ? activeClass : '')}>
          <Link to={path} onClick={preventLink}>
            <IconButton
              size="medium"
              style={{width: 55, height: 55}}
            >
              {icon}
            </IconButton>
          </Link>
        </div>
      )}
    </React.Fragment>
  )
}

const SideBarLeft = (props) => {
  const {
    user,
    signoutUserRequest,
    subscribeRequest,
    loading,
    pollNotifRequest,
    count = 0,
    // theme,
    minify,
    setBuzzModalStatus,
    intentBuzz,
    fromIntentBuzz,
    setRefreshRouteStatus,
    generateStyles,
  } = props
  const { username, is_subscribe } = user || ''
  const [open, setOpen] = useState(false)
  const [openTheme, setOpenTheme] = useState(false)
  const [openSwitchModal, setOpenSwitchModal] = useState(false)
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const classes = useStyles()
  const location = useLocation()
  const history = useHistory()
  const { pathname } = location
  const isBuzzIntent = pathname.match(/^\/intent\/buzz/)
  const timestamp = moment().unix()
  const [openMoreMenu, setOpenMoreMenu] = useState(false)
  const moreMenuRef = useRef()
  const theme = getUserTheme()
  const [ceramicUser, setCeramicUser] = useState(null)
  const [userAvatarUrl, setUserAvatarUrl] = useState('')
  const [fetchingUser, setFetchingUser] = useState(false)

  useEffect(() => {
    if(checkCeramicLogin(username)) {
      setFetchingUser(true)
      getBasicProfile(username)
        .then((res) => {
          setCeramicUser(res)
          setUserAvatarUrl(getIpfsLink(res.images.avatar))
          setFetchingUser(false)
        })
    }
    // eslint-disable-next-line
  }, [user])
  const [activeView, setActiveView] = useState('Home')

  const showThemeModal = () => {
    handleClickCloseOpenMoreMenu()
    setOpenTheme(true)
  }

  const showSwitchModal = () => {
    handleClickCloseOpenMoreMenu()
    setOpenSwitchModal(true)
  }

  const showSettingsModal = () => {
    handleClickCloseOpenMoreMenu()
    setOpenSettingsModal(true)
  }

  useEffect(() => {
    if (isBuzzIntent || fromIntentBuzz || (intentBuzz && intentBuzz.text)) {
      setOpen(true)
    }
    pollNotifRequest()
    // eslint-disable-next-line
  }, [])

  const handleClickLogout = () => {
    signoutUserRequest()
    generateStyles(getTheme('light'))
    history.push('/')
  }

  const handleClickSubscribe = () => {
    subscribeRequest()
  }

  const handleClickBuzz = () => {
    setBuzzModalStatus(true)
    setOpen(true)
  }

  const onHide = () => {
    setBuzzModalStatus(false)
    setOpen(false)
    if (isBuzzIntent) {
      history.push('/')
    }
  }

  const onHideTheme = () => {
    setOpenTheme(false)
  }

  const onHideSwitchModal = () => {
    setOpenSwitchModal(false)
  }

  const onHideSettingsModal = () => {
    setOpenSettingsModal(false)
  }

  const addUserCallBack = () => {
    setOpenLoginModal(true)
    onHideSwitchModal()
  }

  const hideLoginModal = () => {
    setOpenLoginModal(false)
  }

  const refreshLatestRouteData = () => {
    if(pathname.match(/^\/latest/)){
      setRefreshRouteStatus("latest",timestamp)
    }
  }

  const refreshTrendingRouteData = () => {
    if(pathname.match(/^\/trending/)){
      setRefreshRouteStatus("trending",timestamp)
    }
  }

  const refreshHomeRouteData = () => {
    if(pathname === "/"){
      setRefreshRouteStatus("home",timestamp)
    }
  }

  const handleClickOpenMoreMenu = () => {
    setOpenMoreMenu(true)
  }

  const handleClickCloseOpenMoreMenu = () => {
    setOpenMoreMenu(false)
  }

  const handelClickItem = (name) => {
    switch(name) {
    case 'home':
      setActiveView(name)
      refreshHomeRouteData()
      break
    case 'trending':
      setActiveView(name)
      refreshTrendingRouteData()
      break
    case 'latest':
      setActiveView(name)
      refreshLatestRouteData()
      break
    case 'more':
      setActiveView(name)
      handleClickOpenMoreMenu()
      break
    default:
      setActiveView(name)
      return
    }
  }

  useEffect(() => {
    switch(location.pathname) {
    case '/':
      setActiveView('home')
      break
    case '/trending':
      setActiveView('trending')
      break
    case '/latest':
      setActiveView('latest')
      break
    case '/notifications':
      setActiveView('notifications')
      break
    case '/profile':
      setActiveView('profile')
      break
    case `/@${username}/wallet`:
      setActiveView('wallet')
      break
    default:
      return
    }

    // eslint-disable-next-line
  }, [activeView])

  useEffect(() => {
    generateStyles(getTheme(theme))
    // eslint-disable-next-line
  }, [theme])

  const NavLinks = [
    {
      name: 'Home',
      path: "/",
      icon: activeView === 'home' ? <HomeIcon type='fill'/> : <HomeIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('home'),
    },
    {
      name: 'Trending',
      path: '/trending',
      icon: activeView === 'trending' ? <TrendingIcon type='fill'/> : <TrendingIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('trending'),
    },
    {
      name: 'Latest',
      path: "/latest",
      icon: activeView === 'latest' ? <LatestIcon type='fill'/> : <LatestIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('latest'),
    },
    {
      name: 'Notifications',
      path: `/notifications`,
      icon: activeView === 'notifications' ? <Badge badgeContent={count.unread || 0} color="secondary" overlap="rectangular"><NotificationsIcon type='fill'/></Badge> : <Badge badgeContent={count.unread || 0} color="secondary" overlap="rectangular"><NotificationsIcon type='outline'/></Badge>,
      onClick: () => handelClickItem('notifications'),
    },
    {
      name: 'Profile',
      path: `/@${username}/t/buzz?ref=nav`,
      icon: activeView === 'profile' ? <ProfileIcon type='fill'/> : <ProfileIcon type='outline'/>,
      onClick: () => handelClickItem('profile'),
    },
    {
      name: 'Wallet',
      icon: activeView === 'wallet' ? <WalletIcon type='fill'/> : <WalletIcon type='outline'/>,
      path: `/@${username}/wallet`,
      onClick: () => handelClickItem('wallet'),
    },
    {
      name: 'More'  ,
      icon: <div className={classes.moreButton} ref={moreMenuRef}><MoreIcon /></div>,
      path: '#',
      preventDefault: true,
      onClick: handleClickOpenMoreMenu,
    },
  ]

  const CeramicAccountNavLinks = [
    {
      name: 'Home',
      path: "/",
      icon: activeView === 'home' ? <HomeIcon type='fill'/> : <HomeIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('home'),
    },
    {
      name: 'Trending',
      path: '/trending',
      icon: activeView === 'trending' ? <TrendingIcon type='fill'/> : <TrendingIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('trending'),
    },
    {
      name: 'Latest',
      path: "/latest",
      icon: activeView === 'latest' ? <LatestIcon type='fill'/> : <LatestIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('latest'),
    },
    {
      name: 'Profile',
      path: `/@${username}/t/buzz?ref=nav`,
      icon: activeView === 'profile' ? <ProfileIcon type='fill'/> : <ProfileIcon type='outline'/>,
      onClick: () => handelClickItem('profile'),
    },
    {
      name: 'More'  ,
      icon: <div className={classes.moreButton} ref={moreMenuRef}><MoreIcon /></div>,
      path: '#',
      preventDefault: true,
      onClick: handleClickOpenMoreMenu,
    },
  ]

  const ceramicStyles = ceramicUser ? { alignItems: 'center', justifyContent: 'center', marginLeft: 25 } : {}

  return (
    <React.Fragment>
      <div style={{ height: '100vh', width: '100%' }}>
        <Nav className='flex-row' style={{ width: '100%' }}>
          <LinkContainer className={classes.navBar} style={{ padding: !minify ? '0 12px' : 0 }}>
            <NavbarBrand href="/" style={{ display: 'grid', gridAutoFlow: minify ? 'row' : 'column', placeItems: 'center', marginRight: 0, alignSelf: minify ? 'center' : 'flex-start', paddingLeft: !minify ? 0 : 0, transform: minify ? 'translateY(-5px)' : 0 }}>
              <div style={{ paddingTop: !minify ? 5 : 0, ...(!minify ? { marginLeft: 15, marginRight: 15 } : { marginLeft: 0 }) }}>
                {theme === 'light' && !minify && (<BrandIcon />)}
                {(theme === 'night' || theme === 'gray') && !minify && (<BrandIconDark />)}
                {minify &&
                  <IconButton>
                    <CircularBrandIcon />
                  </IconButton>}
              </div>
              {config.VERSION.includes('dev') &&
                <div className={classes.betaTitleContainer} style={{ alignSelf: 'flex-end' }}>
                  {<span className={classes.betaTitle}>BETA</span>}
                </div>}
            </NavbarBrand>
            <div className={classes.navLinkContainer} style={{ paddingLeft: !minify ? 0 : 0, paddingRight: !minify ? 45 : 0, marginTop: !minify ? 12 : 0 }}>
              {!checkCeramicLogin() ?
                NavLinks.map((item) => (
                  <NavLinkWrapper
                    minify={minify}
                    minifyItemsClass={classes.minifyItems}
                    key={`${item.path}-side-${Math.random(0, 100)}`}
                    {...item}
                    textClass={classes.items}
                    iconClass={classes.inline}
                    activeClass={classes.activeItem}
                    active={location.pathname}
                  />
                )) :
                CeramicAccountNavLinks.map((item) => (
                  <NavLinkWrapper
                    minify={minify}
                    minifyItemsClass={classes.minifyItems}
                    key={`${item.path}-side-${Math.random(0, 100)}`}
                    {...item}
                    textClass={classes.items}
                    iconClass={classes.inline}
                    activeClass={classes.activeItem}
                    active={location.pathname}
                  />
                ))}
              {!is_subscribe && !minify && !ceramicUser && !fetchingUser && (
                <ContainedButton
                  transparent={true}
                  fontSize={14}
                  label="Subscribe"
                  loading={loading}
                  className={classes.sideBarButton}
                  onClick={handleClickSubscribe}
                />
              )}
              {!minify && (
                <ContainedButton
                  style={{ height: 45, marginTop: 10 }}
                  fontSize={14}
                  label="Buzz"
                  className={classes.sideBarButton}
                  onClick={handleClickBuzz}
                />
              )}
              {minify && (
                <IconButton
                  style={{display: 'none'}}
                  size="medium"
                  classes={{
                    root: classes.buzzButton,
                  }}
                  onClick={handleClickBuzz}
                >
                  <CreateBuzzIcon />
                </IconButton>
              )}
              {!fetchingUser && !minify && (
                <div className={classes.logoutButton}>
                  <div className={classes.avatarWrapper} onClick={handleClickLogout}>
                    <div style={{ display: 'flex', width: '100%' }}>
                      <React.Fragment>
                        <Avatar author={username} avatarUrl={userAvatarUrl} />
                        <div style={{ display: 'flex', width: '100%', paddingTop: !ceramicUser ? 5 : 0 }}>
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', ...ceramicStyles }}>
                            <div style={{ padding: 0, textAlign: 'center', verticalAlign: 'center' }}>
                              <p className={classes.logoutLabel} styles={{ fontSize: ceramicUser ? 24 : 14 }}>Logout</p>
                              {!ceramicUser && <p className={classes.logoutUsername}>{username}</p>}
                            </div>
                            <div style={{ display: 'flex', paddingTop: !ceramicUser ? 6 : 0, marginLeft: 15 }} className={classes.logoutIcon}>
                              <PowerIcon />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {minify && (
              <div className={classes.bottomMinify}>
                <IconButton
                  size="medium"
                  classes={{
                    root: classes.logoutButtonMinify,
                  }}
                  onClick={handleClickLogout}
                >
                  <PowerIcon top={0} />
                </IconButton>
              </div>
            )}
          </LinkContainer>
        </Nav>
      </div>
      <BuzzFormModal show={open} onHide={onHide} />
      <ThemeModal show={openTheme} onHide={onHideTheme} />
      <SwitchUserModal show={openSwitchModal} onHide={onHideSwitchModal} addUserCallBack={addUserCallBack} />
      <SettingsModal show={openSettingsModal} onHide={onHideSettingsModal} />
      <LoginModal show={openLoginModal} onHide={hideLoginModal} />
      <MoreMenu
        themeModal={openTheme}
        switchUserModal={openSwitchModal}
        anchor={moreMenuRef}
        className={classes.menu}
        open={openMoreMenu}
        onClose={handleClickCloseOpenMoreMenu}
        items={[
          {
            onClick: showThemeModal,
            text: 'Theme',
            visible: true,
          },
          {
            onClick: showSwitchModal,
            text: 'Switch Account',
            visible: !ceramicUser ? true : false,
          },
          {
            onClick: showSettingsModal,
            text: 'Settings',
            visible: true,
          },
        ]}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  loading: pending(state, 'SUBSCRIBE_REQUEST'),
  count: state.polling.get('count'),
  theme: state.settings.get('theme'),
  intentBuzz: state.auth.get("intentBuzz"),
  fromIntentBuzz: state.auth.get('fromIntentBuzz'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    signoutUserRequest,
    subscribeRequest,
    pollNotifRequest,
    setBuzzModalStatus,
    setRefreshRouteStatus,
    generateStyles,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBarLeft)