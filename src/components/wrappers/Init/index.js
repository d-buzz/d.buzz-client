import React, { useEffect } from 'react'
import { getTrendingTagsRequest } from 'store/posts/actions'
import { getSavedUserRequest } from 'store/auth/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const Init = (props) => {
  const {
    getSavedUserRequest,
    getTrendingTagsRequest,
    children
  } = props

  useEffect(() => {
    getTrendingTagsRequest()
    getSavedUserRequest()
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      { children }
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getTrendingTagsRequest,
    getSavedUserRequest,
  }, dispatch)
})

export default connect(null, mapDispatchToProps)(Init)
