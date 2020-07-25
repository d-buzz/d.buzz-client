import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import FormLabel from 'react-bootstrap/FormLabel'
import FormControl from 'react-bootstrap/FormControl'
import FormCheck from 'react-bootstrap/FormCheck'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  loginButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
})

const FormSpacer = () => {
  return (
    <div style={{ height: 15, width: '100%' }}></div>
  )
}

const LoginModal = (props) => {

  const { show, onHide } = props
  const classes = useStyles()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [useKeychain, setUseKeychain] = useState(false)

  const onChange = (e) => {
    const { target } = e
    const { name, value } = target

    if(name === 'username') {
      setUsername(value)
    } else if(name === 'password') {
      setPassword(value)
    }
  }

  const onCheckBoxChanged = (e) => {
    const { target } = e
    const { name, checked } = target

    if(name === 'keychain') {
      setUseKeychain(checked)
    }
  }

  return (
    <React.Fragment>
      <Modal show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', top: 10 }}>
            <center>
              <h5>Login to D.Buzz</h5>
            </center>
          </div>
          <FormLabel>Username</FormLabel>
          <FormControl name="username" type="text" value={username} onChange={onChange} />
          <FormSpacer />
          {
            !useKeychain && (
              <React.Fragment>
                <FormLabel>Password</FormLabel>
                <FormControl name="password" type="password" value={password} onChange={onChange} />
                <FormSpacer />
              </React.Fragment>
            )
          }
          <FormCheck
            name="keychain"
            type="checkbox"
            label="Use hivekeychain"
            onChange={onCheckBoxChanged}
          />
          <center>
            <ContainedButton
              transparent={true}
              className={classes.loginButton}
              fontSize={15}
              label="Submit"
            />
          </center>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default LoginModal
