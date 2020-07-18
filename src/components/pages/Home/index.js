import React, { useEffect } from 'react'
import { PostList, CreateBuzzForm } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getRankedPostRequest, getRepliesRequest } from 'store/posts/actions'
import { pending } from 'redux-saga-thunk'
import HashLoader from 'react-spinners/HashLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  loader: {
    width: 'max-content',
    margin: '0 auto',
    paddingTop: 50,
  }
})

const Home = (props) => {
  const classes = useStyles()
  const { 
    items,
    last,
    loading,
    getRankedPostRequest,
    getRepliesRequest,
  } = props

  useEffect(() => {
    getRankedPostRequest('trending')
    getRepliesRequest('oniemaniego', 'where-does-new-hive-tokens-go')

    //eslint-disable-next-line
  }, [])

  const loadMorePosts = () => {
    const { permlink, author } = last
    getRankedPostRequest('trending', permlink, author)
  }
  
  return (
    <React.Fragment>
      <CreateBuzzForm />
      <InfiniteScroll
        dataLength={items.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        <PostList items={items} />
      </InfiniteScroll>
      {
        loading && (
          <div className={classes.loader}>
            <HashLoader
              color="#e61c34"
              loading={true} 
            />
          </div>
        )
      }
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
    getRepliesRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
