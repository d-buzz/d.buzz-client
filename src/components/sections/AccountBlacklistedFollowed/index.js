import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Avatar, ContainedButton } from 'components/elements'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { pending } from 'redux-saga-thunk'
import { useHistory } from 'react-router-dom'
import {
  setProfileIsVisited,
} from 'store/profile/actions'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { AvatarlistSkeleton } from 'components'


const useStyle = createUseStyles(theme => ({
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 10,
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
  username: {
    fontWeight: 'bold',
    paddingRight: 5,
    marginTop: 10,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    ...theme.font,
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
  blacklistButtonContainer: {
    width: 80,
  },
}))

const AccountBlacklistedFollowed = (props) => {
  const classes = useStyle()
  const {
    loading,
    setProfileIsVisited,
    user,
    followedBlacklist : items,
  } = props

  const { is_authenticated } = user

  const history = useHistory()

  const handleClickUser = (name) => () => {
    setProfileIsVisited(false)
    if(is_authenticated) {
      history.replace(`/@${name}/t/buzz`)
    } else {
      history.replace(`/ug/@${name}/t/buzz`)
    }
  }

  const unblacklistUser = () => {

  }


  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        hasMore={false}
      >
        {items.map((item) => (
          <div className={classes.wrapper}>
            <div className={classes.row} onClick={handleClickUser(item.name)}>
              <Row style={{ marginRight: 0, marginLeft: 0 }}>
                <Col xs="auto" style={{ paddingRight: 0 }}>
                  <div className={classes.left}>
                    <Avatar author={item.name} />
                  </div>
                </Col>
                <Col>
                  <div className={classes.right}>
                    <div className={classes.content}>
                      <p className={classes.username}>
                      @{item.name}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className={classes.blacklistButtonContainer}>
                    <ContainedButton
                      fontSize={14}
                      loading={loading}
                      disabled={loading}
                      style={{ float: 'right', marginTop: 5 }}
                      transparent={true}
                      label="Unfollow blacklist"
                      className={classes.button}
                      onClick={unblacklistUser}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
        {(!loading && items.length === 0) &&
          (<center><br/><h6>No users found on this list yet</h6></center>)}
      </InfiniteScroll>
      <AvatarlistSkeleton loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  loading: pending(state, 'GET_ACCOUNT_LIST_REQUEST'),
  followedBlacklist: state.profile.get('followedBlacklist'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setProfileIsVisited,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountBlacklistedFollowed)
