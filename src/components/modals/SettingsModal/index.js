import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      maxWidth: 550,
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
  settings: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    '& .items': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',

      '& .item': {
        display: 'flex',
        justifyContent: 'space-between',

        '& .title': {
          fontSize: '1.2em',
          fontWeight: '600',
        },

        '& .toggle': {
          padding: '5px 15px',
          fontSize: '1.2em',
          fontWeight: '600',
          background: '#E61C34',
          color: '#ffffff',
          borderRadius: 25,
          userSelect: 'none',
          cursor: 'pointer',

          '&:hover': {
            background: '#B71C1C',
          },
        },
      },
    },
  },
}))

const SettingsModal = (props) => {
  const {
    show,
    onHide,
  } = props
  const classes = useStyles()

  const [embedsStatus, setEmbedsStatus] = useState(localStorage.getItem('showEmbeds') ? localStorage.getItem('showEmbeds') : true)

  useEffect(() => {
    localStorage.setItem('showEmbeds', embedsStatus)
  }, [embedsStatus])

  const handleEmbedsToggle = () => {
    if(embedsStatus === true){
      setEmbedsStatus(false)
    } else {
      setEmbedsStatus(true)
    }
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h6>Settings</h6>
            </center>
            <div className={classes.settings}>
              <div className="items">
                <div className="item">
                  <span className="title">Show Embeds</span>
                  <span className="toggle" onClick={handleEmbedsToggle}>{embedsStatus === true ? 'Disable' : 'Enable'}</span>
                </div>
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
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default SettingsModal