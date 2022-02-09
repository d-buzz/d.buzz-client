import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  field: {
    fontSize: 18,
    resize: 'none',
    width: '100%',
    '&:focus': {
      outline: 'none',
    },
    border: 'none',
    paddingTop: 5,
    ...theme.textArea,
    color: theme.font.color,
    backgroundColor: 'transparent',
    borderBottom: 'none',
    transition: 'all 250ms',
  },
}))

const TextArea = (props) => {
  const classes = useStyles()
  const { buzzId } = props
  const {
    label = buzzId === 1 ? 'What\'s buzzing?' : 'Add another Buzz',
    minRows = 2,
  } = props

  return (
    <React.Fragment>
      <TextareaAutosize
        minRows={minRows}
        maxRows={15}
        placeholder={label}
        className={classes.field}
        {...props}
      />
    </React.Fragment>
  )
}

export default TextArea
