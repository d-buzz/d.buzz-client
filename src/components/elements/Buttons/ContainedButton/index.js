import React from 'react'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'

const useStyles = createUseStyles({
  button: {
    backgroundColor: '#e61c34',
    borderRadius: '50px 50px',
    width: 'max-content',
    cursor: 'pointer',
    '& label': {
      cursor: 'pointer',
      paddingTop: 5,
      paddingLeft: 15,
      paddingRight: 15,
      whiteSpace: 'nowrap',
      color: 'white',
    },
    '&:hover': {
      backgroundColor: '#b71c1c',
    }
  },
})

const ContainedButton = (props) => {
  const classes = useStyles()
  const { 
    label,
    className = {},
    style = {},
    fontSize = 15,
  } = props

  return (
    <div style={style} className={classNames(classes.button, className)}>
      <center>
        <label style={{ fontSize: fontSize }}>
          { label }
        </label>
      </center>
    </div>
  )
}

export default ContainedButton