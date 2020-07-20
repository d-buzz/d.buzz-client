import React, { useEffect } from 'react'
import { getTrendingTagsRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const Init = (props) => {
  const { getTrendingTagsRequest, children } = props

  useEffect(() => {
    getTrendingTagsRequest()
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
  }, dispatch)
})

export default connect(null, mapDispatchToProps)(Init)
