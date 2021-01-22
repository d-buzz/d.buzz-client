import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import { useHistory } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import IconButton from '@material-ui/core/IconButton'
import Nav from 'react-bootstrap/Nav'
import Badge from '@material-ui/core/Badge'
import classNames from 'classnames'
import { useLastLocation } from 'react-router-last-location'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { pollNotifRequest } from 'store/polling/actions'
import {
  BackArrowIcon,
  HomeIcon,
  TrendingIcon,
  LatestIcon,
  NotificationsIcon,
  ProfileIcon,
  ContainedButton,
  Avatar,
  BuzzIcon,
  SunMoonIcon,
} from 'components/elements'
import {
  BuzzFormModal,
  ThemeModal,
  SwitchUserModal,
  LoginModal,
} from 'components'
import { useLocation } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { clearNotificationsRequest } from 'store/profile/actions'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { broadcastNotification } from 'store/interface/actions'
import { signoutUserRequest, setIntentBuzz } from 'store/auth/actions'
import { pending } from 'redux-saga-thunk'
import queryString from 'query-string'

const useStyles = createUseStyles(theme => ({
  main: {
    marginTop: 55,
  },
  avatarMenuWrapper: {
    backgroundColor: `${theme.background.primary} !important`,
    ...theme.font,
  },
  minifyItems: {
    textAlign: 'left',
    width: 60,
    marginBottom: 5,
    ...theme.left.sidebar.items.icons,
    '& a': {
      color: theme.left.sidebar.items.color,
      textDecoration: 'none',
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
        stroke: '#e53935',
      },
    },
  },
  walletButton: {
    marginTop: 5,
    float: 'right',
  },
  navTop: {
    borderBottom: theme.border.primary,
    backgroundColor: theme.background.primary,
    zIndex: 2,
    overflow: 'hidden',
    width: '100%',
    display: 'flex',
  },
  navBottom: {
    borderTop: theme.border.primary,
    backgroundColor: theme.background.primary,
    zIndex: 2,
    overflow: 'hidden',
    width: '100%',
  },
  navTitle: {
    fontFamily: 'Roboto, sans-serif',
    display: 'inline-block',
    verticalAlign: 'top',
    ...theme.navbar.icon,
    flexGrow: 1,
  },
  trendingWrapper: {
    width: '100%',
    minHeight: '100vh',
    border: '1px solid #e6ecf0',
  },
  clearPadding: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    display: 'inline-block',
    marginLeft: 5,
    fontFamily: 'Segoe-Bold',
    fontSize: 18,
    color: theme.font.color,
  },
  searchWrapper: {
    padding: 0,
    margin: 0,
  },
  notes: {
    ...theme.font,
  },
  fab: {
    margin: 0,
    top: 'auto',
    left: 20,
    bottom: 20,
    right: 'auto',
    position: 'absolute',
  },
  separator: {
    height: 200,
    widt: '100%',
  },
}))

