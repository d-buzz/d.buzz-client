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
  BrandIcon,
  BrandIconDark,
  TrendingIcon,
  LatestIcon,
  NotificationsIcon,
  ProfileIcon,
  ContainedButton,
  Avatar,
  BuzzIcon,
} from 'components/elements'
import { BuzzFormModal } from 'components'
import { useLocation } from 'react-router-dom'
import config from 'config'
import Fab from '@material-ui/core/Fab'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'

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
  walletButton: {
    marginTop: 5,
    float: 'right',
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
    theme,
    user,
    pollNotifRequest,
    count = 0,
  } = props
  const { is_authenticated, username } = user
  const avatarRef = React.useRef()
  const [openAvatarMenu, setOpenAvatarMenu] = useState(false)
  const classes = useStyles()

  const history = useHistory()
  const lastLocation = useLastLocation()

  const [open, setOpen] = useState(false)

  let title = 'Home'

  if(pathname.match(/(\/c\/)/)) {
    title = 'Buzz'
  }

  if(pathname.match(/^\/trending/)) {
    title = 'Trending'
  }

  if(pathname.match(/^\/latest/)) {
    title = 'Latest'
  }

  if(!pathname.match(/(\/c\/)/) && pathname.match(/^\/@/)) {
    title = 'Profile'
  }

  if(pathname.match(/(\/notifications)/)) {
    title = 'Notifications'
  }

  if(pathname.match(/(\/tags?)/)) {
    title = 'Tags'
  }

  if(pathname.match(/(\/search?)/)) {
    title = 'Search'
  }

  const handleClickBackButton = () => {
    if(!lastLocation) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }

  const openRedirect = () => {
    window.open("https://d.buzz/", "_self")
  }

  const floatStyle = {margin: 0,
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
      icon: <LatestIcon  />,
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
  ]

  const location = useLocation()

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
            {NavLinks.map((item) => (
              <NavLinkWrapper item={item} active={location.pathname} />
            ))}
          </Nav>
        </div>
      </Navbar>
    )
  }

  const NavLinkWrapper = ({ item, active }) => {
    return (
      <div className={classNames(classes.minifyItems, isActivePath(item.path, active) ? classes.activeItem : '' )}>
        <Link to={item.path}>
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
      >
        <MenuItem onClick={handleCloseAvatar}>Profile</MenuItem>
        <MenuItem onClick={handleCloseAvatar}>Logout</MenuItem>
      </Menu>
    )
  }

  useEffect(() => {
    if(is_authenticated) {
      pollNotifRequest()
    }
  // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <div className={classes.main}>
        {!config.DISABLE_MOBILE && (
          <React.Fragment>
            <NavigationTop />
            <React.Fragment>
              <Fab onClick={handleOpenBuzzModal} size="medium" color="secondary" aria-label="add" style={floatStyle}>
                <BuzzIcon />
              </Fab>
              <AvatarMenu />
              <div className={classes.main}>
                {renderRoutes(route.routes)}
              </div>
            </React.Fragment>
            <div className={classes.separator}></div>
            <NavigationBottom />
            <BuzzFormModal show={open}  onHide={handleCloseModal} />
          </React.Fragment>
        )}
        {config.DISABLE_MOBILE && (
          <React.Fragment>
            <div style={{ width: '98%', margin: '0 auto', marginTop: 20 }}>
              <center>
                {theme.mode === 'light' &&  (<BrandIcon />)}
                {(theme.mode === 'night' || theme.mode === 'gray') && (<BrandIconDark />)}
                <h6 style={{ paddingTop: 10 }} className={classes.notes}>
                  Hello there, mobile view is still underway for this version
                </h6>
              </center>
              <iframe
                title="giphy"
                src="https://giphy.com/embed/XaMTNZkRahZ7ysPMci"
                width="100%"
                height="250px"
                frameBorder="0"
                class="giphy-embed"
                allowFullScreen>
              </iframe>
              <center>
                <h6 className={classes.notes}>meanwhile you can still view the application on mobile by following the link below</h6>
                <ContainedButton
                  style={{ height: 45 }}
                  fontSize={14}
                  transparent={true}
                  label="Take me to the main site"
                  labelStyle={{ paddingTop: 10 }}
                  onClick={openRedirect}
                />
                <br />
                <label>&copy; Dataloft, LLC&nbsp; - <i>v.{config.VERSION}</i></label>
              </center>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  theme: state.settings.get('theme'),
  count: state.polling.get('count'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    pollNotifRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MobileAppFrame)
