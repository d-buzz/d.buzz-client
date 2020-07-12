import React from 'react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  round: {
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    height: 40,
    borderRadius: '50px 50px',
    border: '1px solid #e6ecf0',
    backgroundColor: '#e6ecf0',
    width: '100%',
    '&:focus': {
      outline: 'none',
    },
  }
})

const RoundedFields = (props) => {
  const classes = useStyles()
  const { 
    placeholder = '',
    type = 'text',
    className = {}, 
  } = props

  return (
    <React.Fragment>
      <input type={type} placeholder={placeholder} className={classNames(classes.round, className)}></input>
    </React.Fragment>
  )
}

export default RoundedFields