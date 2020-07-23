import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Trending, SideBarRight } from 'components'

import {
  BrandIcon,
  SearchIcon,
  RoundedField,
  ContainedButton,
} from 'components/elements'
import { createUseStyles } from 'react-jss'
import { StickyContainer, Sticky } from 'react-sticky'

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
  container: {
    '@media (min-width: 1200px)': {
      '&.container': {
        maxWidth: '1100px',
      },
    },
  },
  trendingWrapper: {
    paddingTop: 70,
    width: '100%',
    minHeight: '100vh',
    border: '1px solid #e6ecf0',
  }
})

const Login = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
        <Navbar fixed="top" className={classes.nav}>
          <Container className={classes.container}>
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
        <Container className={classes.container}>
          <StickyContainer>
            <Row style={{ paddingLeft: 0 }}>
              <Col xs={8} style={{ padding: 0 }}>
                <div className={classes.trendingWrapper}>
                  <Trending />
                </div>
              </Col>
              <Col xs={4}>
                  <Sticky>
                  {
                    ({ style }) => (
                      <div style={style}>
                        <SideBarRight top={70} hideSearchBar={true} />
                      </div>
                    )
                  }
                </Sticky>
              </Col>
            </Row>
          </StickyContainer>
        </Container>
    </React.Fragment>
  )
}

export default Login
