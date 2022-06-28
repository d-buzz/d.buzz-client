import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { useState } from 'react'
import { useEffect } from 'react'
import { getUserCustomData, updateUserCustomData } from 'services/database/api'
import Spinner from 'components/elements/progress/Spinner'
import CircularProgress from '@material-ui/core/CircularProgress'
import moment from 'moment'

const useStyles = createUseStyles(theme => ({
  modal: {
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
    paddingLeft: 15,
    paddingRight: 15,
  },
  confirmModalBody: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    '& .title': {
      color: theme.font.color,
      fontSize: '1.5em',
      fontWeight: 800,
    },

    '& .modalButtons': {
      marginTop: 10,
      display: 'flex',
      width: '100%',

      '& button': {
        outlineWidth: 0,
        border: 'none',

        '&:disabled': {
          opacity: '0.5',
          cursor: 'none',
        },
      },

      '& .modalButton': {
        padding: 8,
        width: '100%',
        flex: 0.5,
        textAlign: 'center',
        borderRadius: 35,
        color: '#000000',
        fontSize: '1.2em',
        fontWeight: '600',
        userSelect: 'none',
        cursor: 'pointer',
      },
  
      '& .cancel': {
        background: '#F5F8FA',
        marginRight: 8,
  
        '&:hover': {
          background: '#EDF0F2',
        },

        '&:disabled': {
          '&:hover': {
            background: '#F5F8FA',
          },
        },
      },
  
      '& .select': {
        display: 'grid',
        placeItems: 'center',
        background: '#E61C34',
        color: '#ffffff',
  
        '&:hover': {
          background: '#B71C1C',
        },
      },
    },
  },
  createPocketContainer: {
    width: '100%',
    margin: '15px 0',

    '& .errorText': {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 15,
      width: '100%',
      fontSize: '0.95em',
      fontWeight: 'bold',
      color: '#E61C34',
      animation: 'zoomIn 350ms',
    },

    '& .tryAgainText': {
      fontSize: '0.95em',
    },

    '& .pocketAlreadyText': {
      fontSize: '1.05em',
    },

    '& .pocketName': {
      width: '100%',
      padding: 10,
      fontSize: '1.5em',
      outlineWidth: 0,
      border: 'none',
      borderRadius: 8,
      boxShadow: `0 0 0 1.5px ${theme.font.color}`,
      transition: 'all 250ms',
      color: theme.font.color,
      background: 'transparent',
      
      '&::placeholder': {
        color: theme.font.color,
      },

      '&:focus': {
        boxShadow: `0 0 0 3px ${theme.font.color}`,
      },
    },
  },
  creatingPocketContainer: {
    margin: '15px 0',
    width: '100%',

    '& .label': {
      color: theme.font.color,
      width: '100%',
      fontWight: 600,
      fontSize: '1.2em',
      textAlign: 'center',
    },
  },
}))

function CreatePocketModal(props) {
  const { show, onHide, user, loadPockets } = props
  const [pocketName, setPocketName] = useState('')
  const [pocketSlug, setPocketSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [tryAgain, setTryAgain] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [userData, setUserData] = useState(null)
  const [pocketNames, setPocketNames] = useState([])
  const [pocketAlreadyExists, setPocketAlreadyExists] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    if(show) {
      setFetching(true)
      getUserCustomData(user.username)
        .then(res => {
          setUserData(res)
          setFetching(false)

          if(res[0]?.pockets) {
            res[0].pockets.forEach((pocket) => {
              setPocketNames(pocketNames => [...pocketNames, pocket.pocketName])
            })
          }
        })
    }
    // eslint-disable-next-line
  }, [show])

  const handlePocketNameOnChange = (pocketName) => {
    setPocketName(pocketName)
    setPocketSlug(pocketName.replace('-', '').replace(/\s+/g, '-').toLowerCase())
    if(!pocketNames.includes(pocketName)) {
      setPocketAlreadyExists(false)
    } else {
      setPocketAlreadyExists(true)
    }
  }

  const handleOnAdd = () => {
    if(pocketName) {
      setLoading(true)
      const pockets = [...(userData[0].pockets || []), {
        pocketId: moment().format(),
        pocketName: pocketName,
        pocketSlug: pocketSlug,
        pocketBuzzes: [],
      }]

      // old approach \/

      // pockets[userData[0]?.pockets ? Object.keys(userData[0]?.pockets).length+1 : 1] = {
      // 	pocketId: userData[0]?.pockets ? `${user.username}Pocket${Object.keys(userData[0]?.pockets).length+1}` : `${user.username}Pocket1`,
      // 	pocketName: pocketName,
      // 	pocketBuzzes: []
      // }
      // pockets[1] = {
      // 	pocketId: 1,
      // 	pocketName: pocketName,
      // 	pocketBuzzes: []
      // }
  
      const customUserData = { username: user.username, userData: [{...userData[0], pockets}] }
      updateUserCustomData(customUserData).then(() => {
        loadPockets(pocketSlug)
        setPocketName('')
        setPocketSlug('')
        setLoading(false)
        onHide(!true)
        setTryAgain(false)
      })
        .catch(() => {
          setLoading(false)
          setTryAgain(true)
        })
  
      // setUserData(data => [{...data[0], pockets}])
    } else {
      const pocketNameInput = document.getElementById('pocketNameInput')
      pocketNameInput.style.animation = 'pocketNameInputAnimation 350ms'
      setTimeout(() => {
        pocketNameInput.style.animation = 'none'
      }, 2000)
    }
  }

  const onCancel = () => {
    onHide(!true)
  }

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
          <div className={classes.confirmModalBody}>
            <span className='title'>Create a new Pocket</span>
            {!loading ?
              <React.Fragment>
                <div className={classes.createPocketContainer}>
                  {tryAgain && <span className='tryAgainText errorText'>An error occurd while creating your pocket, please try again!</span>}
                  {pocketAlreadyExists && <span className='pocketExistsText errorText'>A pocket with the same name already exists!</span>}
                  <input type="text" maxLength={20} id='pocketNameInput' className="pocketName" placeholder="Pocket Name" value={pocketName} onChange={e => handlePocketNameOnChange(e.target.value)} />
                </div>
              </React.Fragment> :
              <div className={classes.creatingPocketContainer}>
                <div className="label">Creating pocket...</div>
                <Spinner loading={loading} size={50}/>
              </div>}
            <div className='modalButtons'>
              <button className='cancel modalButton' onClick={onCancel}>Cancel</button>
              <button className='select modalButton' onClick={handleOnAdd} disabled={!pocketName || fetching || loading || pocketAlreadyExists}>{!fetching ? 'Create' : <CircularProgress size={25} color="#ffffff" />}</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default CreatePocketModal