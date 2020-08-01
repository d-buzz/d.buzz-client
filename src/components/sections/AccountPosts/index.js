import React from 'react'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { pending } from 'redux-saga-thunk'
import { HashtagLoader } from 'components/elements'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { getAccountPostsRequest } from 'store/profile/actions'

const AccountPosts = (props) => {
  const {
    items = [],
    loading,
    getAccountPostsRequest,
    author,
    last,
  } = props

  const loadMorePosts = () => {
    try {
      const { permlink } = last
      getAccountPostsRequest(author, permlink)
    } catch(e) { }
  }

  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        {
          items.map((item) => (
            <PostList
              ignoreUsername={true}
              active_votes={item.active_votes}
              author={item.author}
              permlink={item.permlink}
              created={item.created}
              body={item.body}
              upvotes={item.active_votes.length}
              replyCount={item.children}
              meta={item.json_metadata}
              payout={item.payout}
              profile={item.profile}
            />
          ))
        }
        {
          (!loading && items.length === 0) &&
          (<center><br/><h6>No Buzz's</h6></center>)
        }
      </InfiniteScroll>
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('posts'),
  loading: pending(state, 'GET_ACCOUNT_POSTS_REQUEST'),
  last: state.profile.get('last')
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountPostsRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPosts)
