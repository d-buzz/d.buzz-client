import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { useState } from 'react'
import { useEffect } from 'react'
import { getUserCustomData, updateUserCustomData } from 'services/database/api'
import Spinner from 'components/elements/progress/Spinner'

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

    '& .selectPocketLabel': {
      color: theme.font.color,
      marginTop: 5,
      fontSize: '1.2em',
      fontWeight: 400,

      '& .buzzAuthor': {
        fontWeight: 800,
        padding: '5px 10px',
        backgroundColor: theme.context.view.backgroundColor,
        borderRadius: 5,
        userSelect: 'none',
      },
    },

    '& .pockets': {
      width: '100%',
      margin: '15px 0',
      
      '& .pocket': {
        margin: 5,
        width: '100%',
        padding: '15px 0',
        color: theme.font.color,
        border: `2px solid #e74b5d`,
        borderRadius: 5,
        textAlign: 'center',
        userSelect: 'none',
        cursor: 'pointer',
        transition: 'all 250ms',
        
        '&:hover': {
          backgroundColor: 'rgba(231, 75, 93, 0.2)',
        },
        
        '& .pocketName': {
          fontSize: '1.5em',
          fontWeight: 600,
        },
      },
      
      '& .activePocket': {
        borderColor: `#e74b5d !important`,
        backgroundColor: '#e74b5d !important',
        color: '#ffffff !important',
        
        '&:hover': {
          opacity: '1 !important',
          borderColor: `#e74b5d !important`,
          backgroundColor: '#e74b5d !important',
        },
      },
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
        background: '#E61C34',
        color: '#ffffff',
  
        '&:hover': {
          background: '#B71C1C',
        },
      },
    },
  },
  addingPocketContainer: {
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
  loadingPocketsContainer: {
    margin: '15px 0',
    width: '100%',
  },
  message: {
    width: '100%',
    textAlign: 'center',
    margin: '15px 0',
    color: '#E61C34',
    fontSize: '1.2em',
    fontWeight: 'bold',
    animation: 'zoomIn 350ms',
  },
  noPocketsAvailable: {
    margin: '15px 0',
    fontSize: '1.5em',
    color: '#ffffff',
    padding: '5px 25px',
    background: '#E61C3455',
    borderRadius: 8,
  },
}))

function AddToPocketModal(props) {
  const { show, onHide, user, author, buzz } = props
  const [selectedPocket, setSelectedPocket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pockets, setPockets] = useState([])
  const [message, setMessage] = useState('')
  const classes = useStyles()

  useEffect(() => {
    getUserCustomData(user.username)
      .then(res => {
        if(res[0].pockets) {
          setPockets([...res[0].pockets])
        } else {
          setPockets([])
        }
      })
    // eslint-disable-next-line
  }, [show])

  const handleOnAdd = () => {
    // onHide()
    addToPockets()
  }

  const onCancel = () => {
    onHide()
  }

  const resetPockets = () => {
    const allPockets = document.querySelectorAll(`.pocket`).length
    for(let p=0; p<=allPockets-1; p++) {
      document.querySelectorAll(`.pocket`)[p].classList.remove('activePocket')
    }
  }

  const getPocketIndex = (pocket) => {
    return pockets.findIndex((p) => p.pocketId === pocket.pocketId)
  }
  
  const handleSelectPocket = (pocket) => {
    const hasThisBuzz = pocket.pocketBuzzes.find((b) => b.permlink === buzz.permlink) !== undefined
    if(!hasThisBuzz) {
      resetPockets()
      document.querySelector(`.pocket${getPocketIndex(pocket)}`).classList.add('activePocket')
      setSelectedPocket({index: getPocketIndex(pocket), pocketId: pocket.pocketId, pocketName: pocket.pocketName})
      setMessage('')
    } else {
      setMessage('This pocket already has this buzz!')
    }		
  }

  const addToPockets = () => {
    setLoading(true)
    getUserCustomData(user.username)
      .then((data) => {
        // add buzz to the specified pocket
        const pockets = data[0].pockets
        pockets[selectedPocket.index].pocketBuzzes.push(buzz)

        // prepare data to be updated
        const resData = { username: user.username, userData: [{username: data[0].username, settings: data[0].settings, pockets: [...pockets]}] }

        // update users's pockets data
        updateUserCustomData(resData).then(() => {
          setLoading(false)
          setSelectedPocket(null)
          onHide()
        })
      })
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
            <span className='title'>Add to a Pocket</span>
            {!loading ?
              pockets.length > 0 ?
                <React.Fragment>
                  <div className='selectPocketLabel'>Select a pocket to add this buzz from <span className='buzzAuthor'>{author}</span></div>
                  {message && <div className={classes.message}>{message}</div>}
                  <div className='pockets'>
                    {pockets.map(pocket => (
                      <div key={pocket.pocketId} className={`pocket pocket${getPocketIndex(pocket)}`} onClick={() => handleSelectPocket(pocket)}>
                        <span className='pocketName'>{pocket.pocketName}</span>
                      </div>
                    ))}
                  </div>
                </React.Fragment> :
                pockets.length === 0 ?
                  <div className={classes.noPocketsAvailable}>No pockets available</div> :
                  <div className={classes.loadingPocketsContainer}>
                    <Spinner loading={true} size={50}/>
                  </div> :
              <div className={classes.addingPocketContainer}>
                <div className="label">Adding buzz to {selectedPocket.pocketName} pocket...</div>
                <Spinner loading={loading} size={50}/>
              </div>}
            <div className='modalButtons'>
              <button className='cancel modalButton' onClick={onCancel} disabled={loading}>Cancel</button>
              <button className='select modalButton' onClick={handleOnAdd} disabled={!selectedPocket || loading}>Add</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default AddToPocketModal