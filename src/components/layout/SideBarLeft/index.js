import React from 'react'
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
  TrendingIcon,
  LatestIcon,
  NotificationsIcon,
  ProfileIcon,
  ContainedButton,
  Avatar,
} from 'components/elements'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AiOutlinePoweroff } from 'react-icons/ai'
import { signoutUserRequest } from 'store/auth/actions'

const useStyles = createUseStyles({
  items: {
    fontFamily: 'Roboto, sans-serif',
    width: 'max-content',
    fontSize: 20,
    padding: 8,
    marginBottom: 15,
    '& a': {
      color: 'black',
      textDecoration: 'none',
      padding: 6,
      '&:hover': {
        color: '#e53935'
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
      }
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
        stroke: 'red',
      },
    }
  },
  navLinkContainer: {
    marginTop: 20,
  },
  bottom: {
    position: 'absolute',
    bottom: 5,
    height: 'max-content',
    width: '98%',
    borderRadius: '50px 50px',
    cursor: 'pointer',
    backgroundColor: '#f5f8fa',
    transitionDuration: '0.3s',
    transitionProperty: 'background-color',
    '&:hover': {
      backgroundColor: '#e6ecf0',
    }
  },
  inline: {
    display: 'inline-block',
  },
  avatarWrapper: {
    height: 60,
    padding: 5,
  },
})

const NavLinks = [
  {
    name: 'Home',
    path: '/',
    icon: <HomeIcon top={-5} />,
  },
  {
    name: 'Trending',
    path: '/trending',
    icon: <TrendingIcon top={-5} />
  },
  {
    name: 'Latest',
    path: '/latest',
    icon: <LatestIcon top={-5} />
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: <NotificationsIcon top={-5} />,
  },
  {
    name: 'Profile',
    path: '/@stinkymonkeyph',
    icon: <ProfileIcon top={-5} />,
  },
]

const LinkContainer = ({ children }) => {
  return (
    <div style={{ width: 'auto' }}>
      <div>
        { children }
      </div>
    </div>
  )
}

const IconWrapper = ({ children, className }) => {
  return (
    <div style={{ paddingLeft: 5, paddingRight: 10 }} className={className}>
      { children }
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
  } = props

  const isActivePath = (path, current) => {
    return path === current
  }

  return (
    <React.Fragment>
      <div className={classNames(textClass, isActivePath(path, active) ? activeClass : '' )}>
        <IconWrapper className={iconClass}>{ icon }</IconWrapper> <Link to={path}>{ name }</Link>
      </div>
    </React.Fragment>
  )
}

const SideBarLeft = (props) => {
  const { user, signoutUserRequest } = props
  const { username } = user || ''
  const classes = useStyles()
  const location = useLocation()

  const handleClickLogout = () => {
    signoutUserRequest()
  }

  return (
    <React.Fragment>
      <div style={{ height: '100vh', width: '50px' }}>
        <Nav className="flex-row">
          <LinkContainer >
            <NavbarBrand href="#">
              <div style={{ marginLeft: 15, marginRight: 15 }}>
                <BrandIcon />
              </div>
            </NavbarBrand>
            <div className={classes.navLinkContainer}>
              {
                NavLinks.map((item) => (
                  <NavLinkWrapper
                    { ...item }
                    textClass={classes.items}
                    iconClass={classes.inline}
                    activeClass={classes.activeItem}
                    active={location.pathname}
                  />
                ))
              }
              <ContainedButton fontSize={18} label="Buzz" style={{ width: '100%' }} />
            </div>
            <div className={classes.bottom}>
              <div className={classes.avatarWrapper} onClick={handleClickLogout}>
                <Row>
                  <Col xs="auto">
                    <Avatar author={username} />
                  </Col>
                  <Col style={{ paddingLeft: 5 }}>
                    <Row style={{ padding: 0 }}>
                      <Col xs={9} style={{ padding: 0}}>
                        <p style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>Logout</p>
                        <p style={{ paddingBottom: 0, margin: 0 }}>@{username}</p>
                      </Col>
                      <Col style={{ padding: 0}}>
                        <AiOutlinePoweroff style={{ marginTop: 17, fontSize: 20, }}/>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </LinkContainer>
        </Nav>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    signoutUserRequest
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBarLeft)
