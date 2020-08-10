import React, { useState } from 'react'
import classNames from 'classnames'
import {
  CommentIcon,
  HeartIcon,
  HiveIcon,
  ContainedButton,
  HeartIconRed,
  HashtagLoader,
} from 'components/elements'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'
import { ReplyFormModal, NotificationBox } from 'components'
import { createUseStyles } from 'react-jss'
import { withStyles } from '@material-ui/core/styles'
import { upvoteRequest } from 'store/posts/actions'
import moment from 'moment'
import { connect } from 'react-redux'
import Chip from '@material-ui/core/Chip'
import { bindActionCreators } from 'redux'

const PrettoSlider = withStyles({
  root: {
    color: '#e53935',
    height: 5,
    '& .MuiSlider-markLabel': {
      fontSize: 12,
    }
  },
  thumb: {
    height: 15,
    width: 15,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -5,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 5,
    borderRadius: 4,
  },
  rail: {
    height: 5,
    borderRadius: 4,
  },
})(Slider)

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 50,
    label: '50',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 70,
    label: '70',
  },
  {
    value: 80,
    label: '80',
  },
  {
    value: 90,
    label: '90',
  },
  {
    value: 100,
    label: '100',
  },
]

const useStyles = createUseStyles({
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  actionWrapperSpace: {
    paddingRight: 30,
  },
  button: {
    height: 33,
  },
})

const ActionWrapper = ({ className, inlineClass, icon, stat, hideStats, onClick, disabled = false, }) => {
  return (
    <div className={classNames(className, inlineClass)} onClick={ disabled ? () => {} : onClick }>
      <div className={inlineClass}>
        { icon }
      </div>
      {
        !hideStats && (
          <div className={inlineClass}>
            { stat }
          </div>
        )
      }
    </div>
  )
}

