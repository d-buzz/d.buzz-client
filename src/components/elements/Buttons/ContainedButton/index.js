import React from 'react'
import { createUseStyles } from 'react-jss'
import { Spinner } from 'components/elements'
import classNames from 'classnames'

const useStyles = createUseStyles({
  button: {
    padding: '5px 15px',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#e61c34',
    borderRadius: '50px 50px',
    width: 'max-content',
    border: 'none',
    outlineWidth: 'none',
    cursor: 'pointer',
    '& span': {
      whiteSpace: 'nowrap',
      color: 'white',
      fontFamily: 'Segoe-Bold',
    },
    '&:hover': {
      backgroundColor: '#b71c1c',
    },
    '&:disabled': {
      backgroundColor: '#e61c34',
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  transparentButton: {
    padding: '5px 15px',
    background: 'transparent',
    border: '1px solid #e61c34',
    borderRadius: '50px 50px',
    width: 'max-content',
    cursor: 'pointer',
    '& span': {
      whiteSpace: 'nowrap',
      color: '#e61c34',
      fontWeight: 'bold',
      fontFamily: 'Segoe-Bold',
    },
    '&:hover': {
      backgroundColor: '#b71c1c1c',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      background: 'transparent',
    },
  },
  disabledButton: {
    padding: '5px 15px',
    backgroundColor: '#dad1d14d',
    borderRadius: '50px 50px',
    width: 'max-content',
    border: 'none',
    outlineWidth: 'none',
    cursor: 'mouse',
    '& span': {
      whiteSpace: 'nowrap',
      fontFamily: 'Segoe-Bold',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  disabledButtonTransparent: {
    padding: '5px 15px',
    border: '1px solid #e61c34',
    borderRadius: '50px 50px',
    width: 'max-content',
    cursor: 'mouse',
    outlineWidth: 'none',
    '& span': {
      color: '#e61c34',
      whiteSpace: 'nowrap',
      fontFamily: 'Segoe-Bold',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
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
    loading = false,
    labelStyle = {},
  } = props

  let buttonClass = classes.button

  if(transparent) {
    buttonClass = classes.transparentButton
  }

  if(disabled) {
    buttonClass = classes.disabledButton
    if(transparent) {
      buttonClass = classes.disabledButtonTransparent
    }
  }

  return (
    <button onClick={!disabled && !loading ? onClick : () => {}} className={classNames(buttonClass, className)} style={style} disabled={disabled} >
      <span style={{ fontSize: fontSize, ...labelStyle }}>
        {!loading && label}
        {loading && (<Spinner size={15} top={4} loading={true} />)}
      </span>
    </button>
  )
}

export default ContainedButton
