import { IconButton } from '@material-ui/core'
import axios from 'axios'
import CloseIcon from 'components/elements/Icons/CloseIcon'
import ThemeProvider from 'components/wrappers/ThemeProvider'
import config from 'config'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
const Skeleton = React.lazy(() => import('react-loading-skeleton'))

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
    color: theme.font.color,

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
      margin: '5px 0',
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
      padding: '5px 10px',
      backgroundColor: theme.context.view.backgroundColor,
      borderRadius: 5,
    },
  },
  change: {
    margin: '5px 0',

    '& .title': {
      fontSize: '1.5em',
      fontWeight: 700,
    },

    '& .description': {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  headerImage: {
    width: '100%',
    marginBottom: 25,
  },
  betaTesterCredit: {
    display: 'flex',
    width: 'fit-content',
    padding: '5px 10px',
    color: theme.font.color,
    backgroundColor: theme.context.view.backgroundColor,
    borderRadius: 5,
    margin: '15px auto',
  },
  updatesLoader: {
    width: '100%',
    height: '100%',
  },
}))

function WhatsNewModal(props) {
  const { show, onHide } = props
  const classes = useStyles()
  const { VERSION } = config
  const [updates, setUpdates] = useState(null)
  const header = updates?.headerImageUrl
  const changes = updates?.changes
  const improvements = updates?.improvements
  const fixes = updates?.fixes
  const upcoming = updates?.upcoming

  const headers = {'Content-Type': 'application/json','Cache-Control' : 'no-cache'}

  useEffect(() => {
    if(VERSION.includes('dev')) {
      axios.get('https://storageapi.fleek.co/nathansenn-team-bucket/dbuzz-backend/dev-updates.json', {
        headers,
      })
        .then(response => {
          setUpdates(response.data)
        })
        .catch((err) => {
          onHide()
        })
    } else {
      axios.get('https://storageapi.fleek.co/nathansenn-team-bucket/dbuzz-backend/stable-updates.json', {
        headers,
      })
        .then(response => {
          setUpdates(response.data)
        })
        .catch((err) => {
          onHide()
        })
    }
    // eslint-disable-next-line
  }, [])

  return (
    <React.Fragment>
      <Modal
        backdrop='static'
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
            {header && <img className={classes.headerImage} src={header} alt='headerImage' loading='lazy'/>}
            <span className='title'>What's new in this update? <span role='img' aria-label='celebration icon'>🎉</span></span>
            {updates ? 
              <div className='updates'>
                {changes?.length > 0 && <span className='whatsNew updatesRow'>
                  {/* eslint-disable-next-line */}
                  <span className='heading'>NEW FEATURES ✨</span>
                  {changes.map(({title, description}) => (
                    <div className={classes.change}>
                      <span className='title'>{title}</span>
                      <ul className='description'>
                        {description.map(item => (
                          <li className='descriptionItem'>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </span>}
                {improvements?.length > 0 && <span className='improvements updatesRow'>
                  {/* eslint-disable-next-line */}
                  <span className='heading'>IMPROVEMENTS 💡</span>
                  <ul>
                    {improvements.map(item => (
                      <li>{item}</li>
                    ))}
                  </ul>
                </span>}
                {fixes?.length > 0 && <span className='bugFixes updatesRow'>
                  {/* eslint-disable-next-line */}
                  <span className='heading'>BUG FIXES 🔨</span>
                  <ul>
                    {fixes.map(item => (
                      <li>{item}</li>
                    ))}
                  </ul>
                </span>}
                {upcoming?.length > 0 && <span className='upcoming updatesRow'>
                  {/* eslint-disable-next-line */}
                  <span className='heading'>UPCOMING UPDATES ⏳</span>
                  <ul>
                    {upcoming.map(item => (
                      <li>{item}</li>
                    ))}
                  </ul>
                </span>}
              </div> : 
              <span className={classes.updatesLoader}>
                <ThemeProvider>
                  <Skeleton height={60} width={'100%'} count={3}/>
                </ThemeProvider>
              </span>}
            {/* eslint-disable-next-line */}
            {VERSION.includes('dev') ? <span className={classes.betaTesterCredit}>Thanks for being a beta tester of this update 🧪</span> : ''}
            <div className='updatesInfo'>you're on <b>v{VERSION}</b></div>
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