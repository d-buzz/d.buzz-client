import React from 'react'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { pending } from 'redux-saga-thunk'
import { HashtagLoader } from 'components/elements'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { getAccountPostsRequest } from 'store/profile/actions'

const AccountPosts = (props) => {
  const { items = [], loading, getAccountPostsRequest } = props

  const loadMorePosts = () => {
    getAccountPostsRequest()
  }

  return (
    <React.Fragment>
      <HashtagLoader loading={loading} />
      <InfiniteScroll
        dataLength={items.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        {
          !loading && (
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
                payout={(item.pending_payout_value).replace('HBD', '')}
                profile={item.profile}
              />
            ))
          )
        }
      </InfiniteScroll>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('posts'),
  loading: pending(state, 'GET_ACCOUNT_POSTS_REQUEST')
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountPostsRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPosts)
