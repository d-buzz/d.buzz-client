import React, { useState, useEffect } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { createUseStyles } from 'react-jss'
import {
  getFollowersRequest,
  clearProfile,
  getFollowingRequest,
  clearAccountFollowers,
  clearAccountFollowing,
} from 'store/profile/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { anchorTop } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { renderRoutes } from 'react-router-config'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { ProfileSkeleton, HelmetGenerator } from 'components'

const useStyles = createUseStyles(theme => ({
  cover: {
    height: 270,
    width: '100%',
    backgroundColor: '#ffebee',
    overFlow: 'hidden',
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      overFlow: 'hidden',
    },
  },
  avatar: {
    marginTop: -70,
  },
  walletButton: {
    marginTop: 5,
    float: 'right',
    marginRight: 15,
  },
  fullName: {
    fontSize: '18px !important',
    fontWeight: 'bold',
    padding: 0,
    fontFamily: 'Segoe-Bold !important',
    ...theme.font,
  },
  userName: {
    fontSize: 16,
    padding: 0,
    marginTop: -20,
    ...theme.font,
  },
  wrapper: {
    width: '95%',
    margin: '0 auto',
    height: 'max-content',
  },
  paragraph: {
    padding: 0,
    margin: 0,
    fontSize: 14,
    ...theme.font,
  },
  spacer: {
    width: '100%',
    height: 20,
  },
  descriptionContainer: {
    borderBottom: theme.border.primary,
    ...theme.font,
  },
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      ...theme.left.sidebar.items.hover,
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      ...theme.font,
      fontWeight: 'bold',
      fontFamily: 'Segoe-Bold',
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    },
  },
  tabContainer: {
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    },
  },
  weblink: {
    color: '#d32f2f',
    '&:hover': {
      color: '#d32f2f',
    },
  },
  followLinks: {
    ...theme.font,
  },
}))

const Profile = (props) => {
  const {
    match,
    getFollowersRequest,
    isVisited,
    loading,
    route,
    getFollowingRequest,
    // setPageFrom,
  } = props

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location

  const classes = useStyles()
  const [index, setIndex] = useState(0)


  const onChange = (e, index) => {
    setIndex(index)
  }

  const handleTabs = (index) => () => {
    let tab = 'followers'

    if(index === 0) {
      tab = 'followers'
    } else if (index === 1) {
      tab = 'following'
    }
    history.push(`/@${username}/follow/${tab}/`)
  }

  const { params } = match
  const { username } = params

  useEffect(() => {
    // setPageFrom(null)
    const params = queryString.parse(location.search)

    if(!isVisited || (params.ref && (params.ref === 'replies' || params.ref === 'nav'))) {
      anchorTop()
      getFollowersRequest(username)
      getFollowingRequest(username)
    }
    // eslint-disable-next-line
  }, [username])

  useEffect(() => {
    if(pathname.match(/\/follow\/followers/g)) {
      setIndex(0)
    } else if(pathname.match((/\/follow\/following/g))) {
      setIndex(1)
    } else {
      setIndex(0)
    }
  }, [pathname])

  return (
    <React.Fragment>
      <HelmetGenerator page='Profile' />
      <ProfileSkeleton loading={loading} />
      <div style={{ width: '100%', height: 'max-content' }} className={classes.descriptionContainer}>
        <div className={classes.spacer} />
        <Tabs
          value={index}
          indicatorColor="primary"
          textColor="primary"
          centered
          onChange={onChange}
          className={classes.tabContainer}
        >
          <Tab disableTouchRipple onClick={handleTabs(0)} className={classes.tabs} label="Follower" />
          <Tab disableTouchRipple onClick={handleTabs(1)} className={classes.tabs} label="Following" />
        </Tabs>
      </div>
      <React.Fragment>
        {renderRoutes(route.routes, { author: username })}
      </React.Fragment>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_PROFILE_REQUEST'),
  isVisited: state.profile.get('isProfileVisited'),
  loadingFollow: pending(state, 'FOLLOW_REQUEST') || pending(state, 'UNFOLLOW_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getFollowersRequest,
    clearProfile,
    getFollowingRequest,
    clearAccountFollowers,
    clearAccountFollowing,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
