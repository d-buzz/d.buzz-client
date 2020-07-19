import React, { useEffect } from 'react'
import { PostList, CreateBuzzForm } from 'components'
import { HashtagLoader } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getRankedPostRequest } from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import InfiniteScroll from 'react-infinite-scroll-component'


const Home = (props) => {
  const {
    items,
    last,
    loading,
    getRankedPostRequest,
  } = props

  useEffect(() => {
    getRankedPostRequest('created')
    //eslint-disable-next-line
  }, [])

  const loadMorePosts = () => {
    const { permlink, author } = last
    getRankedPostRequest('created', permlink, author)
  }

  return (
    <React.Fragment>
      <CreateBuzzForm />
      <InfiniteScroll
        dataLength={items.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        {
          items.map((item) => (
            <PostList
              author={item.author}
              permlink={item.permlink}
              created={item.created}
              body={item.body}
              upvotes={item.active_votes.length}
              replyCount={item.children}
              meta={item.json_metadata}
              payout={item.payout}
            />
          ))
        }
      </InfiniteScroll>
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_RANKED_POST_REQUEST'),
  items: state.posts.get('items'),
  last: state.posts.get('last'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getRankedPostRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
