import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import {
  BrandIcon,
  SearchIcon,
  RoundedField,
  ContainedButton,
} from 'components/elements'
import { createUseStyles } from 'react-jss'

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
  }
})

const Login = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
        <Navbar className={classes.nav}>
          <Container>
            <Navbar.Brand>
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
            <ContainedButton transparent={true} fontSize={15} label="Log in" className={classes.button} />
            <ContainedButton style={{ marginLeft: 5 }} fontSize={15} label="Sign up" className={classes.button} />
          </Container>
        </Navbar>
    </React.Fragment>
  )
}

export default Login
