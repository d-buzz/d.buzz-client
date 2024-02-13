import React, { useState, useEffect } from 'react'
import { getTrendingTagsRequest } from 'store/posts/actions'
import { getSavedUserRequest, initCeremicLoginRequest } from 'store/auth/actions'
import { getBestRpcNode, checkVersionRequest, setDefaultVotingWeightRequest } from 'store/settings/actions'
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
import classNames from 'classnames'

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
    border: '2px solid #000',
    borderRadius: '15px !important',

    '& .reload_button': {
      color: '#ffffff !important',
      backgroundColor: '#000',
      borderColor: '#000',
      
      '&:hover': {
        color: '#ffffff !important',
        backgroundColor: '#000',
        borderColor: '#000',
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
    borderRadius: 5,
    textAlign: 'center',
    padding: '0 3px',
    fontSize: '0.95em',
    fontWeight: 600,
    userSelect: 'none',
  },
  bgBetaLight:{
    background: '#0000000d',
  },
  bgBetaDark: {
    background: "#ffffff1a",
  },
  textBetaLight: {
    color: '#000',
  },
  textBetaDark: {
    color: '#fff',
  },
}))

const SplashScreen = () => {
  const classes = useStyles()
  const theme = getTheme()

  const [isStaging, setIsStaging] = useState(null)

  const stagingVersion = process.env.REACT_APP_STAGING_VERSION

  useEffect(() => {
    if(window.location.host === 'staging.d.buzz') {
      setIsStaging(true)
    } else {
      setIsStaging(false)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className={classes.wrapper}>
      <div className={classes.brandWrapper}>
        <center>
          {theme === 'light' && (<BrandIcon height={60}/>)}
          {(theme === 'gray' || theme === 'night') && (<BrandIconDark height={60}/>)}
          {config.VERSION.includes('dev') &&
              <div className={classes.betaTitleContainer}>
                {<span className={classNames(classes.betaTitle, theme === 'light'? classes.bgBetaLight:classes.bgBetaDark,theme === 'light'? classes.textBetaLight:classes.textBetaDark)}>BETA</span>}
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
            {!isStaging ?  <b>v{VERSION}</b> : <b>STAGING v{stagingVersion}</b>}
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
    setDefaultVotingWeightRequest,
  } = props

  const classes = useStyles()
  const [init, setInit] = useState(false)
  const [isLatest, setIsLatest] = useState(true)
  const [isStaging, setIsStaging] = useState(null)

  useEffect(() => {
    if(window.location.host === 'staging.d.buzz') {
      setIsStaging(true)
    } else {
      setIsStaging(false)
    }
    // eslint-disable-next-line
  }, [])

  const reload = () => {
    dismiss()
    
    // reset updates modal
    localStorage.removeItem('updatesModal')
    localStorage.removeItem('rpc-setting')
    localStorage.removeItem('rpc-node')

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
    if(isStaging !== null) {
      if(!isStaging) {
        checkVersionRequest().then((isLatest) => {
          setIsLatest(isLatest)
          getBestRpcNode().then(() => {
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
      } else {
        setIsLatest(isLatest)
        getBestRpcNode().then(() => {
          const defaultUpvoteWeight = localStorage.getItem('voteWeight') || 1
          setDefaultVotingWeightRequest(defaultUpvoteWeight).then(() => {
            getSavedUserRequest().then(() => {
              setInit(true)
              getCensorTypesRequest()
              getTrendingTagsRequest()
            })
          })
        })
      }
    }
    // eslint-disable-next-line
  }, [isStaging])

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
    initCeremicLoginRequest,
    checkVersionRequest,
    getCensorTypesRequest,
    setDefaultVotingWeightRequest,
  }, dispatch),
})

export default connect(null, mapDispatchToProps)(Init)
