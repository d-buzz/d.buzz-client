import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { getTheme } from 'services/theme'
import { setThemeRequest, generateStyles } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

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

const THEME = {
  LIGHT: 'light',
  NIGHT: 'night',
}

const ThemeModal = (props) => {
  const {
    show,
    onHide,
    setThemeRequest,
    generateStyles,
  } = props
  const classes = useStyles()

  const handleClickSetTheme = (mode) => () => {
    setThemeRequest(mode)
      .then(({ mode }) => {
        const theme = getTheme(mode)
        generateStyles(theme)
      })
  }

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
            <div
              onClick={handleClickSetTheme(THEME.NIGHT)}
              className={classNames(classes.button, classes.darkModeButton)}
            >
              <center>
                <label>Nightshade Mode</label>
                <label>Dark and Shady, reduced brightness</label>
              </center>
            </div>
            <div
              onClick={handleClickSetTheme(THEME.LIGHT)}
              className={classNames(classes.button, classes.ligthModeButton)}
            >
              <center>
                <label>Daylight Mode</label>
                <label>Light and bright, default theme</label>
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

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setThemeRequest,
    generateStyles,
  }, dispatch),
})

export default connect(null, mapDispatchToProps)(ThemeModal)
