import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment'
import Chip from '@material-ui/core/Chip'
import { Link } from 'react-router-dom'
import { Avatar, HashtagLoader } from 'components/elements'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import { createUseStyles } from 'react-jss'

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
  chips: {
    '&:hover': {
      textDecoration: 'none !important',
    },
    '& span': {
      textDecoration: 'none !important',
      '&:hover': {
        textDecoration: 'none !important'
      }
    }
  }
})


const Notification = (props) => {
  const { notifications, loading } = props

  const classes = useStyle()

  const actionAuthor = (msg) => {
    const author = msg.split(' ')[0]

    return author
  }

  const generateNotifLink = (type, url) => {
    let link
    const split = url.split('/')

    if(type !== 'follow') {
      link = `/${split[0]}/c/${split[1]}`
    } else {
      link = `/${split[0]}/t/buzz`
    }


    return link
  }

  return (
    <React.Fragment>
      {notifications.map((item) => (
        <React.Fragment>
          <div className={classes.wrapper}>
            <div className={classes.row}>
              <Link to={generateNotifLink(item.type, item.url)} style={{ textDecoration: 'none' }}>
                <Row>
                  <Col xs="auto" style={{ paddingRight: 0 }}>
                    <div className={classes.left}>
                      <Avatar author={actionAuthor(item.msg).replace('@', '')} />
                    </div>
                  </Col>
                  <Col>
                    <div className={classes.right}>
                      <div className={classes.content}>
                        <label className={classes.username}>
                          {item.msg}
                        </label> <br />
                        <label className={classes.username}>
                          {moment(`${item.date}Z`).local().fromNow()}
                        </label>
                      </div>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <Chip
                      className={classes.chips}
                      style={{ border: '1px solid #e53935', marginTop: -5 }}
                      size='small'
                      label={item.type}
                      color="secondary"
                      variant="outlined"
                    />
                  </Col>
                </Row>
              </Link>
            </div>
          </div>
        </React.Fragment>
      ))}
      {(!loading && notifications.length === 0) &&
        (<center><br/><h6>You have no notifications</h6></center>)}
      <HashtagLoader loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  notifications: state.polling.get('notifications'),
  loading: pending(state, 'POLL_NOTIF_REQUEST'),
})

export default connect(mapStateToProps)(Notification)
