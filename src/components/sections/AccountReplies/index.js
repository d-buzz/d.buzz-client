import React from 'react'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { pending } from 'redux-saga-thunk'
import { HashtagLoader } from 'components/elements'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { getAccountRepliesRequest } from 'store/profile/actions'

const AccountReplies = (props) => {
  const {
    items = [],
    loading,
    last,
    author,
    getAccountRepliesRequest,
  } = props

  const loadMorePosts = () => {
    const { author: start_author, permlink } = last
    getAccountRepliesRequest(author, permlink, start_author)
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
              title={item.title}
              ignoreUsername={true}
              active_votes={item.active_votes}
              author={item.author}
              permlink={item.permlink}
              created={item.created}
              body={item.body}
              upvotes={item.active_votes.length}
              replyCount={item.children}
              meta={item.json_metadata}
              payout={item.payout === 0 ? '0.00' : item.payout.toFixed(2)}
              profile={item.profile}
            />
          ))
        }
        {
          (!loading && items.length === 0) &&
          (<center><br/><h6>No replies found</h6></center>)
        }
      </InfiniteScroll>
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('replies'),
  loading: pending(state, 'GET_ACCOUNT_REPLIES_REQUEST'),
  last: state.profile.get('lastReply'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountRepliesRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountReplies)
