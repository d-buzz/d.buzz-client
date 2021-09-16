import React, { useState, useEffect } from 'react'
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
import { broadcastNotification, setBuzzModalStatus } from 'store/interface/actions'
import { searchRequest, clearSearchPosts } from 'store/posts/actions'
import { ContainedButton } from 'components/elements'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useLastLocation } from 'react-router-last-location'
import { useWindowDimensions } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { SideBarLeft, SideBarRight, SearchField, NotificationFilter } from 'components'
import BuzzFormModal from 'components/modals/BuzzFormModal'
import { Fab } from '@material-ui/core'
import BuzzIcon from 'components/elements/Icons/BuzzIcon'

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
  searchDiv: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
  },
  menuText: {
    fontSize: 13,
  },
  right: {
    height: 'max-content',
  },
}))

const floatStyle = {
  margin: 0,
  top: 'auto',
  bottom: 20,
  left: 'auto',
  position: 'fixed',
  zIndex: 500,
  backgroundColor: '#e61c34',
}

const GuardedAppFrame = (props) => {
  const {
    route,
    pathname,
    searchRequest,
    clearSearchPosts,
    clearNotificationsRequest,
    broadcastNotification,
    loading,
    count,
    setBuzzModalStatus,
  } = props

  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const lastLocation = useLastLocation()
  const params = queryString.parse(location.search) || ''
  const query = params.q === undefined ? '' : params.q
  const [search, setSearch] = useState(query)
  const [sideBarLeftWidth, setSideBarLeftWidth] = useState(270)
  const [sideBarRightWidth, setSideBarRightWidth] = useState(350)
  const [mainContainerWidth, setMainContainerWidth] = useState(595)
  const [minify, setMinify] = useState(false)
  const [hideSideBarRight, setHideSideBarRight] = useState(false)
  const { width } = useWindowDimensions()
  const [open, setOpen] = useState(false)
  const isBuzzIntent = pathname.match(/^\/intent\/buzz/)

  useEffect(() => {
    setSearch(query)
  // eslint-disable-next-line
  }, [query])

  useEffect(() => {
    if(width >= 1366) {
      setMinify(false)
      setMainContainerWidth(595)
      setHideSideBarRight(false)
      setSideBarLeftWidth(270)
      setSideBarRightWidth(350)
    } else if(width >= 1026 && width < 1366) {
      setMinify(true)
      setMainContainerWidth(595)
      setHideSideBarRight(false)
      setSideBarLeftWidth(55)
      setSideBarRightWidth(300)
    } else if(width >=706 && width < 1026) {
      setMinify(true)
      setMainContainerWidth(595)
      setHideSideBarRight(true)
      setSideBarLeftWidth(60)
    } else {
      setMinify(true)
      setSideBarLeftWidth(55)
      setHideSideBarRight(true)
      setMainContainerWidth(width-100)
    }
  }, [width])


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

  if(pathname.match(/(\/wallet)/) && pathname.match(/^\/@/)) {
    title = 'Wallet'
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


  if(pathname.match(/\/follow\/followers/g) || pathname.match(/\/follow\/following/g) ||
    pathname.match(/\/lists\/muted\/users/g) || pathname.match(/\/lists\/muted\/followed/g) ||
    pathname.match(/\/lists\/blacklisted\/users/g) || pathname.match(/\/lists\/blacklisted\/followed/g)) {
    const items = pathname.split('/')
    title = `Profile / ${items[1]}`
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
      searchRequest(search)
      history.push(`/search/posts?q=${encodeURIComponent(search)}`)
    }
  }


  const handleClearNotification = () => {
    clearNotificationsRequest()
      .then(result => {
        if(typeof result === 'object' && result.success) {
          broadcastNotification('success', 'Successfully marked all your notifications as read')
        } else {
          broadcastNotification('error', 'Failed marking all notifications as read')
        }
      })
  }

  const handleOpenBuzzModal = () => {
    setBuzzModalStatus(true)
    setOpen(true)
  }

  const onHide = () => {
    setBuzzModalStatus(false)
    setOpen(false)
    if (isBuzzIntent) {
      history.push('/')
    }
  }

  const floatingButtonStyle = {
    marginLeft: width > 1026 && 530, right: width < 1026 && 30,
  }

  return (
    <React.Fragment>
      <Row style={{ padding: 0, margin: 0 }}>
        <Col xs="auto" className={classes.clearPadding}>
          <div style={{ width: sideBarLeftWidth }}>
            <Sticky>
              {({ style }) => (
                <div style={{...style}}>
                  <SideBarLeft minify={minify} />
                </div>
              )}
            </Sticky>
          </div>
        </Col>
        <Col xs="auto" className={classes.clearPadding}>
          <div style={{ width: mainContainerWidth }}>
            <Sticky>
              {({ style }) => (
                <Navbar style={style} className={classes.nav}>
                  <Navbar.Brand className={classes.navTitle}>
                    {title !== 'Home' && title !== 'Trending' && title !== 'Latest' && (
                      <IconButton onClick={handleClickBackButton} size="small">
                        <BackArrowIcon />
                      </IconButton>
                    )}
                    {title !== 'Search' && (<span className={classes.title}>{title}</span>)}
                    {title === 'Notifications' && <NotificationFilter />}
                  </Navbar.Brand>
                  {title === 'Search' && (
                    <div className={classes.searchDiv}>
                      <SearchField
                        disableTips={true}
                        iconTop={-2}
                        labelFontSize={14}
                        searchWrapperClass={classes.searchWrapper}
                        style={{ height: 30 }}
                        value={search}
                        onKeyDown={handleSearchKey}
                        onChange={onChange}
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
                {minify && (
                  <Fab onClick={handleOpenBuzzModal} size="medium" color="secondary" aria-label="add" style={{...floatStyle, ...floatingButtonStyle}}>
                    <BuzzIcon />
                  </Fab>
                )}
                <BuzzFormModal show={open} onHide={onHide} />
              </React.Fragment>
            </div>
          </div>
        </Col>
        {!hideSideBarRight && (
          <Col xs="auto">
            <div style={{ width: sideBarRightWidth }}>
              <Sticky>
                {({ style }) => (
                  <div style={style}>
                    <SideBarRight hideSearchBar={false} />
                  </div>
                )}
              </Sticky>
            </div>
          </Col>
        )}
      </Row>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'CLEAR_NOTIFICATIONS_REQUEST'),
  count: state.polling.get('count'),
  buzzModalStatus: state.interfaces.get('buzzModalStatus'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    searchRequest,
    clearSearchPosts,
    clearNotificationsRequest,
    broadcastNotification,
    setBuzzModalStatus,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(GuardedAppFrame)
