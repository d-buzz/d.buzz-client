import { IconButton } from '@material-ui/core'
import Renderer from 'components/common/Renderer'
import CloseIcon from 'components/elements/Icons/CloseIcon'
import config from 'config'
import { updates } from 'updates'
import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'

const useStyles = createUseStyles(theme => ({
  modal: {
    animation: 'zoomIn 350ms',
    width: 630,
    '& div.modal-content': {
      margin: '0 auto',
      backgroundColor: theme.background.primary,
      width: 630,
      borderRadius: '20px 20px !important',
      border: 'none',
    },
    '@media (max-width: 900px)': {
      width: '97% !important',
      '& div.modal-content': {
        margin: '0 auto',
        width: '97% !important',
      },
    },
  },
  modalBody: {
    padding: 25,
  },
  whatsNewModalBody: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    '& ul': {
      padding: '0 0 0 20px !important',
    },

    '& .title': {
      color: theme.font.color,
      fontSize: '1.8em',
      fontWeight: 800,
      marginBottom: 30,
    },

    '& .heading': {
      display: 'flex',
      alignItems: 'center',
      color: '#E61C34',
      marginTop: 5,
      fontSize: '1.2em',
      fontWeight: 700,
      width: '100%',

      '&:after': {
        content: '""',
        height: 3,
        background: '#E61C34',
        borderRadius: '25px',
        margin: '0 20px 0 0',
        flex: '1 0 20px',
        marginLeft: 10,
      },
    },

    '& .updatesRow':{
      width: '100%',
    },
    
    '& .updatesInfo':{
      color: theme.font.color,
    },
  },
}))

function WhatsNewModal(props) {
  const { show, onHide } = props
  const classes = useStyles()
  const { VERSION } = config
  const changes = updates.changes
  const improvements = updates.improvements
  const fixes = updates.fixes
  const alert = new Audio(`${window.location.origin}/alert.wav`)

  useEffect(() => {
    alert.play()
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <Modal
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={onHide}
        dialogClassName={classes.modal}
        animation={false}
      >
        <ModalBody className={classes.modalBody}>
          <div className={classes.whatsNewModalBody}>
            <IconButton style={{ marginTop: -10, marginLeft: 5, marginBottom: 5, alignSelf: 'flex-end' }} onClick={onHide}>
              <CloseIcon />
            </IconButton>
            <span className='title'>What's new? <span role="img" aria-label='' description=''>🎉</span></span>
            {changes && <span className='whatsNew updatesRow'>
              <span className='heading'>NEW FEATURES</span>
              <Renderer content={changes}/>
            </span>}
            {improvements && <span className='improvements updatesRow'>
              <span className='heading'>IMPROVEMENTS</span>
              <Renderer content={improvements} />
            </span>}
            {fixes && <span className='bugFixes updatesRow'>
              <span className='heading'>BUG FIXES</span>
              <Renderer content={fixes} />
            </span>}

            <div className="updatesInfo">you're on <b>v{VERSION}</b></div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
})

export default connect(mapStateToProps, null)(WhatsNewModal)