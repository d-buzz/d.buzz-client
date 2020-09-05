import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  container: {
    backgroundColor: theme.right.list.background,
    borderRadius: '10px 10px',
  },
  wrapper: {
    width: '100%',
    borderBottom: theme.border.primary,
  },
  labelWrapper: {
    width: '95%',
    margin: '0 auto',
  },
  label: {
    color: theme.font.color,
    paddingTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Segoe-Bold',
  },
}))

const ListGroup = (props) => {
  const { children, label } = props
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.labelWrapper}>
          <label className={classes.label}>{label}</label>
        </div>
      </div>
      {children}
      <br />
    </div>
  )
}

export default ListGroup
