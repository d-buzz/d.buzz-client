import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { Avatar } from 'components/elements'
import { broadcastNotification } from 'store/interface/actions'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { List, AutoSizer } from 'react-virtualized'

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
  darkModeButton: {
    backgroundColor: 'rgb(21, 32, 43)',
    '& label': {
      fontSize: 14,
      color: 'white',
      display: 'block',
    },
  },
  ligthModeButton: {
    backgroundColor: 'rgb(255, 255, 255)',
    '& label': {
      fontSize: 14,
      color: 'black',
      display: 'block',
    },
  },
  grayModeButton: {
    backgroundColor: '#202225',
    '& label': {
      fontSize: 14,
      color: 'white',
      display: 'block',
    },
  },
  notes: {
    fontSize: 14,
    ...theme.font,
  },
  closeButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
  active: {
    border: '3px solid #e61c34',
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
    marginLeft: 5,
  },
}))


const HiddenBuzzListModal = (props) => {
  const {
    open,
    onClose,
    loading,
    items = [],
  } = props

  const classes = useStyles()
  const [modalHeight, setModalHeight] = useState({ height: 200 })

  const onHide = () => {
    onClose()
  }

  useEffect(() => {
    const hiddenLength = items.length
    if(hiddenLength >= 5) {
      setModalHeight({ height: 300 })
    } else if (hiddenLength >= 10 ) {
      setModalHeight({ height: 450 })
    } else {
      setModalHeight({ height: 150 })
    }
  }, [items])

  const truncateLink = (link) => {
    console.log({ link })
    if(link.length >= 28) {
      return `${link}`.substr(0, 27) + '...'
    }
    return link
  }

  const rowRenderer = ({ key, index, style }) => {
    return (
      <div key={key} style={style}>
        <div className={classes.inline}>
          <Avatar author={items[index].author} />
        </div>
        <div className={classes.inline}>
          <p className={classes.buzzLinks}>
            {truncateLink(`${items[index].author}/${items[index].permlink}`)}
          </p>
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
                  <h6>Filtered Buzz List</h6>
                </React.Fragment>
              )}
            </center>
            <div style={modalHeight}>
              {items.length !== 0 && (
                <AutoSizer>
                  {({height, width}) => (
                    <List
                      width={width}
                      height={height}
                      rowCount={items.length}
                      rowHeight={50}
                      rowRenderer={rowRenderer}
                    />
                  )}
                </AutoSizer>
              )}
              {items.length === 0 && (<h4>You have not filtered any buzz</h4>)}
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
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(HiddenBuzzListModal)
