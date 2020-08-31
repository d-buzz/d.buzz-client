import React, { useEffect } from 'react'
import { Trending } from 'components'
import { createUseStyles } from 'react-jss'
import {
  clearSearchPosts,
  clearLastSearchTag,
  clearTrendingPosts,
  clearLatestPosts,
  clearTagsPost,
  clearHomePosts,
  setHomeIsVisited,
  setTrendingIsVisited,
  setLatestIsVisited,
  setTagsIsVisited,
  clearAppendReply,
} from 'store/posts/actions'
import {
  clearAccountPosts,
  clearAccountReplies,
} from 'store/profile/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const useStyles = createUseStyles({
  trendingWrapper: {
    width: '100%',
    minHeight: '100vh',
    border: '1px solid #e6ecf0',
  },
  headerWrapper: {
    width: '98%',
    margin: '0 auto',
  },
})

const Landing = (props) => {
  const classes = useStyles()
  const {
    clearSearchPosts,
    clearLastSearchTag,
    clearTrendingPosts,
    clearLatestPosts,
    clearTagsPost,
    clearHomePosts,
    setHomeIsVisited,
    setTrendingIsVisited,
    setLatestIsVisited,
    setTagsIsVisited,
    clearAccountPosts,
    clearAccountReplies,
    clearAppendReply,
   } = props

  useEffect(() => {
    clearAppendReply()
    clearSearchPosts()
    clearLastSearchTag()
    clearTrendingPosts()
    clearLatestPosts()
    clearTagsPost()
    clearHomePosts()
    clearAccountPosts()
    clearAccountReplies()
    setHomeIsVisited(false)
    setTrendingIsVisited(false)
    setLatestIsVisited(false)
    setTagsIsVisited(false)
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <div className={classes.trendingWrapper}>
        <div>
          <h5 style={{ fontWeight: 'bold', marginLeft: 10 }}>Trending</h5>
        </div>
        <Trending unguardedLinks={true} />
      </div>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearSearchPosts,
    clearLastSearchTag,
    clearTrendingPosts,
    clearLatestPosts,
    clearTagsPost,
    clearHomePosts,
    setHomeIsVisited,
    setTrendingIsVisited,
    setLatestIsVisited,
    setTagsIsVisited,
    clearAccountPosts,
    clearAccountReplies,
    clearAppendReply,
  }, dispatch),
})

export default connect(null, mapDispatchToProps)(Landing)
