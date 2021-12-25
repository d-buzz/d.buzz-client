import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      maxWidth: 550,
      minWidth: 100,
      color: '#ffffff',
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
  titleBox: {
    width: '100%',
    padding: 8,
    fontSize: '2rem',
    border: '2px solid lightgray',
    transition: 'border 350ms',
    margin: '15px 0 15px 0',
    borderRadius: 15,

    '&:focus': {
      border: '2px solid #E61C34',
    },
  },

  draftItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px 0',
    padding: '5px 0',
    width: '100%',
    background: theme.context.view.backgroundColor,
    textAlign: 'center',
    borderRadius: 5,
    fontSize: '1.5em',
    userSelect: 'none',
    color: theme.font.color,

    '& .draft_title': {
      flex: 0.9,
      cursor: 'pointer',
    },

    '& .draft_delete_button': {
      flex: 0.1,
      display: 'grid',
      placeItems: 'center',
      height: '100%',
      width: '100%',
      
      '& .delete_icon' : {
        color: '#E61C34',
        fontSize: '1.5em',
        padding: 5,
        cursor: 'pointer',
        transition: 'all 250ms',

        '&:hover': {
          opacity: 0.8,
          color: '#ffffff',
          background: '#E61C34',
          borderRadius: '50%',
        },
      }, 
    },
  },
  message : {
    color: theme.font.color,
    fontSize: '1.15em',
    textAlign: 'center',
  },
  draftDesc: {
    marginTop: 15,
    fontSize: '0.85em',
    color: theme.font.color,
  },
}))

const DraftsModal = (props) => {
  const {
    show,
    onHide,
    drafts,
    setDrafts,
    setSelectedDraft,
  } = props
  const classes = useStyles()

  useEffect(() => {
    
    localStorage.setItem('drafts', JSON.stringify(drafts))

  }, [drafts])

  const handleSelectDraft = (content) => {
    setSelectedDraft(content)
    onHide()
  }

  const handleDeleteDraft = (id) => {
    setDrafts(drafts.filter(draft => draft.id !== id))
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h6>Drafts</h6>
            </center>
            {drafts.length < 1 ?
              <span className={classes.message}>
                <center>There are no drafts found.</center>
              </span>

              :

              drafts.map(draft => (
                <div className={classes.draftItem}>
                  <span className='draft_title' onClick={() => handleSelectDraft(draft.content)}>{draft.title}</span>
                  <span className="draft_delete_button">
                    <DeleteIcon className='delete_icon' onClick={() => handleDeleteDraft(draft.id)}/>
                  </span>
                </div>
              ))}
            <center className={classes.draftDesc}>
              all drafts are currenly stored offline
            </center>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default DraftsModal
