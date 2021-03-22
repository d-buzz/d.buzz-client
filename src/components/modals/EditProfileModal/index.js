import React from 'react'
import { createUseStyles } from 'react-jss'
import IconButton from '@material-ui/core/IconButton'
import { CloseIcon, ContainedButton, Avatar, TextArea } from 'components/elements'
import { 
  Modal,
  ModalBody,
  Row,
  Col,
  Navbar,
} from 'react-bootstrap'

const useStyles = createUseStyles(theme => ({
  modal: {
    width: 600,
    '& div.modal-content': {
      margin: '0 auto',
      backgroundColor: theme.background.primary,
      width: 600,
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
    paddingLeft: 0,
    paddingRight: 0,
  },
  cover: {
    height: 200,
    width: '100%',
    backgroundColor: '#ffebee',
    overFlow: 'hidden',
    maxHeight: 200,
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      overFlow: 'hidden',
      justifyContent: 'center',
    },
  },
  navTitle: {
    fontFamily: 'Roboto, sans-serif',
    display: 'inline-block',
    verticalAlign: 'top',
    marginTop: -10,
    ...theme.navbar.icon,
  },
  avatar: {
    marginTop: -70,
  },
  title: {
    display: 'inline-block',
    marginLeft: 5,
    fontFamily: 'Segoe-Bold',
    fontSize: 18,
    color: theme.font.color,
  },
  saveButton: {
    marginTop: -45,
    marginRight: 15,
    float: 'right',
    fontFamily: 'Segoe-Bold',
  },
  wrapper: {
    width: '95%',
    margin: '0 auto',
    height: 'max-content',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
}))

const EditProfileModal = (props) => {
  const { show, onHide } = props
  const classes = useStyles()
  const cover_image = 'https://images.hive.blog/DQmdojdQGiBPN1nC8diR3GgGkzSxJRR8Ltgyu4cGyVY3Ljf/dbuzz.png'

  return (
    <React.Fragment>
      <Modal
        // size="lg"
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={onHide}
        dialogClassName={classes.modal}
        animation={false}
        // centered
      >
        <ModalBody className={classes.modalBody}>
          <Navbar.Brand className={classes.navTitle}>
            <IconButton style={{ marginLeft: 5 }} onClick={onHide}>
              <CloseIcon />
            </IconButton>
            <span className={classes.title}>Edit profile</span>
          </Navbar.Brand>
          <div style={{ width: '100%' }}>
            <ContainedButton
              fontSize={14}
              style={{ float: 'right' }}
              transparent={false}
              label="Save"
              loading={false}
              disabled={false}
              className={classes.saveButton}
            />
          </div>
          <React.Fragment>
            <div style={{ padding: 5 }}>
              <div className={classes.cover}>
                {cover_image !== '' && (<img src={`https://images.hive.blog/0x0/${cover_image}`} alt="cover"/>)}
              </div>
            </div>
            <div className={classes.wrapper}>
              <Row>
                <Col xs="auto">
                  <div className={classes.avatar}>
                    <Avatar border={true} height="135" author="dbuzz" size="medium" />
                  </div>
                </Col>
              </Row>
            </div>
            <div style={{ width: '100%', height: 'max-content'}}>
              <div className={classes.wrapper}>
                <TextArea 
                  name='content-area' 
                  maxLength="280" 
                  minRows={1} 
                  value={''} 
                  variant="outlined"
                  label="Name"
                  autoFocus />
              </div>
            </div>
          </React.Fragment>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )

}

export default EditProfileModal