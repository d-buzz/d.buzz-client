import React, { useEffect } from 'react'
import queryString from 'query-string'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  getSearchTagsRequest,
  clearTagsPost,
  setTagsIsVisited,
} from 'store/posts/actions'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { pending } from 'redux-saga-thunk'
import { HashtagLoader } from 'components/elements'

const Explore = (props) => {
  const {
    getSearchTagsRequest,
    clearTagsPost,
    items,
    loading,
    last,
    visited,
  } = props
  const location = useLocation()
  const params = queryString.parse(location.search)
  const tag = params.q

  useEffect(() => {
    if(!visited) {
      setTagsIsVisited()
      clearTagsPost()
      getSearchTagsRequest(tag)
    }
  // eslint-disable-next-line
  }, [])

  const loadMorePosts = () => {
    const { permlink, author } = last
    getSearchTagsRequest(tag, permlink, author)
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
              profileRef="home"
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
              payoutAt={item.payout_at}
              highlightTag={tag}
            />
          ))
        }
      </InfiniteScroll>
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.posts.get('searchTag'),
  last: state.posts.get('lastSearchTag'),
  loading: pending(state, 'GET_SEARCH_TAG_REQUEST'),
  visited: state.posts.get('isTagsVisited')
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getSearchTagsRequest,
    clearTagsPost,
    setTagsIsVisited,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
