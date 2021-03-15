import React, { useState, useEffect } from 'react'
import { getTrendingTagsRequest } from 'store/posts/actions'
import { getSavedUserRequest } from 'store/auth/actions'
import { getBestRpcNode, checkVersionRequest } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrandIcon, Spinner } from 'components/elements'
import { getCensorTypesRequest } from 'store/settings/actions'
import { createUseStyles } from 'react-jss'
import config from 'config'


import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import ReplayIcon from '@material-ui/icons/Replay'
import CloseIcon from '@material-ui/icons/Close'

const { VERSION } = config

const useStyles = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'white',
  },
  brandWrapper: {
    margin: '0 auto',
    paddingTop: 30,
  },
  versionDialog: {
    backgroundColor: `${theme.background.primary} !important`,
    ...theme.font,
    height: 130,
    width: 300,
    border: '2px solid #e61c34',
  },
  dialogInner: {
    width: '95%',
    margin: '0 auto',
    marginTop: 10,
  },
  versionButtons: {
    ...theme.font,
  },
}))

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

  const classes = useStyles()
  const [init, setInit] = useState(false)
  const [isLatest, setIsLatest] = useState(true)

  const reload = () => {
    dismiss()
    window.history.forward(1)
    window.location.reload(true)
  }

  const dismiss = () => {
    setIsLatest(true)
  }

  useEffect(() => {
    checkVersionRequest().then((isLatest) => {
      setIsLatest(isLatest)
      getCensorTypesRequest().then(() => {
        getBestRpcNode().then(() => {
          getTrendingTagsRequest()
          getSavedUserRequest().then(() => {
            setInit(true)
          })
        })
      })
    })
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      {!init && (<SplashScreen />)}
      {init && (children)}
      <Snackbar open={!isLatest} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Paper elevation={10} className={classes.versionDialog}>
          <div className={classes.dialogInner}>
            <center>
              <Typography variant="body1"><b>New version available !</b> <br /> Click reload to download the latest version of dbuzz</Typography>
              <br />
              <Button onClick={reload} variant="outlined" size="small" startIcon={<ReplayIcon />} className={classes.versionButtons} color="primary">
                reload
              </Button>&nbsp;
              <Button onClick={dismiss} variant="outlined" size="small" startIcon={<CloseIcon />} className={classes.versionButtons} color="secondary">
                dismiss
              </Button>
            </center>
          </div>
        </Paper>
      </Snackbar>
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
