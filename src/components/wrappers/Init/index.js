import React, { useState, useEffect } from 'react'
import { getTrendingTagsRequest } from 'store/posts/actions'
import { getSavedUserRequest, initWSHASConnectionRequest, initCeremicLoginRequest } from 'store/auth/actions'
import { getBestRpcNode, checkVersionRequest, setDefaultVotingWeightRequest, getWSNodeHAS } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrandIcon, Spinner } from 'components/elements'
import { getCensorTypesRequest } from 'store/settings/actions'
import { createUseStyles } from 'react-jss'
import config from 'config'
import { getTheme } from 'services/helper'
import BrandIconDark from 'components/elements/Icons/BrandIconDark'
// import { getBestCeramicHost } from 'services/ceramic'
import Paper from '@material-ui/core/Paper'

const Snackbar = React.lazy(() => import('@material-ui/core/Snackbar'))
const Typography = React.lazy(() => import('@material-ui/core/Typography'))
const Button = React.lazy(() => import('@material-ui/core/Button'))
const ReplayIcon = React.lazy(() => import('@material-ui/icons/Replay'))
const CloseIcon = React.lazy(() => import('@material-ui/icons/Close'))

const { VERSION } = config

const useStyles = createUseStyles(theme => ({
  wrapper: {
    overflow: 'hidden',
    height: '100vh',
    width: '100%',
    maxHeight: '100vh',
    backgroundColor: theme.background.primary,
  },
  brandWrapper: {
    display: 'grid',
    placeItems: 'center',
    height: '100%',
    margin: '0 auto',
    color: theme.font.color,
  },
  version: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    margin: 'auto !important',
    padding: '5px 15px',
    width: 'fit-content',
    borderRadius: 8,
    ...theme.context.view,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
    border: '1px solid lightgray',
  },
  versionDialog: {
    backgroundColor: `${theme.background.primary} !important`,
    ...theme.font,
    height: 130,
    width: 300,
    border: '2px solid #e61c34',
    borderRadius: '15px !important',

    '& .reload_button': {
      color: '#ffffff !important',
      backgroundColor: '#E61C34',
      borderColor: '#E61C34',
      
      '&:hover': {
        color: '#ffffff !important',
        backgroundColor: '#E61C34',
        borderColor: '#E61C34',
      },
    },
  },
  dialogInner: {
    width: '95%',
    margin: '0 auto',
    marginTop: 10,
  },
  versionButtons: {
    ...theme.font,
    borderRadius: '10px !important',
  },
  betaTitleContainer: {
    margin: '15px 0',
    display: 'grid',
    placeItems: 'center',
  },
  betaTitle: {
    width: 'fit-content',
    background: '#E61C34',
    borderRadius: 5,
    textAlign: 'center',
    color: '#ffffff',
    padding: '0 3px',
    fontSize: '0.95em',
    fontWeight: 600,
    userSelect: 'none',
  },
}))

const SplashScreen = () => {
  const classes = useStyles()
  const theme = getTheme()

  return (
    <div className={classes.wrapper}>
      <div className={classes.brandWrapper}>
        <center>
          {theme === 'light' && (<BrandIcon height={60}/>)}
          {(theme === 'gray' || theme === 'night') && (<BrandIconDark height={60}/>)}
          {config.VERSION.includes('dev') &&
              <div className={classes.betaTitleContainer}>
                {<span className={classes.betaTitle}>BETA</span>}
              </div>}
          <Spinner
            size={35}
            loading={true}
          />
          <Typography
            style={{ marginTop: 13 }}
            variant="h6"
            component="p"
            className={classes.version}
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
    getWSNodeHAS,
    initWSHASConnectionRequest,
    // initCeremicLoginRequest,
    checkVersionRequest,
    getCensorTypesRequest,
    children,
    setDefaultVotingWeightRequest,
  } = props

  const classes = useStyles()
  const [init, setInit] = useState(false)
  const [isLatest, setIsLatest] = useState(true)

  const reload = () => {
    dismiss()
    
    // reset updates modal
    localStorage.removeItem('updatesModal')

    caches.keys().then((names) => {
      // Delete all the cache files
      names.forEach(name => {
        caches.delete(name)
      })
      window.history.forward(1)
      window.location.reload(true)
    })
  }

  const dismiss = () => {
    setIsLatest(true)
  }

  useEffect(() => {
    checkVersionRequest().then((isLatest) => {
      setIsLatest(isLatest)
      getBestRpcNode().then(() => {
        getWSNodeHAS()
        initWSHASConnectionRequest()
        // getBestCeramicHost().then((host) => {
        //   initCeremicLoginRequest()
        //   localStorage.setItem('ceramic', host)
        // })
        const defaultUpvoteWeight = localStorage.getItem('voteWeight') || 1
        setDefaultVotingWeightRequest(defaultUpvoteWeight).then(() => {
          getSavedUserRequest().then(() => {
            setInit(true)
            getCensorTypesRequest()
            getTrendingTagsRequest()
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
              <Typography variant="body1"><b>New version available!</b> <br /> Update to the the latest version of DBUZZ</Typography>
              <Button onClick={reload} variant="outlined" size="small" startIcon={<ReplayIcon />} className={`${classes.versionButtons} reload_button`} color="primary">
                reload
              </Button>&nbsp;
              <Button onClick={dismiss} variant="outlined" size="small" startIcon={<CloseIcon />} className={classes.versionButtons} color="secondary">
                dismiss
              </Button>
            </center>
            <br />
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
    getWSNodeHAS,
    initWSHASConnectionRequest,
    initCeremicLoginRequest,
    checkVersionRequest,
    getCensorTypesRequest,
    setDefaultVotingWeightRequest,
  }, dispatch),
})

export default connect(null, mapDispatchToProps)(Init)
