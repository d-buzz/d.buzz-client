import React, { useEffect } from 'react'
import { PostList, CreateBuzzForm } from 'components'
import { HashtagLoader } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  getHomePostsRequest,
  setHomeIsVisited,
  setTrendingIsVisited,
  clearTrendingPosts,
} from 'store/posts/actions'

const Feeds = (props) => {
  const {
    last,
    loading,
    items,
    isHomeVisited,
    setHomeIsVisited,
    getHomePostsRequest,
    setTrendingIsVisited,
    clearTrendingPosts,
  } = props

  useEffect(() => {
    if(!isHomeVisited) {
      clearTrendingPosts()
      getHomePostsRequest()
      setHomeIsVisited()
      setTrendingIsVisited(false)
    }
    //eslint-disable-next-line
  }, [])

  const loadMorePosts = () => {
    const { permlink, author } = last
    getHomePostsRequest(permlink, author)
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
              profile={item.profile}
            />
          ))
        }
      </InfiniteScroll>
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_HOME_POSTS_REQUEST'),
  isHomeVisited: state.posts.get('isHomeVisited'),
  items: state.posts.get('home'),
  last: state.posts.get('lastTrending'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setHomeIsVisited,
    getHomePostsRequest,
    setTrendingIsVisited,
    clearTrendingPosts,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Feeds)
