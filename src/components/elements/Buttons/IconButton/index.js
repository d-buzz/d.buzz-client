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
    cursor: 'pointer',
    height: 30,
    width: 30,
    borderRadius: 50,
    textAlign: 'center',
    '& svg': {
      position: 'relative',
      margin: '0 auto',
    },
  }
})

const IconWrapper = ({ className, children }) => {
  return (
    <div className={className}>
      <center>
        {children}
      </center>
    </div>
  )
}

const IconButton = (props) => {
  const classes = useStyles()
  const { icon, style = {}, onClick } = props

  return (
    <div onClick={onClick} style={style} className={classes.container}>
      <IconWrapper className={classes.icon}>
        {icon}
      </IconWrapper>
    </div>
  )
}

export default IconButton
