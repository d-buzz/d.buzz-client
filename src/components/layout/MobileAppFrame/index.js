import React from 'react'
// import Navbar from 'react-bootstrap/Navbar'
// import { useHistory } from 'react-router-dom'
// import { BackArrowIcon } from 'components/elements'
// import { renderRoutes } from 'react-router-config'
// import IconButton from '@material-ui/core/IconButton'
// import { useLastLocation } from 'react-router-last-location'
import { connect } from 'react-redux'
import {
  BrandIcon,
  BrandIconDark,
  ContainedButton,
} from 'components/elements'
import config from 'config'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  main: {
    minHeight: '100vh',
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
  notes: {
    ...theme.font,
  },
}))

const MobileAppFrame = (props) => {

  const { theme } = props
  // const { pathname, route } = props
  const classes = useStyles()

  // const history = useHistory()
  // const lastLocation = useLastLocation()

  // let title = 'Home'

  // if(pathname.match(/(\/c\/)/)) {
  //   title = 'Buzz'
  // }

  // if(pathname.match(/^\/trending/)) {
  //   title = 'Trending'
  // }

  // if(pathname.match(/^\/latest/)) {
  //   title = 'Latest'
  // }

  // if(!pathname.match(/(\/c\/)/) && pathname.match(/^\/@/)) {
  //   title = 'Profile'
  // }

  // if(pathname.match(/(\/notifications)/)) {
  //   title = 'Notifications'
  // }

  // if(pathname.match(/(\/tags?)/)) {
  //   title = 'Tags'
  // }

  // if(pathname.match(/(\/search?)/)) {
  //   title = 'Search'
  // }

  // const handleClickBackButton = () => {
  //   if(!lastLocation) {
  //     history.replace('/')
  //   } else {
  //     history.goBack()
  //   }
  // }

  const openRedirect = () => {
    window.open("https://d.buzz/", "_self")
  }

  return (
    <React.Fragment>
      <div className={classes.main}>
        {/* <Navbar className={classes.nav}>
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
        </React.Fragment> */}
        <div style={{ width: '98%', margin: '0 auto', marginTop: 20 }}>
          <center>
            {theme.mode === 'light' &&  (<BrandIcon />)}
            {(theme.mode === 'night' || theme.mode === 'gray') && (<BrandIconDark />)}
            <h6 style={{ paddingTop: 10 }} className={classes.notes}>
              Hello there, mobile view is still underway for this version
            </h6>
          </center>
          <iframe
            title="giphy"
            src="https://giphy.com/embed/XaMTNZkRahZ7ysPMci"
            width="100%"
            height="250px"
            frameBorder="0"
            class="giphy-embed"
            allowFullScreen>
          </iframe>
          <center>
            <h6 className={classes.notes}>meanwhile you can still view the application on mobile by following the link below</h6>
            <ContainedButton
              style={{ height: 45 }}
              fontSize={14}
              transparent={true}
              label="Take me to the main site"
              labelStyle={{ paddingTop: 10 }}
              onClick={openRedirect}
            />
            <br />
            <label>&copy; Dataloft, LLC&nbsp; - <i>v.{config.VERSION}</i></label>
          </center>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
})

export default connect(mapStateToProps)(MobileAppFrame)
