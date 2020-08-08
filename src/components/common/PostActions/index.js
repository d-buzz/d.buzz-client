import React, { useState } from 'react'
import classNames from 'classnames'
import {
  CommentIcon,
  HeartIcon,
  FlagIcon,
  HiveIcon,
  ContainedButton,
  HeartIconRed,
} from 'components/elements'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'
import { HashtagLoader } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { withStyles } from '@material-ui/core/styles'
import { upvoteRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

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
  } = props

  const [showSlider, setShowSlider] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const [vote, setVote] = useState(voteCount)
  const [loading, setLoading] = useState(false)
  const [upvoted, setUpvoted] = useState(hasUpvoted)
  const [showSnackbar, setShowSnackBar] = useState(false)
  const { is_authenticated } = user

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
      })
      .catch(() => {
        alert('upvote failure')
        setLoading(false)
      })
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
                  icon={<IconButton size="small"><CommentIcon /></IconButton>}
                  hideStats={hideStats}
                  stat={
                    <label style={{ marginLeft: 5, }}>
                      { replyCount }
                    </label>
                  }
                />
              </Col>
              <Col>
                <ActionWrapper
                  className={classes.actionWrapperSpace}
                  inlineClass={classes.inline}
                  icon={<IconButton size="small"><HiveIcon /></IconButton>}
                  hideStats={false}
                  stat={
                    <label style={{ marginLeft: 5, }}>
                      ${ payout > 1 ? '1.00' : payout === '0' ? '0.00' : payout }
                    </label>
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
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} style={{ width: 300 }} open={showSnackbar} autoHideDuration={6000} onClose={handleSnackBarClose}>
        <Alert onClose={handleSnackBarClose} severity="success">
          Succesfully upvoted <b>@{author}/{permlink}</b> at {sliderValue}%
        </Alert>
      </Snackbar>
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
