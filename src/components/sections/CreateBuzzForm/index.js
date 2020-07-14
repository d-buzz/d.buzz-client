import React from 'react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { TextArea, ContainedButton, Avatar } from 'components/elements'

const useStyles = createUseStyles({
  container: {
    width: '100%',
    borderBottom: '10px solid #e6ecf0',
  },
  row: {
    width: '98%',
    margin: '0 auto',
    marginTop: 10,
    marginBottom: 10,
  },
  left: {
    width: 60,
    height: '100%',
  },
  right: {
    minHeight: 55,
    width: 'calc(100% - 65px)',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  float: {
    float: 'right',
    marginRight: 5,
  }
})

const CreateBuzzForm = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classNames(classes.inline, classes.left)}>
          <Avatar author={'hive-net-ph'} />
        </div>
        <div className={classNames(classes.inline, classes.right)}>
          <TextArea />
          <ContainedButton label="Buzz it" className={classes.float} />
        </div>
      </div>
    </div>
  )
}

export default CreateBuzzForm
