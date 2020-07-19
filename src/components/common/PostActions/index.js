import React from 'react'
import classNames from 'classnames'
import {
  CommentIcon,
  IconButton,
  HeartIcon,
  FlagIcon,
  HiveIcon,
} from 'components/elements'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  actionWrapperSpace: {
    paddingRight: 30,
  },
})

const ActionWrapper = ({ className, inlineClass, icon, stat, hideStats }) => {
  return (
    <div className={classNames(className, inlineClass)}>
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

  return (
    <React.Fragment>
      <div>
        <ActionWrapper
          className={classes.actionWrapperSpace}
          inlineClass={classes.inline}
          icon={<IconButton icon={<HeartIcon />} />}
          hideStats={hideStats}
          stat={
            <label style={{ marginTop: 5, marginLeft: 5, }}>
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
            <label style={{ marginTop: 5, marginLeft: 5, }}>
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
            <label style={{ marginTop: 5, marginLeft: 5, }}>
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
    </React.Fragment>
  )
}

export default PostActions
