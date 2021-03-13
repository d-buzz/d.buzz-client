import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Avatar } from 'components/elements'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { pending } from 'redux-saga-thunk'
import { useHistory } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { AvatarlistSkeleton, FollowBlacklistsButton } from 'components'


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
  noData : {
    ...theme.font,
  },
  description : {
    paddingRight: 5,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    ...theme.font,
    color: "#e61c34",
  },
}))

const AccountBlacklistedFollowed = (props) => {
  const classes = useStyle()
  const {
    loading,
    setProfileIsVisited,
    user,
    followedBlacklist : items,
    listSearchkey,
  } = props

  const { is_authenticated } = user
  const history = useHistory()
  const [searchkey, setSearchkey] = useState(null)

  const handleClickUser = (name) => () => {
    if(is_authenticated) {
      history.replace(`/@${name}/t/buzz`)
    } else {
      history.replace(`/ug/@${name}/t/buzz`)
    }
  }

  useEffect(() => {
   
    if(listSearchkey && listSearchkey.list_type === 'follow_blacklist'){
      setSearchkey(listSearchkey.keyword)
    }
  // eslint-disable-next-line
  }, [listSearchkey])

  const filterItems = (item) => {
    return searchkey && item ? item.includes(searchkey) : true
  }

  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        hasMore={false}
      >
        {items.map((item) => (
          <React.Fragment>
            {filterItems(item.name) &&
              <div className={classes.wrapper}>
                <div className={classes.row}>
                  <Row style={{ marginRight: 0, marginLeft: 0 }}>
                    <Col xs="auto" style={{ paddingRight: 0 }}
                      onClick={handleClickUser(item.name)}>
                      <div className={classes.left}>
                        <Avatar author={item.name} />
                      </div>
                    </Col>
                    <Col onClick={handleClickUser(item.name)}>
                      <div className={classes.right}>
                        <div className={classes.content}>
                          <p className={classes.username}>
                        @{item.name}
                          </p>
                        </div>
                        {item.blacklist_description && 
                      (<div className={classes.content}>
                        <p className={classes.description}>
                          {item.blacklist_description}
                        </p>
                      </div>)}
                      </div>
                    </Col>
                    <Col xs="auto">
                      <div className={classes.blacklistButtonContainer}>
                        <FollowBlacklistsButton
                          username={item.name} 
                          label="Unfollow blacklist"
                          disabled={!is_authenticated}
                          style={{ float: 'right', marginTop: 5 }}/> 
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>}
          </React.Fragment>
        ))}
        {(!loading && items.length === 0) &&
          (<span className={classes.noData}><center><br/><h6>No users on this list yet</h6></center></span>)}
      </InfiniteScroll>
      <AvatarlistSkeleton loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  loading: pending(state, 'GET_ACCOUNT_LIST_REQUEST'),
  followedBlacklist: state.profile.get('followedBlacklist'),
  listSearchkey: state.profile.get('listSearchkey'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountBlacklistedFollowed)
