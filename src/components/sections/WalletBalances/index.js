import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUseStyles } from 'react-jss'
import { Row, Col } from 'react-bootstrap'
import { pending } from 'redux-saga-thunk'
import { useParams } from 'react-router-dom'
import { ContainedButton, Spinner } from 'components/elements'
import { claimRewardRequest, getWalletBalanceRequest } from 'store/wallet/actions'
import { broadcastNotification } from 'store/interface/actions'

const useStyles = createUseStyles(theme => ({
  row: {
    width: '100%',
    margin: '0 auto',
    paddingTop: 10,
    marginBottom: 10,
    cursor: 'pointer',
    '& label': {
      cusor: 'pointer',
    },
  },
  wrapper: {
    width: '100%',
    borderBottom: theme.border.primary,
  },
  redBottomBorder: {
    width: '100%',
    borderBottom: '2px solid #e61c34',
  },
  right: {
    height: 'max-content',
    cursor: 'pointer',
  },
  label: {
    fontWeight: 'bold',
    paddingRight: 5,
    marginTop: 10,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    ...theme.font,
  },
  content: {
    width: '100%',
    cursor: 'pointer',
    '& label': {
      ...theme.font,
    },
  },
  valueContainer: {
    marginTop: 10,
  },
  description : {
    paddingRight: 5,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    color: '#657786',
    fontSize: 14,
  },
  value : {
    fontWeight: 'bold',
    paddingRight: 5,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    color: '#e61c34',
    textAlign: 'end',
  },
  circle: {
    strokeLinecap: 'round',
    color: '#e53935',
  },
  spacer: {
    width: '100%',
    height: 20,
  },
  button: {
    height: 35,
  },
  spin: {
    float: 'right', 
    paddingTop: 0,
  },
  rowInner: {
    marginRight: 0,
    marginLeft: 0,
  },
}))


const WalletBalances = (props) => {
  const { 
    walletBalance, 
    loading,
    claimRewardRequest,
    broadcastNotification,
    user,
    getWalletBalanceRequest,
  } = props

  const {
    estimate_account_value,
    hbd,
    hive_power,
    hive_tokens,
    pending_rewards = 0,
    savings,
    savings_hbd,
  } = walletBalance || {}

  const { is_authenticated, username : loginUser } = user
  const { username } = useParams()

  const classes = useStyles()
  const [walletInfo, setWalletInfo] = useState([])
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)

  const claimRewards = () => {
    setClaimLoading(true)
    claimRewardRequest().then(({ success, errorMessage }) => {
      setClaimLoading(false)
      if(success){
        setClaimSuccess(true)
        broadcastNotification('success','Successfully claimed rewards')
        getWalletBalanceRequest()
      }else{
        broadcastNotification('error',errorMessage)
      }
    })
  }

  const ClaimButton = ({loading}) => {
    return (
      <ContainedButton
        fontSize={14}
        transparent={true}
        label='Claim'
        className={classes.button}
        onClick={claimRewards}
        loading={loading}
        style={{float: 'right'}}
      />)
  }

  useEffect(() => {
    const walletItems = [
      {
        id: 'pendingRewards',
        label: 'Pending Rewards',
        description: 'You have some pending rewards to claim.',
        value : pending_rewards,
        hide: parseFloat(pending_rewards) === 0.00 || !is_authenticated || loginUser !== username || claimSuccess,
        action: <ClaimButton loading={claimLoading} />,
      },
      {
        id: 'hiveTokens',
        label: 'Hive Tokens (HIVE)',
        description: 'Tradeable tokens that may be transferred anywhere at anytime.'
                    + ' Hive can be converted to HIVE POWER in a process called powering up.',
        value : hive_tokens,
      },
      {
        id: 'hivePower',
        label: 'Hive Power (HP)',
        description: 'Influence tokens which give you more control over post payouts and allow you to earn on curation rewards.'
                    + ' HIVE POWER increases at an APR of approximately 3.18%, subject to blockchain variance.',
        value : `${hive_power} HP`,
      },
      {
        id: 'hbd',
        label: 'Hive Backed Dollars (HBD)',
        description: 'Tradeable tokens that may be transferred anywhere at anytime.'
                    + ' HBD interest rate: 3.00% APR (as voted by the Witnesses)',
        value : hbd,
      },
      {
        id: 'hiveSavings',
        label: 'Hive Savings',
        description: 'Balances subject to 3 day withdraw waiting period.' 
                  + ' HBD interest rate: 3.00% APR (as voted by the Witnesses)',
        value : savings,
        value2 : savings_hbd,
      },
      {
        id: 'eav',
        label: 'Estimated Account Value',
        description: 'The estimated value is based on an average value of Hive in US dollars.',
        value : `$${estimate_account_value}`,
      },
    ]
    setWalletInfo(walletItems)
  // eslint-disable-next-line
  },[walletBalance, claimLoading, claimSuccess])
  

  return (
    <React.Fragment>
      {walletInfo.map((item) => (
        <React.Fragment key={item.id}>
          {!item.hide && (
            <React.Fragment>
              {item.id === 'pendingRewards' && <div className={classes.spacer} />}
              <div className={item.id !== 'pendingRewards' ? classes.wrapper : classes.redBottomBorder}>
                <div className={classes.row}>
                  <Row className={classes.rowInner}>
                    <Col>
                      <div className={classes.right}>
                        <div className={classes.content}>
                          <p className={classes.label}>
                            {item.label}
                          </p>
                        </div>
                        <div className={classes.content}>
                          <p className={classes.description}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col xs='auto'>
                      <div className={classes.valueContainer}>
                        <div className={classes.content}>
                          {!loading && 
                          <p className={classes.value}>
                            {item.value}
                          </p>}
                          {loading && 
                            <Spinner 
                              size={25}
                              loading={loading}
                              className={classes.spin}
                            />}
                        </div>
                        {item.value2 && (
                          <div className={classes.content}>
                            <p className={classes.value}>
                              {!loading && item.value2}
                            </p>
                          </div>
                        )}
                        {item.action && !loading && (
                          <div className={classes.content}>
                            <p className={classes.value}>
                              {item.action}
                            </p>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  walletBalance: state.wallet.get('walletBalance'),
  loading: pending(state, 'GET_WALLET_BALANCE_REQUEST'),
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    claimRewardRequest,
    broadcastNotification,
    getWalletBalanceRequest,
  }, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(WalletBalances)
