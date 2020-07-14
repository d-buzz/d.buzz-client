import React, { useEffect } from 'react'
import { PostList, CreateBuzzForm } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getRankedPostRequest } from 'store/posts/actions'

const Home = (props) => {
  const { items, getRankedPostRequest } = props

  useEffect(() => {
    getRankedPostRequest()
    //eslint-disable-next-line
  }, [])
  
  return (
    <React.Fragment>
      <CreateBuzzForm />
      <PostList items={items} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.posts.get('items'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getRankedPostRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
