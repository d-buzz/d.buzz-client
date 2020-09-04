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

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      width: 400,
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
    border: '3px solid #e6ecf0',
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
    backgroundColor: '#18191a',
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
}))

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
    theme,
  } = props
  const { mode } = theme
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
            <center>
              <label className={classes.notes}>
                Display settings affect all of your Dbuzz accounts on this browser. These settings are only visible to you.
              </label>
            </center>
            <div
              onClick={handleClickSetTheme(THEME.NIGHT)}
              className={classNames(classes.button, classes.darkModeButton, mode === 'night' ? classes.active : '')}
            >
              <center>
                <label>Nightshade Mode</label>
                <label>Dark and Shady, reduced brightness</label>
              </center>
            </div>
            <div
              onClick={handleClickSetTheme(THEME.LIGHT)}
              className={classNames(classes.button, classes.ligthModeButton, mode === 'light' ? classes.active : '')}
            >
              <center>
                <label>Daylight Mode</label>
                <label>Light and bright, default theme</label>
              </center>
            </div>
            <div
              onClick={handleClickSetTheme(THEME.NIGHT)}
              className={classNames(classes.button, classes.grayModeButton, mode === 'gray' ? classes.active : '')}
            >
              <center>
                <label>Graywall Mode</label>
                <label>Dark and Gray, reduced brightness</label>
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

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setThemeRequest,
    generateStyles,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeModal)
