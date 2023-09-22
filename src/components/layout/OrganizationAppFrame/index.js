import React from 'react'
import { StickyContainer } from 'react-sticky'
import config from 'config'
import Container from '@material-ui/core/Container'
import { renderRoutes } from 'react-router-config'
import { createUseStyles } from 'react-jss'
import { Link, useLocation } from 'react-router-dom'
import Typewriter from 'typewriter-effect'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import {
  OrgIcon,
} from 'components/elements'


const useStyles = createUseStyles({
  nav: {
    height: 80,
    backgroundColor: '#f83541',
  },
  container: {
    margin: '0 auto',
    '& span': {
      fontFamily: 'Segoe-Bold',
      fontSize: '0.9975rem',
      color: 'white',
    },
    '@media (min-width: 1100px)': {
      '&.container': {
        maxWidth: '900px',
      },
    },
  },
  heroSection: {
    width: '100%',
    maxHeight: 500,
    backgroundColor: '#f83541',
    paddingTop: '4rem',
    backgroundSize: '85%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '45% 73%',
  },
  footer: {
    position: 'relative',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#f83541',
  },
  inner: {
    width: '100%',
    paddingTop: '3%',
    '& a': {
      color: 'white',
      fontSize: 14,
      paddingRight: '3%',
      textDecoration: 'none',
    },
    '& label': {
      color: 'white',
      fontSize: 14,
      paddingRight: '3%',
    },
  },
})

const OrganizationAppBar = () => {
  const classes = useStyles()
  const { pathname } = useLocation()

  const termsOfService = (pathname.match(/^\/\/tos/))
  const privacyPolicy = (pathname.match(/^\/privacy/))
  const disclaimer = (pathname.match(/^\/disclaimer/))
  const getStarted = (pathname.match(/^\/getstarted/))
  const faqs = (pathname.match(/^\/FAQs/))

  let title = ''
  if (termsOfService) {
    title = 'Terms of Service'
  } else if (privacyPolicy) {
    title = 'Privacy Policy'
  } else if (disclaimer) {
    title = 'Disclaimer'
  } else if (getStarted) {
    title = 'Get Started'
  } else if (faqs) {
    title = 'FAQs'
  }


  return (
    <React.Fragment>
      <Container className={classes.container}>
        <Navbar collapseOnSelect expand="md" fixed="top" variant="dark" className={classes.nav}>
          <Navbar.Brand>
            <Link to="/">
              <left>
                <OrgIcon height={25} top={-15} />
              </left>
            </Link>
          &nbsp;&nbsp;
            <span>
              {title}
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" />
            <Nav>
              <Button style={{ borderRadius: '20px', paddingLeft: 15 }} variant="outline-light">Download: D.BUZZ User Agreement</Button>
            </Nav>
          </Navbar.Collapse>

        </Navbar>
      </Container>
      <div className={classes.heroSection}>
        <center className="d-none d-sm-block">
          <div style={{
            fontFamily: 'Segoe-Bold',
            fontSize: '96px',
            color: 'white',
            lineHeight: '1em',
            padding: '132px 180px 96px 180px',
          }}>
            <Typewriter
              options={{
                strings: title,
                autoStart: true,
                loop: true,
                deleteChars: 30,
                pauseFor: 10000,
              }}
            />

          </div>
        </center>
      </div>
    </React.Fragment>
  )
}

const OrganizationFooter = () => {
  const classes = useStyles()
  const currentSiteUrl = window.location.protocol + '//' + window.location.host

  return (
    <React.Fragment>
      <div className={classes.footer}>
        <Container fluid>
          <center>
            <div className={classes.inner}>
              <label><a href={currentSiteUrl}>&copy; DBuzz&nbsp; - <i>v.{config.VERSION}</i></a></label>
              <Link to="/tos">Terms & Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/disclaimer">Disclaimer</Link>
              <Link to="/FAQs">FAQs</Link>
            </div>
          </center>
        </Container>
      </div>
    </React.Fragment>
  )
}

const OrganizationAppFrame = (props) => {
  const {
    route,
  } = props

  return (
    <React.Fragment>
      <OrganizationAppBar />
      <Container maxWidth="md">
        <StickyContainer>
          {renderRoutes(route.routes)}
        </StickyContainer>
      </Container>
      <OrganizationFooter />
    </React.Fragment>
  )
}

export default OrganizationAppFrame
