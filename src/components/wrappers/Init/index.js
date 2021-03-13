import React, { useState, useEffect } from 'react'
import { getTrendingTagsRequest } from 'store/posts/actions'
import { getSavedUserRequest } from 'store/auth/actions'
import { getBestRpcNode, checkVersionRequest } from 'store/settings/actions'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrandIcon, Spinner } from 'components/elements'
import { getCensorTypesRequest } from 'store/settings/actions'
import { createUseStyles } from 'react-jss'
import config from 'config'

const { VERSION } = config

const useStyles = createUseStyles({
  wrapper: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'white',
  },
  brandWrapper: {
    margin: '0 auto',
    paddingTop: 30,
  },
})

const SplashScreen = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <div className={classes.brandWrapper}>
        <center>
          <BrandIcon />
          <Spinner
            size={35}
            loading={true}
          />
          <Typography
            style={{ marginTop: 13 }}
            variant="h6"
            component="p"
          >
            <b>v{VERSION}</b>
          </Typography>
        </center>
      </div>
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
        getCensorTypesRequest().then(() => {
          getBestRpcNode().then(() => {
            getTrendingTagsRequest()
            getSavedUserRequest().then(() => {
              setInit(true)
            })
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
