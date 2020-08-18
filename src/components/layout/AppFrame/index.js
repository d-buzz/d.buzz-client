import React from 'react'
import Container from 'react-bootstrap/Container'
import { StickyContainer } from 'react-sticky'
import { AppBar, GuardedAppFrame, UnguardedAppFrame } from 'components'
import { createUseStyles } from 'react-jss'
import { useLocation } from 'react-router-dom'

const useStyles = createUseStyles({
  main: {
    minHeight: '100vh',
    borderLeft: '1px solid #e6ecf0',
    borderRight: '1px solid #e6ecf0',
  },
  inner: {
    width: '98%',
    margin: '0 auto',
  },
  guardedContainer: {
    '@media (min-width: 1250px)': {
      '&.container': {
        maxWidth: '1250px',
      },
    },
  },
  unGuardedContainer: {
    '@media (min-width: 1100px)': {
      '&.container': {
        maxWidth: '900px',
      },
    },
  },
})

const AppFrame = (props) => {
  const classes = useStyles()
  const { route } = props
  const { pathname } = useLocation()

  let containerClass = classes.guardedContainer
  const unGuardedRoute = (pathname.match(/^\/login/) || pathname.match(/^\/ug/))

  if(unGuardedRoute) {
    containerClass = classes.unGuardedContainer
  }

  return(
    <React.Fragment>
      {unGuardedRoute && (<AppBar />)}
      <Container className={containerClass}>
        <StickyContainer>
          {!unGuardedRoute && (
            <GuardedAppFrame pathname={pathname} route={route} />
          )}
          {unGuardedRoute && (
            <UnguardedAppFrame route={route} />
          )}
        </StickyContainer>
      </Container>
    </React.Fragment>
  )
}

export default AppFrame
