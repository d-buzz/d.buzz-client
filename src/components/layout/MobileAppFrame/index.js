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
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
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
  // AccordionArrowDownIcon,
  // SettingsIcon,
  SearchIcon,
  // PocketIcon,
  MessageIcon,
  BookmarkIcon,
  // WalletIcon,
} from 'components/elements'
import {
  BuzzFormModal,
  ThemeModal,
  SwitchUserModal,
  LoginModal,
  SearchField,
} from 'components'
import { useLocation } from 'react-router-dom'
import Fab from '@material-ui/core/Fab'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { clearNotificationsRequest,getFollowersRequest,getFollowingRequest, getProfileRequest } from 'store/profile/actions'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { broadcastNotification, setRefreshRouteStatus } from 'store/interface/actions'
import { signoutUserRequest, setIntentBuzz } from 'store/auth/actions'
import { searchRequest, clearSearchPosts } from 'store/posts/actions'
// import { getUserCustomData, updateUserCustomData } from 'services/database/api'

import { pending } from 'redux-saga-thunk'
import queryString from 'query-string'
import moment from 'moment'
import SettingsModal from 'components/modals/SettingsModal'
import CreateBuzzIcon from 'components/elements/Icons/CreateBuzzIcon'
// import MoreIcon from 'components/elements/Icons/MoreIcon'
import { checkCeramicLogin } from 'services/ceramic'
import { generateStyles } from 'store/settings/actions'
import { getTheme } from 'services/theme'
import { getUserTheme, shortenDid } from 'services/helper'
import { Image } from 'react-bootstrap'
import ProfileIcon from 'components/elements/Icons/ProfileIcon'
// import MoonIcon from 'components/elements/Icons/MoonIcon'
// import SunIcon from 'components/elements/Icons/SunIcon'
import CommunityIcon from 'components/elements/Icons/CommunityIcon'
// import MoreIcon from 'components/elements/Icons/MoreIcon'

