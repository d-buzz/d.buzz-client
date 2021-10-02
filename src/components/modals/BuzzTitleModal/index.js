import React from 'react'
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
}))

const BuzzTitleModal = (props) => {
  const {
    show,
    onHide,
    title,
    setTitle,
  } = props
  const classes = useStyles()

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h6>Customize Buzz Title</h6>
            </center>
            <center>
              <label className={classes.notes}>
                This title will show up when the buzz is being published.
              </label>
            </center>
            <div>
              <input type="text" className={classes.titleBox} value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <center>
              <ContainedButton
                onClick={onHide}
                className={classes.closeButton}
                fontSize={14}
                label="Set"
              />
            </center>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default BuzzTitleModal
