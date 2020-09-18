import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'

import { bindActionCreators } from 'redux'
import { getAccountPostsRequest } from 'store/profile/actions'
import { InfiniteList } from 'components'

const AccountPosts = (props) => {
  const {
    items = [],
    loading,
    getAccountPostsRequest,
    author,
    last,
    user,
  } = props

  const loadMorePosts =  useCallback(() => {
    try {
      const { permlink, author: start_author } = last
      getAccountPostsRequest(author, permlink, start_author)
    } catch(e) { }
    // eslint-disable-next-line
  }, [last])

  return (
    <React.Fragment>
      <InfiniteList loading={loading} items={items} onScroll={loadMorePosts} unguardedLinks={!user.is_authenticated}/>
      {(!loading && items.length === 0) &&
          (<center><br/><h6>No Buzz's from @{author}</h6></center>)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('posts'),
  loading: pending(state, 'GET_ACCOUNT_POSTS_REQUEST'),
  last: state.profile.get('last'),
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountPostsRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPosts)
