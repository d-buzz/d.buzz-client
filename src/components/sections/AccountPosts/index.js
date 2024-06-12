import React, {useCallback, useEffect, useState} from 'react'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'

import { bindActionCreators } from 'redux'
import { getAccountPostsRequest } from 'store/profile/actions'
import { InfiniteList } from 'components'
import { createUseStyles } from 'react-jss'

const useStyle = createUseStyles(theme => ({
  wrapper: {
    '& h6': {
      ...theme.font,
    },
  },
}))

const AccountPosts = (props) => {
  const {
    items = [],
    loading,
    getAccountPostsRequest,
    author,
    last,
    user,
    mutelist,
  } = props
  const classes = useStyle()

  const [isFeedPostsLoaded , setFeedPostsLoad] = useState(false)

  const loadMorePosts = useCallback(() => {
    if (!loading) {
      if(items.length>0) {
        const { permlink, author: start_author } = last
        getAccountPostsRequest(author, permlink, start_author)
      }
    }
    // eslint-disable-next-line
  }, [last, loading, items])

  useEffect(() => {
    if (items.length < 3 && !loading && isFeedPostsLoaded) {
      loadMorePosts()
    } else {
      setFeedPostsLoad(true)
    }
  }, [isFeedPostsLoaded, items.length, loadMorePosts, loading])


  // const loadMorePosts =  useCallback(() => {
  //   try {
  //     const { permlink, author: start_author } = last
  //     getAccountPostsRequest(author, permlink, start_author)
  //   } catch(e) { }
  //   // eslint-disable-next-line
  // }, [last])

  const muted = mutelist.includes(author)

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        {!muted && (
          <React.Fragment>
            <InfiniteList disableOpacity={true} loading={loading} items={items} onScroll={loadMorePosts} unguardedLinks={!user.is_authenticated}/>
            {(!loading && items.length === 0) && (<center><br/><h6>No Buzz's from @{author}</h6></center>)}
          </React.Fragment>
        )}
        {muted && <center><br /><h6>This user is on your mutelist, unmute this user to view their buzzes</h6></center>}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('posts'),
  loading: pending(state, 'GET_ACCOUNT_POSTS_REQUEST'),
  last: state.profile.get('last'),
  user: state.auth.get('user'),
  mutelist: state.auth.get('mutelist'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountPostsRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountPosts)