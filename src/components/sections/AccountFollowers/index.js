import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Avatar, HashtagLoader } from 'components/elements'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { getProfileMetaData } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { useHistory } from 'react-router-dom'
import { setProfileIsVisited } from 'store/profile/actions'
import { bindActionCreators } from 'redux'


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
    cursor: 'pointer',
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
  },
  name: {
    fontWeight: 'bold',
    paddingRight: 5,
    paddingBottom: 0,
  },
  username: {
    color: '#657786',
    paddingBottom: 0,
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

  return (
    <React.Fragment>
      {
        items.map((item) => (
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
                      <label className={classes.name}>
                        { getName(item.profile) }
                      </label>
                      <label className={classes.username}>
                        @{ item.profile.name }
                      </label>
                    </div>
                    <div className={classes.content}>
                      <label className={classes.username}>
                        { getAbout(item.profile) }
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))
      }
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('followers'),
  loading: pending(state, 'GET_FOLLOWERS_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setProfileIsVisited,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountFollowers)
