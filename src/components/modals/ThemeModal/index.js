import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton } from 'components/elements'
import classNames from 'classnames'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  modal: {
    '& div.modal-content': {
      borderRadius: '15px 15px !important',
      border: 'none',
      width: 400,
      margin: '0 auto',
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
    lineHeight: '0.8',
    '& :first-child': {
      paddingTop: 5,
    },
    '& label': {
      cursor: 'pointer',
    },
  },
  darkModeButton: {
    backgroundColor: 'rgb(59, 59, 59)',
    '& label': {
      fontSize: 14,
      color: 'white',
      display: 'block',
    },
    '&:hover': {
      backgroundColor: 'rgb(33, 32, 32) !important',
    },
  },
  ligthModeButton: {
    backgroundColor: 'rgb(255, 255, 255)',
    border: '2px solid #e6ecf0',
    '& label': {
      fontSize: 14,
      color: 'black',
      display: 'block',
    },
    '&:hover': {
      backgroundColor: 'whiteSmoke !important',
    },
  },
  notes: {
    fontSize: 14,
  },
  closeButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
})

const ThemeModal = (props) => {
  const { show, onHide } = props
  const classes = useStyles()

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h6>Customize your view</h6>
            </center>
            <label className={classes.notes}>
              Display settings affect all of your Dbuzz accounts on this browser. These settings are only visible to you.
            </label>
            <div className={classNames(classes.button, classes.darkModeButton)}>
              <center>
                <label>Night Mode</label>
                <label>Reduce brightness of your screen</label>
              </center>
            </div>
            <div className={classNames(classes.button, classes.ligthModeButton)}>
              <center>
                <label>Light Mode</label>
                <label>Default Theme</label>
              </center>
            </div>
          </div>
          <center>
            <ContainedButton
              onClick={onHide}
              className={classes.closeButton}
              fontSize={14}
              label="Done"
            />
          </center>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default ThemeModal
