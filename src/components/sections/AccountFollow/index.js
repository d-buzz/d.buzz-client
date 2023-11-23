import React, { useEffect } from 'react'
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
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { ProfileSkeleton, HelmetGenerator } from 'components'


const Profile = (props) => {
  const {
    match,
    getFollowersRequest,
    isVisited,
    loading,
    route,
    getFollowingRequest,
  } = props

  const location = useLocation()

  const { params } = match
  const { username } = params

  useEffect(() => {
    const params = queryString.parse(location.search)

    if(!isVisited || (params.from && (params.from === 'replies' || params.from === 'nav'))) {
      anchorTop()
      getFollowersRequest(username)
      getFollowingRequest(username)
    }
    // eslint-disable-next-line
  }, [username])

  return (
    <React.Fragment>
      <HelmetGenerator page='Profile' />
      <ProfileSkeleton loading={loading} />
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
