import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import FormLabel from 'react-bootstrap/FormLabel'
import FormControl from 'react-bootstrap/FormControl'
import FormCheck from 'react-bootstrap/FormCheck'
import {
  BrandIcon,
  SearchIcon,
  RoundedField,
  ContainedButton,
  IconButton,
  BackArrowIcon,
} from 'components/elements'
import { createUseStyles } from 'react-jss'
import { useLocation, useHistory } from 'react-router-dom'

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
    '@media (min-width: 1200px)': {
      '&.container': {
        maxWidth: '1100px',
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

  const FormSpacer = () => {
    return (
      <div style={{ height: 15, width: '100%' }}></div>
    )
  }

  const LoginModal = () => {
    return (
      <React.Fragment>
        <Modal show={true} onHide={handleClickCloseLoginModal}>
          <ModalBody>
            <div style={{ width: '98%', margin: '0 auto', top: 10 }}>
              <center>
                <h5>Login to D.Buzz</h5>
              </center>
            </div>
            <FormLabel>Username</FormLabel>
            <FormControl type="text" />
            <FormSpacer />
            <FormLabel>Password</FormLabel>
            <FormControl type="password" />
            <FormSpacer />
            <FormCheck type="checkbox" label="Use hivekeychain" />
            <center>
              <ContainedButton
                transparent={true}
                className={classes.loginButton}
                fontSize={15}
                label="Submit"
              />
            </center>
          </ModalBody>
        </Modal>
      </React.Fragment>
    )
  }

  return (
    <Navbar fixed="top" className={classes.nav}>
      <Container className={classes.container}>
        <Navbar.Brand>
          {
            pathname !== '/login' && (
              <React.Fragment>
                <IconButton onClick={handleClickBackButton} style={{ display: 'inline-block' }} icon={<BackArrowIcon />} />
                &nbsp;
              </React.Fragment>
            )
          }
          <BrandIcon height={30} top={-15} />
        </Navbar.Brand>
        <Nav className="mr-auto">
          <RoundedField
            style={{ height: 35 }}
            icon={<SearchIcon top={-2} />}
            placeholder="Search D.Buzz"
            className={classes.search}
          />
        </Nav>
        <ContainedButton onClick={handleClickOpenLoginModal} transparent={true} fontSize={15} label="Log in" className={classes.button} />
        <ContainedButton style={{ marginLeft: 5 }} fontSize={15} label="Sign up" className={classes.button} />
      </Container>
      <LoginModal />
    </Navbar>
  )
}

export default AppBar
