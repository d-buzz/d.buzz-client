import React, { useEffect } from 'react'
import { PostList, CreateBuzzForm } from 'components'
import { HashtagLoader } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getRankedPostRequest, getTrendingPostsRequest, setHomeIsVisited } from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import InfiniteScroll from 'react-infinite-scroll-component'


const Home = (props) => {
  const {
    items,
    last,
    loading,
    trending,
    isVisited,
    getRankedPostRequest,
    getTrendingPostsRequest,
    setHomeIsVisited,
  } = props

  let posts = trending

  useEffect(() => {
    // if(!isVisited) {
    //   setHomeIsVisited()
    //   getRankedPostRequest('created')
    // }
    getTrendingPostsRequest()
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
        dataLength={posts.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        {
          posts.map((item) => (
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
  loading: pending(state, 'GET_TRENDING_POSTS_REQUEST'),
  isVisited: state.posts.get('isHomeVisited'),
  items: state.posts.get('items'),
  trending: state.posts.get('trending'),
  last: state.posts.get('last'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getRankedPostRequest,
    setHomeIsVisited,
    getTrendingPostsRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
