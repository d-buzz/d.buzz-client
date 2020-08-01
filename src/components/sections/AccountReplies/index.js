import React from 'react'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { pending } from 'redux-saga-thunk'
import { HashtagLoader } from 'components/elements'
import InfiniteScroll from 'react-infinite-scroll-component'
// import { bindActionCreators } from 'redux'

const AccountReplies = (props) => {
  const { items, loading } = props

  return (
    <React.Fragment>
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
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_ACCOUNT_REPLIES_REQUEST'),
  items: state.profile.get('replies'),
})

export default connect(mapStateToProps)(AccountReplies)
