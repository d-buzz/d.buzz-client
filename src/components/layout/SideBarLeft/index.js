import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import NavbarBrand from 'react-bootstrap/NavbarBrand'
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
  Avatar,
  ArrowDownIcon,
  ListDialog,
  LogoutIcon,
} from 'components/elements'
import ClickAwayListener from 'react-click-away-listener'
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
    '&:hover': {
      backgroundColor: '#ffebee',
      '& p': {
        color: '#e53935',
      },
      '& svg': {
        '& path': {
          stroke: '#e53935',
        },
      }
    },
  },
  inline: {
    display: 'inline-block',
  },
  avatarWrapper: {
    padding: 5,
  },
  linkWrapper: {
    width: '100%',
    '& div': {
      width: '100%',
      '& label': {
        padding: 0,
        margin: 0,
        cursor: 'pointer',
      },
      '&:hover': {
        height: '100%',
        backgroundColor: '#ffebee',
        width: '100%',
      },
    }
  },
  dialogLinkInner: {
    width: '90%',
    margin: '0 auto',
    fontWeight: 600,
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
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

const DialogLinkWrapper = (props) => {
  const { children, className} = props

  return (
    <div className={className}>
      { children }
    </div>
  )
}

const DialogLinkInnerWrapper = (props) => {
  const  { children, className } = props

  return (
    <div className={className}>
      <div>
        <div style={{ width: '90%', margin: '0 auto' }}>
          <label>{ children }</label>
        </div>
      </div>
    </div>
  )
}

const SideBarLeft = (props) => {
  const { user } = props
  const { username } = user || ''
  const classes = useStyles()
  const location = useLocation()
  const [openDialog, setOpenDialog] = useState()

  const handleClickShowDialog = () => {
    setOpenDialog(true)
  }

  const handleClickAway = () => {
    setOpenDialog(false)
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
            <ClickAwayListener onClickAway={handleClickAway}>
              <div className={classes.bottom}>

                  <ListDialog show={openDialog}>
                    <DialogLinkWrapper className={classes.linkWrapper}>
                      <DialogLinkInnerWrapper className={classes.dialogLinkInner}>
                        Logout @{ username }
                      </DialogLinkInnerWrapper>
                    </DialogLinkWrapper>
                  </ListDialog>
                <div className={classes.avatarWrapper} onClick={handleClickShowDialog}>
                  <Row>
                    <Col xs="auto">
                      <Avatar author={username} />
                    </Col>
                    <Col style={{ paddingLeft: 5 }}>
                      <Row style={{ padding: 0 }}>
                        <Col xs={9} style={{ padding: 0}}>
                          <p style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>{ username }</p>
                          <p style={{ paddingBottom: 0, margin: 0 }}>@{username}</p>
                        </Col>
                        <Col style={{ padding: 0}}>
                          <ArrowDownIcon style={{ marginTop: 18, }}/>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
            </div>
            </ClickAwayListener>
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
