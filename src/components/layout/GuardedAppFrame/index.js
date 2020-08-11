import React from 'react'
import { SideBarLeft, SideBarRight } from 'components'
import { Sticky } from 'react-sticky'
import { useHistory } from 'react-router-dom'
import { BackArrowIcon } from 'components/elements'
import IconButton from '@material-ui/core/IconButton'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { createUseStyles } from 'react-jss'
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
  const { route, pathname  } = props
  const classes = useStyles()
  const history = useHistory()

  let title = 'Home'

  if(pathname.match(/(\/c\/)/)) {
    title = 'BUZZ'
  }

  if(pathname.match(/^\/trending/)) {
    title = 'Trending'
  }

  if(pathname.match( /^\/latest/)) {
    title = 'Latest'
  }

  if(!pathname.match(/(\/c\/)/) && pathname.match(/^\/@/)) {
    title = 'Profile'
  }

  if(pathname.match(/(\/notifications)/) && pathname.match(/(\/p\/)/)) {
    title = 'Notifications'
  }

  const handleClickBackButton = () => {
    try {
      history.goBack()
    } catch(e) {
      history.replace('/')
    }
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

export default GuardedAppFrame
