import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  inner: {
    cursor: 'pointer',
    width: '95%',
    margin: '0 auto',
  },
  wrapper: {
    cursor: 'pointer',
    widt: '100%',
    borderBottom: '1px solid #e6ecf0',
    transitionDuration: '0.3s',
    transitionProperty: 'background-color',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    }
  },
  label: {
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  subLabel: {
    fontSize: 13,
    color: '#657786',
  },
  linkWrapper: {
    textDecoration: 'none',
    color: '#14171a',
    cursor: 'pointer',
    '&:hover': {
      color: '#14171a',
    },
    '& label': {
      cursor: 'pointer',
    }
  }
})

const ListAction = (props) => {
  const classes = useStyles()
  const { label, subLabel } = props
  
  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <div className={classes.inner}>
          <a href="/tag" className={classes.linkWrapper}>
            <label className={classes.label}>{ label }</label> <br />
            <label className={classes.subLabel}>{ subLabel }</label>
          </a>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ListAction