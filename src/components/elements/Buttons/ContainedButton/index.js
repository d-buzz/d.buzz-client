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
  transparentButton: {
    border: '1px solid #e61c34',
    borderRadius: '50px 50px',
    width: 'max-content',
    cursor: 'pointer',
    '& label': {
      cursor: 'pointer',
      paddingTop: 5,
      paddingLeft: 15,
      paddingRight: 15,
      whiteSpace: 'nowrap',
      color: '#e61c34',
      fontWeight: 'bold',
    },
    '&:hover': {
      backgroundColor: '#b71c1c1c',
    }
  },
  disabledButton: {
    backgroundColor: '#d0cfcf',
    borderRadius: '50px 50px',
    width: 'max-content',
    cursor: 'mouse',
    '& label': {
      cursor: 'mouse',
      paddingTop: 5,
      paddingLeft: 15,
      paddingRight: 15,
      whiteSpace: 'nowrap',
      color: 'white',
    },
    '&:hover': {
      backgroundColor: '#d0cfcf',
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
    transparent = false,
    onClick = () => {},
    disabled = false,
  } = props

  let buttonClass = classes.button

  if(transparent) {
    buttonClass = classes.transparentButton
  }

  if(disabled) {
    buttonClass = classes.disabledButton
  }

  return (
    <div onClick={!disabled ? onClick : () => {}} className={classNames(buttonClass, className)} style={style} >
      <center>
        <label style={{ fontSize: fontSize }}>
          { label }
        </label>
      </center>
    </div>
  )
}

export default ContainedButton
