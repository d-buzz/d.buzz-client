import React, { useState, useEffect } from 'react'
import { SideBarLeft, SideBarRight, SearchField, NotificationBox } from 'components'
import { Sticky } from 'react-sticky'
import { useHistory } from 'react-router-dom'
import { BackArrowIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { renderRoutes } from 'react-router-config'
import IconButton from '@material-ui/core/IconButton'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import queryString from 'query-string'
import { clearNotificationsRequest } from 'store/profile/actions'
import { searchRequest, clearSearchPosts } from 'store/posts/actions'
import { ContainedButton } from 'components/elements'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { useLastLocation } from 'react-router-last-location'


const useStyles = createUseStyles(theme => ({
  main: {
    minHeight: '100vh',
    borderLeft: theme.border.primary,
    borderRight: theme.border.primary,
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
    fontFamily: 'Segoe-Bold',
    fontSize: 18,
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

const GuardedAppFrame = (props) => {
  const {
    route,
    pathname,
    searchRequest,
    clearSearchPosts,
    clearNotificationsRequest,
    loading,
    count,
  } = props
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const lastLocation = useLastLocation()
  const params = queryString.parse(location.search) || ''
  const [search, setSearch] = useState(params.q)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [message, setMessage] = useState()
  const [severity, setSeverity] = useState('success')


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
    if(!lastLocation) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }

  const onChange = (e) => {
    const { target } = e
    const { value } = target
    setSearch(value)
  }

  const handleSearchKey = (e) => {
    if(e.key === 'Enter') {
      clearSearchPosts()
      history.replace(`/search/posts?q=${encodeURIComponent(search)}`)
      searchRequest(search)
    }
  }

  const handleSnackBarClose = () => {
    setShowSnackbar(false)
  }

  const handleClearNotification = () => {
    clearNotificationsRequest()
      .then(result => {
        setShowSnackbar(true)
        if(result.success) {
          setMessage('Successfully marked all your notifications as read')
        } else {
          setSeverity('error')
          setMessage('Failed marking all notifications as read')
        }
      })
  }

  useEffect(() => {
    if(typeof params === 'object') {
      setSearch(params.q)
    }
  }, [params])

  return (
    <React.Fragment>
      <Row>
        <Col xs="auto" className={classes.clearPadding}>
          <div style={{ width: 270 }}>
            <Sticky>
              {({ style }) => (
                <div style={{...style}}>
                  <SideBarLeft/>
                </div>
              )}
            </Sticky>
          </div>
        </Col>
        <Col xs="auto" className={classes.clearPadding}>
          <div style={{ width: 595 }}>
            <Sticky>
              {({ style }) => (
                <Navbar style={style} className={classes.nav}>
                  <Navbar.Brand style={{ fontFamily: 'Roboto, sans-serif', display: 'inline-block', verticalAlign: 'top' }}>
                    {title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
                      <IconButton onClick={handleClickBackButton} size="small">
                        <BackArrowIcon />
                      </IconButton>
                    )}
                    {title !== 'Search' && (<span className={classes.title}>{title}</span>)}
                  </Navbar.Brand>
                  {title === 'Search' && (
                    <div style={{ display: 'inline-block', verticalAlign: 'top', width: '100%' }}>
                      <SearchField
                        disableTips={true}
                        iconTop={-2}
                        labelFontSize={14}
                        searchWrapperClass={classes.searchWrapper}
                        style={{ height: 30 }}
                        value={search}
                        onChange={onChange}
                        onKeyDown={handleSearchKey}
                        placeholder="You can use @username or #tag to simplify your query"
                      />
                    </div>
                  )}
                  {title === 'Notifications' && count.unread !== 0 && (
                    <div style={{ width: '100%' }}>
                      <ContainedButton
                        fontSize={12}
                        style={{ float: 'right', marginTop: 5 }}
                        transparent={true}
                        label="Mark all as read"
                        loading={loading}
                        disabled={loading}
                        className={classes.walletButton}
                        onClick={handleClearNotification}
                      />
                    </div>
                  )}
                </Navbar>
              )}
            </Sticky>
            <div className={classes.main}>
              <React.Fragment>
                {renderRoutes(route.routes)}
              </React.Fragment>
            </div>
          </div>
        </Col>
        <Col xs={3}>
          <div style={{ width: 350 }}>
            <Sticky>
              {({ style }) => (
                <div style={style}>
                  <SideBarRight hideSearchBar={false} />
                </div>
              )}
            </Sticky>
          </div>
        </Col>
      </Row>
      <NotificationBox
        show={showSnackbar}
        message={message}
        severity={severity}
        onClose={handleSnackBarClose}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'CLEAR_NOTIFICATIONS_REQUEST'),
  count: state.polling.get('count'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    searchRequest,
    clearSearchPosts,
    clearNotificationsRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(GuardedAppFrame)
