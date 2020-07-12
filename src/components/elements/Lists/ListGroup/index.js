import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  wrapper: {
    width: '100%',
    borderBottom: '1px solid #e6ecf0',
  },
  labelWrapper: {
    width: '95%',
    margin: '0 auto',
  },
  label: {
    color: '#14171a',
    paddingTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
  }
})

const ListGroup = (props) => {
  const { children, label } = props
  const classes = useStyles()

  return (
    <div style={{ backgroundColor: '#f5f8fa', borderRadius: '10px 10px' }}>
      <div className={classes.wrapper}>
        <div className={classes.labelWrapper}>
          <label className={classes.label}>{ label }</label>
        </div>
      </div>
      { children }
      <br />
    </div>
  )
}

export default ListGroup
