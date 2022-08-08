import React, { useEffect, useState, useRef } from 'react'
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
  // BuzzIcon,
  SearchIcon,
  WalletIcon,
} from 'components/elements'
import {
  BuzzFormModal,
  ThemeModal,
  SwitchUserModal,
  LoginModal,
  SearchField,
  NotificationFilter,
  MoreMenu,
} from 'components'
import { useLocation } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { clearNotificationsRequest } from 'store/profile/actions'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { broadcastNotification, setRefreshRouteStatus } from 'store/interface/actions'
import { signoutUserRequest, setIntentBuzz } from 'store/auth/actions'
import { searchRequest, clearSearchPosts } from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import queryString from 'query-string'
import moment from 'moment'
import SettingsModal from 'components/modals/SettingsModal'
import CreateBuzzIcon from 'components/elements/Icons/CreateBuzzIcon'
import MoreIcon from 'components/elements/Icons/MoreIcon'
import { checkCeramicLogin, checkForCeramicAccount, getBasicProfile } from 'services/ceramic'
import { generateStyles } from 'store/settings/actions'
import { getTheme } from 'services/theme'

const useStyles = createUseStyles(theme => ({
  main: {
    marginTop: 55,
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
  searchButton: {
    marginTop: 5,
    float: 'right',
    '& svg': {
      '& path': {
        stroke: theme.left.sidebar.items.color,
      },
    },
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
    width: '100%',
  },
  searchDiv: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  avatarWrapper: {
    paddingLeft: "10px",
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
    '& a': {
      color: theme.font.color,
    },
  },
  moreButton: {
    display: 'flex',
    color: theme.left.sidebar.items.color,

    '&:hover': {
      color: '#E53935',
    },
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
    searchRequest,
    clearSearchPosts,
    setRefreshRouteStatus,
    generateStyles,
  } = props

  const history = useHistory()
  const lastLocation = useLastLocation()
  const location = useLocation()

  const params = queryString.parse(location.search) || ''
  const timestamp = moment().unix()

  const { is_authenticated, username } = user
  const avatarRef = React.useRef()
  const [openAvatarMenu, setOpenAvatarMenu] = useState(false)
  const [openTheme, setOpenTheme] = useState(false)
  const [openSwitchModal, setOpenSwitchModal] = useState(false)
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [disableSearchTips, setDisableSearchTips] = useState(false)
  const query = params.q === undefined ? '' : params.q
  const [searchkey, setSearchkey] = useState(query)
  const [openMoreMenu, setOpenMoreMenu] = useState(false)
  const moreMenuRef = useRef()
  const classes = useStyles()
  const [avatarUrl, setAvatarUrl] = useState(null)

  const [activeView, setActiveView] = useState('home')

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

  if(pathname.match(/\/follow\/followers/g) || pathname.match(/\/follow\/following/g) ||
    pathname.match(/\/lists\/muted\/users/g) || pathname.match(/\/lists\/muted\/followed/g) ||
    pathname.match(/\/lists\/blacklisted\/users/g) || pathname.match(/\/lists\/blacklisted\/followed/g)) {
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

  const floatStyle = {
    padding: 8,
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

  const handelClickItem = (name) => {
    setActiveView(name)
    switch(name) {
    case 'Home':
      refreshHomeRouteData()
      break
    case 'Trending':
      refreshTrendingRouteData()
      break
    case 'Latest':
      refreshLatestRouteData()
      break
    case 'More':
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

  useEffect(() => {
    if(checkForCeramicAccount(username)) {
      getBasicProfile(username).then((ceramicProfile) => {
        const avatar = ceramicProfile.images?.avatar.replace('ipfs://', '')
        setAvatarUrl(`https://ipfs.io/ipfs/${avatar}`)
      })
    }
    // eslint-disable-next-line
  }, [username])

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

  const isActivePath = (path, current) => {
    const _path = (path && path.split("?").length > 0) ? path.split("?")[0] : path
    return _path === current
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
        if (typeof result === 'object' && result.success) {
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

  const showSettingsModal = () => {
    handleClickCloseOpenMoreMenu()
    setOpenSettingsModal(true)
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

  const handleDiscordClick = () => {
    window.open('https://discord.gg/kCZGPs7', '_blank')
  }

  const NavigationBottom = () => {
    return (
      <Navbar className={classes.navBottom} fixed="bottom">
        <div style={{ width: '100%' }}>
          <Nav className="justify-content-center">
            {!checkCeramicLogin() ?
              NavLinks.map((item, index) => (
                <NavLinkWrapper key={index} item={item} active={location.pathname} />
              )) :
              CeramicAccountNavLinks.map((item, index) => (
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
            style={{width: 55, height: 55}}
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
        className={classes.menu}
      >
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/@${username}`}>Profile</MenuItem>
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/org/en/getstarted`}>Get Started</MenuItem>
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/org/en/tos`}>Terms of Service</MenuItem>
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/developers`}>Developers</MenuItem>
        <MenuItem onClick={handleDiscordClick}>Discord Channel</MenuItem>
        <MenuItem onClick={handleClickSignout}>Logout</MenuItem>
      </Menu>
    )
  }

  const handleClickSignout = () => {
    handleCloseAvatar()
    signoutUserRequest()
    generateStyles(getTheme('light'))
  }


  const handleSetBuzzIntent = () => {
    if (params.text) {
      const payload = { ...params, hashtags: params.tags }
      setIntentBuzz(payload)
    }
  }

  const handleClickSearchButton = () => {
    history.push(`/search/posts?q=`)
  }

  const onChangeSearch = (e) => {
    const { target } = e
    const { value } = target
    setSearchkey(value)
  }


  const handleSearchKey = (e) => {
    if(e.key === 'Enter') {
      clearSearchPosts()
      searchRequest(searchkey)
      setDisableSearchTips(true)
      history.push(`/search/posts?q=${encodeURIComponent(searchkey)}`)
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

  useEffect(() => {
    if(title !== 'Search'){
      setSearchkey('')
      clearSearchPosts()
    }
    // eslint-disable-next-line
  }, [title])


  return (
    <React.Fragment>
      <div className={classes.main}>
        <React.Fragment>
          <Navbar className={classes.navTop} fixed="top">
            <Navbar.Brand className={classes.navTitle}>
              {title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
                <IconButton onClick={handleClickBackButton} size="small">
                  <BackArrowIcon />
                </IconButton>
              )}
              {title !== 'Search' && (<span className={classes.title}>{title}</span>)}
              {title === 'Notifications' && <NotificationFilter />}
            </Navbar.Brand>
            {title === 'Search' && (
              <div className={classes.searchDiv}>
                <SearchField
                  disableTips={disableSearchTips}
                  iconTop={-2}
                  searchWrapperClass={classes.searchWrapper}
                  style={{ fontSize: 16, height: 35 }}
                  value={searchkey}
                  onKeyDown={handleSearchKey}
                  onChange={onChangeSearch}
                  placeholder="Search D.Buzz"
                  autoFocus
                />
              </div>
            )}
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
            {is_authenticated && title !== 'Search' &&
          (<React.Fragment>
            <IconButton onClick={handleClickSearchButton} size="small"
              className={classes.searchButton}>
              <SearchIcon/>
            </IconButton>
            <div className={classes.avatarWrapper}>
              <span ref={avatarRef}><Avatar onClick={handleClickAvatar} height={35} author={username} avatarUrl={avatarUrl} /></span>
            </div>
          </React.Fragment>)}
          </Navbar>
          <React.Fragment>
            {is_authenticated && (
              <Fab onClick={handleOpenBuzzModal} size="medium" color="secondary" aria-label="add" style={floatStyle}>
                <CreateBuzzIcon />
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
      <SettingsModal show={openSettingsModal} onHide={onHideSettingsModal} />
      <LoginModal show={openLoginModal} onHide={hideLoginModal} fromIntentBuzz={fromIntentBuzz} buzzIntentCallback={handleSetBuzzIntent} />
      <MoreMenu 
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
            visible: !checkForCeramicAccount(user.username) ? true : false,
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
    searchRequest,
    clearSearchPosts,
    setRefreshRouteStatus,
    generateStyles,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MobileAppFrame)