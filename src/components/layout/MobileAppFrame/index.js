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
  // TrendingIcon,
  // LatestIcon,
  NotificationsIcon,
  // ProfileIcon,
  ContainedButton,
  Avatar,
  // BuzzIcon,
  SettingsIcon,
  SearchIcon,
  PocketIcon,
  MessageIcon,
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
// import MoreIcon from 'components/elements/Icons/MoreIcon'
import { checkCeramicLogin, checkForCeramicAccount } from 'services/ceramic'
import { generateStyles } from 'store/settings/actions'
import { getTheme } from 'services/theme'
import { Image } from 'react-bootstrap'
import ProfileIcon from 'components/elements/Icons/ProfileIcon'

const useStyles = createUseStyles(theme => ({
  // headerspacing: {
  //   width: '100%', 
  //   display: 'flex', 
  //   justifyContent: 'center', 
  //   alignItems: 'center',
  // },
  // titleContainerStyles: {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  // },
  main: {
    marginTop: 120,
  },
  maintest: {
    fontsize15: 15,
  },
  marginTop50: {
    marginTop: 50,
  },
  minifyItems: {
    textAlign: 'left',
    width: "100%",
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
        stroke: `${theme.font.color} !important`,
        fill: `${theme.font.color} !important`,
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
  padding16: {
    padding: "16px",
  },
  positionRelative: {
    position:'relative',
  },
  colorBlack: {
    color: "rgba(15,20,25,1.00)",
  },
  colorGray:{
    color: "rgb(83, 100, 113)",
  },
  fontsize17:{
    fontSize: 17,
  },
  fontsize15:{
    fontSize: 15,
  },
  fontWeight700:{
    fontWeight:700,
  },
  maxWidth100: {
    maxWidth: "100%",
  },
  width100:{
    width: "100%",
  },
  width30:{
    width: "30%",
  },
  marginTop8:{
    marginTop: 8,
  },
  navigationContainer: {
    height:"100vh",
    position:"fixed",
    zIndex:100,
    width: "100vw",
    backgroundColor:"rgba(0, 0, 0, 0.4)",
    transitionProperty: "background-color",
    transitionTimingFunction: "ease",
    transitionDuration: "250ms",
  },
  navigationMainContentsmallWidth: {
    transform:"translateX(0%)",
    maxWidth:"70%",
    transitionTimingFunction:"ease",
    width:"1px",
    height:"100vh",
    transitionDuration:"250ms",
    boxShadow:"rgba(101, 119, 134, 0.2) 0px 0px 8px, rgba(101, 119, 134, 0.25) 0px 1px 3px 1px",
    backgroundColor:"rgba(255,255,255,1.00)",
  },
  navigationMainContent: {
    transform:"translateX(0%)",
    maxWidth:"70%",
    transitionTimingFunction:"ease",
    minWidth:"280px",
    height:"100vh",
    transitionDuration:"250ms",
    boxShadow:"rgba(101, 119, 134, 0.2) 0px 0px 8px, rgba(101, 119, 134, 0.25) 0px 1px 3px 1px",
    backgroundColor:"rgba(255,255,255,1.00)",
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
    // marginRight: '0rem',
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
    paddingLeft: "0px",
    display: "flex",
    marginBottom: 10,
  },
  widthHalfWidth: {
    width: '50%',
  },
  width45Percent: {
    width: '45%',
  },
  paddingBottomEmpty: {
    paddingBottom: '0px !important',
  },
  paddingTop20: {
    paddingTop: '20px',
  },
  paddingTop13: {
    paddingTop: 13,
  },
  paddingBottom10: {
    paddingBottom: 10,
  },
  displayFlex: {
    display: 'flex',
  },
  marginEmpty: {
    margin: '0px',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  justifyContentEnd: {
    justifyContent: 'end',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  paddingLeft15:{
    paddingLeft: 15,
  },
  paddingBottom15:{
    paddingBottom: 15,
  },
  height5:{
    height:5,
  },
  fontSize17: {
    fontSize: 17,
  },
  fontWeightBold: {
    fontWeight: 'bolder',
  },
  background606060:{
    background: '#606060',
  },
  borderRadius10:{
    borderRadius:10,
  },
  flexDirectionColumn:{
    flexDirection: 'column',
  },
  flexDirectionRow:{
    flexDirection: 'row',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  hoverBackgroundGray:{
    '&:hover': {
      backgroundColor: 'rgba(15,20,25,0.1)',
    },
  },
  demoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    border: "1px solid black",
    borderRadius: '50%',
    width: '32px',
    marginRight:'34px',
  },
  marginRightNone: {
    marginRight: '0 !important',
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
  flexShrink1:{
    flexShrink:1,
  },
  outlineStyleNone:{
    outlineStyle:'none',
  },
  alignItemsStretch:{
    alignItems:'stretch',
  },
  lineHeight20:{
    lineHeight:'20px',
  },
  lineHeight24:{
    lineHeight:'24px',
  },
  fontsize20:{
    fontSize:18,
  },
  
  wordWrapBreakWord:{
    wordWrap:'break-word',
  },
  marginRight30:{
    marginRight:30,
  },
  justifyContentStart:{
    justifyContent:'start',
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

  const [activeView, setActiveView] = useState('trending')

  let title = 'Trending'

  const showThemeModal = () => {
    setOpenTheme(true)
  }

  if (pathname.match(/(\/c\/)/)) {
    title = 'Buzz'
  }

  if (pathname.match(/^\/home/)) {
    title = 'Home'
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
    if(pathname.match(/^\/home/)){
      setRefreshRouteStatus("home", timestamp)
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
    backgroundColor: '#000',
  }

  // const avatarStyle = { float: 'right' }
  const handelClickItemByTab = (name) => {
    setActiveView(name)
    if (name === 'trending') {
      history.replace('/trending')
      return
    }

    if (name === 'home') {
      history.replace('/home')
      refreshHomeRouteData()
      return
    }
   
  }
  const handelClickItem = (name) => {
    setActiveView(name)
    switch(name) {
    case 'Home':
      refreshLatestRouteData()
      break
    case 'Trending':
      refreshTrendingRouteData()
      break
    // case 'Latest':
    //   refreshLatestRouteData()
    //   break
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
      setActiveView('trending')
      break
    case '/home':
      setActiveView('home')
      break
    case '/latest':
      setActiveView('latest')
      break
    case '/message':
      setActiveView('message')
      break
    case '/notifications':
      setActiveView('notifications')
      break
    case '/profile':
      setActiveView('profile')
      break
    case '/search/posts':
      setActiveView('search')
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
      path: "/latest",
      icon: activeView === 'latest' ? <HomeIcon type='fill'/> : <HomeIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('latest'),
    },
    {
      name: 'Search',
      path: "/search/posts?q=",
      icon: activeView === 'search' ? <SearchIcon type='fill'/> : <SearchIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('search'),
    },
    // {
    //   name: 'Trending',
    //   path: '/',
    //   icon: activeView === 'trending' ? <TrendingIcon type='fill'/> : <TrendingIcon type='outline'/>,
    //   preventDefault: false,
    //   onClick: () => handelClickItem('trending'),
    // },
    // {
    //   name: 'Latest',
    //   path: "/latest",
    //   icon: activeView === 'latest' ? <LatestIcon type='fill'/> : <LatestIcon type='outline'/>,
    //   preventDefault: false,
    //   onClick: () => handelClickItem('latest'),
    // },
    {
      name: 'Notifications',
      path: `/notifications`,
      icon: activeView === 'notifications' ? <Badge badgeContent={count.unread || 0} color="secondary" style={{height:30}}><NotificationsIcon type='fill'/></Badge> : <Badge badgeContent={count.unread || 0} color="secondary" style={{height:30}}><NotificationsIcon type='outline'/></Badge>,
      onClick: () => handelClickItem('notifications'),
    },
    // {
    //   name: 'Profile',
    //   path: `/@${username}/t/buzz?from=nav`,
    //   icon: activeView === 'profile' ? <ProfileIcon type='fill'/> : <ProfileIcon type='outline'/>,
    //   onClick: () => handelClickItem('profile'),
    // },
    // {
    //   name: 'Wallet',
    //   icon: activeView === 'wallet' ? <WalletIcon type='fill'/> : <WalletIcon type='outline'/>,
    //   path: `/@${username}/wallet`,
    //   onClick: () => handelClickItem('wallet'),
    // },
    {
      name: 'Message',
      icon: activeView === 'message' ? <MessageIcon type='fill'/> : <MessageIcon type='outline'/>,
      path: `/message`,
      onClick: () => handelClickItem('message'),
    },
    // {
    //   name: 'More'  ,
    //   icon: <div className={classes.moreButton} ref={moreMenuRef}><MoreIcon /></div>,
    //   path: '#',
    //   preventDefault: true,
    //   onClick: handleClickOpenMoreMenu,
    // },
  ]


  const CeramicAccountNavLinks = [
    {
      name: 'Home',
      path: "/latest",
      icon: activeView === 'latest' ? <HomeIcon type='fill'/> : <HomeIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('latest'),
    },
    {
      name: 'Search',
      path: "/search/posts?q=",
      icon: activeView === 'search' ? <SearchIcon type='fill'/> : <SearchIcon type='outline'/>,
      preventDefault: false,
      onClick: () => handelClickItem('search'),
    },
    {
      name: 'Message',
      icon: activeView === 'message' ? <MessageIcon type='fill'/> : <MessageIcon type='outline'/>,
      path: `/message`,
      onClick: () => handelClickItem('message'),
    },
    // {
    //   name: 'Trending',
    //   path: '/',
    //   icon: activeView === 'trending' ? <TrendingIcon type='fill'/> : <TrendingIcon type='outline'/>,
    //   preventDefault: false,
    //   onClick: () => handelClickItem('trending'),
    // },
    // {
    //   name: 'Latest',
    //   path: "/latest",
    //   icon: activeView === 'latest' ? <LatestIcon type='fill'/> : <LatestIcon type='outline'/>,
    //   preventDefault: false,
    //   onClick: () => handelClickItem('latest'),
    // },
    // {
    //   name: 'Profile',
    //   path: `/@${username}/t/buzz?from=nav`,
    //   icon: activeView === 'profile' ? <ProfileIcon type='fill'/> : <ProfileIcon type='outline'/>,
    //   onClick: () => handelClickItem('profile'),
    // },
    // {
    //   name: 'More'  ,
    //   icon: <div className={classes.moreButton} ref={moreMenuRef}><MoreIcon /></div>,
    //   path: '#',
    //   preventDefault: true,
    //   onClick: handleClickOpenMoreMenu,
    // },
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
    // setOpenAvatarMenu(true)
    setShowSideBarNavigation(true)
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
      <div onClick={item.onClick} className={classNames(classes.minifyItems, isActivePath(item.path, active) ? classes.activeItem : '')+' '+classes.displayFlex+' '+classes.justifyContentCenter+' '+classes.alignItemsCenter}>
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

  const [showSideBarNavigation, setShowSideBarNavigation] = useState(false)
  return (
    <React.Fragment>
      <React.Fragment>
        <div className='maincontent'>
          <div onClick={() => setShowSideBarNavigation(false)} className={showSideBarNavigation?'navigationFullWidth':'navigationsmallWidth'}>
            <div className={showSideBarNavigation?'navigationMainContentFullwidth':'navigationMainContentNowidth'}>
              <div>
                <div className={classes.padding16+' '+classes.displayFlex+' '+classes.flexDirectionColumn}>
                  <div className={classes.displayFlex+' '+classes.justifyContentBetween+' '+classes.positionRelative}>
                    <div className={classes.width45Percent}>
                      <span ref={avatarRef}><Avatar onClick={handleClickAvatar} height={35} author={username} /></span>
                    </div> 
                    <div className={classes.demoContainer+' '+classes.displayFlex+' '+classes.justifyContentEnd+' '+classes.marginRightNone}>
                      <span ref={avatarRef}>+</span>
                    </div> 
                  </div>
                  <div className={classes.marginTop8+' '+classes.displayFlex+' '+classes.positionRelative}>
                    <div className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100+' '+classes.width100+' '+classes.flexDirectionColumn}>
                      <Link to={'#'} className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100} >
                        <span className={classes.colorBlack+' '+ classes.fontsize17+' '+classes.fontWeight700}>{username}</span>
                      </Link>
                      <Link to={'#'} className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100} >
                        <span className={classes.colorGray+' '+ classes.fontsize17+' '+classes.fontWeight700}>@{username}</span>
                      </Link>
                    </div>
                  </div>
                  <div className={classes.marginTop8+' '+classes.displayFlex+' '+classes.positionRelative}>
                    <div className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100+' '+classes.width100+' '+classes.flexDirectionColumn}>
                      <div className={classes.displayFlex+' '+classes.justifyContentStart}>
                        <div className={classes.marginRight30+' '+classes.fontsize15}><span className={classes.fontWeight700}>144</span> Following</div>
                        <div className={classes.fontsize15}><span className={classes.fontWeight700}>144</span> Followers</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* PROFILE TAB */}
                <div className={classes.marginTop8+' '+classes.displayFlex+' '+classes.positionRelative}>
                  <div className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100+' '+classes.width100}>
                    <div className={classes.padding16+' '+classes.displayFlex+' '+classes.justifyContentBetween+' '+classes.width100}>
                      <div className={classes.width30}> 
                        <div  className={classNames(classes.minifyItems)}>
                          <Link to={`/@${username}`}>
                            <ProfileIcon type='fill'/>
                          </Link>
                        </div>
                      </div>
                      <div onClick={()=>history.push(`/@${username}`)} className={classes.width100+' '+classes.lineHeight24+' '+classes.fontsize20+' '+classes.fontWeight700}>Profile</div>
                    </div>
                    
                  </div>
                </div>
                <div className={classes.displayFlex+' '+classes.positionRelative}>
                  <div className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100+' '+classes.width100}>
                    <div className={classes.padding16+' '+classes.displayFlex+' '+classes.justifyContentBetween+' '+classes.width100}>
                      <div className={classes.width30}>
                        <div  className={classNames(classes.minifyItems)}>
                          <Link to={'#'}>
                            <PocketIcon/>
                          </Link>
                        </div>
                      </div>
                      <div className={classes.width100+' '+classes.lineHeight24+' '+classes.fontsize20+' '+classes.fontWeight700}>Pockets</div>
                    </div>
                  </div>
                </div>
                <div className={classes.displayFlex+' '+classes.positionRelative}>
                  <div className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100+' '+classes.width100}>
                    <div className={classes.padding16+' '+classes.displayFlex+' '+classes.justifyContentBetween+' '+classes.width100}>
                      <div className={classes.width30}>
                        <div  className={classNames(classes.minifyItems)}>
                          <Link to={'#'}>
                            <WalletIcon type='fill'/>
                          </Link>
                        </div>
                      </div>
                      <div className={classes.width100+' '+classes.lineHeight24+' '+classes.fontsize20+' '+classes.fontWeight700}>Wallet</div>
                    </div>
                  </div>
                </div>
                <div className={classes.displayFlex+' '+classes.positionRelative}>
                  <div className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100+' '+classes.width100}>
                    <div className={classes.padding16+' '+classes.displayFlex+' '+classes.justifyContentBetween+' '+classes.width100}>
                      <div className={classes.width30}>
                        <div  className={classNames(classes.minifyItems)}>
                          <Link to={'#'}>
                            <MessageIcon type='fill'/>
                          </Link>
                        </div>
                      </div>
                      <div className={classes.width100+' '+classes.lineHeight24+' '+classes.fontsize20+' '+classes.fontWeight700}>Message</div>
                    </div>
                  </div>
                </div>
                <div className={classes.displayFlex+' '+classes.positionRelative}>
                  <div className={classes.displayFlex+' '+classes.positionRelative+' '+classes.maxWidth100+' '+classes.width100}>
                    <div className={classes.padding16+' '+classes.displayFlex+' '+classes.justifyContentBetween+' '+classes.width100}>
                      <div className={classes.width30}>
                        <div  className={classNames(classes.minifyItems)}>
                          <Link to={'#'}>
                            <SettingsIcon type='fill'/>
                          </Link>
                        </div>
                      </div>
                      <div className={classes.width100+' '+classes.lineHeight24+' '+classes.fontsize20+' '+classes.fontWeight700}>Settings</div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          <div className={location.pathname === '/' || location.pathname === '/home' || location.pathname === '/latest' || location.pathname === '/trending'? classes.main+' '+classes.maintest:classes.marginTop50}>
            
            <Navbar className={classes.navTop+' '+ classes.paddingBottomEmpty} fixed="top">
              <Navbar.Brand className={classes.navTitle}>
                {title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
                  <IconButton onClick={handleClickBackButton} size="small">
                    <BackArrowIcon />
                  </IconButton>
                )}
                {title !== 'Search' && title !== 'Profile' && (<div>
                  {is_authenticated &&
                    (<React.Fragment>
                      <div className={classes.avatarWrapper}>
                        <div className={classes.width45Percent}>
                          <span ref={avatarRef}><Avatar onClick={handleClickAvatar} height={35} author={username} /></span>
                        </div>
                        <div className={classes.widthHalfWidth}>
                          <Image width={'60px'} src={`${window.location.origin}/dbuzz-text-logo.svg`}/>
                        </div>
                      </div>
                    </React.Fragment>)}
                  <div className={classes.displayFlex}>
                    <div onClick={() => handelClickItemByTab('trending')} className={classes.flexDirectionColumn+' '+classes.hoverBackgroundGray+' '+classes.paddingTop13+' '+classes.widthHalfWidth+' '+classes.displayFlex+' '+classes.justifyContentCenter+' '+classes.alignItemsCenter}>
                      <p className={activeView === 'trending'? classes.fontSize17+' '+ classes.fontWeightBold+' '+classes.marginEmpty+' '+classes.cursorPointer+' '+classes.paddingBottom15:classes.marginEmpty+' '+classes.cursorPointer+' '+classes.paddingBottom15+' '+classes.fontSize17}>Trending</p>
                      <div
                        className={activeView === 'trending'?classes.width45Percent+' '+classes.height5+' '+classes.background606060+' '+classes.borderRadius10:''}
                      ></div>
                    </div>
                    <div onClick={() => handelClickItemByTab('home')} className={classes.flexDirectionColumn+' '+classes.hoverBackgroundGray+' '+classes.paddingTop13+' '+classes.widthHalfWidth +' '+classes.displayFlex+' '+classes.justifyContentCenter+' '+classes.alignItemsCenter +' '+classes.paddingLeft15}>
                      <p className={activeView === 'home'? classes.fontSize17+' '+ classes.fontWeightBold+' '+classes.marginEmpty+' '+classes.cursorPointer+' '+classes.paddingBottom15:classes.marginEmpty+' '+classes.cursorPointer+' '+classes.paddingBottom15+' '+classes.fontSize17}>Following</p>
                      <div
                        className={activeView === 'home'?classes.width45Percent+' '+classes.height5+' '+classes.background606060+' '+classes.borderRadius10:''}
                      ></div>
                    </div>
                  </div>
                </div>)}
                
                
                {/* {title !== 'Search' && (
                  <div>
                    <div className={classes.titleContainerStyles}>
                      <span className={classes.title}>{title}</span>
                      <div className={classes.headerspacing}>
                        <Image width={'50px'} src={`${window.location.origin}/dbuzz.svg`}/>
                      </div>
                    </div>
                    
                  </div>
                
                )}
                */}
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
              
            </Navbar>
            
            <React.Fragment>
              {is_authenticated && (
                <Fab onClick={handleOpenBuzzModal} size="medium" color="secondary" aria-label="add" style={floatStyle}>
                  <CreateBuzzIcon />
                </Fab>
              )}
              <AvatarMenu />
              
              <div className={location.pathname === '/' || location.pathname === '/home' || location.pathname === '/latest' || location.pathname === '/trending'? classes.main:classes.marginTop50}>
                {renderRoutes(route.routes)}
              </div>
            </React.Fragment>
            <div className={classes.separator}></div>
            {is_authenticated && (<NavigationBottom />)}
            <BuzzFormModal show={open} onHide={handleCloseModal} />
          </div>
        </div>
      </React.Fragment>
        
      
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
