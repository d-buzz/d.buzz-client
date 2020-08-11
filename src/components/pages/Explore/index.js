import React, { useEffect } from 'react'
import { getSearchTagsRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const Explore = (props) => {
  const { getSearchTagsRequest } = props

  useEffect(() => {
    const tag = 'redux'
    getSearchTagsRequest(tag)
  // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <h4>Hello World</h4>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getSearchTagsRequest,
  }, dispatch)
})

export default connect(null, mapDispatchToProps)(Explore)
