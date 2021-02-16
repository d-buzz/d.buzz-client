import React, { useState, useEffect } from 'react'
import { getTrendingTagsRequest } from 'store/posts/actions'
import { getSavedUserRequest } from 'store/auth/actions'
import { getBestRpcNode, checkVersionRequest } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrandIcon, Spinner } from 'components/elements'
import { getCensorTypesRequest } from 'store/settings/actions'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  wrapper: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'white',
  },
})

const SplashScreen = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Spinner
        size={35}
        loading={true}
        style={{
          position: 'absolute',
          margin: 'auto',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <BrandIcon
        style={{
          position: 'absolute',
          margin: 'auto',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </div>
  )
}

const Init = (props) => {
  const {
    getSavedUserRequest,
    getTrendingTagsRequest,
    getBestRpcNode,
    checkVersionRequest,
    getCensorTypesRequest,
    children,
  } = props

  const [init, setInit] = useState(false)

  useEffect(() => {
    checkVersionRequest().then((isLatest) => {
      if(!isLatest) {
        window.history.forward(1)
        window.location.reload(true)
      } else {
        getCensorTypesRequest()
        getBestRpcNode().then(() => {
          getTrendingTagsRequest()
          getSavedUserRequest().then(() => {
            setInit(true)
          })
        })
      }
    })
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      {!init && (<SplashScreen />)}
      {init && (children)}
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getTrendingTagsRequest,
    getSavedUserRequest,
    getBestRpcNode,
    checkVersionRequest,
    getCensorTypesRequest,
  }, dispatch),
})

export default connect(null, mapDispatchToProps)(Init)
