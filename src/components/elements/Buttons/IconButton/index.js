import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    width: 'max-content',
    height: 'max-content',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: '#ffebee',
      '& svg': {
        '& path': {
          stroke: '#e53935',
        },
      },
    }
  },
  icon: {
    padding: 4,
    paddingRight: 6,
    paddingLeft: 6,
    cursor: 'pointer',
  }
})

const IconWrapper = ({ className, children }) => {
  return (
    <div className={className}>
      { children }
    </div>
  )
}

const IconButton = (props) => {
  const classes = useStyles()
  const { icon } = props

  return (
    <div className={classes.container}>
      <IconWrapper className={classes.icon}>
        { icon }
      </IconWrapper>
    </div>
  )
}

export default IconButton
