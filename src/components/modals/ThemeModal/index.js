import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { getTheme } from 'services/theme'
import { setThemeRequest, generateStyles } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserCustomData, updateUserCustomData } from 'services/database/api'
import { CircularProgress } from '@material-ui/core'

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
  themeLoadingContainer: {
    width: '100%',
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.font.color,
    
    '& .title': {
      marginTop: 15,
      fontSize: '1.2rem',
      color: theme.font.color,
    },
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
    // setThemeRequest,
    generateStyles,
    // theme,
    user,
  } = props
  // const { mode } = theme
  const classes = useStyles()
  const [loading, setLoading] = useState(false)

  const customUserData = JSON.parse(localStorage.getItem('customUserData'))
  const mode = JSON.parse(localStorage.getItem('customUserData'))?.settings?.theme

  const handleClickSetTheme = (mode) => () => {
    setLoading(true)
    // setThemeRequest(mode)
    //   .then(({ mode }) => {
    //     const theme = getTheme(mode)
    //     generateStyles(theme)
    //   })
    const data = { ...customUserData, settings: { ...customUserData?.settings, theme: mode } }
    localStorage.setItem('customUserData', JSON.stringify({...data}))
    const theme = getTheme(mode)
    generateStyles(theme)
    handleUpdateTheme(mode)
  }
  
  const handleUpdateTheme = (theme) => {
    const { username } = user
    
    getUserCustomData(username)
      .then(res => {
        const userData = {
          ...res[0],
          settings: {
            ...res[0].settings,
            theme: theme,
          },
        }
        const responseData = { username, userData: [userData] }
        
        if(res) {
          updateUserCustomData(responseData)
            .then(() => {
              setLoading(false)
            })
        }
      })

  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
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
            {!loading ?
              <>
                <div
                  onClick={handleClickSetTheme(THEME.NIGHT)}
                  className={classNames(classes.button, classes.darkModeButton, mode === 'night' ? classes.active : '')}
                >
                  <center>
                    <label>Nightshade</label>
                    <label>Dark and Shady, reduced brightness</label>
                  </center>
                </div>
                <div
                  onClick={handleClickSetTheme(THEME.LIGHT)}
                  className={classNames(classes.button, classes.ligthModeButton, mode === 'light' ? classes.active : '')}
                >
                  <center>
                    <label>Daylight</label>
                    <label>Light and bright, default theme</label>
                  </center>
                </div>
              </> :
              <div className={classes.themeLoadingContainer}>
                <CircularProgress color='#ffffff' style={{height: 50, width: 50}} />
                <span className='title'>Syncing your theme...</span>
              </div>}
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
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setThemeRequest,
    generateStyles,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeModal)
