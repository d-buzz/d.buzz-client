import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import {
  getSearchTagsRequest,
  clearTagsPost,
  setTagsIsVisited,
  setPageFrom,
  clearLastSearchTag,
  clearSearchPosts,
  clearReplies,
} from 'store/posts/actions'
import { connect } from 'react-redux'
import { PostList } from 'components'
import { bindActionCreators } from 'redux'
import { useLocation } from 'react-router-dom'
import { pending } from 'redux-saga-thunk'
import { PostlistSkeleton } from 'components'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  searchWrapper: {
    ...theme.font,
  },
}))

const Tags = (props) => {
  const classes = useStyles()
  const {
    getSearchTagsRequest,
    clearTagsPost,
    items,
    loading,
    visited,
    clearLastSearchTag,
    setPageFrom,
    clearSearchPosts,
    clearReplies,
  } = props
  const location = useLocation()
  const params = queryString.parse(location.search)
  const tag = params.q
  const [results, setResults] = useState([])

  useEffect(() => {
    clearSearchPosts()
    // eslint-disable-next-line
  }, [])

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
    clearReplies()
  // eslint-disable-next-line
  }, [tag])

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('customUserData'))?.settings?.showNSFWPosts !== 'disabled' ? items.results : items.results?.filter((item) => !item?.json_metadata?.tags?.includes('nsfw'))?.filter((item) => !item?.json_metadata?.tags?.includes('NSFW')) || []
    setResults(posts || [])
  // eslint-disable-next-line
  }, [items])

  return (
    <React.Fragment>
      {results.map((item) => (
        <React.Fragment key={item.id}>
          <PostList
            disableUpvote={true}
            searchListMode={true}
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
            disableOpacity={true}
            type='HIVE'
          />
        </React.Fragment>),
      )}
      <PostlistSkeleton loading={loading} />
      {(!loading && results.length === 0) &&
        (<center><br/><div className={classes.searchWrapper}><h6>No Buzz's found with <span style={{ color: '#d32f2f', fontFamily: 'Segoe-Bold' }}>#{tag}</span></h6></div></center>)}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.posts.get('searchTag'),
  last: state.posts.get('lastSearchTag'),
  loading: pending(state, 'GET_SEARCH_TAG_REQUEST'),
  visited: state.posts.get('isTagsVisited'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getSearchTagsRequest,
    clearTagsPost,
    setTagsIsVisited,
    clearLastSearchTag,
    setPageFrom,
    clearSearchPosts,
    clearReplies,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
