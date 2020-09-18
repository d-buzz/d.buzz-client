import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import { bindActionCreators } from 'redux'
import { getAccountRepliesRequest } from 'store/profile/actions'
import { InfiniteList } from 'components'

const AccountReplies = (props) => {
  const {
    items = [],
    loading,
    last,
    author,
    getAccountRepliesRequest,
    user,
  } = props

  const loadMorePosts =  useCallback(() => {
    const { author: start_author, permlink } = last
    getAccountRepliesRequest(author, permlink, start_author)
    // eslint-disable-next-line
  }, [last])

  return (
    <React.Fragment>
      <InfiniteList loading={loading} items={items} onScroll={loadMorePosts} unguardedLinks={!user.is_authenticated}/>
      {(!loading && items.length === 0) &&
          (<center><br/><h6>No replies found</h6></center>)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('replies'),
  loading: pending(state, 'GET_ACCOUNT_REPLIES_REQUEST'),
  last: state.profile.get('lastReply'),
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountRepliesRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountReplies)
