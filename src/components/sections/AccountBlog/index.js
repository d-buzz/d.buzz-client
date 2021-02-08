import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'

import { bindActionCreators } from 'redux'
import { getAccountBlogRequest } from 'store/profile/actions'
import { InfiniteList } from 'components'

const AccountBlog = (props) => {
  const {
    items = [],
    loading,
    getAccountBlogRequest,
    author,
    last,
    user,
    mutelist,
  } = props

  const loadMorePosts = useCallback(() => {
    try {
      const { permlink, author: start_author } = last
      getAccountBlogRequest(author, permlink, start_author)
    } catch (e)  { }
    // eslint-disable-next-line
  }, [last])
  
  const muted = mutelist.includes(author)

  return (
    <React.Fragment>
      {!muted && (
        <React.Fragment>
          <InfiniteList isBlog={true} disableOpacity={true} loading={loading} items={items} onScroll={loadMorePosts} unguardedLinks={!user.is_authenticated}/>
          {(!loading && items.length === 0) && 
          (<center><br /><h6>No blog post from @{author}</h6></center>)}
        </React.Fragment>
      )}
      {muted && <center><br /><h6>This user is on your mutelist, unmute this user to view their buzzes</h6></center>}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('blog'),
  loading: pending(state, 'GET_ACCOUNT_BLOG_REQUEST'),
  last: state.profile.get('lastBlog'),
  user: state.auth.get('user'),
  mutelist: state.auth.get('mutelist'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountBlogRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountBlog)