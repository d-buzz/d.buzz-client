import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {
  BrandIcon,
  BrandIconDark,
  ContainedButton,
  BackArrowIcon,
} from 'components/elements'
import { LoginModal, SearchField } from 'components'
import { createUseStyles } from 'react-jss'
import { useLocation, useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isMobile } from 'react-device-detect'
import { getTheme } from 'services/helper'
import SignupModal from 'components/modals/SignupModal'

const IconButton = React.lazy(() => import('@material-ui/core/IconButton'))

const useStyles = createUseStyles(theme => ({
  nav: {
    height: 55,
    top: 'auto',
    backgroundColor: theme.nav.background,
    borderBottom: theme.border.primary,
  },
  search: {
    width: 350,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#e6ecf0',
  },
  button: {
    width: 100,
    height: 35,
  },
  loginButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
  container: {
    margin: '0 auto',
    '@media (min-width: 1100px)': {
      '&.container': {
        maxWidth: '900px',
      },
    },
  },
  backButton: {
    display: 'inline-block',
    ...theme.icon,
  },
}))

const AppBar = (props) => {
  const classes = useStyles()
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [openSignupModal, setOpenSignupModal] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const { pathname } = location
  const mode = getTheme() || 'light'

  const handleClickBackButton = () => {
    history.goBack()
  }

  const handleClickOpenLoginModal = () => {
    setOpenLoginModal(true)
  }

  const handleClickCloseLoginModal = () => {
    setOpenLoginModal(false)
  }

  const handleClickOpenSignupModal = () => {
    const referralRegex = /#\/@([A-Za-z0-9-]+\.?[A-Za-z0-9-]+)(\?ref=[a-z]+)?$/
    const referral = window.location.hash.match(referralRegex)?.[1]
    if(referral) {
      window.location.href = `http://localhost:3000/@${referral}`
    } else {
      window.location.href = `http://localhost:3000`
    }
  }
  
  const handleClickCloseSignupModal = () => {
    setOpenSignupModal(false)
  }

  return (
    <Navbar fixed="top" className={classes.nav}>
      <Container className={classes.container}>
        <Navbar.Brand>
          {pathname !== '/ug' && pathname !== '/' && (
            <React.Fragment>
              <IconButton className={classes.backButton} onClick={handleClickBackButton} size="small">
                <BackArrowIcon />
              </IconButton>
              &nbsp;
            </React.Fragment>
          )}
          <Link to="/">
            {mode === 'light' && (<BrandIcon height={30} top={-15} />)}
            {(mode === 'night' || mode === 'gray') && (<BrandIconDark height={30} top={-15} />)}
          </Link>
        </Navbar.Brand>
        {!isMobile && (
          <Nav className="mr-auto">
            <SearchField disableTips={true} />
          </Nav>
        )}
        <div style={{ display: 'flex' }}>
          <ContainedButton style={{ marginLeft: 5 }} onClick={handleClickOpenLoginModal} transparent={true} fontSize={15} label="Log in" className={classes.button} />
          <ContainedButton style={{ marginLeft: 5 }} onClick={handleClickOpenSignupModal} fontSize={15} label="Sign up" className={classes.button} />
        </div>
      </Container>
      <LoginModal show={openLoginModal} onHide={handleClickCloseLoginModal} />
      <SignupModal show={openSignupModal} onHide={handleClickCloseSignupModal} />
    </Navbar>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
})

export default connect(mapStateToProps)(AppBar)
