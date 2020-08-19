import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {
  BrandIcon,
  ContainedButton,
  IconButton,
  BackArrowIcon,
} from 'components/elements'
import { LoginModal, SearchField } from 'components'
import { createUseStyles } from 'react-jss'
import { useLocation, useHistory, Link } from 'react-router-dom'

const useStyles = createUseStyles({
  nav: {
    height: 55,
    backgroundColor: 'white',
    borderBottom: '1px solid rgb(204, 214, 221)',
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
})

const AppBar = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const { pathname } = location

  const handleClickBackButton = () => {
    history.goBack()
  }

  const handleClickOpenLoginModal = () => {
    setOpen(true)
  }

  const handleClickCloseLoginModal = () => {
    setOpen(false)
  }

  return (
    <Navbar fixed="top" className={classes.nav}>
      <Container className={classes.container}>
        <Navbar.Brand>
          {pathname !== '/ug' && (
            <React.Fragment>
              <IconButton onClick={handleClickBackButton} style={{ display: 'inline-block' }} icon={<BackArrowIcon />} />
              &nbsp;
            </React.Fragment>
          )}
          <Link to="/">
            <BrandIcon height={30} top={-15} />
          </Link>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <SearchField disableTips={true} />
        </Nav>
        <ContainedButton onClick={handleClickOpenLoginModal} transparent={true} fontSize={15} label="Log in" className={classes.button} />
        <ContainedButton style={{ marginLeft: 5 }} fontSize={15} label="Sign up" className={classes.button} />
      </Container>
      <LoginModal show={open} onHide={handleClickCloseLoginModal} />
    </Navbar>
  )
}

export default AppBar
