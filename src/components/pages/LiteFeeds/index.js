import React, { useEffect, useState } from 'react'
import { CreateBuzzForm, HelmetGenerator } from 'components'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { isMobile } from 'react-device-detect'
import { Link } from 'react-router-dom'
import LiteInfiniteList from 'components/common/LiteInfiniteList'
import { HOME_POSTS_QUERY } from 'services/union'
import { useQuery } from '@apollo/client'
import { deepClone, removeFootNote } from 'services/api'
import _ from 'lodash'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    ...theme.font,
    paddingTop: '5%',
    '& a': {
      color: '#e53934 !important',
    },
  },
}))

const LiteFeeds = React.memo((props) => {
  const { buzzModalStatus, user } = props
  const classes = useStyles()
  // eslint-disable-next-line
  const { loading, error, data } = useQuery(HOME_POSTS_QUERY, {
    variables: { user: user?.username },
  })
  
  const [allPosts, setAllPosts] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    const posts = deepClone(data?.socialFeed?.items || []).filter(post => post?.permlink !== null)
    removeFootNote(posts)
    
    if (!_.isEqual(posts, allPosts)) {
      setAllPosts(posts)
    }
    // eslint-disable-next-line
  }, [data])

  useEffect(() => {
    if (allPosts.length > 0) {
      setItems(allPosts.slice(0, 10))
    }
  }, [allPosts])

  const loadMorePosts = () => {
    const newLimit = items.length + 10
    if (newLimit <= allPosts.length) {
      setItems(allPosts.slice(0, newLimit))
    }
  }

  return (
    <>
      <HelmetGenerator page='Home' />
      {!isMobile && !buzzModalStatus && (<CreateBuzzForm />)}
      {items.length === 0 && !loading && (
        <center>
          <h6 className={classes.wrapper}>
            Hi there! it looks like you haven't followed anyone yet, <br />
            you may start following people by reading the&nbsp;
            <Link to="/latest">latest</Link> <br /> or <Link to="/trending">trending</Link>&nbsp;
            buzzes on d.buzz today.
          </h6>
        </center>
      )}
      <LiteInfiniteList loading={loading} items={items} onScroll={loadMorePosts} />
    </>
  )
})

const mapStateToProps = (state) => ({
  refreshRouteStatus: state.interfaces.get('refreshRouteStatus'),
  user: state.auth.get('user'),
})

export default connect(mapStateToProps, null)(LiteFeeds)
