import React, { useState, useEffect } from 'react'
import Nav from 'react-bootstrap/Nav'
import NavbarBrand from 'react-bootstrap/NavbarBrand'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
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
} from 'components/elements'
import {
  BuzzFormModal,
  ThemeModal,
} from 'components'
import Badge from '@material-ui/core/Badge'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AiOutlinePoweroff } from 'react-icons/ai'
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
    ...theme.leftSideBarIcons,
    '& a': {
      color: theme.leftSidebarItemsColor,
      textDecoration: 'none',
      padding: 6,
      '&:hover': {
        color: '#e53935',
      },
    },
    '&:hover': {
      backgroundColor: '#ffebee',
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
    backgroundColor: '#f5f8fa',
    transitionDuration: '0.3s',
    transitionProperty: 'background-color',
    '&:hover': {
      backgroundColor: '#e6ecf0',
    },
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

const IconWrapper = ({ children, className }) => {
  return (
    <div style={{ paddingLeft: 5, paddingRight: 10 }} className={className}>
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
    onClick = () => {},
  } = props


  const isActivePath = (path, current) => {
    return path === current
  }

  return (
    <div onClick={onClick} className={classNames(textClass, isActivePath(path, active) ? activeClass : '' )}>
      <IconWrapper className={iconClass}>{icon}</IconWrapper> <Link to={path}>{name}</Link>
    </div>
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
      icon: <HomeIcon top={-5} />,
    },
    {
      name: 'Trending',
      path: '/trending',
      icon: <TrendingIcon top={-5} />,
    },
    {
      name: 'Latest',
      path: '/latest',
      icon: <LatestIcon top={-5} />,
    },
    {
      name: 'Notifications',
      path: `/notifications`,
      icon: <Badge badgeContent={count.unread || 0} color="secondary"><NotificationsIcon top={-5} /></Badge>,
    },
    {
      name: 'Profile',
      path: `/@${username}/t/buzz?ref=nav`,
      icon: <ProfileIcon top={-5} />,
    },
    {
      name: 'Display',
      icon: <SunMoonIcon top={-5} />,
      onClick: showThemeModal,
    },
  ]

  return (
    <React.Fragment>
      <div style={{ height: '100vh', width: '50px' }}>
        <Nav className="flex-row">
          <LinkContainer >
            <NavbarBrand href="/">
              <div style={{ marginLeft: 15, marginRight: 15 }}>
                {theme.mode === 'light' && (<BrandIcon />)}
                {theme.mode === 'night' && (<BrandIconDark />)}
              </div>
            </NavbarBrand>
            <div className={classes.navLinkContainer}>
              {NavLinks.map((item) => (
                <NavLinkWrapper
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
              <ContainedButton
                style={{ height: 45 }}
                fontSize={14}
                label="Buzz"
                labelStyle={{ paddingTop: 10 }}
                className={classes.sideBarButton}
                onClick={handleClickBuzz}
              />
            </div>
            <div className={classes.bottom}>
              <div className={classes.avatarWrapper} onClick={handleClickLogout}>
                <Row>
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
                        <p style={{ fontWeight: 'bold', margin: 0, padding: 0, paddingLeft: 5, fontSize: 13 }}>Logout</p>
                        <p style={{ fontWeight: 'bold', margin: 0, padding: 0, paddingLeft: 5, fontSize: 12 }}>@{username}</p>
                      </Col>
                      <Col style={{ padding: 0 }}>
                        <AiOutlinePoweroff style={{ fontSize: 25, marginTop: 16 }} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
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
