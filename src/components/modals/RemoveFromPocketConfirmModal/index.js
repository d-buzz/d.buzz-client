import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { useState } from 'react'
import { useEffect } from 'react'
import { getUserCustomData, updateUserCustomData } from 'services/database/api'
import Spinner from 'components/elements/progress/Spinner'
import { CircularProgress } from '@material-ui/core'

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

    '& .description': {
      margin: '15px 0',
      color: '#E61C34',
      fontSize: '1.25em',
      fontWeight: 600,
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
  deletingBuzz: {
    margin: '15px 0',

    '& .label': {
      color: theme.font.color,
      fontSize: '1.5em',
      fontWeight: 600,
    },
  },
}))

function RemoveFromPocketConfirmModal(props) {
  const { show, onHide, user, pocket, buzz, loadPockets } = props
  const classes = useStyles()

  const [fetching, setFetching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [pockets, setPockets] = useState([])

  useEffect(() => {
    if(show) {
      setFetching(true)
      getUserCustomData(user.username)
        .then(res => {
          setUserData(res[0])
          setPockets([...res[0].pockets])
          setFetching(false)
        })
    }
    // eslint-disable-next-line
  }, [show])

  const getBuzzIndex = () => {
    return pocket.pocketBuzzes.findIndex((b) => b.permlink === buzz.permlink)
  }
  const getPocketIndex = () => {
    return pockets.findIndex((b) => b.pocketId === pocket.pocketId)
  }

  const handleOnDelete = () => {
    setLoading(true)
    
    const pocketsArray = [...pockets]
    const pocketBuzzesArray = [...pocket.pocketBuzzes]
    const pocketIndex = getPocketIndex()
    const buzzIndex = getBuzzIndex()
    
    //remove buzz from pocketBuzzes array
    pocketBuzzesArray.splice(buzzIndex, 1)
    // update array
    pockets[pocketIndex].pocketBuzzes = [...pocketBuzzesArray]
    
    // prepare data to be updated
    const customUserData = { username: user.username, userData: [{...userData, pockets: pocketsArray}] }

    updateUserCustomData(customUserData).then(() => {
      setLoading(false)
      onCancel()
      
      if(loadPockets) {
        loadPockets(pocket.pocketSlug)
      }
    })
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
        animation={true}
      >
        <ModalBody className={classes.modalBody}>
          <div className={classes.confirmModalBody}>
            {!loading && <span className='title'>Remove this buzz from {pocket?.pocketName} Pocket?</span>}
            {!loading ?
              <div className="description">This can't be undone!</div> :
              <div className={classes.deletingBuzz}>
                <span className='label'>Deleting the buzz from {pocket?.pocketName}</span>
                <Spinner size={50} loading={loading}/>
              </div>}
            <div className='modalButtons'>
              <button className='cancel modalButton' onClick={onCancel} disabled={loading}>Cancel</button>
              <button className='select modalButton' onClick={handleOnDelete} disabled={fetching | loading}>{!fetching ? 'Remove' : <CircularProgress size={15} color="#ffffff" />}</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default RemoveFromPocketConfirmModal