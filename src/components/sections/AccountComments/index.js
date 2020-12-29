import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'

import { bindActionCreators } from 'redux'
import { getAccountCommentsRequest } from 'store/profile/actions'
import { InfiniteList } from 'components'

const AccountComments = (props) => {
  const {
    items = [],
    loading,
    getAccountCommentsRequest,
    author,
    last,
    user,
    mutelist,
  } = props

  const loadMorePosts =  useCallback(() => {
    try {
      const { permlink, author: start_author } = last
      getAccountCommentsRequest(author, permlink, start_author)
    } catch(e) { }
    // eslint-disable-next-line
  }, [last])

  const muted = mutelist.includes(author)

  return (
    <React.Fragment>
      {!muted && (
        <React.Fragment>
          <InfiniteList title={true} loading={loading} items={items} onScroll={loadMorePosts} unguardedLinks={!user.is_authenticated}/>
          {(!loading && items.length === 0) &&
          (<center><br/><h6>No comments from @{author}</h6></center>)}
        </React.Fragment>
      )}
      {muted && (<center><br/><h6>This user is on your mutelist, unmute this user to view their comments</h6></center>)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('comments'),
  loading: pending(state, 'GET_ACCOUNT_COMMENTS_REQUEST'),
  last: state.profile.get('lastComment'),
  user: state.auth.get('user'),
  mutelist: state.auth.get('mutelist'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountCommentsRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountComments)
