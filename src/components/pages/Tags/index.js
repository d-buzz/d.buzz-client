import React, { useEffect } from 'react'
import { getSearchTagsRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { pending } from 'redux-saga-thunk'
import { HashtagLoader } from 'components/elements'
import InfiniteScroll from 'react-infinite-scroll-component'
import queryString from 'query-string'

const Explore = (props) => {
  const { getSearchTagsRequest, items, loading, last } = props
  const location = useLocation()
  const params = queryString.parse(location.search)
  const tag = params.q

  useEffect(() => {
    console.log({ tag })
    getSearchTagsRequest(tag)
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
  loading: pending(state, 'GET_SEARCH_TAG_REQUEST')
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getSearchTagsRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
