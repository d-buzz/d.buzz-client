import React, { useState } from 'react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'
import { TextArea, ContainedButton, Avatar } from 'components/elements'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
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
  },
  root: {
    position: 'relative',
  },
  bottom: {
    color: '#ffebee',
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
    color: '#e53935',
  },
})


const CreateBuzzForm = (props) => {
  const classes = useStyles()
  const [wordCount, setWordCount] = useState(0)
  const [content, setContent] = useState()
  const { user } = props

  const onChange = (e) => {
    const { target } = e
    const { value } = target
    setContent(value)
    setWordCount(Math.floor((value.length/280) * 100))
  }


  console.log({ wordCount })

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classNames(classes.inline, classes.left)}>
          <Avatar author={user.username} />
        </div>
        <div className={classNames(classes.inline, classes.right)}>
          <TextArea maxlength="280" value={content} onKeyUp={onChange} onKeyDown={onChange} onChange={onChange} />
          <ContainedButton label="Buzz it" className={classes.float} />
          <Box style={{ float: 'right', marginRight: 10, paddingTop: 5, }} position="relative" display="inline-flex">
            <CircularProgress
              classes={{
                circle: classes.circle,
              }}
              size={30}
              value={wordCount}
              variant="static"
            />
          </Box>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(CreateBuzzForm)