const MobileAppFrame = (props) => {

  const {
    pathname,
    route,
    user,
    pollNotifRequest,
    count = 0,
    signoutUserRequest,
    loading,
    broadcastNotification,
    clearNotificationsRequest,
    setIntentBuzz,
    fromIntentBuzz,
  } = props
  const { is_authenticated, username } = user
  const avatarRef = React.useRef()
  const [openAvatarMenu, setOpenAvatarMenu] = useState(false)
  const [openTheme, setOpenTheme] = useState(false)
  const [openSwitchModal, setOpenSwitchModal] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const classes = useStyles()

  const history = useHistory()
  const lastLocation = useLastLocation()
  const location = useLocation()

  const [open, setOpen] = useState(false)


  const { search } = location
  const params = queryString.parse(search) || ''

  let title = 'Home'

  const showThemeModal = () => {
    setOpenTheme(true)
  }

  if (pathname.match(/(\/c\/)/)) {
    title = 'Buzz'
  }

  if (pathname.match(/^\/trending/)) {
    title = 'Trending'
  }

  if (pathname.match(/^\/latest/)) {
    title = 'Latest'
  }

  if (!pathname.match(/(\/c\/)/) && pathname.match(/^\/@/)) {
    title = 'Profile'
  }

  if (pathname.match(/(\/notifications)/)) {
    title = 'Notifications'
  }

  if (pathname.match(/(\/tags?)/)) {
    title = 'Tags'
  }

  if (pathname.match(/(\/search?)/)) {
    title = 'Search'
  }

  if (pathname.match(/\/follow\/followers/g) || pathname.match(/\/follow\/following/g)) {
    const items = pathname.split('/')
    title = `Profile / ${items[1]}`
  }

  const handleClickBackButton = () => {
    if (!lastLocation) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }

  const floatStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 100,
    left: 'auto',
    position: 'fixed',
    zIndex: 500,
    backgroundColor: '#e61c34',
  }

  // const avatarStyle = { float: 'right' }

  const NavLinks = [
    {
      name: 'Home',
      path: '/',
      icon: <HomeIcon />,
    },
    {
      name: 'Trending',
      path: '/trending',
      icon: <TrendingIcon />,
    },
    {
      name: 'Latest',
      path: '/latest',
      icon: <LatestIcon />,
    },
    {
      name: 'Notifications',
      path: `/notifications`,
      icon: <Badge badgeContent={count.unread || 0} color="secondary"><NotificationsIcon /></Badge>,
    },
    {
      name: 'Profile',
      path: `/@${username}/t/buzz?ref=nav`,
      icon: <ProfileIcon />,
    },
    {
      name: 'Display',
      icon: <SunMoonIcon />,
      onClick: showThemeModal,
      type: 'action',
    },
  ]
  const isActivePath = (path, current) => {
    return path === current
  }

  const handleOpenBuzzModal = () => {
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
  }

  const handleClickAvatar = () => {
    setOpenAvatarMenu(true)
  }

  const handleCloseAvatar = () => {
    setOpenAvatarMenu(false)
  }

  const onHideTheme = () => {
    setOpenTheme(false)
  }

  const handleClearNotification = () => {
    clearNotificationsRequest()
      .then(result => {
        if (result.success) {
          broadcastNotification('success', 'Successfully marked all your notifications as read')
        } else {
          broadcastNotification('error', 'Failed marking all notifications as read')
        }
      })
  }

  const showSwitchModal = () => {
    setOpenAvatarMenu(false)
    setOpenSwitchModal(true)
  }

  const onHideSwitchModal = () => {
    setOpenSwitchModal(false)
  }

  const addUserCallBack = () => {
    setOpenLoginModal(true)
    onHideSwitchModal()
  }

  const hideLoginModal = () => {
    setOpenLoginModal(false)
  }

  const NavigationTop = () => {
    return (
      <Navbar className={classes.navTop} fixed="top">
        <Navbar.Brand className={classes.navTitle}>
          {title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
            <IconButton onClick={handleClickBackButton} size="small">
              <BackArrowIcon />
            </IconButton>
          )}
          {title !== 'Search' && (<span className={classes.title}>{title}</span>)}
          {title === 'Notifications' && count.unread !== 0 && (
            <ContainedButton
              fontSize={12}
              style={{ marginTop: -3 }}
              transparent={true}
              label="Clear"
              loading={loading}
              disabled={loading}
              className={classes.walletButton}
              onClick={handleClearNotification}
            />
          )}
        </Navbar.Brand>
        {is_authenticated &&
          (<div className={classes.avatarWrapper}><span ref={avatarRef}><Avatar onClick={handleClickAvatar} height={35} author={username} /></span></div>)}
      </Navbar>
    )
  }

  const NavigationBottom = () => {
    return (
      <Navbar className={classes.navBottom} fixed="bottom">
        <div style={{ width: '100%' }}>
          <Nav className="justify-content-center">
            {NavLinks.map((item, index) => (
              <NavLinkWrapper key={index} item={item} active={location.pathname} />
            ))}
          </Nav>
        </div>
      </Navbar>
    )
  }

  const NavLinkWrapper = ({ item, active }) => {
    return (
      <div onClick={item.onClick} className={classNames(classes.minifyItems, isActivePath(item.path, active) ? classes.activeItem : '')}>
        <Link to={item.path || '#'}>
          <IconButton
            size="medium"
          >
            {item.icon}
          </IconButton>
        </Link>
      </div>
    )
  }

  const AvatarMenu = () => {
    return (
      <Menu
        anchorEl={() => avatarRef.current}
        keepMounted
        open={openAvatarMenu}
        onClose={handleCloseAvatar}
        classes={{ root: classes.avatarMenuWrapper }}
      >
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/@${username}`}>Profile</MenuItem>
        <MenuItem onClick={showSwitchModal}>Switch Account</MenuItem>
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/developer`}>Developers</MenuItem>
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/org/en/getstarted`}>Get Started</MenuItem>
        <MenuItem onClick={handleClickSignout}>Logout</MenuItem>
      </Menu>
    )
  }

  const handleClickSignout = () => {
    handleCloseAvatar()
    signoutUserRequest()
  }


  const handleSetBuzzIntent = () => {
    const { text, url, tags } = params
    if (text) {
      setIntentBuzz(text, url, tags)
    }
  }

  useEffect(() => {
    if (is_authenticated) {
      pollNotifRequest()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (fromIntentBuzz && is_authenticated) {
      setOpen(true)
    }
    // eslint-disable-next-line
  }, [fromIntentBuzz, is_authenticated])

  return (
    <React.Fragment>
      <div className={classes.main}>
        <React.Fragment>
          <NavigationTop />
          <React.Fragment>
            {is_authenticated && (
              <Fab onClick={handleOpenBuzzModal} size="medium" color="secondary" aria-label="add" style={floatStyle}>
                <BuzzIcon />
              </Fab>
            )}
            <AvatarMenu />
            <div className={classes.main}>
              {renderRoutes(route.routes)}
            </div>
          </React.Fragment>
          <div className={classes.separator}></div>
          {is_authenticated && (<NavigationBottom />)}
          <BuzzFormModal show={open} onHide={handleCloseModal} />
        </React.Fragment>
      </div>
      <ThemeModal show={openTheme} onHide={onHideTheme} />
      <SwitchUserModal show={openSwitchModal} onHide={onHideSwitchModal} addUserCallBack={addUserCallBack} />
      <LoginModal show={openLoginModal} onHide={hideLoginModal} fromIntentBuzz={fromIntentBuzz} buzzIntentCallback={handleSetBuzzIntent} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  theme: state.settings.get('theme'),
  count: state.polling.get('count'),
  loading: pending(state, 'CLEAR_NOTIFICATIONS_REQUEST'),
  fromIntentBuzz: state.auth.get('fromIntentBuzz'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    pollNotifRequest,
    signoutUserRequest,
    broadcastNotification,
    clearNotificationsRequest,
    setIntentBuzz,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MobileAppFrame)
