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
  getFollowingRequest,
} from 'store/profile/actions'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { AvatarlistSkeleton } from 'components'

const useStyle = createUseStyles(theme => ({
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
    borderBottom: theme.border.primary,
    '&:hover': {
      ...theme.postList.hover,
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
    ...theme.font,
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
    '& label': {
      ...theme.font,
    },
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
    },
  },
  tags: {
    wordWrap: 'break-word',
    width: 'calc(100% - 60px)',
    height: 'max-content',
    '& a': {
      color: '#d32f2f',
    },
  },
}))

const AccountFollowing = (props) => {
  const classes = useStyle()
  const {
    items,
    loading,
    setProfileIsVisited,
    author,
    last,
    getFollowingRequest,
    user,
  } = props

  const { is_authenticated } = user

  const history = useHistory()

  const getName = (profile) => {
    const { name } = getProfileMetaData(profile)
    return name ? name : `@${profile.name}`
  }

  const getAbout = (profile) => {
    const { about } = getProfileMetaData(profile)
    return about
  }

  const handleClickFollowing = (name) => () => {
    setProfileIsVisited(false)

    if(is_authenticated) {
      history.replace(`/@${name}/t/buzz`)
    } else {
      history.replace(`/ug/@${name}/t/buzz`)
    }
  }

  const loadMorePosts = () => {
    const { following } = last
    getFollowingRequest(author, following)
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
            <div className={classes.row} onClick={handleClickFollowing(item.following)}>
              <Row>
                <Col xs="auto" style={{ paddingRight: 0 }}>
                  <div className={classes.left}>
                    <Avatar author={item.following} />
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
          (<center><br/><h6>Not following anyone</h6></center>)}
      </InfiniteScroll>
      <AvatarlistSkeleton loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  items: state.profile.get('following'),
  loading: pending(state, 'GET_FOLLOWING_REQUEST'),
  last: state.profile.get('lastFollowing'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setProfileIsVisited,
    getFollowingRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountFollowing)
