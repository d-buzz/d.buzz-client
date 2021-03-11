import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Avatar } from 'components/elements'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { pending } from 'redux-saga-thunk'
import { useHistory } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { bindActionCreators } from 'redux'
import { AvatarlistSkeleton, MuteButton } from 'components'


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

const AccountMutedUsers = (props) => {
  const classes = useStyle()
  const {
    loading,
    user,
    mutedList:items,
  } = props

  const { is_authenticated } = user

  const history = useHistory()

  const handleClickUser = (name) => () => {
    if(is_authenticated) {
      history.replace(`/@${name}/t/buzz`)
    } else {
      history.replace(`/ug/@${name}/t/buzz`)
    }
  }
  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        hasMore={false}
      >
        {items.map((item) => (
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
                <Col xs="auto">
                  <div className={classes.buttonContainer}>
                    <MuteButton 
                      username={item.name} 
                      label="unmute"
                      disabled={!is_authenticated}/> 
                  </div>
                </Col>
              </Row>
            </div>
          </div>
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
  mutedList: state.profile.get('mutedList'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountMutedUsers)
