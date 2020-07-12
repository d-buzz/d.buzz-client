import React from 'react'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  field: {
    padding: 5,
    paddingLeft: 5,
    paddingRight: 5,
    border: 'none',
    backgroundColor: 'transparent',
    width: 'calc(100% - 65px)',
    height: 40,
    '&:focus': {
      outline: 'none',
    },
  },
  round: {
    borderRadius: '50px 50px',
    border: '1px solid #e6ecf0',
  },
  inline: {
    display: 'inline',
  },
  iconWrapper: {
    paddingLeft: 15,
    paddingRight: 10,
  }
})

const IconWrapper = ({ children, className }) => {
  return (
    <div className={className}>
      { children }
    </div>
  )
}

const RoundedFields = (props) => {
  const classes = useStyles()
  const { 
    placeholder = '',
    type = 'text',
    className = {},
    style = {},
    icon = '' 
  } = props

  let defaultInputStyle = { width: 'auto', paddingLeft: 5, paddingRight: 5 }

  if(icon) {
    defaultInputStyle = {}
  }

  return (
    <React.Fragment>
      <div className={classNames(classes.round, className)}>
        <IconWrapper className={classNames(classes.inline, classes.iconWrapper)}>
          { icon }
        </IconWrapper>
        <input 
          type={type}
          style={{ ...style, ...defaultInputStyle }} 
          placeholder={ placeholder } 
          className={classNames(classes.field, classes.inline)}
        />
      </div>
    </React.Fragment>
  )
}

export default RoundedFields