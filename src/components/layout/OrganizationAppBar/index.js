import React from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import {
  OrgIcon,
} from 'components/elements'
import { createUseStyles } from 'react-jss'
import { Link, useLocation } from 'react-router-dom'

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
    backgroundImage: `url("./../../dbuzz.png")`,
  },
})

const OrganizationAppBar = () => {
  const classes = useStyles()
  const { pathname } = useLocation()

  const termsOfService = (pathname.match(/^\/org\/en\/tos/))
  const privacyPolicy = (pathname.match(/^\/org\/en\/privacy/))
  const disclaimer = (pathname.match(/^\/org\/en\/disclaimer/))

  let title = ''
  if(termsOfService) {
    title = 'Terms of Service'
  } else if(privacyPolicy) {
    title = 'Privacy Policy'
  } else if(disclaimer) {
    title = 'Disclaimer'
  }

  
  return (
    <React.Fragment>
      <Navbar fixed="top" className={classes.nav}>
      <Container className={classes.container}>
        <Navbar.Brand>
          <Link to="/">
            <OrgIcon height={25} top={-15} style={{marginLeft: '-239'}} />
          </Link>
          &nbsp;&nbsp;
          <span>
           {title}
          </span>
        </Navbar.Brand>
        <div style={{marginRight: '-205px'}}>
          <Button style={{borderRadius: '20px', paddingLeft: 15}} variant="outline-light">Download: D.BUZZ User Agreement</Button>
        </div>
      </Container>
      </Navbar>
      <div className={classes.heroSection}>
        <Container style={{overflowX: 'hidden', overflowY: 'auto'}}>
          <div style={{
            fontFamily: 'Segoe-Bold',
            fontSize: '96px',
            color: 'white',
            lineHeight: '1em',
            padding: '132px 180px 96px 180px',
          }}>
            D.BUZZ &nbsp; {title}
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default OrganizationAppBar