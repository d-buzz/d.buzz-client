import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Avatar } from 'components/elements'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { pending } from 'redux-saga-thunk'
import { useHistory, useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { AvatarlistSkeleton, BlacklistButton } from 'components'
import { checkAccountExistRequest } from "store/profile/actions"
import { showAccountSearchButton, hideAccountSearchButton } from "store/interface/actions"


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
  buttonContainer: {
    width: 80,
  },
  noData : {
    ...theme.font,
  },
}))

const LIST_TYPE = 'blacklist'
const AccountBlacklistedUsers = (props) => {
  const classes = useStyle()
  const {
    loading,
    user,
    blacklistedList : items,
    listSearchkey,
    checkAccountExistRequest,
    showAccountSearchButton,
    hideAccountSearchButton,
  } = props

  const { username:loginUser, is_authenticated } = user
  const history = useHistory()
  const { username } = useParams()
  const [searchkey, setSearchkey] = useState(null)

  const handleClickUser = (name) => () => {
    if(is_authenticated) {
      history.replace(`/@${name}/t/buzz`)
    } else {
      history.replace(`/ug/@${name}/t/buzz`)
    }
  }

  useEffect(() => {
   
    if(listSearchkey && listSearchkey.list_type === LIST_TYPE){
      setSearchkey(listSearchkey.keyword)
      checkAccountExists(listSearchkey.keyword)
    }
  // eslint-disable-next-line
  }, [listSearchkey])

  const filterItems = (item) => {
    return searchkey && item ? item.includes(searchkey) : true
  }

  const checkAccountExists = (keyword) => {
    const exist = items && items.filter((item) => item.name === keyword).length > 0
    if(loginUser === username){
      if(keyword && !exist){
        checkAccountExistRequest(keyword).then(({ exists }) => {
          if(exists){
            showAccountSearchButton(LIST_TYPE)
          }else{
            hideAccountSearchButton()
          }
        })
      }else{
        hideAccountSearchButton()
      }
    }
  }

  const filteredItemCount = () => {
    return searchkey ? items.filter((item) => item.name.includes(searchkey)).length : items.length
  }

  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        hasMore={false}
      >
        {items.map((item) => (
          <React.Fragment key={`${item.name}-${Math.random(0, 100)}`}>
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
                    </div>
                  </Col>
                  {loginUser === username && 
                  <Col xs="auto">
                    <div className={classes.buttonContainer}>
                      <BlacklistButton 
                        username={item.name} 
                        label="Unblacklist"
                        disabled={!is_authenticated}
                        style={{ float: 'right', marginTop: 5 }}/> 
                    </div>
                  </Col>}
                </Row>
              </div>
            </div>}
          </React.Fragment>
        ))}
        {(!loading && !searchkey && items.length === 0) &&
          (<span className={classes.noData}><center><br/><h6>No users on this list yet</h6></center></span>)}
        {(!loading && searchkey && filteredItemCount() === 0) &&
          (<span className={classes.noData}><center><br/><h6>User not found on this list</h6></center></span>)}
      </InfiniteScroll>
      <AvatarlistSkeleton loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  loading: pending(state, 'GET_ACCOUNT_LIST_REQUEST'),
  blacklistedList: state.profile.get('blacklistedList'),
  listSearchkey: state.profile.get('listSearchkey'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    checkAccountExistRequest,
    showAccountSearchButton,
    hideAccountSearchButton,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountBlacklistedUsers)
