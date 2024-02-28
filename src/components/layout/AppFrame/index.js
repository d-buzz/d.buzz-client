import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import { StickyContainer } from 'react-sticky'
import {
  InstallAppBanner,
  AppBar,
  DevelopersFrame,
  GuardedAppFrame,
  UnguardedAppFrame,
  OrganizationAppFrame,
  MobileAppFrame,
  ReplyFormModal,
  LiteReplyFormModal,
  NotificationBox,
  UserDialog,
  MuteModal,
  LoginModal,
  HideBuzzModal,
  CensorshipModal,
  FollowMutedListModal,
  BlacklistModal,
  FollowBlacklistsModal,
} from 'components'
import {
  setLinkConfirmationModal,
} from 'store/interface/actions'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { bindActionCreators } from 'redux'
import { setIntentBuzz, setFromIntentBuzz } from 'store/auth/actions'
import queryString from 'query-string'
import LinkConfirmationModal from 'components/modals/LinkConfirmationModal'
import { isLiteMode } from 'services/helper'


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
  const { route, user, setIntentBuzz, setFromIntentBuzz, fromIntentBuzz, linkConfirmationModal, setLinkConfirmationModal } = props
  const { pathname, search } = useLocation()
  const { is_authenticated } = user
  const [showLogin, setShowLogin] = useState(false)
  const params = queryString.parse(search) || ''
  const referrer = document.referrer

  const organizationRoutes = pathname.match(/^\/(tos|privacy|disclaimer|getstarted|faqs|leaderboard)/)
  const developersRoutes = pathname.match(/^\/developers/)

  let containerClass = classes.guardedContainer
  const unGuardedRoute = (pathname.match(/^\/login/) || !is_authenticated)
  const [signUpConfirmation, setSignUpConfirmation] = useState(false)

  if (organizationRoutes) {
    containerClass = classes.organizationContainer
  }

  if (unGuardedRoute) {
    containerClass = classes.unGuardedContainer
  }

  const checkIfLogin = () => {
    if (!is_authenticated) {
      setShowLogin(true)
    } else {
      setShowLogin(false)
    }
  }

  useEffect(() => {
    if (pathname.match(/^\/intent\/buzz/)) {
      setFromIntentBuzz(true)
      handleSetBuzzIntent()
      checkIfLogin()
    } else if ((params.status === 'success') && referrer === 'https://hiveonboard.com/') {
      setSignUpConfirmation(true)
      checkIfLogin()
    } else {
      setFromIntentBuzz(false)
      setShowLogin(false)
    }
    // eslint-disable-next-line
  }, [params, pathname]);

  const handleClickCloseLoginModal = () => {
    setShowLogin(false)
  }

  const handleSetBuzzIntent = () => {
    if (params.text) {
      const payload = { ...params, hashtags: params.tags }
      setIntentBuzz(payload)
    }
  }

  return (
    <React.Fragment>
      {!isMobile && <InstallAppBanner />}
      {!is_authenticated && (<AppBar />)}
      {!isMobile && !developersRoutes && !organizationRoutes && (
        <Container className={containerClass}>
          <StickyContainer>
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
      {isMobile && !developersRoutes && !organizationRoutes && (<MobileAppFrame pathname={pathname} route={route} />)}
      {developersRoutes && (<DevelopersFrame route={route} />)}
      {organizationRoutes && (<OrganizationAppFrame pathname={pathname} route={route} />)}
      {isLiteMode() ? <LiteReplyFormModal /> : <ReplyFormModal />}
      <NotificationBox />
      <MuteModal />
      <FollowMutedListModal/>
      <HideBuzzModal />
      <CensorshipModal />
      <BlacklistModal/>
      <FollowBlacklistsModal/>
      <LoginModal
        show={showLogin}
        onHide={handleClickCloseLoginModal}
        signUpConfirmation={signUpConfirmation}
        fromIntentBuzz={fromIntentBuzz}
        buzzIntentCallback={handleSetBuzzIntent} />
      <LinkConfirmationModal link={linkConfirmationModal} onHide={setLinkConfirmationModal} />

    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  fromIntentBuzz: state.auth.get('fromIntentBuzz'),
  linkConfirmationModal: state.interfaces.get('linkConfirmationModal'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setIntentBuzz,
    setFromIntentBuzz,
    setLinkConfirmationModal,
  }, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(AppFrame)