const useStyles = createUseStyles(theme => ({
  main: {
    marginTop: 120,
  },
  marginTop50: {
    marginTop: 50,
  },
  minifyItems: {
    textAlign: 'left',
    width: "100%",
    '& svg': {
      stroke: theme.font.color,
      paddingTop: -10,
      '& path': {
        fill: theme.font.color,
      },
    },
    '& a': {
      color: theme.left.sidebar.items.color,
      textDecoration: 'none',
    },

  },
  minifyItemsStrokeWidth15:{
    textAlign: 'left',
    width: "100%",
    marginBottom: 5,
    ...theme.left.sidebar.items.icons,
    '& a': {
      color: theme.left.sidebar.items.color,
      textDecoration: 'none',
    },
    '& svg': {
      '& path': {
        fill: 'white !important',
        stroke: 'black !important',
        strokeWidth: 5,
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
  positionAbsolute: {
    position:'absolute',
  },
  bottom20Percent:{
    bottom: "20%",
  },
  colorBlack: {
    color: "rgba(15,20,25,1.00)",
  },
  colorWhite: {
    color: "#f1f1f1",
  },
  colorGray:{
    color: "rgb(83, 100, 113)",
  },
  colorGray2:{
    color: "rgb(113, 118, 123)",
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
  widthAuto:{
    width: "auto",
  },
  marginTop8:{
    marginTop: 8,
  },
  marginTop15:{
    marginTop: 15,
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
    marginBottom: 15,
  },
  widthHalfWidth: {
    width: '50%',
  },
  width45Percent: {
    width: '45%',
  },
  width43Percent: {
    width: '43%',
  },
  paddingBottomEmpty: {
    paddingBottom: '0px !important',
  },
  paddingTop50: {
    paddingTop: 55,
  },
  paddingTop20: {
    paddingTop: '20px',
  },
  paddingTop13: {
    paddingTop: 13,
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
    fontWeight: '500',
  },
  height5:{
    height:5,
  },
  fontSize17: {
    fontSize: 17,
  },
  fontWeightBold: {
    fontWeight: '700',
  },
  background606060:{
    background: '#606060',
  },
  backgroundaaa:{
    background: '#aaa',
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
  hoverBackgroundBlack:{
    '&:hover': {
      backgroundColor: '#272727',
    },
  },
  demoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',

    borderRadius: '50%',
    marginRight:'34px',
  },
  marginRightNone: {
    marginRight: '0 !important',
  },
  marginRight20: {
    marginRight:20,
  },
  menu: {
    '& .MuiPaper-root': {
      background: theme.background.primary,
    },
    '& ul':{
      background: theme.background.primary,
      '& nav':{
        background: theme.background.primary,
        '& div':{
          fontSize: 18,
          fontWeight: '500 !important',
          background: theme.background.primary,
          color: theme.font.color,
          '& div':{
            '& div':{
              paddingLeft: '5%',
            },
          },
        },
      },
      
    },
    '& li': {
      fontSize: 18,
      fontWeight: '500 !important',
      background: theme.background.primary,
      color: theme.font.color,

      '&:hover': {
        ...theme.context.view,
      },

      '#advanced-subheader': {
        // Your specific styles for the id="advanced-subheader"
        color: 'red',
        fontWeight: 'bold',
      },
    },
  },
  nestedList: {
    fontSize: 18,
    fontWeight: 'normal !important',
    background: theme.background.secondary,
    color: theme.font.color,
    '&:hover': {
      ...theme.context.view,
    },
    '& div':{
      '& div':{
        '& div':{
          paddingLeft: '5%',
          // paddingTop: '4px',
          // paddingBottom: '4px',
          '& a':{
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '5%',
            '& div':{
              marginTop: '0px',
              marginBottom: '0px',
            },
          },
          '& div':{
            paddingTop: '4px',
            paddingBottom: '4px',
            paddingLeft: '5%',
            '& div':{
              marginTop: '0px',
              marginBottom: '0px',
            },
          },
        },
      },
    },
    '& ul':{
      paddingTop: '0px',
      paddingBottom: '0px',
      '& div':{
        '& div':{
          '& span':{
            fontWeight: 'normal !important',
          },
        },
      },
      '& a':{
        '& div':{
          '& span':{
            fontWeight: 'normal !important',
          },
        },
      },
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
  alignItemsStart:{
    alignItems: 'start',
  },
  padding8Left:{
    paddingLeft: 8,
  },
  padding16Left:{
    paddingLeft: 16,
  },
  padding8Top:{
    paddingTop: 8,
  },
  padding8Bottom:{
    paddingBottom: 8,
  },
  padding15Bottom0: {
    padding: "15px 15px 0px 15px",
  },
  height100: {
    height: "100%",
  },
  accordionTransition:{
    transition: 'height 0.2s ease',
  },
  accordionshow:{
    height: '140px',
    width: '97%',
    // border: '1px solid grey',
    marginLeft: 'auto',
  },
  accordionhide:{
    height: '0px',
    width: '97%',
    // border: '0.2px solid grey',
    marginLeft: 'auto',
  },
  displayhide: {
    display: 'none',
  },
  displayShow: {
    display: 'block',
  },
  paddingBottom10:{
    paddingBottom: 10,
  },
  // icon specific styles
  settingsIcon: {
    stroke: theme.font.color,
    '& .settings-cog': {
      fill: `${theme.font.color}`,
    },
  },
  marginTop85: {
    marginTop: 85,
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
    profile,
    setIntentBuzz,
    fromIntentBuzz,
    searchRequest,
    clearSearchPosts,
    setRefreshRouteStatus,
    generateStyles,
  } = props
  // const customUserData = JSON.parse(localStorage.getItem('customUserData'))
  // const THEME = {
  //   LIGHT: 'light',
  //   NIGHT: 'night',
  // }
  // const handleClickSetTheme = (mode) => () => {
  //   const data = { ...customUserData, settings: { ...customUserData?.settings, theme: mode } }
  //   localStorage.setItem('customUserData', JSON.stringify({...data}))
  //   const theme = getTheme(mode)
  //   generateStyles(theme)
  //   handleUpdateTheme(mode)
  // }

  // const handleUpdateTheme = (theme) => {
  //   const { username } = user

  //   getUserCustomData(username)
  //     .then(res => {
  //       const userData = {
  //         ...res[0],
  //         settings: {
  //           ...res[0].settings,
  //           theme: theme,
  //         },
  //       }
  //       const responseData = { username, userData: [userData] }

  //       if(res) {
  //         updateUserCustomData(responseData)
  //           .then(() => {
  //             // setLoading(false)
  //           })
  //       }
  //     })

  // }


  const mode = getUserTheme()
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
  // const [openMoreMenu, setOpenMoreMenu] = useState(false)
  // const [showSettings, setShowSettings] = useState(false)
  // const moreMenuRef = useRef()
  const classes = useStyles()

  const [activeView, setActiveView] = useState('trending')
  const [showProfessionalTools, setShowProfessionalTools] = useState(false)
  const [showSettingsAndSupport, setShowSettingsAndSupport] = useState(false)

  let title = 'Trending'
  let openedSubProfile = false

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
    openedSubProfile = true
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

  // const handleClickOpenMoreMenu = () => {
  //   setOpenMoreMenu(true)
  // }

  // const handleClickCloseOpenMoreMenu = () => {
  //   setOpenMoreMenu(false)
  // }

  const redirectToChatPage = () => {
    window.location.href = "https://chat.d.buzz"
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
    border: `${getTheme(getUserTheme())?.buzzButton?.border}`,
    color: `${getTheme(getUserTheme())?.buzzButton?.color}`,
    backgroundColor: `${getTheme(getUserTheme())?.background?.primary}`,
    fill: `${getTheme(getUserTheme())?.buzzButton?.fill}`,
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

    if (name === 'latest') {
      history.replace('/latest')
      refreshLatestRouteData()
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
    // case 'More':
    //   handleClickOpenMoreMenu()
    //   break
    default:
      return
    }
  }

  // eslint-disable-next-line
  // useEffect(() => {
  //   if(username) {
  //     getProfileRequest(username)
  //     getFollowersRequest(username)
  //     getFollowingRequest(username)
  //   }
  // }, [username,getProfileRequest,getFollowersRequest,getFollowingRequest])

  // eslint-disable-next-line
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
  }, [location])

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
    {
      name: 'Notifications',
      path: `/notifications`,
      icon: activeView === 'notifications' ? <Badge badgeContent={count.unread || 0} color="secondary" style={{height:30}}><NotificationsIcon type='fill'/></Badge> : <Badge badgeContent={count.unread || 0} color="secondary" style={{height:30}}><NotificationsIcon type='outline'/></Badge>,
      onClick: () => handelClickItem('notifications'),
    },
    {
      name: 'Message',
      icon: activeView === 'message' ? <MessageIcon type='fill'/> : <MessageIcon type='outline'/>,
      onClick:() => redirectToChatPage(),
    },
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

  // const showSettingsModal = () => {
  //   handleClickCloseOpenMoreMenu()
  //   setOpenSettingsModal(true)
  // }

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

  // const handelClickWallet = () => {
  //   history.push(`/@${username}/wallet/balances`)
  //   handelClickItem('wallet')
  // }

  const toggleProfessionTools = () => {
    setShowProfessionalTools(!showProfessionalTools)
  }

  const toggleSettingsAndSupport = () => {
    setShowSettingsAndSupport(!showSettingsAndSupport)
  }

  const showComingSoon = () => {
    broadcastNotification('success', `Coming soon`)
  }

  const { stats, metadata } = profile || ''
  const {profile: profileMeta} = metadata || ''
  const {name:userName} = profileMeta || ''
  const { followers, following } = stats || ''
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
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/getstarted`}>Get Started</MenuItem>
        <MenuItem onClick={handleCloseAvatar} component={Link} to={`/tos`}>Terms of Service</MenuItem>
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
    setSearchkey(value.toLowerCase())
  }


  const handleSearchKey = (e) => {
    if(e.key === 'Enter') {
      clearSearchPosts()
      searchRequest(searchkey.toLowerCase())
      setDisableSearchTips(true)
      history.push(`/search/trending?q=${encodeURIComponent(searchkey.toLowerCase())}`)
    }
  }

  // eslint-disable-next-line
  useEffect(() => {
    if (is_authenticated) {
      pollNotifRequest()
    }
    // eslint-disable-next-line
  }, [])

  // eslint-disable-next-line
  useEffect(() => {
    if (fromIntentBuzz && is_authenticated) {
      setOpen(true)
    }
    // eslint-disable-next-line
  }, [fromIntentBuzz, is_authenticated])

  // eslint-disable-next-line
  useEffect(() => {
    if(title !== 'Search'){
      setSearchkey('')
      clearSearchPosts()
    }
    // eslint-disable-next-line
  }, [title])

  // eslint-disable-next-line
  const [showSideBarNavigation, setShowSideBarNavigation] = useState(false)

  return (
    <React.Fragment>
      <React.Fragment>
        <div className='maincontent'>
          <div className={classNames(classes.displayFlex,showSideBarNavigation?'navigationFullWidthNoTrans':'navigationsmallWidthNoTrans',(mode === 'night' || mode === 'gray')? 'bg-91-112-131':'bg-black-transparent' )}>
            <div className={classNames(classes.displayFlex,showSideBarNavigation?'navigationFullWidth':'navigationsmallWidth' )}>
              <div className={classNames(showSideBarNavigation?'navigationMainContentFullwidth':'navigationMainContentNowidth',(mode === 'night' || mode === 'gray')? 'bg-21-32-43':'bg-white', classes.width100)}>
                <div className={classNames(classes.height100)}>
                  <div className={classNames(classes.padding16,classes.displayFlex,classes.flexDirectionColumn)}>
                    <div className={classNames(classes.displayFlex,classes.justifyContentBetween,classes.positionRelative)}>
                      <div className={classNames(classes.width45Percent)}>
                        <span ref={avatarRef}><Avatar onClick={handleClickAvatar} height={35} author={username} /></span>
                      </div>
                      <div onClick={() => setOpenSwitchModal(true)} className={classNames((mode==='night' || mode==='gray') ?'border-white':'border-black',(mode==='night' || mode==='gray') ?'text-white':'','width35',classes.demoContainer,classes.displayFlex,classes.justifyContentEnd,classes.marginRightNone)}>
                        <span ref={avatarRef}>+</span>
                      </div>
                    </div>
                    <div className={classNames(classes.marginTop8,classes.displayFlex,classes.positionRelative)}>
                      <div className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100,classes.width100,classes.flexDirectionColumn)}>
                        <Link to={'#'} className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100)} >
                          <span className={classNames((mode ==='night' || mode ==='gray') ? 'text-white':classes.colorBlack,classes.fontsize17,classes.fontWeight700)}>{userName || !username?.includes('did') ? username : shortenDid(username)}</span>
                        </Link>
                        <Link to={'#'} className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100)} >
                          <span className={classNames((mode === 'night' || mode === 'gray')?'text-gray':classes.colorGray,classes.fontsize17,classes.fontWeight700)}>@{!username?.includes('did') ? username : shortenDid(username)}</span>
                        </Link>
                      </div>
                    </div>
                    <div className={classNames(classes.marginTop8,classes.displayFlex,classes.positionRelative)}>
                      <div className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100,classes.width100,classes.flexDirectionColumn)}>
                        <div className={classNames(classes.displayFlex,classes.justifyContentStart)}>
                          <div className={classNames((mode==='night' || mode==='gray') ?'text-gray':'',classes.marginRight30,classes.fontsize15)}><span className={classNames((mode === 'night' || mode === 'gray')?'text-white':'')}>{following}</span> Following</div>
                          <div className={classNames((mode==='night' || mode==='gray') ?'text-gray':'',classes.fontsize15)}><span className={classNames((mode === 'night' || mode === 'gray')?'text-white':'')}>{followers}</span> Followers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* PROFILE TAB */}
                  <Link to={`/@${username}`} onClick={() => setShowSideBarNavigation(false)}  className={classNames(classes.marginTop8,classes.displayFlex,classes.positionRelative)}>
                    <div className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100,classes.width100)}>
                      <div className={classNames(classes.padding16, classes.padding16Left,classes.padding8Top,classes.padding8Bottom, classes.displayFlex,classes.justifyContentCenter,classes.width100, classes.alignItemsCenter)}>
                        <div className={classNames(classes.marginRight20,classes.minifyItems, classes.activeItem,classes.widthAuto)}>
                          <ProfileIcon style={{margin:0}} type='outline'/>
                          {/* <div  className={classNames(classes.minifyItems, classes.activeItem )}>
                            <Link to={`/@${username}`}>
                              <IconButton
                                size="medium"
                                style={{width: 55, padding:'0px 12px 0px 0px'}}
                              >
                                <ProfileIcon type='outline'/>
                              </IconButton>
                            </Link>
                          </div> */}
                        </div>
                        <div onClick={()=>history.push(`/@${username}`)} className={classNames((mode === 'night' || mode === 'gray')?'text-white':'text-black',classes.width100,classes.lineHeight24,classes.fontsize20,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}><p style={{margin:0}}>Profile</p></div>
                      </div>

                    </div>
                  </Link>
                  <Link to={`/@${username}/t/pockets`} onClick={() => setShowSideBarNavigation(false)}  className={classNames(classes.displayFlex,classes.positionRelative)}>
                    <div className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100,classes.width100)}>
                      <div className={classNames(classes.padding16, classes.padding16Left,classes.padding8Top,classes.padding8Bottom,classes.displayFlex,classes.justifyContentBetween,classes.width100, classes.alignItemsCenter)}>
                        <div className={classNames(classes.marginRight20,classes.minifyItems, classes.activeItem,classes.widthAuto)}>
                          <BookmarkIcon type='outline'/>
                          {/* <div  className={classNames(classes.minifyItems, classes.activeItem )}>
                            <Link to={`/@${username}/t/pockets`}>
                              <IconButton
                                size="medium"
                                style={{width: 55, padding:'12px 12px 0px 0px'}}
                              >
                                <PocketIcon type='outline'/>
                              </IconButton>
                            </Link>
                          </div> */}
                        </div>
                        <div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'text-black',classes.width100,classes.lineHeight24,classes.fontsize20,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}>Bookmarks</div>
                      </div>
                    </div>
                  </Link>
                  <div onClick={() => showComingSoon()} className={classNames(classes.displayFlex,classes.positionRelative)}>
                    <div className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100,classes.width100)}>
                      <div className={classNames(classes.padding16, classes.padding16Left,classes.padding8Top,classes.padding8Bottom,classes.displayFlex,classes.justifyContentBetween,classes.width100, classes.alignItemsCenter)}>
                        <div className={classNames(classes.marginRight20,classes.minifyItems, classes.activeItem,classes.widthAuto)}>
                          <CommunityIcon type='outline'/>
                          {/* <div  className={classNames(classes.minifyItems, classes.activeItem )}>
                            <Link to={'#'}>
                              <IconButton
                                size="medium"
                                style={{width: 55, padding:'12px 12px 0px 0px'}}
                              >
                                <MessageIcon type='outline'/>
                              </IconButton>
                            </Link>
                          </div>  */}
                        </div>
                        <div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'',classes.width100,classes.lineHeight24,classes.fontsize20,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}>Communities</div>
                      </div>
                    </div>
                  </div>
                  <div className={classNames(classes.displayFlex,classes.positionRelative,classes.justifyContentCenter, classes.marginTop15)}>
                    <div className={classNames('margin-top-2','margin-bottom-2','bg-475154', 'height1', 'width89')}>
                    </div>
                  </div>
                  <div className={classes.nestedList}>
                    <List>
                      <ListItem button onClick={toggleProfessionTools}>
                        <ListItemText primary='Professional Tools'/>
                        {showProfessionalTools ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={showProfessionalTools} timeout="auto" unmountOnExit>
                        <List component="div">
                          <ListItem component="a" href='https://auto.vote' target="_blank" rel="noopener noreferrer" key='Auto.Vote' button>
                            <ListItemText primary='Auto.Vote' />
                          </ListItem>
                        </List>
                        <List component="div">
                          <ListItem component="a" href={'http://blog.d.buzz/#/@'+username} target="_blank" rel="noopener noreferrer" key='Blog' button>
                            <ListItemText primary='Blog' />
                          </ListItem>
                        </List>
                        <List component="div">
                          <ListItem component="a" href='https://dex.d.buzz' target="_blank" rel="noopener noreferrer" key='DEX' button>
                            <ListItemText primary='DEX' />
                          </ListItem>
                        </List>
                        <List component="div">
                          <ListItem component="a" href='https://d.buzz/leaderboard' target="_blank" rel="noopener noreferrer" key='Leaderboard' button>
                            <ListItemText primary='Leaderboard' />
                          </ListItem>
                        </List>
                        <List component="div">
                          <ListItem onClick={showComingSoon} key='Hive dApps' button>
                            <ListItemText primary='Hive dApps' />
                          </ListItem>
                        </List>
                      </Collapse>
                      <ListItem button onClick={toggleSettingsAndSupport}>
                        <ListItemText primary='Settings & Support'/>
                        {showSettingsAndSupport ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={showSettingsAndSupport} timeout="auto" unmountOnExit>
                        <List component="div">
                          <ListItem onClick={showThemeModal} key='Display' button>
                            <ListItemText primary='Display' />
                          </ListItem>
                        </List>
                        <List component="div">
                          <ListItem onClick={showSwitchModal} key='Swith Account' button>
                            <ListItemText primary='Swith Account' />
                          </ListItem>
                        </List>
                        <List component="div">
                          <ListItem component="a" href='https://chat.d.buzz/' target="_blank" rel="noopener noreferrer" key='Messages' button>
                            <ListItemText primary='Messages' />
                          </ListItem>
                        </List>
                      </Collapse>
                      <ListItem component="a" href={`/@${username}/wallet`} target="_blank" rel="noopener noreferrer" key='Wallet' button>
                        <ListItemText primary='Wallet' />
                      </ListItem>
                    </List>
                  </div>
                  {/* <Link to={`/@${username}/wallet`}  onClick={() => setShowSideBarNavigation(false)}  className={classNames(classes.displayFlex,classes.positionRelative)}>
                    <div className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100,classes.width100)}>
                      <div className={classNames(classes.padding16, classes.padding16Left,classes.padding8Top,classes.padding8Bottom,classes.displayFlex,classes.justifyContentBetween,classes.width100, classes.alignItemsCenter)}>
                        <div className={classNames(classes.marginRight20,classes.minifyItems, classes.activeItem,classes.widthAuto)}>
                          <WalletIcon type='outline'/>
                          <div  className={classNames(classes.minifyItems, classes.activeItem )}>
                            <Link to={`/@${username}/wallet`}>
                              <IconButton
                                size="medium"
                                style={{width: 55, padding:'12px 12px 0px 0px'}}
                              >
                                <WalletIcon type='outline'/>
                              </IconButton>
                            </Link>
                          </div>
                        </div>
                        <div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'text-black',classes.width100,classes.lineHeight24,classes.fontsize20,classes.fontWeight700,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}>Wallet</div>
                      </div>
                    </div>
                  </Link> */}
                  
                  {/* <div onClick={() => setOpenSettingsModal(true)} className={classNames(classes.displayFlex,classes.positionRelative)}>
                    <div className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100,classes.width100)}>
                      <div className={classNames(classes.padding16, classes.padding16Left,classes.padding8Top,classes.padding8Bottom,classes.displayFlex,classes.justifyContentBetween,classes.width100, classes.alignItemsCenter)}>
                        <div className={classNames(classes.marginRight20, classes.activeItem,classes.widthAuto)}>
                          <div className={classNames(classes.displayFlex,classes.justifyContentCenter,classes.alignItemsCenter)}>
                            <Link to={'#'}>
                              <IconButton
                                size="medium"
                                style={{width: 23, height: 23, padding:0 }}
                              >
                                <SettingsIcon className={classes.settingsIcon}/>
                              </IconButton>
                            </Link>
                          </div>
                        </div>
                        <div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'',classes.width100,classes.lineHeight24,classes.fontsize20,classes.fontWeight700,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}>Settings</div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div onClick={handleClickSetTheme(mode === 'light'? THEME.NIGHT: THEME.LIGHT)} className={classNames(classes.displayFlex,classes.positionAbsolute, classes.bottom20Percent, classes.width100, classes.paddingBottom10)}>
                    <div className={classNames(classes.displayFlex,classes.positionRelative,classes.maxWidth100,classes.width100)}>
                      <div className={classNames(classes.padding16, classes.padding16Left,classes.padding8Top,classes.padding8Bottom,classes.displayFlex,classes.justifyContentBetween,classes.width100, classes.alignItemsCenter)}>
                        <div className={classNames(classes.marginRight20,classes.minifyItems, classes.activeItem,classes.widthAuto)}>
                          {mode === 'light' && (
                            <SunIcon />
                          )}
                          {(mode === 'night' || mode === 'gray') && (
                            <MoonIcon />
                          )}
                        </div>
                        <div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'',classes.width100,classes.lineHeight24,classes.fontsize20,classes.fontWeight700,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}>{(mode === 'night' || mode === 'gray')? 'Dark':'Light'}</div>
                      </div>
                    </div>
                  </div> */}
                  {/* <div  className={classNames(classes.displayFlex,classes.positionRelative, 'testing')}>
                    <div className={classNames(classes.displayFlex, classes.flexDirectionColumn,classes.positionRelative,classes.maxWidth100,classes.width100)}>
                      <div style={{paddingLeft:'18px' }} className={classNames(classes.padding16, classes.flexDirectionColumn, classes.padding8Left,classes.padding8Top,classes.padding8Bottom,classes.displayFlex,classes.justifyContentBetween,classes.width100)}>
                        <div onClick={() => setShowSettings(!showSettings)} className={classNames(classes.displayFlex, classes.alignItemsCenter)}>
                          <div className={classNames(classes.displayFlex, classes.alignItemsCenter)}>
                            <div className={classNames( classes.width30, classes.marginRight20,classes.minifyItems,classes.activeItem)}>
                              <SettingsIcon type='outline'/>
                            </div>
                            <div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'',classes.width100,classes.lineHeight24,classes.fontsize20,classes.fontWeight700,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}>Settings</div>
                          </div>

                          <div  className={classNames(classes.minifyItems, classes.activeItem, classes.displayFlex, classes.justifyContentEnd )}>
                            <Link to={'#'}>
                              <IconButton
                                size="medium"
                                style={{width: 55}}
                              >
                                <AccordionArrowDownIcon type='outline'/>
                              </IconButton>
                            </Link>
                          </div>
                        </div>
                        <div style={{marginLeft:0}} className={classNames(classes.accordionTransition, showSettings ? classes.accordionshow: classes.accordionhide)}>
                          <div onClick={() => setShowSettings(!showSettings)} className={classNames(showSettings? classes.displayFlex:classes.displayhide, classes.alignItemsStart, classes.flexDirectionColumn)}>
                            <div onClick={() => setOpenTheme(true)} style={{marginBottom: 10}} className={classNames(showSettings? classes.displayFlex:classes.displayhide, classes.alignItemsCenter, classes.width100)} >
                              <div style={{width:'25%'}} className={classNames(classes.minifyItems, classes.activeItem,classes.width30)}>
                                {mode === 'light' && (
                                  <SunIcon />
                                )}
                                {(mode === 'night' || mode === 'gray') && (
                                  <MoonIcon />
                                )}
                              </div>
                              <div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'',classes.width100,classes.lineHeight24,classes.fontsize20,classes.fontWeight700,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}>{(mode === 'night' || mode === 'gray')? 'Night':'Light'}</div>
                            </div>
                            <div onClick={() => setOpenSettingsModal(true)} className={classNames(showSettings? classes.displayFlex:classes.displayhide, classes.alignItemsCenter, classes.width100)}>
                              <div style={{width:'25%'}} className={classes.width30}>
                                <SettingsIcon type='outline'/>
                              </div>
                              <div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'',classes.width100,classes.lineHeight24,classes.fontsize20,classes.fontWeight700,classes.displayFlex,classes.positionRelative,classes.justifyContentStart, classes.alignItemsCenter)}>Settings</div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div> */}
                </div>
              </div>
              <div onClick={() => setShowSideBarNavigation(false)}  className={classNames(classes.width30, classes.height100)}>

              </div>
            </div>
          </div>
          <div className={location.pathname === '/' || location.pathname === '/home' || location.pathname === '/latest' || location.pathname === '/trending' || (location.pathname === '/notifications' && count.unread !== 0 )? classes.main:(location.pathname === '/notifications' && count.unread === 0 )?classes.marginTop85:classes.marginTop50}>

            <Navbar className={classNames(classes.navTop,username?classes.paddingBottomEmpty:classes.paddingTop50)} fixed="top">
              <Navbar.Brand className={classes.navTitle}>
                {title !== 'Home' && title !== 'Trending' && title !== 'Latest' && activeView !== 'notifications' && (
                  <IconButton onClick={handleClickBackButton} size="small">
                    <BackArrowIcon />
                    {openedSubProfile && location.pathname.match(/\/follow\/followers/g) && (<div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'',classes.fontWeight700)}>&nbsp;Followers</div>)}
                    {openedSubProfile && location.pathname.match(/\/follow\/following/g) && (<div className={classNames((mode === 'night' || mode === 'gray')?'text-white':'',classes.fontWeight700)}>&nbsp;Following</div>)}
                  </IconButton>
                )}
                {title !== 'Search' && title !== 'Profile' && !openedSubProfile && (<div>
                  {is_authenticated &&
                    (<React.Fragment>
                      <div className={classNames(classes.avatarWrapper, classes.positionRelative)}>

                        <div className={classNames(classes.positionAbsolute,classes.width43Percent)}>
                          <span ref={avatarRef}><Avatar onClick={handleClickAvatar} height={35} author={username} /></span>
                        </div>
                        {/* <div className={classes.widthHalfWidth}> */}
                        <div className={classNames(classes.width100, classes.displayFlex, classes.justifyContentCenter, classes.alignItemsCenter)}>
                          <Image width={'60px'} src={`${window.location.origin}/${(mode === 'night' || mode === 'gray')?'dbuzz-text-logo-white.svg':'dbuzz-text-logo.svg'}`}/>
                        </div>
                      </div>
                    </React.Fragment>)}
                  {activeView !== 'notifications' && window.location.pathname !== "/tags" && !openedSubProfile && (
                    <div className={classes.displayFlex}>
                      <div onClick={() => handelClickItemByTab('trending')} className={classNames(classes.flexDirectionColumn,classes.hoverBackgroundGray,classes.padding15Bottom0,classes.widthHalfWidth,classes.displayFlex,classes.justifyContentCenter,classes.alignItemsCenter)}>
                        <p className={mode === 'light' && activeView === 'trending'? classNames(classes.fontSize17,classes.fontWeightBold,classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15):(mode === 'night' || mode === 'gray') && activeView === 'trending'? classNames(classes.colorWhite, classes.fontSize17,classes.fontWeightBold, classes.marginEmpty, classes.cursorPointer,classes.paddingBottom15):(mode === 'night' || mode === 'gray')?classNames(classes.colorGray2,classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15,classes.fontSize17):classNames(classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15,classes.fontSize17)}>Trending</p>
                        <div
                          className={classNames(classes.width45Percent,classes.height5,activeView === 'trending' && mode === 'light' ?classes.background606060:activeView === 'trending' && (mode === 'night' || mode === 'gray')?classes.backgroundaaa:'',activeView === 'trending'?classes.borderRadius10:'' )}
                        ></div>
                      </div>

                      {!username && (
                        <div onClick={() => handelClickItemByTab('latest')} className={classNames(classes.flexDirectionColumn,classes.hoverBackgroundGray,classes.padding15Bottom0,classes.widthHalfWidth,classes.displayFlex,classes.justifyContentCenter,classes.alignItemsCenter,classes.paddingLeft15)}>
                          <p className={mode === 'light' && activeView === 'latest'? classNames(classes.fontSize17,classes.fontWeightBold,classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15):(mode === 'night' || mode === 'gray') && activeView === 'latest'? classNames(classes.colorWhite, classes.fontSize17,classes.fontWeightBold, classes.marginEmpty, classes.cursorPointer,classes.paddingBottom15):(mode === 'night' || mode === 'gray')?classNames(classes.colorGray2,classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15,classes.fontSize17):classNames(classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15,classes.fontSize17)}>Latest</p>
                          <div
                            className={classNames(classes.width45Percent,classes.height5,activeView === 'latest' && mode === 'light' ?classes.background606060:activeView === 'latest' && (mode === 'night' || mode === 'gray')?classes.backgroundaaa:'',activeView === 'latest'?classes.borderRadius10:'' )}
                          ></div>
                        </div>
                      )}
                      {username && (
                        <div onClick={() => handelClickItemByTab('home')} className={classNames(classes.flexDirectionColumn,classes.hoverBackgroundGray,classes.padding15Bottom0,classes.widthHalfWidth,classes.displayFlex,classes.justifyContentCenter,classes.alignItemsCenter,classes.paddingLeft15)}>
                          <p className={mode === 'light' && activeView === 'home'? classNames(classes.fontSize17,classes.fontWeightBold,classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15):(mode === 'night' || mode === 'gray') && activeView === 'home'? classNames(classes.colorWhite, classes.fontSize17,classes.fontWeightBold, classes.marginEmpty, classes.cursorPointer,classes.paddingBottom15):(mode === 'night' || mode === 'gray')?classNames(classes.colorGray2,classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15,classes.fontSize17):classNames(classes.marginEmpty,classes.cursorPointer,classes.paddingBottom15,classes.fontSize17)}>Following</p>
                          <div
                            className={classNames(classes.width45Percent,classes.height5,activeView === 'home' && mode === 'light' ?classes.background606060:activeView === 'home' && (mode === 'night' || mode === 'gray')?classes.backgroundaaa:'',activeView === 'home'?classes.borderRadius10:'' )}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
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
                {title === 'Notifications' && count.unread !== 0 && (
                  <ContainedButton
                    fontSize={12}
                    style={{ marginTop: -38 }}
                    transparent={true}
                    label="Clear"
                    loading={loading}
                    disabled={loading}
                    className={classes.walletButton}
                    onClick={handleClearNotification}
                  />
                )}
                {/*{title === 'Notifications' && <NotificationFilter />}*/}
              </Navbar.Brand>

              {title === 'Search' && (
                <div className={classes.searchDiv}>
                  <SearchField
                    disableTips={disableSearchTips}
                    iconTop={-2}
                    searchWrapperClass={classes.searchWrapper}
                    style={{ fontSize: 16, height: 35 }}
                    value={searchkey.toLowerCase()}
                    onKeyDown={handleSearchKey}
                    onChange={onChangeSearch}
                    placeholder="Search D.Buzz"
                    autoFocus
                  />
                </div>
              )}

            </Navbar>

            <React.Fragment>
              {is_authenticated && (
                <Fab onClick={handleOpenBuzzModal} size="medium" color="secondary" aria-label="add" style={floatStyle}>
                  <CreateBuzzIcon fill={floatStyle.fill}/>
                </Fab>
              )}
              <AvatarMenu />

              <div className={location.pathname === '/' || location.pathname === '/home' || location.pathname === '/latest' || location.pathname === '/trending'|| (location.pathname === '/notifications' && count.unread !== 0 )? classes.main:(location.pathname === '/notifications' && count.unread === 0 )?classes.marginTop85:classes.marginTop50}>
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
      
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  profile: state.profile.get('profile'),
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
    getFollowersRequest,
    getFollowingRequest,
    getProfileRequest,
    setIntentBuzz,
    searchRequest,
    clearSearchPosts,
    setRefreshRouteStatus,
    generateStyles,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MobileAppFrame)