const PostActions = (props) => {
  const classes = useStyles()
  const {
    author,
    permlink,
    voteCount,
    replyCount,
    payout,
    hideStats = false,
    upvoteRequest,
    hasUpvoted = false,
    user,
    title = null,
    replyRef = 'list',
    treeHistory = 0,
    payoutAt = null,
  } = props

  const [showSlider, setShowSlider] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [vote, setVote] = useState(voteCount)
  const [replyStateCount, setReplyStateCount] = useState(replyCount)
  const [loading, setLoading] = useState(false)
  const [upvoted, setUpvoted] = useState(hasUpvoted)
  const [showSnackbar, setShowSnackBar] = useState(false)
  const [message, setMessage] = useState()
  const [severity, setSeverity] = useState('success')
  const { is_authenticated } = user
  const [open, setOpen] = useState(false)

  const handleSnackBarClose = () => {
    setShowSnackBar(false)
  }

  const handleClickShowSlider = () => {
    setShowSlider(true)
  }

  const handleClickHideSlider = () => {
    setShowSlider(false)
  }

  const handleChange = (e, value) => {
    setSliderValue(value)
  }

  const handleClickUpvote = (author, permlink) => () => {
    setShowSlider(false)
    setLoading(true)
    upvoteRequest(author, permlink, sliderValue)
      .then(() => {
        setShowSnackBar(true)
        setVote(vote + 1)
        setUpvoted(true)
        setLoading(false)
        setMessage(`Succesfully upvoted @${author}/${permlink} at ${sliderValue}%`)
      })
      .catch(() => {
        setUpvoted(false)
        setMessage(`Failure upvoting @${author}/${permlink} at ${sliderValue}%`)
        setSeverity('error')
        setLoading(false)
      })
  }

  const handleClickReply = (author, permlink) => () => {
    setOpen(true)
  }

  const handleOnClose = () => {
    setOpen(false)
  }

  const onReplyDone = ({ message, severity }) => {
    if(severity === 'success') {
      setReplyStateCount(replyStateCount+1)
    }
    setShowSnackBar(true)
    setMessage(message)
    setSeverity(severity)
  }


  return (
    <React.Fragment>
      {
        !showSlider && (
          <div>
            <Row>
              <Col>
                {
                  !loading && upvoted && (
                    <ActionWrapper
                      className={classes.actionWrapperSpace}
                      inlineClass={classes.inline}
                      icon={<IconButton disabled={true} size="small"><HeartIconRed /></IconButton>}
                      hideStats={hideStats}
                      stat={
                        <label style={{ marginLeft: 5, }}>
                          { vote }
                        </label>
                      }
                    />
                  )
                }
                {
                  !loading && !upvoted && (
                    <ActionWrapper
                      className={classes.actionWrapperSpace}
                      inlineClass={classes.inline}
                      icon={<IconButton disabled={!is_authenticated} size="small"><HeartIcon /></IconButton>}
                      hideStats={hideStats}
                      disabled={!is_authenticated}
                      onClick={handleClickShowSlider}
                      stat={
                        <label style={{ marginLeft: 5, }}>
                          { vote }
                        </label>
                      }
                    />
                  )
                }
                {
                  loading && (
                    <ActionWrapper
                      className={classes.actionWrapperSpace}
                      inlineClass={classes.inline}
                      icon={<HashtagLoader top={3} loading={true} size={20} style={{ display: 'inline-block', verticalAlign: 'top' }} />
                    }
                      hideStats={hideStats}
                      onClick={handleClickShowSlider}
                      stat={
                        <label style={{ marginLeft: 5, }}>
                          { voteCount }
                        </label>
                      }
                    />
                  )
                }
              </Col>
              <Col>
                <ActionWrapper
                  className={classes.actionWrapperSpace}
                  inlineClass={classes.inline}
                  icon={<IconButton size="small" disabled={!is_authenticated}><CommentIcon /></IconButton>}
                  hideStats={hideStats}
                  disabled={!is_authenticated}
                  onClick={handleClickReply(author, permlink)}
                  stat={
                    <label style={{ marginLeft: 5, }}>
                      { replyStateCount }
                    </label>
                  }
                />
              </Col>
              <Col xs="auto">
                <ActionWrapper
                  className={classes.actionWrapperSpace}
                  inlineClass={classes.inline}
                  hideStats={false}
                  stat={
                    <Chip
                      style={{ border: '1px solid #e53935' }}
                      size='small'
                      icon={<HiveIcon style={{ paddingLeft: 5, }}/>}
                      label={
                        <span style={{ color: '#e53935' }}>
                          ${ payout > 1 ? '1.00' : payout === '0' ? '0.00' : payout } { moment(`${payoutAt}Z`).local().fromNow() }
                        </span>
                      }
                      color="secondary"
                      variant="outlined"
                    />
                  }
                />
              </Col>
            </Row>
          </div>
        )
      }
      {
        showSlider && (
          <div style={{ width: '98%', paddingRight: 30 }}>
            <Row>
              <Col xs="auto">
                <ContainedButton onClick={handleClickUpvote(author, permlink)} fontSize={15} label={`Upvote (${sliderValue}%)`} className={classes.button} />
              </Col>
              <Col style={{ paddingLeft: 0 }}>
                <ContainedButton
                  fontSize={14}
                  transparent={true}
                  label="Cancel"
                  className={classes.button}
                  onClick={handleClickHideSlider}
                />
              </Col>
            </Row>
            <div style={{ paddingLeft: 10 }}>
              <PrettoSlider
                marks={marks}
                value={sliderValue}
                onChange={handleChange}
              />
            </div>
          </div>
        )
      }
      <NotificationBox
        show={showSnackbar}
        message={message}
        severity={severity}
        onClose={handleSnackBarClose}
      />
      <ReplyFormModal
        treeHistory={treeHistory}
        title={title}
        show={open}
        onHide={handleOnClose}
        author={author}
        permlink={permlink}
        replyRef={replyRef}
        onReplyDone={onReplyDone}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    upvoteRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PostActions)
