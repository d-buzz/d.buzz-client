import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { Avatar, ContainedButton } from 'components/elements'
import { broadcastNotification } from 'store/interface/actions'
import { removeHiddenBuzzRequest } from 'store/auth/actions'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { Link } from 'react-router-dom'
const { List, AutoSizer } = React.lazy(() => import('react-virtualized'))

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      maxWidth: 400,
      minWidth: 100,
      margin: '0 auto',
      '& h6': {
        ...theme.font,
      },
    },
    '& input.form-control': {
      borderRadius: '50px 50px',
      fontSize: 14,
    },
    '& label': {
      fontSize: 14,
    },
  },
  button: {
    width: '100%',
    height: 60,
    marginBottom: 15,
    borderRadius: '5px 5px',
    cursor: 'pointer',
    lineHeight: 0.8,
    border: `3px solid ${theme.background.primary}`,
    '& :first-child': {
      paddingTop: 5,
    },
    '& label': {
      cursor: 'pointer',
    },
    '&:hover': {
      border: '3px solid #e61c34',
    },
  },
  removeButton: {
    width: 85,
    height: 35,
  },
  innerModal: {
    width: '98%',
    margin: '0 auto',
    height: 'max-content',
  },
  text: {
    ...theme.font,
  },
  inline: {
    display: 'inline-block',
  },
  buzzLinks: {
    marginLeft: 10,
    color: '#d32f2f',
  },
  list: {
    outline: 'none',
  },
  listInner: {
    paddingBottom: 15,
  },
}))


const HiddenBuzzListModal = (props) => {
  const {
    open,
    onClose,
    loading,
    items = [],
    removeHiddenBuzzRequest,
    broadcastNotification,
  } = props

  const classes = useStyles()
  const [modalHeight, setModalHeight] = useState({ height: 20 })

  const onHide = () => {
    onClose()
  }

  useEffect(() => {
    const hiddenLength = items.length
    if (hiddenLength === 0) {
      setModalHeight({ height: 20 })
    } else if (hiddenLength <= 2) {
      setModalHeight({ height: 100 })
    } else if (hiddenLength <= 5) {
      setModalHeight({ height: 250 })
    } else if (hiddenLength <= 5) {
      setModalHeight({ height: 350 })
    } else if (hiddenLength <= 10 ) {
      setModalHeight({ height: 450 })
    } else  {
      setModalHeight({ height: 600 })
    }
  }, [items])

  const truncateLink = (link) => {
    if(link.length >= 20) {
      return `${link}`.substr(0, 19) + '...'
    }
    return link
  }

  const unhideBuzz = (author, permlink) => () => {
    removeHiddenBuzzRequest(author, permlink)
      .then(() => {
        broadcastNotification('success', `Succesfully Unhide @${author}/${permlink}`)
      })
  }

  const rowRenderer = ({ key, index, style }) => {
    return (
      <div className={classes.listInner} key={key} style={style}>
        <div className={classes.inline}>
          <Avatar author={items[index].author} />
        </div>
        <div className={classes.inline}>
          <Link
            className={classes.buzzLinks}
            to={`/@${items[index].author}/${items[index].permlink}`}
            rel='noopener noreferrer'
            target='_blank'
          >
            @{truncateLink(`${items[index].author}/${items[index].permlink}`)}
          </Link>
        </div>
        <div className={classes.inline} style={{ float: 'right', marginRight: 5 }}>
          <ContainedButton
            onClick={unhideBuzz(items[index].author, items[index].permlink)}
            className={classes.removeButton}
            fontSize={14}
            transparent={true}
            label='Remove'
          />
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={open || loading} onHide={onHide}>
        <ModalBody>
          <div className={classes.innerModal}>
            <center>
              {!loading && (
                <React.Fragment>
                  <h6 className={classes.text}>Hidden Buzz List</h6>
                  <p className={classes.text}>Below are the list of buzzes you removed from your feeds</p>
                </React.Fragment>
              )}
              {items.length === 0 && (<h6>You have not filtered any buzz</h6>)}
            </center>
            <div style={modalHeight}>
              {items.length !== 0 && (
                <AutoSizer>
                  {({height, width}) => (
                    <List
                      width={width}
                      height={height}
                      rowCount={items.length}
                      rowHeight={70}
                      rowRenderer={rowRenderer}
                      className={classes.list}
                    />
                  )}
                </AutoSizer>
              )}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
  loading: pending(state, 'HIDE_BUZZ_REQUEST'),
  items: state.auth.get('hiddenBuzzes'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    broadcastNotification,
    removeHiddenBuzzRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(HiddenBuzzListModal)
