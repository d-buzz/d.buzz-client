import React from 'react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { TextArea, ContainedButton, Avatar } from 'components/elements'
import { connect } from 'react-redux'


const useStyles = createUseStyles({
  container: {
    width: '100%',
    borderBottom: '10px solid #e6ecf0',
  },
  row: {
    width: '98%',
    margin: '0 auto',
    paddingTop: 15,
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

const CreateBuzzForm = (props) => {
  const classes = useStyles()
  const { user } = props

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classNames(classes.inline, classes.left)}>
          <Avatar author={user.username} />
        </div>
        <div className={classNames(classes.inline, classes.right)}>
          <TextArea />
          <ContainedButton label="Buzz it" className={classes.float} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(CreateBuzzForm)
