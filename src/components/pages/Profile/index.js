import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import classNames from 'classnames'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Chip from '@material-ui/core/Chip'
import { createUseStyles } from 'react-jss'
import { Avatar, ContainedButton, HashtagLoader } from 'components/elements'
import {
  getProfileRequest,
  getAccountPostsRequest,
  setProfileIsVisited,
  getAccountRepliesRequest,
} from 'store/profile/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { anchorTop, getProfileMetaData } from 'services/helper'
import { pending } from 'redux-saga-thunk'
import { renderRoutes } from 'react-router-config'
import { useHistory, useLocation } from 'react-router-dom'

const useStyles = createUseStyles({
  cover: {
    height: 270,
    width: '100%',
    backgroundColor: '#ffebee',
    overFlow: 'hidden',
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      overFlow: 'hidden',
    }
  },
  avatar: {
    marginTop: -70,
  },
  walletButton: {
    marginTop: 5,
    float: 'right',
    marginRight: 15,
  },
  fullName: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 0,
  },
  userName: {
    fontSize: 16,
    padding: 0,
    marginTop: -20,
  },
  wrapper: {
    width: '95%',
    margin: '0 auto',
    height: 'max-content'
  },
  paragraph: {
    padding: 0,
    margin: 0,
  },
  spacer: {
    width: '100%',
    height: 20,
  },
  descriptionContainer: {
    borderBottom: '1px solid #e6ecf0',
  },
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      backgroundColor: '#ffebee',
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      fontWeight: 'bold',
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    }
  },
  tabContainer: {
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    }
  },
  weblink: {
    color: '#d32f2f'
  }
})


const Profile = (props) => {
  const {
    match,
    getProfileRequest,
    getAccountPostsRequest,
    setProfileIsVisited,
    getAccountRepliesRequest,
    isVisited,
    profile,
    loading,
    route,
  } = props

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location

  const classes = useStyles()
  const [index, setIndex] = useState(0)

  const onChange = (e, index) => {
    setIndex(index)
  }

  const handleTabs = (index) => () => {
    history.push(`/@${username}/t/${index}/`)
  }

  const { params } = match
  const { username } = params

  useEffect(() => {
    if(!isVisited) {
      anchorTop()
      setProfileIsVisited()
      getProfileRequest(username)
      getAccountPostsRequest(username)
      getAccountRepliesRequest(username)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(pathname.match(/^(?:(?:.+)\/@[/t/0/])|(?:(?:\/t\/0))/)) {
      setIndex(0)
    } else if(pathname.match(/^(?:(?:.+)\/@[/t/1/])|(?:(?:\/t\/1))/)) {
      setIndex(1)
    } else if(/^(?:(?:.+)\/@[/t/2/])|(?:(?:\/t\/2))/) {
      setIndex(2)
    } else if(/^(?:(?:.+)\/@[/t/3/])|(?:(?:\/t\/3))/) {
      setIndex(3)
    }
  }, [pathname])



  const { cover, name, about, website } = getProfileMetaData(profile)
  const { following_count, follower_count } = profile.follow_count || 0
  const { reputation = 0 } = profile


  return (
    <React.Fragment>
      <HashtagLoader loading={loading} />
      {
        !loading && (
          <React.Fragment>
            <div className={classes.cover}>
              { cover !== '' && (<img src={`https://images.hive.blog/0x0/${cover}`} alt="cover"/>) }
            </div>
            <div className={classes.wrapper}>
              <Row>
                <Col xs="auto">
                  <div className={classes.avatar}>
                    <Avatar border={true} height="135" author={username} size="medium" />
                  </div>
                </Col>
                <Col>
                  <ContainedButton
                    className={classes.walletButton}
                    transparent={true}
                    label="Followed"
                  />
                </Col>
              </Row>
            </div>
            <div style={{ width: '100%', height: 'max-content' }} className={classes.descriptionContainer}>
              <div className={classNames(classes.wrapper)}>
                <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <Col xs="auto">
                    <p className={classNames(classes.paragraph, classes.fullName)}>
                      { name || username }&nbsp;<Chip  size="small" label={reputation} />
                    </p>
                    <p className={classNames(classes.paragraph, classes.userName)}>
                      @{username}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="auto">
                    <p className={classes.paragraph}>
                      { about }
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="auto">
                    <p className={classes.paragraph}>
                      <a href={website} target="_blank" rel="noopener noreferrer" className={classes.weblink}>
                        { website }
                      </a>
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="auto">
                    <p className={classes.paragraph}>
                    <b>{ following_count }</b> Following &nbsp; <b>{ follower_count }</b> Follower
                    </p>
                  </Col>
                </Row>
                <div className={classes.spacer} />
                <Tabs
                  value={index}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                  onChange={onChange}
                  className={classes.tabContainer}
                >
                  <Tab disableTouchRipple onClick={handleTabs(0)} className={classes.tabs} label="Buzzes" />
                  <Tab disableTouchRipple onClick={handleTabs(1)} className={classes.tabs} label="Replies" />
                  <Tab disableTouchRipple onClick={handleTabs(2)} className={classes.tabs} label="Followers" />
                  <Tab disableTouchRipple onClick={handleTabs(3)} className={classes.tabs} label="Following" />
                </Tabs>
              </div>
            </div>
            <React.Fragment>
              { renderRoutes(route.routes, { author: username }) }
            </React.Fragment>
          </React.Fragment>
        )
      }
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'GET_PROFILE_REQUEST'),
  profile: state.profile.get('profile'),
  isVisited: state.profile.get('isProfileVisited'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getProfileRequest,
    getAccountPostsRequest,
    setProfileIsVisited,
    getAccountRepliesRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
