import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { broadcastNotification } from 'store/interface/actions'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { List, AutoSizer } from 'react-virtualized'

const list = [
  'Brian Vaughn',
  'Brian Vaughn',
]

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
}))


const HiddenBuzzListModal = (props) => {
  const {
    open,
    closeHideBuzzDialog,
    loading,
    hiddenItems = [],
  } = props

  const classes = useStyles()
  const [modalHeight, setModalHeight] = useState({ height: 250 })

  const onHide = () => {
    closeHideBuzzDialog()
  }

  useEffect(() => {
    const hiddenLength = hiddenItems.length
    if(hiddenLength >= 5) {
      setModalHeight({ height: 300 })
    } else if (hiddenLength >= 10 ) {
      setModalHeight({ height: 450 })
    } else {
      setModalHeight({ height: 250 })
    }
  }, [hiddenItems])

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    return (
      <div key={key} style={style}>
        {list[index]}
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
                  <h6>The list below contains all the buzzes you filtered and removed from your buzz feeds</h6>
                </React.Fragment>
              )}
            </center>
            <div style={modalHeight}>
              <AutoSizer>
                {({height, width}) => (
                  <List
                    width={width}
                    height={height}
                    rowCount={list.length}
                    rowHeight={50}
                    rowRenderer={rowRenderer}
                  />
                )}
              </AutoSizer>
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
  hiddenItems: state.auth.get('hiddenBuzzes'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    broadcastNotification,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(HiddenBuzzListModal)
