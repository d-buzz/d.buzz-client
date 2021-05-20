import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUseStyles } from 'react-jss'
import { useHistory, useLocation } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { HelmetGenerator } from 'components'
import { Tab, Tabs } from '@material-ui/core'
import { getWalletBalanceRequest, getWalletHistoryRequest } from "store/wallet/actions"
import { clearRefreshRouteStatus } from 'store/interface/actions'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    width: '100%',
    margin: '0 auto',
    height: 'max-content',
    ...theme.font,
  },
  tabs: {
    textTransform: 'none !important',
    '&:hover': {
      ...theme.left.sidebar.items.hover,
      '& span': {
        color: '#e53935',
      },
    },
    '&.MuiTabs-indicator': {
      backgroundColor: '#ffebee',
    },
    '& span': {
      ...theme.font,
      fontWeight: 'bold',
      fontFamily: 'Segoe-Bold',
    },
    '&.Mui-selected': {
      '& span': {
        color: '#e53935',
      },
    },
  },
  tabContainer: {
    '& span.MuiTabs-indicator': {
      backgroundColor: '#e53935 !important',
    },
  },
  spacer: {
    width: '100%',
    height: 20,
  },
}))

const Wallet = (props) => {
  const {
    route,
    match,
    getWalletBalanceRequest,
    getWalletHistoryRequest,
    refreshRouteStatus,
    clearRefreshRouteStatus,
  } = props

  const classes = useStyles()
  const [index, setIndex] = useState(0)

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const { params } = match
  const { username } = params

  const handleTabs = (index) => () => {
    let tab = "balances"
    if(index === 1){
      tab = "history"
    }
    history.push(`/@${username}/wallet/${tab}`)
  }

  const onChange = (e, index) => {
    setIndex(index)
  }

  useEffect(() => {
    getWalletBalanceRequest(username)
    getWalletHistoryRequest(username)
  // eslint-disable-next-line
  },[username])


  useEffect(() => {
    if(refreshRouteStatus.pathname === "wallet"){
      getWalletBalanceRequest(username)
      clearRefreshRouteStatus()
    }
  // eslint-disable-next-line
  },[refreshRouteStatus])

  useEffect(() => {
    if(pathname.match(/(\/wallet?)$|(\/wallet\/balances\/)$|(\/wallet\/balances)$/m)) {
      setIndex(0)
    } else if(pathname.match(/(\/wallet\/history\/)$|(\/wallet\/history)$/m)) {
      setIndex(1)
    }
  },[pathname])
  

  return (
    <React.Fragment>
      <HelmetGenerator page='Wallet' />
      <div className={classes.wrapper}>
        <div className={classes.spacer} />
        <Tabs
          value={index}
          indicatorColor="primary"
          textColor="primary"
          centered
          onChange={onChange}
          className={classes.tabContainer}
        >
          <Tab disableTouchRipple onClick={handleTabs(0)} className={classes.tabs} label="Balances" />
          <Tab disableTouchRipple onClick={handleTabs(1)} className={classes.tabs} label="History" />
        </Tabs>
      </div>
      <React.Fragment>
        {renderRoutes(route.routes)}
      </React.Fragment>
    </React.Fragment>)

}

const mapStateToProps = (state) => ({
  refreshRouteStatus: state.interfaces.get('refreshRouteStatus'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getWalletBalanceRequest,
    getWalletHistoryRequest,
    clearRefreshRouteStatus,
  }, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(Wallet)