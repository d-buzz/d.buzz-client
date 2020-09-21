import React, { useState } from 'react'
import classNames from 'classnames'
import {
  CommentIcon,
  HeartIcon,
  HiveIcon,
  ContainedButton,
  HeartIconRed,
  Spinner,
} from 'components/elements'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Chip from '@material-ui/core/Chip'
import moment from 'moment'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'
import { broadcastNotification } from 'store/interface/actions'
import { createUseStyles } from 'react-jss'
import { withStyles } from '@material-ui/core/styles'
import { upvoteRequest } from 'store/posts/actions'
import { openReplyModal } from 'store/interface/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isMobile } from 'react-device-detect'

const PrettoSlider = withStyles({
  root: {
    color: '#e53935',
    height: 5,
    '& .MuiSlider-markLabel': {
      fontSize: 12,
      color: '#d32f2f',
    },
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

const useStyles = createUseStyles(theme => ({
  icon: {
    ...theme.icon,
    ...theme.font,
  },
  spinner: {
    ...theme.font,
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
    fontSize: 14,
    ...theme.font,
  },
  actionWrapperSpace: {
    paddingRight: 30,
    fontSize: 14,
  },
  button: {
    height: 33,
    fontSize: 14,
  },
  chip: {
    border: 'none !important',
    float: 'right !important',
    '& span': {
      fontFamily: 'Segoe-Bold',
      marginTop: -5,
    },
  },
  sliderWrapper: {
    width: '98%',
    paddingRight: 30,
  },
  iconButton: {
    ...theme.iconButton.hover,
  },
}))

const ActionWrapper = ({ className, inlineClass, icon, stat, hideStats, onClick, disabled = false }) => {
  return (
    <div className={classNames(className, inlineClass)} onClick={disabled ? () => {} : onClick}>
      <div className={inlineClass}>
        {icon}
      </div>
      {!hideStats && (
        <div style={{ paddingTop: 2 }} className={inlineClass}>
          {stat}
        </div>
      )}
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
    body = null,
    replyRef = 'list',
    treeHistory = 0,
    payoutAt = null,
    disableExtraPadding = false,
    openReplyModal,
    broadcastNotification,
    disableUpvote = false,
  } = props

  const [showSlider, setShowSlider] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [vote, setVote] = useState(voteCount)
  const [loading, setLoading] = useState(false)
  const [upvoted, setUpvoted] = useState(hasUpvoted)

  const { is_authenticated } = user

  let extraPadding = { paddingTop: 10 }

  if(disableExtraPadding) {
    extraPadding = {}
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

  const handleClickUpvote = () => {
    setShowSlider(false)
    setLoading(true)
    upvoteRequest(author, permlink, sliderValue)
      .then(({ success }) => {
        if(success) {
          setVote(vote + 1)
          setUpvoted(true)
          setLoading(false)
          broadcastNotification('success', `Succesfully upvoted @${author}/${permlink} at ${sliderValue}%`)
        } else {
          setUpvoted(false)
          broadcastNotification('error', `Failure upvoting @${author}/${permlink} at ${sliderValue}%`)
          setLoading(false)
        }
      })
      .catch(() => {
        setUpvoted(false)
        broadcastNotification('error', `Failure upvoting @${author}/${permlink} at ${sliderValue}%`)
        setLoading(false)
      })
  }

  const handleClickReply = () => {
    openReplyModal(author, permlink, body, treeHistory, replyRef)
  }

  const getPayoutDate = (date) => {
    const semantic =  moment(`${date}Z`).local().fromNow()
    return semantic !== '51 years ago' ? semantic : ''
  }

  return (
    <React.Fragment>
      {!showSlider && (
        <div>
          <Row style={{ width: '100%', ...extraPadding }}>
            <Col xs={!isMobile ? 0 : 4}>
              {!loading && upvoted && (
                <ActionWrapper
                  className={classes.actionWrapperSpace}
                  inlineClass={classes.inline}
                  icon={<IconButton disabled={true} size="small"><HeartIconRed /></IconButton>}
                  hideStats={hideStats}
                  stat={(
                    <label style={{ marginLeft: 5 }}>
                      {vote}
                    </label>
                  )}
                />
              )}
              {!loading && !upvoted && (
                <ActionWrapper
                  className={classes.actionWrapperSpace}
                  inlineClass={classNames(classes.inline, classes.icon)}
                  icon={<IconButton classes={{ root: classes.iconButton  }} disabled={!is_authenticated || disableUpvote} size="small"><HeartIcon /></IconButton>}
                  hideStats={hideStats}
                  disabled={!is_authenticated || disableUpvote}
                  onClick={handleClickShowSlider}
                  stat={(
                    <label style={{ marginLeft: 5 }}>
                      {vote}
                    </label>
                  )}
                />
              )}
              {loading && (
                <ActionWrapper
                  className={classes.actionWrapperSpace}
                  inlineClass={classNames(classes.inline, classes.spinner)}
                  icon={<Spinner top={0} loading={true} size={20} style={{ display: 'inline-block', verticalAlign: 'top' }} />}
                  hideStats={hideStats}
                  onClick={handleClickShowSlider}
                  stat={(
                    <label style={{ marginLeft: 5 }}>
                      {voteCount}
                    </label>
                  )}
                />
              )}
            </Col>
            <Col xs={!isMobile ? 0 : 4}>
              <ActionWrapper
                className={classes.actionWrapperSpace}
                inlineClass={classNames(classes.inline, classes.icon)}
                icon={<IconButton classes={{ root: classes.iconButton  }} size="small" disabled={!is_authenticated}><CommentIcon /></IconButton>}
                hideStats={hideStats}
                disabled={!is_authenticated}
                onClick={handleClickReply}
                stat={(
                  <label style={{ marginLeft: 5 }}>
                    {replyCount}
                  </label>
                )}
              />
            </Col>
            <Col xs={!isMobile ? 'auto' : 4}>
              <ActionWrapper
                className={classes.actionWrapperSpace}
                inlineClass={classes.inline}
                hideStats={false}
                stat={(
                  <Chip
                    className={classes.chip}
                    size='small'
                    icon={<HiveIcon style={{ paddingLeft: 5 }}/>}
                    label={(
                      <span style={{ color: '#e53935', fontSize: 14 }}>
                        ${payout > 1 ? '1.00' : payout === '0' ? '0.00' : payout}&nbsp;
                        {!payout ? '0.00 in 7 days' : ''}&nbsp;
                        {!isMobile && payoutAt ? getPayoutDate(payoutAt) : ''}
                      </span>
                    )}
                    color="secondary"
                    variant="outlined"
                  />
                )}
              />
            </Col>
          </Row>
        </div>
      )}
      {showSlider && (
        <div className={classes.sliderWrapper}>
          <Row>
            <Col xs="auto">
              <ContainedButton onClick={handleClickUpvote} fontSize={14} label={`Upvote (${sliderValue}%)`} className={classes.button} />
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
      )}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    upvoteRequest,
    openReplyModal,
    broadcastNotification,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostActions)
