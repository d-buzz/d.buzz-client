import React from 'react'
import Container from 'react-bootstrap/Container'
import { StickyContainer } from 'react-sticky'
import {
  AppBar,
  GuardedAppFrame,
  UnguardedAppFrame,
  OrganizationAppFrame,
  OrganizationAppBar,
  OrganizationFooter,
  MobileAppFrame,
  ReplyFormModal,
  NotificationBox,
} from 'components'
import { createUseStyles } from 'react-jss'
import { useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'


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
    width: 'max-content',
    '@media (min-width: 1250px)': {
      margin: '0 auto !important',
      '&.container': {
        margin: '0 auto',
        maxWidth: 'max-content',
      },
    },
    '@media (max-width: 768px)': {
      margin: '0 auto !important',
      '&.container': {
        margin: '0 auto',
        minWidth: 'max-content',
      },
    },
  },
  unGuardedContainer: {
    '@media (min-width: 1100px)': {
      margin: '0 auto !important',
      '&.container': {
        maxWidth: '900px',
      },
    },
  },
  organizationContainer: {
    '@media (min-width: 1100px)': {
      margin: '0 auto !important',
      '&.container': {
        maxWidth: '1250px',
        paddingBottom: 25,
      },
    },
  },
})

const AppFrame = (props) => {
  const classes = useStyles()
  const { route } = props
  const { pathname } = useLocation()

  const organizationRoutes = (pathname.match(/^\/org/))
  let containerClass = classes.guardedContainer
  const unGuardedRoute = (pathname.match(/^\/login/) || pathname.match(/^\/ug/))

  if(organizationRoutes) {
    containerClass = classes.organizationContainer
  }

  if(unGuardedRoute) {
    containerClass = classes.unGuardedContainer
  }

  return(
    <React.Fragment>
      {unGuardedRoute && (<AppBar />)}
      {organizationRoutes && (<OrganizationAppBar />)}
      {!isMobile && (
        <Container className={containerClass}>
          <StickyContainer>
            {organizationRoutes && (
              <OrganizationAppFrame pathname={pathname} route={route} />
            )}
            {!unGuardedRoute && !organizationRoutes && (
              <GuardedAppFrame pathname={pathname} route={route} />
            )}
            {unGuardedRoute && !organizationRoutes && (
              <UnguardedAppFrame route={route} />
            )}
          </StickyContainer>
        </Container>
      )}
      {isMobile && (<MobileAppFrame pathname={pathname} route={route} />)}
      {organizationRoutes && (<OrganizationFooter />)}
      <ReplyFormModal />
      <NotificationBox />
    </React.Fragment>
  )
}

export default AppFrame
