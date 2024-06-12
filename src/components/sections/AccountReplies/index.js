import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import { bindActionCreators } from 'redux'
import { getAccountRepliesRequest } from 'store/profile/actions'
import { InfiniteList } from 'components'
import { createUseStyles } from 'react-jss'

const useStyle = createUseStyles(theme => ({
  wrapper: {
    '& h6': {
      ...theme.font,
    },
  },
}))

const AccountReplies = (props) => {
  const {
    items = [],
    loading,
    last,
    author,
    getAccountRepliesRequest,
    user,
    mutelist,
  } = props

  const classes = useStyle()
  const loadMorePosts =  useCallback(() => {
    if(items.length>0) {
      const { author: start_author, permlink } = last
      getAccountRepliesRequest(author, permlink, start_author)
    }
    // eslint-disable-next-line
  }, [last])

  const muted = mutelist.includes(author)

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        {!muted && (
          <React.Fragment>
            <InfiniteList title={true} loading={loading} items={items} onScroll={loadMorePosts} unguardedLinks={!user.is_authenticated}/>
            {(!loading && items.length === 0) &&
          (<center><br/><h6>No replies found</h6></center>)}
          </React.Fragment>
        )}
        {muted && (<center><br/><h6>This user is on your mutelist, unmute this user to view replies</h6></center>)}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('replies'),
  loading: pending(state, 'GET_ACCOUNT_REPLIES_REQUEST'),
  last: state.profile.get('lastReply'),
  user: state.auth.get('user'),
  mutelist: state.auth.get('mutelist'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccountRepliesRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountReplies)
