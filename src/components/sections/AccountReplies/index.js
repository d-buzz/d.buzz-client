import React from 'react'
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'

const AccountReplies = (props) => {
  const { items } = props

  return (
    <React.Fragment>
      { JSON.stringify(items) }
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('replies'),
})

export default connect(mapStateToProps)(AccountReplies)
