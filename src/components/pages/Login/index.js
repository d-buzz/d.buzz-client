import React from 'react'
import { Trending } from 'components'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  trendingWrapper: {
    width: '100%',
    minHeight: '100vh',
    border: '1px solid #e6ecf0',
  }
})

const Login = () => {
  const classes = useStyles()
  return (
    <React.Fragment>
      <div className={classes.trendingWrapper}>
        <div style={{ width: '98%', margin: '0 auto', }}>
          <h5 style={{ fontWeight: 'bold' }}>Explore</h5>
        </div>
        <Trending unguardedLinks={true} />
      </div>
    </React.Fragment>
  )
}

export default Login
