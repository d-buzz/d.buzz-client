import React from 'react'
import config from 'config'
import { createUseStyles } from 'react-jss'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'

const useStyles = createUseStyles({
  footer: {
    position: 'relative',
    bottom: 0,
    width: '100%',
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
  inner: {
    width: '100%',
    paddingTop: 30,
    paddingLeft: 85,
    '& a': {
      color: 'white',
      fontSize: 14,
      paddingRight: 100,
      textDecoration: 'none',
    },
    '& label': {
      color: 'white',
      fontSize: 14,
      paddingRight: 100,
    },
  },
})

const OrganizationFooter = () => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <div className={classes.footer}>
        <Container className={classes.container}>
          <div className={classes.inner}>
            <label>&copy; Dataloft, LLC&nbsp; - <i>v.{config.VERSION}</i></label>
            <Link to="/org/en/tos">Terms</Link>;
            <Link to="/org/en/privacy">Privacy Policy</Link>
            <Link to="/org/en/disclaimer">Disclaimer</Link>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default OrganizationFooter