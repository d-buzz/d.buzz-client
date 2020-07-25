import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  menu: {
    backgroundColor: '#f5f8fa',
    borderRadius: '10px 10px',
    position: 'absolute',
    minheight: 60,
    width: '98%',
    bottom: 80,
    boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: 'calc(50% - 10px)',
      background: 'rgb(204, 214, 221)',
      width: '20px',
      height: '10px',
      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
    },
  }
})

const FloatingDialog = (props) => {
  const classes = useStyles()
  const { children, show } = props

  return (
    <React.Fragment>
      {
        show && (
          <div className={classes.menu}>
            <div style={{ paddingTop: 10, paddingBottom: 10, }}>
              { children }
            </div>
          </div>
        )
      }
    </React.Fragment>
  )
}

export default FloatingDialog
