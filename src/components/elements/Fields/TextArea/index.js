import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  field: {
    fontSize: 15,
    resize: 'none',
    width: '100%',
    '&:focus': {
      outline: 'none',
    },
    paddingTop: 5,
    border: 'none',
    borderBottom: '1px solid #e6ecf0',
  },
})

const TextArea = (props) => {
  const classes = useStyles()
  const {
    label = 'What\'s buzzing?',
    minRows = 2,
  } = props

  return (
    <React.Fragment>
      <TextareaAutosize
        minRows={minRows}
        maxRows={15}
        placeholder={label}
        className={classes.field}
        { ...props }
      />
    </React.Fragment>
  )
}

export default TextArea
