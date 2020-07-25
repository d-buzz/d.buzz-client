import React from 'react'
import Nav from 'react-bootstrap/Nav'
import NavbarBrand from 'react-bootstrap/NavbarBrand'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  HomeIcon,
  BrandIcon,
  TrendingIcon,
  LatestIcon,
  NotificationsIcon,
  ProfileIcon,
  ContainedButton,
} from 'components/elements'
import { connect } from 'react-redux'


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
          stroke: 'red',
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
    bottom: 0
  },
  inline: {
    display: 'inline-block',
  }
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
  const { user } = props
  const { username } = user || ''
  const classes = useStyles()
  const profileImage = `https://images.hive.net.ph/u/${username}/avatar/small`
  const location = useLocation()

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
              <Row>
                <Col md="auto" p="0" style={{ width: 'max-content', paddingRight: 0, paddingLeft: 35 }}>
                  <Image
                    src={profileImage}
                    roundedCircle
                    height={50}
                    className={classes.inline}
                  />
                </Col>
                <Col style={{ marginLeft: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 'bold' }}>{username}</p>
                  <p style={{ fontSize: 13, marginTop: -15 }}>@{username}</p>
                </Col>
              </Row>
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

export default connect(mapStateToProps)(SideBarLeft)
