import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import { useHistory } from 'react-router-dom'
import { BackArrowIcon } from 'components/elements'
import { renderRoutes } from 'react-router-config'
import IconButton from '@material-ui/core/IconButton'
import { useLastLocation } from 'react-router-last-location'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  main: {
    minHeight: '100vh',
    borderLeft: theme.border.primary,
    borderRight: theme.border.primary,
  },
  nav: {
    borderBottom: theme.border.primary,
    borderLeft: theme.border.primary,
    borderRight: theme.border.primary,
    backgroundColor: theme.background.primary,
    zIndex: 2,
    overflow: 'hidden',
    width: '100%',
  },
  navTitle: {
    fontFamily: 'Roboto, sans-serif',
    display: 'inline-block',
    verticalAlign: 'top',
    ...theme.navbar.icon,
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
    fontFamily: 'Segoe-Bold',
    fontSize: 18,
    color: theme.font.color,
  },
  searchWrapper: {
    padding: 0,
    margin: 0,
  },
  walletButton: {
    marginTop: 5,
    float: 'right',
  },
}))

const MobileAppFrame = (props) => {

  const { pathname, route } = props
  const classes = useStyles()

  const history = useHistory()
  const lastLocation = useLastLocation()

  let title = 'Home'

  if(pathname.match(/(\/c\/)/)) {
    title = 'Buzz'
  }

  if(pathname.match(/^\/trending/)) {
    title = 'Trending'
  }

  if(pathname.match(/^\/latest/)) {
    title = 'Latest'
  }

  if(!pathname.match(/(\/c\/)/) && pathname.match(/^\/@/)) {
    title = 'Profile'
  }

  if(pathname.match(/(\/notifications)/)) {
    title = 'Notifications'
  }

  if(pathname.match(/(\/tags?)/)) {
    title = 'Tags'
  }

  if(pathname.match(/(\/search?)/)) {
    title = 'Search'
  }

  const handleClickBackButton = () => {
    // if(!lastLocation) {
    //   history.replace('/')
    // } else {
    history.goBack()
    // }
  }

  return (
    <React.Fragment>
      <div style={{ minHeight: '100vh' }}>
        <Navbar className={classes.nav}>
          <Navbar.Brand className={classes.navTitle}>
            {title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
              <IconButton onClick={handleClickBackButton} size="small">
                <BackArrowIcon />
              </IconButton>
            )}
            {title !== 'Search' && (<span className={classes.title}>{title}</span>)}
          </Navbar.Brand>
        </Navbar>
        <React.Fragment>
          {renderRoutes(route.routes)}
        </React.Fragment>
      </div>
    </React.Fragment>
  )
}

export default MobileAppFrame
