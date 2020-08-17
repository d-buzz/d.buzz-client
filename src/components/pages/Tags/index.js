import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import {
  getSearchTagsRequest,
  clearTagsPost,
  setTagsIsVisited,
  setPageFrom,
  clearLastSearchTag,
} from 'store/posts/actions'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { pending } from 'redux-saga-thunk'
import { PostlistSkeleton } from 'components'

const Tags = (props) => {
  const {
    getSearchTagsRequest,
    clearTagsPost,
    items,
    loading,
    visited,
    clearLastSearchTag,
    setPageFrom,
  } = props
  const location = useLocation()
  const params = queryString.parse(location.search)
  const tag = params.q
  const [results, setResults] = useState([])

  useEffect(() => {
    setPageFrom(null)
    if(!visited) {
      clearLastSearchTag()
      setTagsIsVisited()
      clearTagsPost()
      getSearchTagsRequest(tag)
    }

    if(tag !== params.q) {
      clearLastSearchTag()
      setTagsIsVisited()
      clearTagsPost()
      getSearchTagsRequest(tag)
    }
  // eslint-disable-next-line
  }, [tag])

  useEffect(() => {
    setResults(items.results || [])
  // eslint-disable-next-line
  }, [items])

  return (
    <React.Fragment>
      {results.map((item) => (
        <PostList
          searchListMode={true}
          title={item.title}
          profileRef="tags"
          active_votes={item.total_votes}
          author={item.author}
          permlink={item.permlink}
          created={item.created_at}
          body={item.body}
          upvotes={item.total_votes}
          replyCount={item.children}
          meta={{ app: item.app, tags: item.tags }}
          payout={item.payout}
          profile={item.profile}
          payoutAt={item.payout_at}
          highlightTag={tag}
        />)
      )}
      <PostlistSkeleton loading={loading} />
      {(!loading && results.length === 0) &&
        (<center><br/><h6>No Buzz's found with <span style={{ color: '#d32f2f', fontFamily: 'Segoe-Bold' }}>#{tag}</span></h6></center>)}
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
    clearLastSearchTag,
    setPageFrom,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
