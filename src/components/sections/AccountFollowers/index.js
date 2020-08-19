import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Avatar } from 'components/elements'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { getProfileMetaData } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { useHistory } from 'react-router-dom'
import {
  setProfileIsVisited,
  getFollowersRequest
} from 'store/profile/actions'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { AvatarlistSkeleton } from 'components'


const useStyle = createUseStyles({
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 20,
    marginBottom: 10,
    cursor: 'pointer',
    '& label': {
      cusor: 'pointer',
    },
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: '1px solid #e6ecf0',
    '& a': {
      color: 'black',
    },
    '&:hover': {
      backgroundColor: '#f5f8fa',
    },
    cursor: 'pointer !important',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  left: {
    height: '100%',
    width: 50,
  },
  right: {
    height: 'max-content',
    width: '98%',
    cursor: 'pointer',
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  username: {
    color: '#657786',
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    cursor: 'pointer',
  },
  post: {
    color: '#14171a',
    paddingTop: 0,
    marginTop: -10,
  },
  content: {
    width: '100%',
    '& img': {
      borderRadius: '15px 15px',
    },
    '& iframe': {
      borderRadius: '15px 15px',
    },
    cursor: 'pointer',
  },
  actionWrapper: {
    paddingTop: 10,
  },
  actionWrapperSpace: {
    paddingRight: 30,
  },
  preview: {
    '& a': {
      borderRadius: '10px 10px',
      boxShadow: 'none',
    }
  },
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f',
    },
  },
})

const AccountFollowers = (props) => {
  const classes = useStyle()
  const {
    items,
    loading,
    setProfileIsVisited,
    getFollowersRequest,
    author,
    last,
  } = props
  const history = useHistory()

  const getName = (profile) => {
    const { name } = getProfileMetaData(profile)
    return name ? name : `@${profile.name}`
  }

  const getAbout = (profile) => {
    const { about } = getProfileMetaData(profile)
    return about
  }

  const handleClickFollower = (name) => () => {
    setProfileIsVisited(false)
    history.replace(`/@${name}/t/buzz`)
  }

  const loadMorePosts = () => {
    const { follower } = last || ''
    getFollowersRequest(author, follower)
  }

  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        next={loadMorePosts}
        hasMore={true}
      >
        {items.map((item) => (
          <div className={classes.wrapper}>
            <div className={classes.row} onClick={handleClickFollower(item.follower)}>
              <Row>
                <Col xs="auto" style={{ paddingRight: 0 }}>
                  <div className={classes.left}>
                    <Avatar author={item.follower} />
                  </div>
                </Col>
                <Col>
                  <div className={classes.right}>
                    <div className={classes.content}>
                      <p className={classes.name}>
                        {getName(item.profile)}
                      </p>
                      <p className={classes.username}>
                        @{item.profile.name}
                      </p>
                    </div>
                    <div className={classes.content}>
                      <label className={classes.username}>
                        {getAbout(item.profile)}
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
        {(!loading && items.length === 0) &&
          (<center><br/><h6>Do not have a follower</h6></center>)}
      </InfiniteScroll>
      <AvatarlistSkeleton loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('followers'),
  loading: pending(state, 'GET_FOLLOWERS_REQUEST'),
  last: state.profile.get('lastFollower'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setProfileIsVisited,
    getFollowersRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountFollowers)
