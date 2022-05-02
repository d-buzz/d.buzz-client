import React, { useState, useEffect, useRef } from 'react'
import Nav from 'react-bootstrap/Nav'
import NavbarBrand from 'react-bootstrap/NavbarBrand'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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
import { pollNotifRequest } from 'store/polling/actions'
import moment from 'moment'
import SettingsModal from 'components/modals/SettingsModal'
import { getTheme } from 'services/helper'
import config from 'config'
import CreateBuzzIcon from 'components/elements/Icons/CreateBuzzIcon'
import MoreIcon from 'components/elements/Icons/MoreIcon'

const useStyles = createUseStyles(theme => ({
  items: {
    fontFamily: 'Segoe-Bold',
    width: 'max-content',
    fontSize: 18,
    padding: 8,
    marginBottom: 8,
    ...theme.left.sidebar.items.icons,
    '& a': {
      color: theme.left.sidebar.items.color,
      textDecoration: 'none',
      padding: 6,
      '&:hover': {
        color: '#e53935',
      },
    },
    '&:hover': {
      ...theme.left.sidebar.items.hover,
      borderRadius: '50px 50px',
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
    marginTop: 15,
    fontSize: 14,
  },
  bottom: {
    position: 'absolute',
    bottom: 15,
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
    bottom: 15,
    ...theme.left.sidebar.bottom.wrapperMinify,
  },
  inline: {
    display: 'inline-block',
  },
  avatarWrapper: {
    minHeight: 55,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
  },
  sideBarButton: {
    width: '120%',
    marginBottom: 10,
  },
  logoutLabel: {
    fontWeight: 'bold',
    margin: 0,
    padding: 0,
    paddingLeft: 5,
    fontSize: 13,
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
    fontSize: '0.65em',
    fontWeight: 600,
    userSelect: 'none',
  },
  navBar: {
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'center !important',
  },
}))


const LinkContainer = ({ children, className }) => {
  return (
    <div style={{ width: 'auto' }}>
      <div className={className}>
        {children}
      </div>
    </div>
  )
}

const IconWrapper = ({ children, className, style = {} }) => {
  return (
    <div style={{ paddingLeft: 5, paddingRight: 10, ...style }} className={className}>
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
          <Link to={path} style={{ display: 'flex', alignItems: 'center' }}>
            <IconWrapper style={{ textAlign: 'right' }} className={iconClass}>{icon}</IconWrapper>
            {name}
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
  const theme = getTheme()
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
    setActiveView(name)
    switch(name) {
    case 'home':
      refreshHomeRouteData()
      break
    case 'trending':
      refreshTrendingRouteData()
      break
    case 'latest':
      refreshLatestRouteData()
      break
    case 'more':
      handleClickOpenMoreMenu()
      break
    default:
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
      setActiveView(`/@${username}/wallet`)
      break
    default:
      return
    }

    // eslint-disable-next-line
  }, [])

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
      icon: activeView === 'notifications' ? <Badge badgeContent={count.unread || 0} color="secondary"><NotificationsIcon type='fill'/></Badge> : <Badge badgeContent={count.unread || 0} color="secondary"><NotificationsIcon type='outline'/></Badge>,
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

  return (
    <React.Fragment>
      <div style={{ height: '100vh', width: '50px' }}>
        <Nav className='flex-row'>
          <LinkContainer className={classes.navBar}>
            <NavbarBrand href="/" style={{marginRight: 0, alignSelf: minify ? 'center' : 'flex-start'}}>
              <div style={{ paddingTop: 20, ...(!minify ? { marginLeft: 15, marginRight: 15 } : { marginLeft: 0 }) }}>
                {theme === 'light' && !minify && (<BrandIcon />)}
                {theme === 'dark' && !minify && (<BrandIconDark />)}
                {minify && config.VERSION.includes('dev') ? (<CircularBrandIcon />) : minify && (<IconButton><CircularBrandIcon /></IconButton>)}
              </div>
            </NavbarBrand>
            {config.VERSION.includes('dev') &&
              <div className={classes.betaTitleContainer} style={{width: !minify ? 180 : 40}}>
                {<span className={classes.betaTitle}>BETA</span>}
              </div>}
            <div className={classes.navLinkContainer}>
              {NavLinks.map((item) => (
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
              {!is_subscribe && !minify && (
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
                  style={{ height: 45 }}
                  fontSize={14}
                  label="Buzz"
                  labelStyle={{ paddingTop: 10 }}
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
            </div>
            {!minify && (
              <div className={classes.bottom}>
                <div className={classes.avatarWrapper} onClick={handleClickLogout}>
                  <Row>
                    <React.Fragment>
                      <Col xs="auto">
                        <div style={{ display: 'table-cell', width: '100%', height: '100%' }}>
                          <div style={{ display: 'inline-flex', top: '50%', bottom: '50%' }}>
                            <Avatar author={username} />
                          </div>
                        </div>
                      </Col>
                      <Col style={{ paddingLeft: 5 }}>
                        <Row style={{ padding: 0 }}>
                          <Col xs={8} style={{ padding: 0, textAlign: 'center', verticalAlign: 'center' }}>
                            <p className={classes.logoutLabel}>Logout</p>
                            <p className={classes.logoutUsername}>@{username}</p>
                          </Col>
                          <Col style={{ padding: 0 }} className={classes.logoutIcon}>
                            <PowerIcon top={12} />
                          </Col>
                        </Row>
                      </Col>
                    </React.Fragment>
                  </Row>
                </div>
              </div>
            )}
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
          },
          {
            onClick: showSwitchModal,
            text: 'Switch Account',
          },
          {
            onClick: showSettingsModal,
            text: 'Settings',
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
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBarLeft)