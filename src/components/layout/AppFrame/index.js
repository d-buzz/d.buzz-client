import React from 'react'
import Container from 'react-bootstrap/Container'
import { StickyContainer, Sticky } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import IconButton from '@material-ui/core/IconButton'
import { BackArrowIcon } from 'components/elements'
import { SideBarLeft, SideBarRight, AppBar } from 'components'
import { createUseStyles } from 'react-jss'
import { useLocation, useHistory } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

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
    '@media (min-width: 1200px)': {
      '&.container': {
        maxWidth: '1300px',
      },
    },
  },
  unGuardedContainer: {
    '@media (min-width: 1200px)': {
      '&.container': {
        maxWidth: '1100px',
      },
    },
  },
  nav: {
    borderBottom: '1px solid #e6ecf0',
    borderLeft: '1px solid #e6ecf0',
    borderRight: '1px solid #e6ecf0',
    backgroundColor: 'white',
    zIndex: 2,
    overflow: 'hidden',
    width: '100%',
  },
  trendingWrapper: {
    width: '100%',
    minHeight: '100vh',
    border: '1px solid #e6ecf0',
  },
  clearPadding: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    display: 'inline-block',
    marginLeft: 5,
  }
})

const GuardedAppFrame = (props) => {

  const { route, pathname } = props
  const classes = useStyles()
  const history = useHistory()

  let title = 'Home'

  if(pathname.match(/^\/content\/@/)) {
    title = 'BUZZ'
  } else if(pathname.match(/^\/trending/)) {
    title = 'Trending'
  } else if(pathname.match( /^\/latest/)) {
    title = 'Latest'
  } else if(pathname.match(/^(?:[^/content]*)\/@/)) {
    title = 'Profile'
  }

  const handleClickBackButton = () => {
    history.goBack()
  }

  return (
    <React.Fragment>
      <Row>
        <Col xs={2} className={classes.clearPadding}>
          <Sticky>
            {
              ({ style }) => (
                <div style={style}>
                  <SideBarLeft/>
                </div>
              )
            }
          </Sticky>
        </Col>
        <Col xs={7} className={classes.clearPadding}>
          <Sticky>
            {
              ({ style }) => (
                <Navbar style={style} className={classes.nav}>
                  <Navbar.Brand style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {
                      title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
                        <IconButton onClick={handleClickBackButton} size="small">
                          <BackArrowIcon />
                        </IconButton>
                      )
                    }
                    <span className={classes.title}>{ title }</span>
                  </Navbar.Brand>
                </Navbar>
              )
            }
          </Sticky>
          <div className={classes.main}>
            <React.Fragment>
              { renderRoutes(route.routes) }
            </React.Fragment>
          </div>
        </Col>
        <Col xs={3}>
          <Sticky>
            {
              ({ style }) => (
                <div style={style}>
                  <SideBarRight hideSearchBar={false} />
                </div>
              )
            }
          </Sticky>
        </Col>
      </Row>
    </React.Fragment>
  )
}

const UnguardedAppFrame = (props) => {
  const { route } = props
  const classes = useStyles()

  return (
    <React.Fragment>
      <Row>
        <Col xs={8} className={classes.clearPadding}>
          <div style={{ paddingTop: 25 }} className={classes.main}>
            <React.Fragment>
              { renderRoutes(route.routes) }
            </React.Fragment>
          </div>
        </Col>
        <Col xs={4}>
          <Sticky>
            {
              ({ style }) => (
                <div style={style}>
                  <SideBarRight hideSearchBar={true} />
                </div>
              )
            }
          </Sticky>
        </Col>
      </Row>
    </React.Fragment>
  )
}

const AppFrame = (props) => {
  const classes = useStyles()
  const { route } = props
  const { pathname } = useLocation()

  let containerClass = classes.guardedContainer
  const unGuardedRoute = (pathname === '/login' || pathname.includes('/ug'))

  if(unGuardedRoute) {
    containerClass = classes.unGuardedContainer
  }

  return(
    <React.Fragment>
      { unGuardedRoute && (<AppBar />) }
      <Container className={containerClass}>
        <StickyContainer>
          {
            !unGuardedRoute && (
              <GuardedAppFrame pathname={pathname} route={route} />
            )
          }
          {
            unGuardedRoute && (
              <UnguardedAppFrame route={route} />
            )
          }
        </StickyContainer>
      </Container>
    </React.Fragment>
  )
}

export default AppFrame
