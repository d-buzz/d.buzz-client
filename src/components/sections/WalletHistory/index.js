import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { createUseStyles } from 'react-jss'
import { Row, Col } from "react-bootstrap"
import { Avatar } from 'components/elements'
import { getWalletHistoryRequest } from 'store/wallet/actions'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useHistory } from 'react-router-dom'
import { AvatarlistSkeleton } from "components"
import moment from 'moment'

const useStyles = createUseStyles(theme => ({
  row: {
    width: '100%',
    margin: '0 auto',
    paddingTop : 5,
    paddingBottom : 5,
  },
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderBottom: theme.border.primary,
    '&:hover': {
      ...theme.postList.hover,
    },
    cursor: 'pointer !important',
  },
  redBottomBorder: {
    width: '100%',
    borderBottom: "2px solid #e61c34",
  },
  right: {
    height: 'max-content',
    cursor: 'pointer',
  },
  left: {
    height: '100%',
    marginTop: "15px",
  },
  label: {
    paddingRight: 5,
    marginTop: 10,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    ...theme.font,
    '& a' : {
      ...theme.font,
    },
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
    fontSize: 14,
    wordBreak: 'break-word',
    ...theme.font,
  },
  time : {
    paddingRight: 5,
    marginTop: 0,
    marginBottom: 5,
    wordBreak: 'break-word',
    color: "#657786",
    fontSize: 13,
    
  },
  negativeValue : {
    fontWeight: 'bold',
    color: "#e61c34",
    textAlign: "end",
  },
  positiveValue : {
    fontWeight: 'bold',
    textAlign: "end",
    ...theme.font,
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
  lockIcon : {
    color: "#e61c34 !important",
    padding: "0px !important",
    paddingLeft: "3px !important",
    '& .MuiIconButton-label' : {
      '& svg' : {
        fontSize: "1.2rem !important",
      },
    },
  },
}))

const WalletHistory = (props) => {
  const { walletHistory: items, user, loading, getWalletHistoryRequest } = props
  const { username: loginUser } = user
  const classes = useStyles()
  const history = useHistory()

  const viewTrxToHiveBlocks = (trx_id) => () => {
    window.open(`https://hiveblocks.com/tx/${trx_id}`, '_blank')
  }

  const goToProfile = (username) => () => {
    history.push(`/@${username}`)
  }

  const loadMoreHistory = () => {
    getWalletHistoryRequest(loginUser)
  }
  

  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={items.length || 0}
        hasMore={true}
        next={loadMoreHistory}
      >
        {items.map((item) => (
          <div className={classes.wrapper} key={item.trx_id}>
            <div className={classes.row}>
              <Row style={{ marginRight: 0, marginLeft: 0 }}>
                <Col xs="auto" style={{ paddingRight: 0 }}>
                  <div className={classes.left}>
                    <Avatar author={item.main_user} height="40" onClick={goToProfile(item.main_user)}/>
                  </div>
                </Col>
                <Col>
                  <div className={classes.right} onClick={viewTrxToHiveBlocks(item.trx_id)}>
                    <div className={classes.content}>
                      <p className={classes.label}>
                        {item.operation === 'transfer' && 
                           <React.Fragment>
                             {`${item.description} @${item.main_user}`}
                           </React.Fragment>}
                        {item.operation !== 'transfer' && item.description}
                      </p>
                    </div>
                    <div className={classes.content}>
                      <p className={classes.time}>
                        {moment(`${item.timestamp}Z`).local().fromNow()}
                      </p>
                    </div>
                    <div className={classes.content}>
                      <p className={classes.description}>
                        {item.op.memo && item.op.memo.substring(0, 1) !== "#" && item.op.memo}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className={classes.valueContainer} onClick={viewTrxToHiveBlocks(item.trx_id)}>
                    <div className={classes.content} >
                      <p className={item.op.from === loginUser ? classes.negativeValue : classes.positiveValue}>
                        {item.operation === 'transfer' && 
                        <React.Fragment>
                          {item.op.from === loginUser && `- ${item.amount}`}
                          {item.op.from !== loginUser && `${item.amount}`}
                        </React.Fragment>}
                        {item.operation !== 'transfer' && item.amount}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
        {(!loading && items.length === 0) &&
          (<center><br/><h6>No wallet transaction history yet</h6></center>)}
      </InfiniteScroll>
      <AvatarlistSkeleton loading={loading} />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  walletHistory : state.wallet.get('walletHistory'),
  loading: pending(state, 'GET_WALLET_HISTORY_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getWalletHistoryRequest,
  }, dispatch),
})


export default connect(mapStateToProps, mapDispatchToProps)(WalletHistory)
