import React, {useEffect, useState} from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment'
import { setPageFrom } from 'store/posts/actions'
import { Link } from 'react-router-dom'
import { Avatar, Spinner } from 'components/elements'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { anchorTop } from 'services/helper'
import { isMobile } from 'react-device-detect'
import { ContainedButton } from 'components/elements'
import { filterNotificationRequest } from 'store/polling/actions'
import {Tab, Tabs} from "@material-ui/core"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

const addHover = (theme) => {
  let style = {
    '&:hover': {
      ...theme.postList.hover,
    },
  }

  if(isMobile) {
    style = {}
  }

  return style
}

const useStyle = createUseStyles(theme => ({
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      backgroundColor: {
        ...theme.textArea,
      },
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      fontFamily: 'Segoe-Bold',
      fontWeight: 'bold',
      ...theme.font,
    },
    '& .MuiTab-root span.MuiTab-label': {
      fontFamily: 'Segoe-Bold',
      fontWeight: 'bold',
      ...theme.font,
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    },
  },
  tabsContainer: {
    justifyContent: 'center',
  },

  topContainer: {
    borderBottom: theme.border.primary,
    '& label': {
      fontFamily: 'Segoe-Bold',
      paddingTop: 5,
      '& span': {
        color: '#d32f2f',
        fontWeight: 400,
      },
    },
  },
  tabContainer: {
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    },
  },
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
  unread: {
    ...theme.unread,
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    fontFamily: 'Segoe-Bold',
    fontSize: 14,
    borderBottom: theme.border.primary,
    '& a': {
      color: 'black',
    },
    ...addHover(theme),
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
  chips: {
    '&:hover': {
      textDecoration: 'none !important',
    },
    '& span': {
      fontSize: 14,
      fontFamily: 'Segoe-Bold',
      textDecoration: 'none !important',
      '&:hover': {
        textDecoration: 'none !important',
      },
    },
  },
  noData: {
    ...theme.font,
  },
  filteredNote: {
    fontWeight: 'bold',
    fontSize: 15,
    ...theme.font,
    textAlign: 'center',
    display: 'block',
    margin: '0 auto',
  },
  button: {
    '&:hover': {
      background: '#E61C34',

      '& label': {
        color: '#ffffff !important',
      },
    },
  },
}))


const Notification = (props) => {
  const {
    notifications,
    loading,
    count,
    setPageFrom,
    notifFilter,
  } = props

  const { filterNotificationRequest } = props

  useEffect(() => {
    anchorTop()
    setPageFrom(null)
    // eslint-disable-next-line
  }, [])

  const actionAuthor = (msg) => {
    const author = msg.split(' ')[0]

    return author
  }

  const generateNotifLink = (type, url) => {
    let link
    const split = url.split('/')

    if(type !== 'follow') {
      link = `/${split[0]}/${split[1]}`
    } else {
      link = `/${split[0]}/t/buzz`
    }

    return link
  }

  const generateFilterDescription = () => {
    let verb = `${notifFilter.toLowerCase().charAt(0).toUpperCase()+notifFilter.toLowerCase().slice(1)}S`

    if(verb === 'Replys') {
      verb = 'Replies'
    }
    // return `Showing ${verb}`
  }

  const handleClickViewProfile = (username) => (e) => {
    e.preventDefault()
    window.open(`https://d.buzz/@${username}`, '_blank')
  }

  const classes = useStyle()
  const [selectedTab, setSelectedTab] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
    anchorTop()
    setPageFrom(null)
  }, [setPageFrom])

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)

    switch (newValue) {
    case 0:
      filterNotificationRequest('ALL')
      generateFilterDescription()
      break
    case 1:
      filterNotificationRequest('MENTION')
      generateFilterDescription()
      break
    default:
      break
    }
  }

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const handleFilterChange = (filter) => () => {
    filterNotificationRequest(filter)
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <div className={classes.topContainer}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          className={classes.tabs}
          classes={{ flexContainer: classes.tabsContainer }}
        >
          <Tab label="All" />
          <Tab label="Mention" />
          <Tab label="Filters" onClick={openMenu} />
        </Tabs>

        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem onClick={handleFilterChange('VOTE')}>Votes</MenuItem>
          <MenuItem onClick={handleFilterChange('FOLLOW')}>Follows</MenuItem>
          <MenuItem onClick={handleFilterChange('REPLY')}>Replies</MenuItem>
          <MenuItem onClick={handleFilterChange('REBLOG')}>Reblogs</MenuItem>
          <MenuItem onClick={handleFilterChange('TRANSFER')}>Transfers</MenuItem>
        </Menu>

      </div>
      {/*{notifFilter !== 'ALL' && <center><span className={classes.filteredNote}>Showing {notifFilter}S</span></center>}*/}

      {notifications.map((item, index) => (
        <div className={classNames(classes.wrapper, (index < count.unread) && notifFilter === 'ALL' ? classes.unread : '')} key={index}>
          <div className={classes.row}>
            <Link to={generateNotifLink(item.type, item.url)}>
              <Row>
                <Col xs="auto" style={{ paddingRight: 0 }}>
                  <div className={classes.left}>
                    <Avatar author={actionAuthor(item.msg).replace('@', '')} onClick={handleClickViewProfile(actionAuthor(item.msg).replace('@', ''))} />
                  </div>
                </Col>
                <Col>
                  <div className={classes.right}>
                    <div className={classes.content}>
                      <label className={classes.username}>{item.msg}</label>
                      <br />
                      <label className={classes.username}>{moment(`${item.date}Z`).local().fromNow()}</label>
                      <br />
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className={classes.content}>
                    <ContainedButton fontSize={12} disabled={loading} style={{ float: 'right' }} transparent={true} label="View profile" className={classes.button} onClick={handleClickViewProfile(actionAuthor(item.msg).replace('@', ''))} />
                  </div>
                </Col>
              </Row>
            </Link>
          </div>
        </div>
      ))}
      {(!loading && notifications.length === 0) && <span className={classes.noData}><center><h6>You have no notifications</h6></center></span>}
      <Spinner loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  notifications: state.polling.get('notifications'),
  count: state.polling.get('count'),
  loading: pending(state, 'POLL_NOTIF_REQUEST'),
  notifFilter: state.polling.get('notificationFilter'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setPageFrom,
    filterNotificationRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notification)