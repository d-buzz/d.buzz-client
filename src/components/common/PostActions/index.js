import React, { useState } from 'react'
import classNames from 'classnames'
import {
  CommentIcon,
  IconButton,
  HeartIcon,
  FlagIcon,
  HiveIcon,
  ContainedButton,
} from 'components/elements'
import { createUseStyles } from 'react-jss'
import Slider from '@material-ui/core/Slider'
import { withStyles } from '@material-ui/core/styles'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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

const ActionWrapper = ({ className, inlineClass, icon, stat, hideStats, onClick }) => {
  return (
    <div className={classNames(className, inlineClass)} onClick={onClick}>
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
    voteCount,
    replyCount,
    payout,
    hideStats = false,
  } = props

  const [showSlider, setShowSlider] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)

  const handleClickShowSlider = () => {
    setShowSlider(true)
  }

  const handleClickHideSlider = () => {
    setShowSlider(false)
  }

  const handleChange = (e, value) => {
    setSliderValue(value)
  }


  return (
    <React.Fragment>
      {
        !showSlider && (
          <div>
            <ActionWrapper
              className={classes.actionWrapperSpace}
              inlineClass={classes.inline}
              icon={<IconButton icon={<HeartIcon />} />}
              hideStats={hideStats}
              onClick={handleClickShowSlider}
              stat={
                <label style={{ marginLeft: 5, }}>
                  { voteCount }
                </label>
              }
            />
            <ActionWrapper
              className={classes.actionWrapperSpace}
              inlineClass={classes.inline}
              icon={<IconButton icon={<CommentIcon />} />}
              hideStats={hideStats}
              stat={
                <label style={{ marginLeft: 5, }}>
                  { replyCount }
                </label>
              }
            />
            <ActionWrapper
              className={classes.actionWrapperSpace}
              inlineClass={classes.inline}
              icon={<IconButton icon={<HiveIcon />} />}
              hideStats={false}
              stat={
                <label style={{ marginLeft: 5, }}>
                  { payout }
                </label>
              }
            />
            <ActionWrapper
              className={classes.actionWrapperSpace}
              inlineClass={classes.inline}
              icon={<IconButton icon={<FlagIcon />} />}
            />
          </div>
        )
      }
      {
        showSlider && (
          <div style={{ width: '98%', paddingRight: 30 }}>
            <Row>
              <Col xs="auto">
                <ContainedButton fontSize={15} label={`Upvote (${sliderValue}%)`} className={classes.button} />
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
    </React.Fragment>
  )
}

export default PostActions
