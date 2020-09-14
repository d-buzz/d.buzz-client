import React, { useState, useEffect } from 'react'
import Nav from 'react-bootstrap/Nav'
import NavbarBrand from 'react-bootstrap/NavbarBrand'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import Badge from '@material-ui/core/Badge'
import { createUseStyles } from 'react-jss'
import { useLocation } from 'react-router-dom'
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
  SunMoonIcon,
  PowerIcon,
  CircularBrandIcon,
  BuzzIcon,
} from 'components/elements'
import IconButton from '@material-ui/core/IconButton'
import {
  BuzzFormModal,
  ThemeModal,
} from 'components'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { signoutUserRequest, subscribeRequest } from 'store/auth/actions'
import { pollNotifRequest } from 'store/polling/actions'

const useStyles = createUseStyles(theme => ({
  items: {
    fontFamily: 'Segoe-Bold',
    width: 'max-content',
    fontSize: 18,
    padding: 8,
    marginBottom: 15,
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
        '& path': {
          stroke: '#e53935',
        },
      },
    },
  },
  minifyItems: {
    textAlign: 'left',
    marginBottom: 15,
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
        '& path': {
          stroke: '#e53935',
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
        stroke: '#e53935',
      },
    },
  },
  navLinkContainer: {
    marginTop: 20,
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
    backgroundColor: '#e53935 !important',
    '&:hover': {
      backgroundColor: '#b71c1c !important',
    },
  },
  logoutButtonMinify: {
    ...theme.left.sidebar.bottom.wrapper,
  },
}))


const LinkContainer = ({ children }) => {
  return (
    <div style={{ width: 'auto' }}>
      <div>
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
    onClick = () => {},
  } = props


  const isActivePath = (path, current) => {
    return path === current
  }

  return (
    <React.Fragment>
      {!minify && (
        <div onClick={onClick} className={classNames(textClass, isActivePath(path, active) ? activeClass : '' )}>
          <Link to={path}>
            <IconWrapper style={{ textAlign: 'right' }} className={iconClass}>{icon}</IconWrapper>
            {name}
          </Link>
        </div>
      )}
      {minify && (
        <div onClick={onClick} className={classNames(minifyItemsClass, isActivePath(path, active) ? activeClass : '' )}>
          <Link to={path}>
            <IconButton
              size="medium"
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
    theme,
    minify,
  } = props
  const { username, is_subscribe } = user || ''
  const [open, setOpen] = useState(false)
  const [openTheme, setOpenTheme] = useState(false)
  const classes = useStyles()
  const location = useLocation()

  const showThemeModal = () => {
    setOpenTheme(true)
  }

  useEffect(() => {
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
    setOpen(true)
  }

  const onHide = () => {
    setOpen(false)
  }

  const onHideTheme = () => {
    setOpenTheme(false)
  }

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
    {
      name: 'Display',
      icon: <SunMoonIcon />,
      onClick: showThemeModal,
    },
  ]

  return (
    <React.Fragment>
      <div style={{ height: '100vh', width: '50px' }}>
        <Nav className="flex-row">
          <LinkContainer >
            <NavbarBrand href="/">
              <div style={{ paddingTop: 10, ...(!minify ? { marginLeft: 15, marginRight: 15 } : { marginLeft: 0 }) }}>
                {theme.mode === 'light' && !minify &&  (<BrandIcon />)}
                {(theme.mode === 'night' || theme.mode === 'gray') && !minify && (<BrandIconDark />)}
                {minify && (<CircularBrandIcon />)}
              </div>
            </NavbarBrand>
            <div className={classes.navLinkContainer}>
              {NavLinks.map((item) => (
                <NavLinkWrapper
                  minify={minify}
                  minifyItemsClass={classes.minifyItems}
                  key={`${item.path}-side`}
                  {...item}
                  textClass={classes.items}
                  iconClass={classes.inline}
                  activeClass={classes.activeItem}
                  active={location.pathname}
                />
              ))}
              {!is_subscribe && (
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
                  size="medium"
                  classes={{
                    root: classes.buzzButton,
                  }}
                  onClick={handleClickBuzz}
                >
                  <BuzzIcon />
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
      <BuzzFormModal show={open}  onHide={onHide} />
      <ThemeModal show={openTheme} onHide={onHideTheme} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  loading: pending(state, 'SUBSCRIBE_REQUEST'),
  count: state.polling.get('count'),
  theme: state.settings.get('theme'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    signoutUserRequest,
    subscribeRequest,
    pollNotifRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBarLeft)
