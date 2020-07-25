import React from 'react'
import Container from 'react-bootstrap/Container'
import { StickyContainer, Sticky } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import { BackArrowIcon, IconButton } from 'components/elements'
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
  }
})

const AppFrame = (props) => {
  const classes = useStyles()
  const { route } = props
  const { pathname } = useLocation()
  const history = useHistory()

  let containerClass = classes.guardedContainer
  let title = 'Home'

  let hideSearchBar = false
  const unGuardedRoute = (pathname === '/login' || pathname.includes('/ug'))

  if(unGuardedRoute) {
    containerClass = classes.unGuardedContainer
  }

  if(pathname.includes('/content/@')) {
    title = 'BUZZ'
  } else if(pathname.includes('/trending')) {
    title = 'Trending'
  } else if(pathname.includes('/latest')) {
    title = 'Latest'
  }

  const handleClickBackButton = () => {
    history.goBack()
  }

  return(
    <React.Fragment>
      { unGuardedRoute && (<AppBar />) }
      <Container className={containerClass}>
        <StickyContainer>
          {
            !unGuardedRoute && (
              <React.Fragment>
                <Row>
                  <Col xs={2} style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                  <Col xs={7} style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Sticky>
                      {
                        ({ style }) => (
                          <Navbar style={style} className={classes.nav}>
                            <Navbar.Brand href="#" style={{ fontFamily: 'Roboto, sans-serif' }}>
                              {
                                title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
                                  <IconButton onClick={handleClickBackButton} style={{ display: 'inline-block' }} icon={<BackArrowIcon />} />
                                )
                              }
                              <span style={{ display: 'inline-block', marginLeft: 5, }}>{ title }</span>
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
                            <SideBarRight hideSearchBar={hideSearchBar} />
                          </div>
                        )
                      }
                    </Sticky>
                  </Col>
                </Row>
              </React.Fragment>
            )
          }
          {
            unGuardedRoute && (
              <React.Fragment>
                <Row>
                  <Col xs={8} style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                            <SideBarRight hideSearchBar={hideSearchBar} />
                          </div>
                        )
                      }
                    </Sticky>
                  </Col>
                </Row>
              </React.Fragment>
            )
          }
        </StickyContainer>
      </Container>
    </React.Fragment>
  )
}

export default AppFrame
