import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { setThemeRequest, generateStyles } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      maxWidth: 400,
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
  closeButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
  text: {
    ...theme.font,
    textAlign: 'justify',
  },
}))

const PayoutDisclaimerModal = (props) => {
  const {
    show,
    onHide,
  } = props
  const classes = useStyles()

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h6>Warning:</h6>
            </center>
            <p className={classes.text}>
              This is your max accept payout for THIS buzz. You can set different max payouts for each of your buzz's. If you set you payout to "0", any rewards will be sent to the @null account.
            </p>
            <p className={classes.text}>
              We recommend not changing the max payout from 1 (HBD).
            </p>
            <p className={classes.text}>
              If you do change it and your content is not a high quality original content (not posted elsewhere on Hive + all created by You) i.e. art pieces, drawings, etc. You risk having your content be down voted by the community, and could earn considerable less or nothing, than it otherwise would.
            </p>
            <p className={classes.text}>
              By clicking "OK" you accept this warning and will not hold D.buzz responsible for any down votes. Or "cancel" to keep at the recommended payout.
            </p>
          </div>
          <div style={{ display: 'inline-block' }}>
            <ContainedButton
              className={classes.closeButton}
              fontSize={14}
              transparent={true}
              label="Agree"
            />
          </div>
          <div style={{ display: 'inline-block', float: 'right' }}>
            <ContainedButton
              className={classes.closeButton}
              fontSize={14}
              transparent={true}
              label="Cancel"
            />
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setThemeRequest,
    generateStyles,
  }, dispatch),
})

export default connect(null, mapDispatchToProps)(PayoutDisclaimerModal)
