import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ContainedButton, Avatar } from 'components/elements'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { getProfileMetaData } from 'services/helper'
import { createUseStyles } from 'react-jss'
import Popover from '@material-ui/core/Popover'
import { followRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { pending } from 'redux-saga-thunk'
import { bindActionCreators} from 'redux'

const useStyles = createUseStyles({
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
    marginBottom: 0,
  },
  username: {
    color: '#657786',
    paddingBottom: 0,
  },
  paragraph: {
    padding: 0,
    margin: 0,
  },
  popover: {
    pointerEvents: 'none',
    '& :after': {
      border: '1px solid red',
    }
  },
  paper: {
    pointerEvents: "auto",
    padding: 2,
    '& :after': {
      border: '1px solid red',
    }
  },
  wrapper: {
    width: 300,
    minHeight: 160
  }
})

const UserDialog = (props) => {
  const classes = useStyles()
  const {
    open,
    anchorEl,
    onMouseEnter,
    onMouseLeave,
    profile,
    loading,
    unguardedLinks,
    followRequest,
  } = props

  const { name, about } = getProfileMetaData(profile)
  const { reputation = 0, name: author } = profile
  const [shouldStayOpen, setShouldStayOpen] = useState(false)

  let following_count = 0
  let follower_count = 0

  if(profile.follow_count) {
    follower_count = profile.follow_count.follower_count
    following_count = profile.follow_count.following_count
  }

  let authorLink = `/@${author}?ref=card`

  if(unguardedLinks) {
    authorLink = `ug${authorLink}`
  }

  const followUser = () => {
    setShouldStayOpen(true)
    followRequest(author).then(() => {
      setShouldStayOpen(false)
    })
  }

  return (
    <Popover
      id="mouse-over-popover"
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={open | shouldStayOpen}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{ onMouseEnter, onMouseLeave }}
      onClose={onMouseLeave}
    >
      <div className={classes.wrapper}>
      <div style={{ height: '100%', width: '95%', margin: '0 auto', marginTop: 5, marginBottom: 5, }}>
        <div className={classes.row}>
            <Row>
              <Col xs="auto" style={{ paddingRight: 0 }}>
                <div className={classes.left}>
                  <Avatar author={author} />
                </div>
              </Col>
              <Col>
                <div className={classes.right}>
                  <ContainedButton
                    loading={loading}
                    disabled={loading}
                    style={{ float: 'right', marginTop: 5, }}
                    transparent={true}
                    fontSize={15}
                    label="Follow"
                    className={classes.button}
                    onClick={followUser}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="auto" style={{ paddingRight: 0 }}>
                <label className={classes.name} style={{ color: 'black' }}>
                  <Link
                    to={authorLink}
                    style={{ color: 'black' }}
                  >
                    { name ? name : `${author}`}({reputation})
                  </Link>
                </label>
                <p className={classNames(classes.paragraph, classes.username)}>
                  { `@${author}` }
                </p>
                <p className={classes.paragraph}>
                  { about }
                </p>
                <p className={classes.paragraph}>
                  <b>{ following_count }</b> Following &nbsp; <b>{ follower_count }</b> Follower
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Popover>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'FOLLOW_REQUEST')
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    followRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDialog)
