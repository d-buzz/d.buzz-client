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

  return (
    <React.Fragment>
      <TextareaAutosize
        minRows={2}
        maxRows={15}
        placeholder="What's Buzzing?"
        className={classes.field}
        { ...props }
      />
    </React.Fragment>
  )
}

export default TextArea
