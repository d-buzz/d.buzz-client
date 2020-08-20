import React, { useEffect } from 'react'
import { Trending } from 'components'
import { createUseStyles } from 'react-jss'
import { clearSearchPosts } from 'store/posts/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const useStyles = createUseStyles({
  trendingWrapper: {
    width: '100%',
    minHeight: '100vh',
    border: '1px solid #e6ecf0',
  },
  headerWrapper: {
    width: '98%',
    margin: '0 auto',
  }
})

const Landing = (props) => {
  const classes = useStyles()
  const { clearSearchPosts } = props

  useEffect(() => {
    clearSearchPosts()
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <div className={classes.trendingWrapper}>
        <div>
          <h5 style={{ fontWeight: 'bold', marginLeft: 10, }}>Trending</h5>
        </div>
        <Trending unguardedLinks={true} />
      </div>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearSearchPosts,
  }, dispatch)
})

export default connect(null, mapDispatchToProps)(Landing)
