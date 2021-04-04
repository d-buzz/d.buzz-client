import React, { useState } from 'react'
import { CaretIcon } from 'components/elements'
import IconButton from '@material-ui/core/IconButton'
import Col from 'react-bootstrap/Col'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import classNames from 'classnames'


import { filterNotificationRequest } from 'store/polling/actions'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const useStyles = createUseStyles(theme => ({
  menuText: {
    fontSize: 13,
  },
  right: {
    height: 'max-content',
  },
}))

const NotificationFilter = (props) => {

  const { filterNotificationRequest } = props

  const classes = useStyles()
  const [openCaret, setOpenCaret] = useState(false)

  const openMenu = (e) => {
    setOpenCaret(e.currentTarget)
  }

  const closeMenu = () => {
    setOpenCaret(false)
  }

  const onChangeNotification = (name) => () => {
    filterNotificationRequest(name)
    setOpenCaret(false)
  }

  return (
    <React.Fragment>
      <IconButton onClick={openMenu} size='small'>
        <CaretIcon />
      </IconButton>
      <Col xs="auto">
        <div className={classNames('right-content', classes.right)}>
          <Menu
            anchorEl={openCaret}
            keepMounted
            open={Boolean(openCaret)}
            onClose={closeMenu}
          >
            <MenuItem className={classes.menuText} onClick={onChangeNotification('ALL')}>All</MenuItem>
            <MenuItem className={classes.menuText} onClick={onChangeNotification('VOTE')}>Votes</MenuItem>
            <MenuItem className={classes.menuText} onClick={onChangeNotification('MENTION')}>Mentions</MenuItem>
            <MenuItem className={classes.menuText} onClick={onChangeNotification('FOLLOW')}>Follows</MenuItem>
            <MenuItem className={classes.menuText} onClick={onChangeNotification('REPLY')}>Replies</MenuItem>
            <MenuItem className={classes.menuText} onClick={onChangeNotification('REBLOG')}>Reblogs</MenuItem>
            <MenuItem className={classes.menuText} onClick={onChangeNotification('TRANSFER')}>Transfers</MenuItem>
          </Menu>
        </div>
      </Col>
    </React.Fragment>
  )
}


const mapStateToProps = (state) => ({
  notifFilter: state.polling.get('notificationFilter'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    filterNotificationRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationFilter)
