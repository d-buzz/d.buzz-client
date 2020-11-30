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
  UserDialog,
  MuteModal,
} from 'components'
import { connect } from 'react-redux'
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
  const { route, user } = props
  const { pathname } = useLocation()
  const { is_authenticated } = user

  const organizationRoutes = (pathname.match(/^\/org/))
  let containerClass = classes.guardedContainer
  const unGuardedRoute = (pathname.match(/^\/login/) || !is_authenticated)

  if(organizationRoutes) {
    containerClass = classes.organizationContainer
  }

  if(unGuardedRoute) {
    containerClass = classes.unGuardedContainer
  }

  return(
    <React.Fragment>
      {!is_authenticated && (<AppBar />)}
      {organizationRoutes && (<OrganizationAppBar />)}
      {!isMobile && (
        <Container className={containerClass}>
          <StickyContainer>
            {organizationRoutes && (
              <OrganizationAppFrame pathname={pathname} route={route} />
            )}
            {is_authenticated && !organizationRoutes && (
              <GuardedAppFrame pathname={pathname} route={route} />
            )}
            {!is_authenticated && !organizationRoutes && (
              <UnguardedAppFrame route={route} />
            )}
          </StickyContainer>
          <UserDialog />
        </Container>
      )}
      {isMobile && (<MobileAppFrame pathname={pathname} route={route} />)}
      {organizationRoutes && (<OrganizationFooter />)}
      <ReplyFormModal />
      <NotificationBox />
      <MuteModal />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(AppFrame)
