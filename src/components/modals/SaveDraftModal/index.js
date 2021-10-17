import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { CheckIcon } from 'components/elements'

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
    padding: '5px 15px',
    borderRadius: 25,
    lineHeight: 0.8,
    border: 'none',
    background: '#E61C34',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer',
    '&:hover': {
      background: '#B71C1C',
    },
  },
  titleBox: {
    width: '100%',
    padding: 8,
    fontSize: '2rem',
    border: '2px solid lightgray',
    transition: 'border 350ms',
    margin: '15px 0 15px 0',
    borderRadius: 15,
    color: theme.font.color,

    '&:focus': {
      border: '2px solid #E61C34',
    },
  },
  draftModalContainer: {
    marginTop: 20,

    '& .draft_title_container': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',

      '& label': {
        textAlign: 'center',
        width: '60%',
        fontWeight: 'bold',
      },

      '& .input_container': {
        display: 'flex',
        justifyContent: 'center',
        width: '60%',
        marginTop: 5,

        '& input': {
          outlineWidth: 0,
          border: 'none',
          padding: '5px 15px',
          boxShadow: '0 0 0 2px #E61C34',
          borderRadius: 25,
          fontSize: '1.5em',
          marginRight: 10,
          background: 'transparent',
          color: theme.font.color,
        },
      },

      '& .draft_content': {
        marginTop: 15,
        width: '100%',
        padding: 15,
        boxShadow: '0 0 0 1px #EDF0F2',
        borderRadius: 15,
        textAlign: 'center',
        color: theme.font.color,
      },

    },
  },
}))

const SaveDraftModal = (props) => {
  const {
    show,
    onHide,
    drafts,
    setDrafts,
    draftData,
  } = props
  const classes = useStyles()

  const [draftName, setDraftName] = useState('')

  useEffect(() => {
    
    localStorage.setItem('drafts', JSON.stringify(drafts))

  }, [drafts])

  const resetSaveDraft = () => {
    setDraftName('')
    onHide()
  }

  const handleSaveDraft = () => {
    setDrafts([...drafts, {id: drafts.length+1, title: draftName, content:  draftData?.content}])
    resetSaveDraft()
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h6>SAVE THIS DRAFT</h6>
            </center>
            <div className={classes.draftModalContainer}>
              <div className='draft_title_container'>
                <div className='input_container'>
                  <input type='text' placeholder='Name this draft buzz' value={draftName} onChange={e => setDraftName(e.target.value)} />
                  <button className={classes.button} onClick={handleSaveDraft}>
                    <CheckIcon color='#ffffff'/>
                  </button>
                </div>
                <div className="draft_content">
                  {draftData?.content}
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default SaveDraftModal